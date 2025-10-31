import { jest } from "@jest/globals"

//  Mock the pool *before* loading the app
const mockQuery = jest.fn().mockImplementation((sql = "") => {
  const normalized = sql.toLowerCase()

  //  Handle unverified users first (must come BEFORE the 'from users' check)
  if (
    normalized.includes("from users") &&
    normalized.includes("verified = false")
  ) {
    return Promise.resolve({
      rows: [
        { id: 1, name: "John Doe", email: "john@example.com", verified: false },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          verified: false
        }
      ]
    })
  }

  //  Handle all users (general query)
  if (normalized.includes("from users")) {
    return Promise.resolve({
      rows: [
        { id: 1, name: "Alice", email: "alice@example.com", verified: true },
        { id: 2, name: "Bob", email: "bob@example.com", verified: false }
      ]
    })
  }

  return Promise.resolve({ rows: [] })
})

//  Mock the module BEFORE importing app
jest.unstable_mockModule("../src/utils/db.js", () => ({
  __esModule: true,
  default: { query: mockQuery }
}))

//  Import AFTER mocking
import jwt from "jsonwebtoken"
import request from "supertest"
const { default: app } = await import("../src/server.js")

let token

beforeAll(() => {
  const fakeAdmin = { id: 9999, role: "admin", email: "admin@test.com" }
  token = jwt.sign(fakeAdmin, process.env.JWT_SECRET || "testsecret", {
    expiresIn: "1h"
  })
})

describe("Admin Users API", () => {
  it("should require JWT token", async () => {
    const res = await request(app).get("/api/users")
    expect(res.statusCode).toBe(401)
  })

  it("should return users when authorized", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("users")
    expect(res.body.users.length).toBeGreaterThan(0)
  })

  it("should return unverified users when authorized", async () => {
    const res = await request(app)
      .get("/api/users/unverified")
      .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.users)).toBe(true)
    expect(res.body.users[0]).toHaveProperty("verified", false)
  })
})
