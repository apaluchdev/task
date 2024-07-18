import { z } from "zod";

// Define the Task validation schema using zod
export const TaskSchema = z.object({
  id: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
  title: z.string().max(256),
  description: z.string().max(256),
  userId: z.string(),
  completed: z.boolean(),
  deadline: z.date().optional().nullable(),
});

// Infer the Task type from the schema
export type Task = z.infer<typeof TaskSchema>;
