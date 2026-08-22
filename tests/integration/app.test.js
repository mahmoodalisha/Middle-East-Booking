const request = require("supertest");
const app = require("../../app");

describe("GET /test", () => {
  test("should return Express app is running", async () => {
    const response = await request(app)
      .get("/test");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Express app is running");
  });
});