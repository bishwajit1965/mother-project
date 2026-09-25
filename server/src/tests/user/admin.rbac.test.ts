import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../app.js";

describe("Users Route", () => {
  it("should allow ADMIN role", async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.data;

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });
});
