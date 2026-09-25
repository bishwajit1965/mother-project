import { describe, expect, it } from "vitest";
import createToken from "../../utils/createToken.js";

describe("createToken", () => {
  it("should create a jwt token", () => {
    const token = createToken(
      {
        userId: "123",
        email: "boss@gmail.com",
        role: "ADMIN",
      },
      "secret",
      "1d",
    );

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });
});
