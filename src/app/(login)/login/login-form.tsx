"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye } from "@/components/ui/icons";
import { login } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  async function onSubmit(values: LoginFormSchema) {
    const res = await login(values.email, values.password);

    if (res.success) {
      toast({
        title: "Account created",
        description: res.message,
      });
      reset({
        email: "",
        password: "",
      });
      router.push("/login");
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      reset({
        email: "",
        password: "",
      });
    }
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
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl className="">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      onClick={togglePassword}
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-3"
                    >
                      <Eye />
                    </button>
                  </div>
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
        href="/sign-up"
      >
        Need to create an account?
        <span className="underline font-bold text-grey-900">Sign Up</span>
      </Link>
    </div>
  );
}
