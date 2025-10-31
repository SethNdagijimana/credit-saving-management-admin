import request from "supertest"
import app from "../src/server.js"

describe("Admin Authentication", () => {
  it("should return 400 for missing credentials", async () => {
    const res = await request(app).post("/api/admin/login").send({})
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("message")
  })

  it("should fail with invalid credentials", async () => {
    const res = await request(app).post("/api/admin/login").send({
      email: "fake@example.com",
      password: "wrongpass"
    })
    expect(res.statusCode).toBe(400)
  })
})
