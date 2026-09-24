import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.js";

describe("Auth Register", () => {
  it("should reject invalid email", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "abc",
      password: "123456",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Validation Error");
  });
});

describe("Auth Login", () => {
  it("should reject invalid email", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "abc",
      password: "123456",
    });
    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Validation Error");
  });
});

describe("Auth Register", () => {
  it("should reject duplicate email", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Pew Paul",
      email: "pew@gmail.com",
      password: "123456",
    });
    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("User already exists");
  });
});
