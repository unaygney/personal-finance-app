import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { decrypt } from '@/lib/auth'
import db from '@/lib/db'
import { cn, getColorHexCode } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CaretRight, Dots } from '@/components/ui/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'

import { ChartSection } from './chart-section'
import AddnewBudget from '@/modals/add-new-budget'
import DeleteBudget from '@/modals/delete-budget'
import UpdateBudget from '@/modals/update-budget'

export const metadata: Metadata = {
  title: 'Budgets',
  description: 'Manage your budgets and track your spending',
}

export default async function BudgetsPage() {
  const userId = await decrypt()

  if (!userId) redirect('/login')

  const budgets = await db.budget.findMany({
    where: {
      userId: userId,
    },
  })
  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
  })

  const chartData = budgets.map((budget) => {
    const categoryTransactions = transactions.filter((transaction) => {
      return transaction.Category === budget.category
    })

    const latestTransactions = categoryTransactions.slice(0, 3)

    const totalSpent = categoryTransactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0)

    return {
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      fill: getColorHexCode(budget.theme),
      totalSpent: totalSpent,
      remaining: budget.amount - Math.abs(totalSpent),
      latestTransaction: latestTransactions,
    }
  })

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
        {chartData.length > 0 ? (
          <ChartSection chartData={chartData} />
        ) : (
          <div className="text-preset-4 text-grey-300">
            You haven&apos;t created a budget yet.
          </div>
        )}
        <div className="flex flex-col gap-6">
          {chartData.map((data) => (
            <ContentSection key={data.category} data={data} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentSection({ data }: { data: any }) {
  return (
    <div className="w-full self-start rounded-lg bg-white px-5 py-6 md:px-5 md:py-5 lg:p-8">
      <div className="flex h-full w-full flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: data.fill }}
            />
            <h3 className="text-preset-2 text-grey-900">{data.category}</h3>
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
                      Edit Budget
                    </Button>
                  </DialogTrigger>
                  <UpdateBudget id={data.id} />
                </Dialog>
                <hr />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="border-none bg-transparent text-secondary-red"
                    >
                      Delete Budget
                    </Button>
                  </DialogTrigger>
                  <DeleteBudget category={data.category} id={data.id} />
                </Dialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-4">
          <p className="text-preset-4 font-normal text-grey-500">
            Maximum of ${data.amount.toFixed(2)}
          </p>
          <div className="rounded bg-beige-100 p-1">
            <Progress
              className="h-6 rounded bg-transparent"
              maxValue={data.amount}
              value={Math.abs(data.totalSpent)}
              indicatorColor={data.fill}
            />
          </div>

          <div className="flex items-center">
            <div className="relative flex flex-1 flex-col justify-between pl-5">
              <span
                className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg"
                style={{ backgroundColor: data.fill }}
              />
              <p className="text-preset-5 text-grey-500">Spent</p>
              <p className="text-preset-4 font-bold text-grey-900">
                ${data.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="relative flex flex-1 flex-col justify-between pl-5">
              <span className="absolute bottom-0 left-0 top-0 h-full w-1 rounded-lg bg-beige-100" />
              <p className="text-preset-5 text-grey-500">Free</p>
              <p className="text-preset-4 font-bold text-grey-900">
                ${data.remaining.toFixed(2)}
              </p>
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
                href={'/transactions'}
              >
                See All
                <CaretRight />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {data.latestTransaction.length > 0 ? (
                data.latestTransaction
                  .slice(0, 3)
                  .map((transaction: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-grey-500 border-opacity-15 pb-4 [&:not(:last-child)]:border-b"
                    >
                      <div className="flex items-center gap-4">
                        <span className="relative h-8 w-8 overflow-hidden rounded-full bg-green-200">
                          <Image
                            unoptimized
                            fill
                            src={transaction.avatar}
                            alt={`${transaction.name}'s image`}
                          />
                        </span>
                        <h6 className="text-preset-5 font-bold capitalize text-grey-900">
                          {transaction.name}
                        </h6>
                      </div>

                      <div className="flex flex-col justify-between text-right">
                        <p
                          className={cn(
                            'text-preset-5 font-bold text-secondary-red',
                            { 'text-secondary-green': transaction.amount > 0 }
                          )}
                        >
                          {transaction.amount < 0 ? '-' : '+'}
                          {`$${Math.abs(transaction.amount).toFixed(2)}`}
                        </p>
                        <p className="text-preset-5 text-grey-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-preset-4 text-center font-normal text-grey-500">
                  You haven&apos;t made any spendings yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
