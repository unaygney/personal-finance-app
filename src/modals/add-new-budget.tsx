'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

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

import { addBudget } from '@/app/(dashboard)/budgets/actions'
import { getThemes } from '@/app/(dashboard)/pots/actions'

import { toast } from '@/hooks/use-toast'

type PostType = {
  name: string
  value: string
  isUsed: boolean
}

export default function AddnewBudget() {
  const form = useForm<AddNewBudgetSchema>({
    resolver: zodResolver(addNewBudgetSchema),
  })

  const { data: POST_RESPONSE, isLoading } = useQuery('posts', async () =>
    getThemes()
  )

  const POSTS: PostType[] = POST_RESPONSE?.success ? POST_RESPONSE.data : []

  const {
    reset,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: AddNewBudgetSchema) {
    const res = await addBudget(values)
    if (res.success) {
      toast({
        title: 'Success',
        description: res.message,
      })

      setTimeout(() => window.location.reload(), 2000)
    }

    if (!res.success) {
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
        <DialogTitle>Add New Budget</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-col">
            <p className="my-5">
              Choose a category to set a spending budget. These categories can
              help you monitor spending.
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
                            placeholder="e.g. $2000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 1)
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
                              <SelectValue
                                placeholder={
                                  isLoading
                                    ? 'Loading themes...'
                                    : 'Select a theme'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading themes...
                                </SelectItem>
                              ) : POSTS.length > 0 ? (
                                POSTS.map((post: PostType) => (
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
                                        <p className="">{post.name}</p>
                                      </div>
                                      {post.isUsed && (
                                        <p className="text-preset-5 ml-4 text-right text-grey-500">
                                          (Already used)
                                        </p>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  No themes available
                                </SelectItem>
                              )}
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
                    Submit
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
