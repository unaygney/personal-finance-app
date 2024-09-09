'use client'

import React, { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { deleteBudget } from '@/app/(dashboard)/budgets/actions'

import { useToast } from '@/hooks/use-toast'

export default function DeleteBudget({
  id,
  category,
}: {
  category: string
  id: string | number
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const onDelete = async () => {
    startTransition(async () => {
      const res = await deleteBudget(id)
      if (res.success) {
        toast({
          title: 'Success',
          description: res.message,
        })
        setTimeout(() => window.location.reload(), 2000)
      }
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{`Delete ${category}?`}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this budget? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex-co flex">
        <Button
          variant="destroy"
          onClick={onDelete}
          disabled={isPending}
          loading={isPending}
        >
          Yes, Confirm Deletion
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            No, Go Back
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
