"use client";

import { CheckCircle, WarningCircle } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Transaction } from "@prisma/client";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: () => (
      <h6 className="text-preset-5 font-normal text-grey-500">Bill Title</h6>
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
          <p className="text-preset-4 ml-2 font-bold text-grey-900">{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <h6 className="text-preset-5 font-normal text-grey-500">Due Date</h6>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const currentDate = new Date();

      // Tarihi "Monthly - 2nd" formatında göster
      const month = date.toLocaleString("default", { month: "long" }); // Ay ismi
      const day = date.getDate(); // Gün
      const formattedDate = `Monthly - ${day}th`;

      // Tarih farkını hesapla
      const timeDiff = date.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let statusIcon = null;
      if (daysDiff < 0) {
        statusIcon = (
          <CheckCircle className="ml-2 h-5 w-5 text-secondary-green" />
        );
      } else if (daysDiff <= 3) {
        statusIcon = (
          <WarningCircle className="ml-2 h-5 w-5 text-secondary-red" />
        );
      }

      return (
        <div className="flex w-[120px] items-center gap-2">
          <p className="text-preset-5 font-normal text-grey-500">
            {formattedDate}
          </p>
          {statusIcon && statusIcon}
        </div>
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
      const amount = Math.abs(parseFloat(row.getValue("amount")));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      const dateValue = new Date(row.getValue("date"));
      const currentDate = new Date();

      const timeDiff = dateValue.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const textColorClass =
        daysDiff <= 3 && daysDiff >= 0
          ? "text-secondary-red"
          : daysDiff < 0
            ? "text-grey-900"
            : "text-grey-900";

      return (
        <div
          className={cn("text-preset-4 text-right font-bold", textColorClass)}
        >
          {formatted}
        </div>
      );
    },
  },
];
