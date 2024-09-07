import { CaretRight, JarLight } from "@/components/ui/icons";
import Link from "next/link";
import React from "react";

import { getColorHexCode } from "@/lib/utils";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";
import Chart from "./chart";
export default async function Dashboard() {
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

    const latestTransactions = categoryTransactions.slice(0, 3);

    return {
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      fill: getColorHexCode(budget.theme),
      totalSpent: totalSpent,
      remaining: budget.amount - Math.abs(totalSpent),
      latestTransaction: latestTransactions,
    };
  });
  return (
    <div className="container mx-auto flex flex-col gap-8">
      <h1 className="text-preset-1 text-grey-900">Overview</h1>
      <Balance />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <Pots />
          <Budgets chartData={chartData} />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <Transactions />
          <RecurringBills />
        </div>
      </div>
    </div>
  );
}

function Balance() {
  return (
    <div className="grid h-auto grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
      <div className="w-full rounded-lg bg-grey-900 p-5 md:p-6">
        <div className="flex flex-col gap-3">
          <p className="text-preset-4 font-normal text-white">
            Current Balance
          </p>
          <h4 className="text-preset-1 font-bold text-white">$4,836.00</h4>
        </div>
      </div>
      <div className="w-full rounded-lg bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3">
          <p className="text-preset-4 font-normal text-grey-500">Income</p>
          <h4 className="text-preset-1 font-bold text-grey-900">$4,836.00</h4>
        </div>
      </div>
      <div className="w-full rounded-lg bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3">
          <p className="text-preset-4 font-normal text-grey-500">Expenses</p>
          <h4 className="text-preset-1 font-bold text-grey-900">$4,836.00</h4>
        </div>
      </div>
    </div>
  );
}
function Pots() {
  return (
    <div className="w-full self-start rounded-lg bg-white px-5 py-6 md:p-8 lg:flex-1">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-preset-2 font-bold text-grey-900">Pots</h3>
          <Link
            href={"/pots"}
            className="inline-flex items-center gap-3 text-grey-500"
          >
            See Details
            <CaretRight />
          </Link>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="rounded-lg bg-beige-100 p-4 md:flex-1">
            <div className="flex items-center gap-4">
              <JarLight className="fill-transparent text-secondary-green" />
              <div className="flex flex-col gap-[11px]">
                <p className="text-preset-4 font-normal text-grey-500">
                  Total Saved
                </p>
                <p className="text-preset-1 font-bold text-grey-900">$850</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-0 gap-y-4 md:flex-1">
            <div className="relative w-[49%] pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-[8px] bg-red-800" />
              <div className="flex flex-col gap-1">
                <p className="text-preset-5 line-clamp-1 font-normal text-grey-500">
                  Emergency Fund
                </p>
                <p className="text-preset-4 font-bold text-grey-900">$850</p>
              </div>
            </div>
            <div className="relative w-[49%] pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-[8px] bg-red-800" />
              <div className="flex flex-col gap-1">
                <p className="text-preset-5 line-clamp-1 font-normal text-grey-500">
                  Emergency Fund
                </p>
                <p className="text-preset-4 font-bold text-grey-900">$850</p>
              </div>
            </div>
            <div className="relative w-[49%] pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-[8px] bg-red-800" />
              <div className="flex flex-col gap-1">
                <p className="text-preset-5 line-clamp-1 font-normal text-grey-500">
                  Emergency Fund
                </p>
                <p className="text-preset-4 font-bold text-grey-900">$850</p>
              </div>
            </div>
            <div className="relative w-[49%] pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-[8px] bg-red-800" />
              <div className="flex flex-col gap-1">
                <p className="text-preset-5 line-clamp-1 font-normal text-grey-500">
                  Emergency Fund
                </p>
                <p className="text-preset-4 font-bold text-grey-900">$850</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Budgets({ chartData }: { chartData: any }) {
  const slicedChartData = chartData.slice(0, 4);

  return (
    <div className="rounded-lg bg-white px-5 py-6 md:p-8 lg:max-w-[428px] lg:flex-1">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-preset-2 font-bold text-grey-900">Budgets</h3>
          <Link
            href={"/budgets"}
            className="inline-flex items-center gap-3 text-grey-500"
          >
            See Details
            <CaretRight />
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <Chart chartData={chartData} />

          <div className="flex flex-col gap-4 lg:w-[98px]">
            {slicedChartData.map((item: any, index: any) => (
              <div
                key={index}
                className={`relative flex flex-col items-start pl-4`}
              >
                <span
                  className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />

                <h4 className="text-preset-4 truncate font-normal text-grey-500">
                  {item.category}
                </h4>
                <p className="text-preset-5 font-bold text-grey-900">
                  ${Math.abs(item.totalSpent)?.toFixed(2) ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Transactions() {
  return (
    <div className="h-full w-full rounded-lg bg-white px-5 py-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-preset-2 font-bold text-grey-900">
            Transactions
          </h3>
          <Link
            href={"/transactions"}
            className="inline-flex items-center gap-3 text-grey-500"
          >
            See Details
            <CaretRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
function RecurringBills() {
  return (
    <div className="w-full rounded-lg bg-white px-5 py-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-preset-2 font-bold text-grey-900">
            Recurring Bills
          </h3>
          <Link
            href={"/recurring-bills"}
            className="inline-flex items-center gap-3 text-grey-500"
          >
            See Details
            <CaretRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
