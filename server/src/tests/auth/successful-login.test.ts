import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.js";

describe("Successful login", () => {
  it("should login successfully", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Login successful");
  });
});
