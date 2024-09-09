import { Transaction } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import React from 'react'

import { decrypt } from '@/lib/auth'
import db from '@/lib/db'

import { Receipt2 } from '@/components/ui/icons'

import { columns } from './columns'

const DataTable = dynamic<{
  columns: ColumnDef<Transaction>[]
  data: Transaction[]
}>(() => import('./data-table').then((mod) => mod.DataTable), { ssr: false })

export const metadata: Metadata = {
  title: 'Recurring Bills',
  description: 'Manage your budgets and track your spending',
}

export default async function RecurringBills() {
  const userId = await decrypt()

  if (!userId) {
    redirect('/login')
  }

  const data = await db.transaction.findMany({
    where: {
      userId,
    },
  })

  const recurringData = data.filter(
    (transaction) => transaction.recurring && transaction.amount < 0
  )

  const paidBills = recurringData.filter(
    (transaction) => new Date(transaction.date) < new Date()
  )

  const upcomingBills = recurringData.filter(
    (transaction) => new Date(transaction.date) >= new Date()
  )

  const dueSoonBills = recurringData.filter((transaction) => {
    const today = new Date()
    const dueDate = new Date(transaction.date)
    const diffInDays =
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    return diffInDays <= 3 && diffInDays >= 0
  })

  const totalBillsAmount = recurringData.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  )

  const paidBillsTotal = paidBills.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  )

  const upcomingBillsTotal = upcomingBills.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  )

  const dueSoonTotal = dueSoonBills.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  )

  return (
    <div className="container flex flex-col gap-8">
      <h1 className="text-preset-1 text-grey-900">Recurring Bills</h1>
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,337px)_1fr]">
        <div className="grid grid-cols-1 gap-3 self-start md:grid-cols-2 md:gap-6 lg:grid-cols-1">
          <TotalBills total={totalBillsAmount} />
          <Summary
            paidBillsTotal={paidBillsTotal}
            upcomingBillsTotal={upcomingBillsTotal}
            dueSoonTotal={dueSoonTotal}
          />
        </div>

        <DataTable columns={columns} data={recurringData} />
      </div>
    </div>
  )
}

function TotalBills({ total }: { total: number }) {
  return (
    <div className="rounded-lg bg-grey-900 px-5 py-6">
      <div className="flex items-center gap-5 text-white md:flex-col md:items-start md:gap-8">
        <span>
          <Receipt2 />
        </span>
        <div className="flex flex-col gap-[11px]">
          <span className="text-preset-4">Total bills</span>
          <span className="text-preset-1">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function Summary({
  paidBillsTotal,
  upcomingBillsTotal,
  dueSoonTotal,
}: {
  paidBillsTotal: number
  upcomingBillsTotal: number
  dueSoonTotal: number
}) {
  return (
    <div className="w-full rounded-lg bg-white p-5">
      <div className="flex flex-col gap-5">
        <h3>Summary</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-[#69686826] pb-4">
            <span className="text-preset-5 text-grey-500">Paid bills</span>
            <span className="text-preset-5 text-grey-900">
              ${paidBillsTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#69686826] pb-4">
            <span className="text-preset-5 text-grey-500">Total Upcoming</span>
            <span className="text-preset-5 text-grey-900">
              ${upcomingBillsTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-preset-5 text-grey-500">Due Soon</span>
            <span className="text-preset-5 text-secondary-red">
              ${dueSoonTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
