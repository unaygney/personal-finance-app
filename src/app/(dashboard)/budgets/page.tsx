import { Button } from "@/components/ui/button";
import React from "react";
import { ChartSection } from "./chart-section";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddnewBudget from "@/modals/add-new-budget";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import { get } from "http";
import { getColorHexCode } from "@/lib/utils";

export default async function BudgetsPage() {
  const userId = await decrypt();

  if (!userId) redirect("/login");

  const budgets = await db.budget.findMany({
    where: {
      userId: userId,
    },
  });
  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
  });

  const chartData = budgets.map((budget) => {
    const categoryTransactions = transactions.filter((transaction) => {
      return transaction.Category === budget.category;
    });

    const totalSpent = categoryTransactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    return {
      category: budget.category,
      amount: budget.amount,
      fill: getColorHexCode(budget.theme),
      totalSpent: totalSpent,
    };
  });

  return (
    <div className="container flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+Add New Budget</Button>
          </DialogTrigger>
          <AddnewBudget />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,428px)_1fr]">
        <ChartSection chartData={chartData} />
        <ContentSection />
      </div>
    </div>
  );
}

function ContentSection() {
  return <div className="">content</div>;
}
