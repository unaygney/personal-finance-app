'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pot } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getColorHexCode } from '@/lib/utils'
import { WithdrawFormSchema, withdrawSchema } from '@/lib/validations'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

import { withdrawMoney } from '@/app/(dashboard)/pots/actions'

import { useToast } from '@/hooks/use-toast'

export default function WithdrawMoney({ pot }: { pot: Pot }) {
  const { toast } = useToast()
  const maxAmount = pot.total

  const form = useForm<WithdrawFormSchema>({
    resolver: zodResolver(withdrawSchema(maxAmount)),
    defaultValues: { amount: 0 },
  })

  async function onSubmit(values: WithdrawFormSchema) {
    const res = await withdrawMoney(pot.id, values.amount)

    if (res.success) {
      toast({
        title: 'Withdrawal Successful',
        description: 'You have successfully withdrawn money from your pot',
      })
      form.reset({ amount: 0 })
      setTimeout(() => window.location.reload(), 2000)
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred while processing your request',
        variant: 'destructive',
      })
      form.reset({ amount: 0 })
    }
  }

  const amount = form.watch('amount')

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{`Withdraw from "${pot.name}"`}</DialogTitle>
        <DialogDescription asChild>
          <div className="flex flex-col gap-5">
            <p>
              Withdraw from your pot to put money back in your main balance.
              This will reduce the amount you have in this pot.
            </p>
            <div className="flex flex-col justify-center gap-4">
              <Form {...form}>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-preset-4 font-normal">New Amount</p>
                    <p className="text-preset-1 text-grey-900">
                      ${(pot.total - amount).toFixed(2)}
                    </p>
                  </div>

                  <Progress
                    className="h-2"
                    indicatorColor={getColorHexCode(pot.theme)}
                    maxValue={pot.target}
                    value={pot.total}
                    withdrawnValue={amount}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-secondary-red">
                      {(((pot.total - amount) / pot.target) * 100).toFixed(2)}%
                    </p>
                    <p>{`Target of ${pot.target}`}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Withdraw</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            min={1}
                            max={maxAmount}
                            onChange={(e) => {
                              let value = e.target.value
                              if (value === '') {
                                field.onChange(value)
                                return
                              }

                              let numericValue = parseFloat(value)
                              if (numericValue > maxAmount) {
                                numericValue = maxAmount
                              }
                              if (!isNaN(numericValue)) {
                                field.onChange(numericValue)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="mt-4 w-full" type="submit">
                    Confirm Withdrawal
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}
