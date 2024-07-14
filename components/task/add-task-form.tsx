"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { insertTask } from "@/db/queries";
import { useSession } from "next-auth/react";

interface Props {
  onSubmitted: () => void;
}

const AddTaskForm: React.FC<Props> = ({ onSubmitted }) => {
  const { data: session } = useSession();
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
      userId: session?.user.id as string,
    });

    toast({
      title: "Task Submitted",
    });

    onSubmitted();
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
        <Button variant="default" className="self-start" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddTaskForm;
