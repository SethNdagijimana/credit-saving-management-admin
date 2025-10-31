export const Pool = jest.fn(() => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn(),
  end: jest.fn()
}))
