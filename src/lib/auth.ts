import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "./utils";
import { redis } from "./redis";
import { cookies } from "next/headers";

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
export const decrypt = async () => {
  const token = (cookies().get("accessToken")?.value as string) ?? null;
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (e) {
    console.log(e);
  }
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
export const accessTokenRefresh = async (sessionId: string) => {
  try {
    const refreshToken = await redis.get(`refreshToken:${sessionId}`);
    if (!refreshToken) {
      return {
        success: false,
        message: "Token verification failed.Token expired!",
      };
    }

    const secretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

    const { payload } = await jwtVerify(refreshToken as string, secretKey);

    const userId = payload.userId as string;

    const newAccessToken = await generateAccessToken(userId);

    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false, message: "Token verification failed." };
  }
};
export function isTokenValid(token: string): boolean {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const expiration = payload.exp * 1000;
    return expiration > Date.now();
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
}
export const isAuthPages = (url: string) => {
  const AUTH_PAGES = ["/login", "/sign-up"];

  return AUTH_PAGES.some((page) => url.startsWith(page));
};
export const isSecuredPage = (url: string) => {
  const SECURED_PAGES = ["/"];

  return SECURED_PAGES.some((page) => url.startsWith(page));
};
