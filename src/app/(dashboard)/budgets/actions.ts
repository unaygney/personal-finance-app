"use server";

import { decrypt } from "@/lib/auth";
import db from "@/lib/db";
import { addNewBudgetSchema, AddNewBudgetSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export const addBudget = async (values: AddNewBudgetSchema) => {
  const userId = await decrypt();

  if (!userId || typeof userId !== "string") {
    return { success: false, message: "Invalid token" };
  }

  const isValid = await addNewBudgetSchema.safeParse(values);

  if (!isValid) {
    return { success: false, message: "invalid data" };
  }

  try {
    await db.budget.create({
      data: {
        amount: values.maximumSpend,
        category: values.categories,
        theme: values.theme,
        userId,
      },
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Budget is created successfully",
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Someting went wrong" };
  }
};
