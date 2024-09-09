'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pot } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'

import { getColorHexCode } from '@/lib/utils'
import { AddMoneyFormSchema, addMoneySchema } from '@/lib/validations'

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

import { addMoney } from '@/app/(dashboard)/pots/actions'

import { useToast } from '@/hooks/use-toast'

export default function AddMoneyModal({ pot }: { pot: Pot }) {
  const { toast } = useToast()
  const maxAmount = pot.target - pot.total

  const form = useForm<AddMoneyFormSchema>({
    resolver: zodResolver(addMoneySchema(maxAmount)),
    defaultValues: { amount: 1 },
  })

  const amount = parseFloat(form.watch('amount').toString() || '0')

  async function onSubmit(values: AddMoneyFormSchema) {
    const res = await addMoney(pot.id, values.amount)

    if (res.success) {
      toast({
        title: 'Adding money successfully',
        description: 'You have successfully added money.',
      })
      form.reset({ amount: 0 })

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred while processing your request',
        variant: 'destructive',
      })
      form.reset({ amount: 0 })
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{`Add to "${pot.name}"`}</DialogTitle>
        <DialogDescription asChild>
          <div className="flex flex-col gap-5">
            <p>
              Add money to your pot to keep it separate from your main balance.
              As soon as you add this money, it will be deducted from your
              current balance.
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
                      ${(pot?.total + amount)?.toFixed(2)}
                    </p>
                  </div>

                  <Progress
                    className="h-2"
                    indicatorColor={getColorHexCode(pot.theme)}
                    maxValue={pot.target}
                    value={pot.total}
                    addedValue={amount}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-secondary-green">
                      {(((pot.total + amount) / pot.target) * 100).toFixed(2)}%
                    </p>
                    <p>{`Target of ${pot.target}`}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Add</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            min={0}
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
                    Confirm Addition
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
