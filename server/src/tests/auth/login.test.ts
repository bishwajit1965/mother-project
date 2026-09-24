import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../app.js";

describe("Auth Login", () => {
  it("should reject wrong password", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Password does not match");
  });
});
