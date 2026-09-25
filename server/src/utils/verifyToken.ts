import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export default verifyToken;
