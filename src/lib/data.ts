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
export async function deleteRefreshToken(userId: string) {
  await redis.del(`refreshToken:${userId}`);
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
export async function deleteUserInRedis(id: string) {
  await redis.del(`user:${id}`);
}
export async function getUserFromRedis(userId: string) {
  const user = await redis.get(`user:${userId}`);
  if (!user) {
    return null;
  }
  return user;
}
export const updateBalance = async (userId: string, amount: number) => {
  const currentBalance = await db.balance.findUnique({
    where: { userId },
  });

  if (!currentBalance) {
    const newBalance = {
      current: amount,
      income: amount > 0 ? amount : 0,
      expenses: amount < 0 ? Math.abs(amount) : 0,
    };
    await db.balance.create({
      data: { userId, ...newBalance },
    });
  } else {
    const updatedBalance = {
      current: currentBalance.current + amount,
      income:
        amount > 0 ? currentBalance.income + amount : currentBalance.income,
      expenses:
        amount < 0
          ? currentBalance.expenses + Math.abs(amount)
          : currentBalance.expenses,
    };
    await db.balance.update({
      where: { userId },
      data: updatedBalance,
    });
  }
};
