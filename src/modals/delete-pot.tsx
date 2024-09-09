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

import { deletePot } from '@/app/(dashboard)/pots/actions'

import { useToast } from '@/hooks/use-toast'

export default function DeletePotModal({ potId }: { potId: number }) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const onDelete = async () => {
    startTransition(async () => {
      const res = await deletePot(potId)

      if (res.success) {
        toast({
          title: 'Success',
          description: res.message,
        })
        window.location.reload()
      }
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete ‘Savings’?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this pot? This action cannot be
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
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
