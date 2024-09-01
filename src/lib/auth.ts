import "server-only";
import { SignJWT } from "jose";
import { getEnv } from "./utils";

const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

const ALG = "HS256";

export const generateAccessToken = async (userId: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);

  return jwt;
};

export const generateRefreshToken = async (userId: string) => {
  const secret = new TextEncoder().encode(JWT_REFRESH_SECRET);

  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return jwt;
};
