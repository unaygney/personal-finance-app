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
import { CaretRight, Dots } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

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
  return (
    <div className="w-full self-start rounded-lg bg-white px-5 py-6 md:px-5 md:py-5 lg:p-8">
      <div className="flex h-full w-full flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="h-4 w-4 rounded-full bg-red-400" />
            <h3 className="text-preset-2 text-grey-900">Savings</h3>
          </div>
          <button className="text-grey-500">
            <Dots />
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4">
          <p className="text-preset-4 font-normal text-grey-500">
            Maximum of $50.00
          </p>
          <div className="rounded bg-beige-100 p-1">
            <Progress
              className="h-6 rounded bg-transparent"
              maxValue={100}
              value={50}
              indicatorColor="#333"
            />
          </div>

          <div className="flex items-center">
            <div className="relative flex flex-1 flex-col justify-between pl-5">
              <span
                className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
                style={{ backgroundColor: "#277C78" }}
              />
              <p className="text-preset-5 text-grey-500">Spent</p>
              <p className="text-preset-4 font-bold text-grey-900">$20.00</p>
            </div>
            <div className="relative flex flex-1 flex-col justify-between pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-beige-100" />
              <p className="text-preset-5 text-grey-500">Free</p>
              <p className="text-preset-4 font-bold text-grey-900">$20.00</p>
            </div>
          </div>
        </div>
        {/* Latests Spending */}
        <div className="rounded-lg bg-beige-100 p-4 md:p-5">
          <div className="flex w-full flex-col gap-5">
            <div className="flex items-center justify-between">
              <h4 className="text-preset-3 text-grey-900">Latest Spending</h4>
              <Link
                className="text-preset-4 inline-flex items-center gap-3 font-normal text-grey-500"
                href={"/transactions"}
              >
                See All
                <CaretRight />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-grey-500 border-opacity-15 pb-4">
                <div className="flex items-center gap-4">
                  <span className="h-8 w-8 rounded-full bg-green-200"></span>
                  <h6 className="text-preset-5 font-bold text-grey-900">
                    Spark electric Solutions
                  </h6>
                </div>

                <div className="flex flex-col justify-between text-right">
                  <p className="text-preset-5 font-bold text-grey-900">
                    $-100.00
                  </p>
                  <p className="text-preset-5 text-grey-500">2 Aug 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
