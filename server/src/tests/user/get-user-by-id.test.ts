import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../app.js";

describe("Get User By ID", () => {
  it("should retrieve a user successfully", async () => {
    // Login as Admin
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.data;

    const userId = "6ab417b13cf1e7e441b575b8";

    const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(userId);

    expect(response.body.data.email).toBe("shuvrarunu@gmail.com");
  });

  it("should reject invalid user id", async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.data;

    const response = await request(app)
      .get("/api/v1/users/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Invalid user id");
  });

  it("should return 404 for non-existent user", async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.data;

    const response = await request(app)
      .get("/api/v1/users/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("User not found");
  });
});
