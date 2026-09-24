import jwt, { Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(
    payload,
    secret,
    expiresIn === undefined ? {} : { expiresIn },
  );
};

export default createToken;
