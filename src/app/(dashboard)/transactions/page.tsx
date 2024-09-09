import { Transaction } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import React from 'react'

import { decrypt } from '@/lib/auth'
import db from '@/lib/db'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { columns } from './columns'
import AddnewTransaction from '@/modals/add-transaction'

const DataTable = dynamic<{
  columns: ColumnDef<Transaction>[]
  data: Transaction[]
}>(() => import('./data-table').then((mod) => mod.DataTable), { ssr: false })

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'Manage your budgets and track your spending',
}

export default async function TransactionsPage() {
  const userId = await decrypt()
  if (!userId || typeof userId !== 'string') {
    redirect('/login')
  }

  const data = await db.transaction.findMany({
    where: {
      userId,
    },
  })

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
  )
}
