"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: LoginFormSchema) {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(2000);
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center gap-8 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
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
            Login
          </Button>
        </form>
      </Form>
      <Link
        className="text-preset-4 text-center truncate  font-normal inline-flex gap-2 items-center text-grey-500"
        href="/register"
      >
        Need to create an account?
        <span className="underline font-bold text-grey-900">Sign Up</span>
      </Link>
    </div>
  );
}
