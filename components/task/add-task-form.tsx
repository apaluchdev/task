"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { insertTask } from "@/db/queries";
import { useRouter } from "next/navigation";
const { v4: uuidv4 } = require("uuid");

export function AddTaskForm() {
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(1).max(256),
    description: z.string().min(0).max(256),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await insertTask({
      title: values.title,
      description: values.description,
      userId: uuidv4(),
    });

    toast({
      title: "Task Submitted",
      description: <div>The task</div>,
    });

    router.refresh();
  }

  return (
    <Form {...form}>
      <form className="flex gap-8 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Title</FormLabel>
              <FormControl>
                <Input placeholder="Task Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Description</FormLabel>
              <FormControl>
                <Input placeholder="Task Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="self-start" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
