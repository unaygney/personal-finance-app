import { Button } from "@/components/ui/button";
import { Dots } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddnewBudget from "@/modals/add-new-budget";
import { Pot } from "@prisma/client";
import db from "@/lib/db";
import { getColorHexCode } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeletePotModal from "@/modals/delete-pot";
import UpdatePotModal from "@/modals/update-pot-modal";
import AddMoneyModal from "@/modals/add-money-modal";
import WithdrawMoney from "@/modals/withdraw-money";

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

        <Popover>
          <PopoverTrigger>
            <Dots />
          </PopoverTrigger>
          <PopoverContent asChild>
            <div className="flex w-[114px] flex-col gap-1 px-5 py-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-none bg-transparent"
                  >
                    Edit Pot
                  </Button>
                </DialogTrigger>
                <UpdatePotModal id={pot.id} />
              </Dialog>
              <hr />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-none bg-transparent text-secondary-red"
                  >
                    Delete Pot
                  </Button>
                </DialogTrigger>
                <DeletePotModal potId={pot.id} />
              </Dialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Totals Area */}
      <div className="flex h-[114px] flex-col justify-center gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-preset-4 text-grey-500">Total Saved</h4>
          <p className="text-preset-1">${pot.total.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Progress
            className="h-2"
            maxValue={pot.target}
            value={pot.total}
            indicatorColor={getColorHexCode(pot.theme)}
          />
          <div className="flex justify-between">
            <p className="text-preset-5 text-grey-500">
              {((pot.total / pot.target) * 100).toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">{`Target of $${pot.target.toLocaleString()}`}</p>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="mb-[14px] flex gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex-1">
              + Add Money
            </Button>
          </DialogTrigger>
          <AddMoneyModal pot={pot} />
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex-1">
              Withdraw
            </Button>
          </DialogTrigger>
          <WithdrawMoney pot={pot} />
        </Dialog>
      </div>
    </div>
  );
}
