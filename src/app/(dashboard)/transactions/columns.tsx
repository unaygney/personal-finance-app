"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Transaction } from "@prisma/client";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: () => (
      <h6 className="text-preset-5 font-normal text-grey-500">
        Recipient / Sender
      </h6>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as React.ReactNode;

      return (
        <div className="flex items-center">
          <Image
            src={row.original.avatar}
            alt={name as string}
            width={32}
            height={32}
            className="rounded-full"
            unoptimized
          />
          <p className="text-preset-4 ml-2 font-bold capitalize text-grey-900">
            {name}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "Category",
    header: () => (
      <h6 className="text-preset-5 font-normal text-grey-500">Category</h6>
    ),
    cell: ({ row }) => {
      const category = row.getValue("Category") as React.ReactNode;
      return (
        <p className="text-preset-5 font-normal text-grey-500">{category}</p>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <h6 className="text-preset-5 font-normal text-grey-500">
        Transaction Date
      </h6>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <p className="text-preset-5 font-normal text-grey-500">
          {date.toLocaleDateString()}
        </p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => (
      <h6 className="text-preset-5 text-right font-normal text-grey-500">
        Amount
      </h6>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return (
        <div
          className={cn("text-preset-4 text-right font-bold text-grey-900", {
            "text-secondary-green": amount > 0,
          })}
        >
          {amount > 0 ? "+" : null}
          {formatted}
        </div>
      );
    },
  },
];
