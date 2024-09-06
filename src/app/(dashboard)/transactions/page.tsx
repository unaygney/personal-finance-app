import React from "react";
import { columns } from "./columns";
import dynamic from "next/dynamic";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddnewTransaction from "@/modals/add-transaction";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Transaction } from "@prisma/client";

const DataTable = dynamic<{
  columns: ColumnDef<Transaction>[];
  data: Transaction[];
}>(() => import("./data-table").then((mod) => mod.DataTable), { ssr: false });

export default async function TransactionsPage() {
  const userId = await decrypt();
  if (!userId || typeof userId !== "string") {
    redirect("/login");
  }

  const data = await db.transaction.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="container flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Transactions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+Add New Transaction</Button>
          </DialogTrigger>
          <AddnewTransaction />
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
