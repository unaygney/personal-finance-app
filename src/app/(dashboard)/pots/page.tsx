import { Button } from "@/components/ui/button";
import { Dots } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddnewBudget from "@/modals/add-new-budget";
import { Pot } from "@prisma/client";
import db from "@/lib/db";
import { getColorHexCode } from "@/lib/utils";

export default async function PotsPage() {
  const POTS = await db.pot.findMany({
    where: { userId: "cad5da4a-7dae-4c5c-9b2b-d71f5f8a95a2" },
  });

  return (
    <div className="container flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Pots</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+Add New Budget</Button>
          </DialogTrigger>
          <AddnewBudget />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {POTS.map((pot: Pot, idx) => (
          <PotCard pot={pot} key={idx} />
        ))}
      </div>
    </div>
  );
}

function PotCard({ pot }: { pot: Pot }) {
  return (
    <div className="flex flex-col gap-8 rounded-[12px] bg-white px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span
            className="mr-4 h-4 w-4 rounded-full"
            style={{ backgroundColor: getColorHexCode(pot.theme) }}
          />
          <h3 className="text-preset-2 text-grey-900">{pot.name}</h3>
        </div>
        <button>
          <Dots />
        </button>
      </div>
      {/* Totals Area */}
      <div className="flex h-[114px] flex-col justify-center gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-preset-4 text-grey-500">Total Saved</h4>
          <p className="text-preset-1">${pot.target.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Progress
            className="h-2"
            value={(pot.total / pot.target) * 100}
            indicatorColor={pot.theme}
          />
          <div className="flex justify-between">
            <p className="text-preset-5 text-grey-500">Target</p>
            <p className="text-preset-5 text-grey-500">Total</p>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="mb-[14px] flex gap-4">
        <Button variant="secondary" className="flex-1">
          + Add Money
        </Button>
        <Button variant="secondary" className="flex-1">
          Withdraw
        </Button>
      </div>
    </div>
  );
}
