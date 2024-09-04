"use server";

import { decrypt } from "@/lib/auth";
import db from "@/lib/db";
import { addNewPotsSchema } from "@/lib/validations";
import { Theme } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { POSTS } from "./constants";

export const addPot = async ({
  name,
  target,
  theme,
}: {
  name: string;
  target: number;
  theme: string;
}) => {
  console.log(typeof name, typeof target, typeof theme);
  // check if the token is valid
  const userId = await decrypt();
  if (!userId || typeof userId !== "string") {
    return { success: false, message: "Invalid token" };
  }

  // Check if the user already has a pot with the same theme
  const existingPot = await db.pot.findFirst({
    where: {
      userId,
      theme: theme.toUpperCase() as Theme,
    },
  });

  if (existingPot) {
    return {
      success: false,
      message: `You already have a pot with the theme ${theme}. Please choose another theme.`,
    };
  }

  // check if the values are valid
  const isValid = addNewPotsSchema.safeParse({ potName: name, target, theme });
  if (!isValid.success) {
    return { success: false, message: JSON.stringify(isValid.error.errors) };
  }

  try {
    await db.pot.create({
      data: {
        name,
        target,
        theme: theme.toUpperCase() as Theme,
        total: 0,
        userId,
      },
    });
    revalidatePath("/pots");
    return { success: true, message: "Pot added successfully" };
  } catch (error) {
    console.error("Error adding pot:", error);
    return { success: false, message: "Error adding pot" };
  }
};
export const getThemes = async () => {
  const userId = await decrypt();

  if (!userId || typeof userId !== "string") {
    return { success: false, message: "Invalid token", data: [] };
  }

  const userPots = await db.pot.findMany({
    where: { userId },
    select: { theme: true },
  });

  const usedThemes = userPots.map((pot) => pot.theme);

  const themesWithUsage = POSTS.map((post) => ({
    name: post.name,
    value: post.value,
    isUsed: usedThemes.includes(post.value as Theme),
  }));

  return { success: true, data: themesWithUsage };
};