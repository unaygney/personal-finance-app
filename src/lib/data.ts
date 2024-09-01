import "server-only";
import db from "./db";
import { redis } from "./redis";

export const getUser = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user.");
  }
};
export async function saveRefreshToken(userId: string, refreshToken: string) {
  await redis.set(`refreshToken:${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60,
  });
}
