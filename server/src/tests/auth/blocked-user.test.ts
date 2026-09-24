import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../app.js";

describe("Blocked User Login", () => {
  it("should reject blocked user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "pew@gmail.com",
      password: "123456",
    });

    console.log(response.status);
    console.log(response.body);

    expect(response.status).toBe(403);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("User is blocked");
  });
});
