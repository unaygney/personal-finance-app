"use server";
import { decrypt } from "@/lib/auth";
import { deleteRefreshToken, deleteUserInRedis } from "@/lib/data";
import { cookies } from "next/headers";
export const logout = async () => {
  const userId = (await decrypt()) as string;
  cookies().delete("accessToken");
  cookies().delete("sessionId");

  // delete the refresh token and user from redis
  await deleteRefreshToken(userId);
  await deleteUserInRedis(userId);

  return { success: true };
};
