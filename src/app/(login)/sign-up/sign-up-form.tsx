'use client'

import { register } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import { SignUpFormSchema, signUpSchema } from '@/lib/validations'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Eye } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'

import { useToast } from '@/hooks/use-toast'

export default function SignupForm() {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const { toast } = useToast()
  const router = useRouter()
  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const {
    reset,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: SignUpFormSchema) {
    const res = await register(values.email, values.password, values.name)

    if (res.success) {
      toast({
        title: 'Account created',
        description: res.message,
      })
      reset({
        name: '',
        email: '',
        password: '',
      })
      router.push('/login')
    } else {
      toast({
        title: 'Error',
        description: res.message,
        variant: 'destructive',
      })
      reset({
        name: '',
        email: '',
        password: '',
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Email</FormLabel>
                <FormControl className="">
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl className="">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      onClick={togglePassword}
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Eye />
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Passwords must be at least 8 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isSubmitting}
            className="w-full gap-2"
            type="submit"
            loading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </Form>
      <Link
        className="text-preset-4 inline-flex items-center gap-2 truncate text-center font-normal text-grey-500"
        href="/login"
      >
        Already have an account?{' '}
        <span className="font-bold text-grey-900 underline">Login</span>
      </Link>
    </div>
  )
}
