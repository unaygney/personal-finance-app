'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { getColorHexCode } from '@/lib/utils'
import { AddNewPotsFormSchema, addNewPotsSchema } from '@/lib/validations'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getPot, updatePot } from '@/app/(dashboard)/pots/actions'
import { POSTS } from '@/app/(dashboard)/pots/constants'

import { useToast } from '@/hooks/use-toast'

export default function UpdatePotModal({ id }: { id: number }) {
  const { toast } = useToast()

  const form = useForm<AddNewPotsFormSchema>({
    resolver: zodResolver(addNewPotsSchema),
    defaultValues: {
      potName: '',
      target: 0,
    },
  })

  const {
    reset,
    setValue,
    formState: { isSubmitting },
  } = form

  const { data } = useQuery(['pot', id], async () => getPot(id), {
    onSuccess: (response) => {
      if (response.success && response.data) {
        setValue('potName', response.data.name)
        setValue('target', response.data.target)
        setValue('theme', response.data.theme)
      }
    },
  })

  async function onSubmit(values: AddNewPotsFormSchema) {
    const res = await updatePot(id, values)

    if (res.success) {
      toast({
        title: 'Updated',
        description: 'Pot updated successfully',
      })
      window.location.reload()
    }
  }

  return (
    <DialogContent className="w-full">
      <DialogHeader className="w-full">
        <DialogTitle>Edit Pot</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-col">
            <p className="my-5">
              If your saving targets change, feel free to update your pots.
            </p>
            <div className="flex w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="potName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pot Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Rainy Days"
                            maxLength={30}
                            {...field}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) {
                                field.onChange(e)
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          {30 - (field.value?.length || 0)} characters left
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="$ e.g. 2000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                            <SelectContent>
                              {POSTS.map((post: any) => (
                                <SelectItem
                                  key={post.name}
                                  value={post.value}
                                  disabled={post.isUsed}
                                >
                                  <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                      <span
                                        className="mr-2 h-4 w-4 rounded-full"
                                        style={{
                                          backgroundColor: getColorHexCode(
                                            post.value
                                          ),
                                        }}
                                      />
                                      <p>{post.name}</p>
                                    </div>
                                    {post.isUsed && (
                                      <p className="text-preset-5 ml-4 text-right text-grey-500">
                                        (Already used)
                                      </p>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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
