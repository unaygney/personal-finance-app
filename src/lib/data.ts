import "server-only";
import db from "./db";
import { redis } from "./redis";

export const getUser = async (id: string) => {
  try {
    const cachedData = await getUserFromRedis(id);
    if (cachedData) {
      return cachedData;
    }

    const user = await db.user.findUnique({
      where: { id },
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
export async function saveUserInRedis(user: {
  id: string;
  email: string;
  name: string;
}) {
  await redis.set(`user:${user.id}`, JSON.stringify(user), {
    ex: 7 * 24 * 60 * 60,
  });
}
export async function getUserFromRedis(userId: string) {
  const user = await redis.get(`user:${userId}`);
  if (!user) {
    return null;
  }
  return user;
}
