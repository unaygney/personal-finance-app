import "server-only";
import db from "./db";

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
