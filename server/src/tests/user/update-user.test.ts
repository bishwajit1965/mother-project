import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../app.js";

describe("Update User", () => {
  it("should update user successfully", async () => {
    // Login as ADMIN
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "paul.bishwajit09@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.data;

    const userId = "6ab417b13cf1e7e441b575b8";

    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Arpita Paul Updated By Test",
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("User updated successfully.");

    expect(response.body.data.name).toBe("Arpita Paul Updated By Test");
  });
});
