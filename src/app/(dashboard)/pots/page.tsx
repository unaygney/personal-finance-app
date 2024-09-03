import { Button } from "@/components/ui/button";
import { Dots } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddnewBudget from "@/modals/add-new-budget";

const POSTS = [
  {
    name: "Savings",
    target: 2000.0,
    total: 159.0,
    theme: "#277C78",
  },
  {
    name: "Concert Ticket",
    target: 150.0,
    total: 110.0,
    theme: "#626070",
  },
  {
    name: "Gift",
    target: 150.0,
    total: 110.0,
    theme: "#82C9D7",
  },
  {
    name: "New Laptop",
    target: 1000.0,
    total: 10.0,
    theme: "#F2CDAC",
  },
  {
    name: "Holiday",
    target: 1440.0,
    total: 531.0,
    theme: "#826CB0",
  },
] as const;

type POT = (typeof POSTS)[number];

export default function PotsPage() {
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
        {POSTS.map((pot: POT, idx) => (
          <PotCard pot={pot} key={idx} />
        ))}
      </div>
    </div>
  );
}

function PotCard({ pot }: { pot: POT }) {
  return (
    <div className="flex flex-col gap-8 rounded-[12px] bg-white px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span
            className="mr-4 h-4 w-4 rounded-full"
            style={{ backgroundColor: pot.theme }}
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
