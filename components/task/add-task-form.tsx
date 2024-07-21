"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { upsertTask } from "@/db/queries";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { TimePicker } from "../ui/time-picker";
import { Task } from "@/types/task";

interface Props {
  onSubmitted: () => void;
  task: Task | undefined;
}

const AddTaskForm: React.FC<Props> = ({ onSubmitted, task }) => {
  const { data: session } = useSession();
  const formSchema = z.object({
    title: z.string().min(1).max(256),
    description: z.string().min(0).max(256),
    dateTime: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dateTime: task?.deadline ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await upsertTask({
        id: task?.id,
        title: values.title,
        description: values.description,
        userId: session?.user.id as string,
        deadline: values.dateTime,
        completed: false,
      });

      toast({
        title: task?.id ? "Task Updated" : "Task Submitted",
      });

      onSubmitted();
    } catch (error) {
      toast({
        title: "An error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form className="flex gap-8 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
              <FormLabel>
                Description <span className="opacity-50 italic"> - Optional</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Task Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">
                Deadline <span className="opacity-50 italic"> - Optional</span>
              </FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
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
