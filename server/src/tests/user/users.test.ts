import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.js";

describe("Users Route", () => {
  it("Should reject request without token", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    // expect(response.body.message).toBe("Missing token");
  });
});
