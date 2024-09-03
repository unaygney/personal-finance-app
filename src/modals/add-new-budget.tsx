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
import { AddNewPotsFormSchema, addNewPotsSchema } from "@/lib/validations";

const POSTS = [
  {
    name: "Green",
    value: "GREEN",
    theme: "#277C78",
  },
  {
    name: "Grey",
    value: "GREY",
    theme: "#626070",
  },
  {
    name: "Cyan",
    value: "CYAN",
    theme: "#82C9D7",
  },
  {
    name: "Orange",
    value: "ORANGE",
    theme: "#F2CDAC",
  },
  {
    name: "Purple",
    value: "PURPLE",
    theme: "#826CB0",
  },
  {
    name: "Red",
    value: "RED",
    theme: "#FF0000",
  },
  {
    name: "Yellow",
    value: "YELLOW",
    theme: "#FFFF00",
  },
  {
    name: "Navy",
    value: "NAVY",
    theme: "#000080",
  },
  {
    name: "Turquoise",
    value: "TURQUOISE",
    theme: "#40E0D0",
  },
  {
    name: "Brown",
    value: "BROWN",
    theme: "#A52A2A",
  },
  {
    name: "Magenta",
    value: "MAGENTA",
    theme: "#FF00FF",
  },
  {
    name: "Blue",
    value: "BLUE",
    theme: "#0000FF",
  },
  {
    name: "Army",
    value: "ARMY",
    theme: "#4B5320",
  },
  {
    name: "Pink",
    value: "PINK",
    theme: "#FFC0CB",
  },
  {
    name: "Yellowgreen",
    value: "YELLOWGREEN",
    theme: "#9ACD32",
  },
] as const;

export default function AddnewBudget() {
  const form = useForm<AddNewPotsFormSchema>({
    resolver: zodResolver(addNewPotsSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  function onSubmit(values: AddNewPotsFormSchema) {
    console.log(values);
  }

  return (
    <DialogContent className="w-full">
      <DialogHeader className="w-full">
        <DialogTitle>Add New Pot</DialogTitle>
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
                    name="potName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pot Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rainy Days" {...field} />
                        </FormControl>
                        <FormDescription>30 characters left</FormDescription>
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
                              {POSTS.map((post) => (
                                <SelectItem key={post.name} value={post.value}>
                                  <div className="flex items-center">
                                    <span
                                      className="mr-2 h-4 w-4 rounded-full"
                                      style={{ backgroundColor: post.theme }}
                                    />
                                    <p className="">{post.name}</p>
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
