'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import { getColorHexCode } from '@/lib/utils'
import {
  AddNewBudgetSchema,
  Categories,
  addNewBudgetSchema,
} from '@/lib/validations'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { editBudget } from '@/app/(dashboard)/budgets/actions'
import { POSTS } from '@/app/(dashboard)/pots/constants'

import { useToast } from '@/hooks/use-toast'

export default function UpdateBudget({ id }: { id: number }) {
  const { toast } = useToast()

  const form = useForm<AddNewBudgetSchema>({
    resolver: zodResolver(addNewBudgetSchema),
  })

  const {
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: AddNewBudgetSchema) {
    const res = await editBudget(values, id)

    if (res.success) {
      toast({
        title: 'Success',
        description: res.message,
      })
      setTimeout(() => window.location.reload(), 2000)
    } else {
      toast({
        title: 'Error',
        description: res.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="w-full">
      <DialogHeader className="w-full">
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-col">
            <p className="my-5">
              As your budgets change, feel free to update your spending limits.
            </p>
            <div className="flex w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Categories.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maximumSpend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Spend</FormLabel>
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
                    loading={isSubmitting}
                  >
                    Savve Changes
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
