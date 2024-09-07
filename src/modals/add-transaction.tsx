"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AddNewTransactionFormSchema,
  addNewTransactionSchema,
  Categories,
} from "@/lib/validations";

import { toast } from "@/hooks/use-toast";
import { useQuery } from "react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { format, formatISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addTransaction } from "@/app/(dashboard)/transactions/actions";

type PostType = {
  name: string;
  value: string;
  isUsed: boolean;
};

export default function AddnewTransaction() {
  const form = useForm<AddNewTransactionFormSchema>({
    resolver: zodResolver(addNewTransactionSchema),
    defaultValues: {
      recurring: false,
    },
  });

  const {
    reset,
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(values: AddNewTransactionFormSchema) {
    const res = await addTransaction(values);
    if (res.success) {
      toast({
        title: "Success",
        description: res.message,
      });
      reset({
        name: "",
        amount: 0,
        recurring: false,
        category: "Bills",
        avatar: "",
        date: "",
      });

      setTimeout(() => window.location.reload(), 2000);
    }

    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="w-full">
      <DialogHeader className="w-full">
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-col">
            <div className="flex w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g Urban Sevices Hub"
                            maxLength={30}
                            {...field}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) {
                                field.onChange(e);
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
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Transaction Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"secondary"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date ? formatISO(date) : "")
                              }
                              disabled={(date: any) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g $1000"
                            {...field}
                            type="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || value === "-") {
                                field.onChange(value);
                              } else {
                                field.onChange(parseFloat(value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel>Recurring</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
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
  );
}
