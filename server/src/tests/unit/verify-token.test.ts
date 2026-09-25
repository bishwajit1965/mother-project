import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";

import createToken from "../../utils/createToken.js";
import verifyToken from "../../utils/verifyToken.js";

describe("verifyToken", () => {
  it("should verify a valid token", () => {
    const payload = {
      userId: "123",
      email: "boss@gmail.com",
      role: "ADMIN",
    };

    const token = createToken(payload, "secret", "1d");

    const decoded = verifyToken(token, "secret");

    expect(decoded).toMatchObject(payload);
  });

  it("should throw for invalid token", () => {
    expect(() => verifyToken("invalid-token", "secret")).toThrow();
  });
});
