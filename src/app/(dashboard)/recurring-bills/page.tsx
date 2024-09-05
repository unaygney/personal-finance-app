import React from "react";
import { data } from "../transactions/page";

import { columns, Transactions } from "./columns";
import dynamic from "next/dynamic";
import { ColumnDef } from "@tanstack/react-table";
import { Receipt2 } from "@/components/ui/icons";

const DataTable = dynamic<{
  columns: ColumnDef<Transactions>[];
  data: Transactions[];
}>(() => import("./data-table").then((mod) => mod.DataTable), { ssr: false });

export default function RecurringBills() {
  const recurringData = data.filter((transaction) => transaction.recurring);

  return (
    <div className="container flex flex-col gap-8">
      <h1 className="text-preset-1 text-grey-900">Transactions</h1>
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,337px)_1fr]">
        {/* Sidebar kısmı */}
        <div className="grid grid-cols-1 gap-3 self-start md:grid-cols-2 md:gap-6 lg:grid-cols-1">
          <TotalBills />
          <Summary />
        </div>

        <DataTable columns={columns} data={recurringData} />
      </div>
    </div>
  );
}

function TotalBills() {
  return (
    <div className="rounded-lg bg-grey-900 px-5 py-6">
      <div className="flex items-center gap-5 text-white md:flex-col md:items-start md:gap-8">
        <span>
          <Receipt2 />
        </span>
        <div className="flex flex-col gap-[11px]">
          <span className="text-preset-4">Total bills</span>
          <span className="text-preset-1">$384.98</span>
        </div>
      </div>
    </div>
  );
}

function Summary() {
  return (
    <div className="w-full rounded-lg bg-white p-5">
      <div className="flex flex-col gap-5">
        <h3>Summary</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-[#69686826] pb-4">
            <span className="text-preset-5 text-grey-500">Paid bills</span>
            <span className="text-preset-5 text-grey-900">$384.98</span>
          </div>
          <div className="flex justify-between border-b border-[#69686826] pb-4">
            <span className="text-preset-5 text-grey-500">Total Upcoming</span>
            <span className="text-preset-5 text-grey-900">$384.98</span>
          </div>
          <div className="flex justify-between">
            <span className="text-preset-5 text-grey-500">Due Soon</span>
            <span className="text-preset-5 text-secondary-red">$($40.00)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
