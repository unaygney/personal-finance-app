"use server";

import { decrypt } from "@/lib/auth";
import { updateBalance } from "@/lib/data";
import db from "@/lib/db";
import { logoMapping } from "@/lib/utils";
import {
  AddNewTransactionFormSchema,
  addNewTransactionSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export const addTransaction = async (data: AddNewTransactionFormSchema) => {
  const userId = await decrypt();
  if (!userId || typeof userId !== "string") {
    return { success: false, message: "Invalid token" };
  }

  const isValid = addNewTransactionSchema.safeParse(data);
  if (!isValid.success) {
    return { success: false, message: "Invalid data" };
  }

  const avatar = logoMapping[data.category] || "/images/Logo-1.jpg";

  try {
    await db.transaction.create({
      data: {
        userId,
        name: data.name,
        Category: data.category,
        amount: data.amount,
        recurring: data.recurring || false,
        avatar,
        date: data.date,
      },
    });

    // Update balance
    await updateBalance(userId, data.amount);

    revalidatePath("/", "layout");

    return { success: true, message: "Transaction added successfully" };
  } catch (error) {
    return { success: false, message: "Error adding transaction" };
  }
};
