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

export function sortTasksByProperty(tasks: Task[], property: keyof Task, ascending: boolean) {
  var sortedTasks = tasks.sort((a, b) => {
    if (a[property] && b[property] && a[property] < b[property]) {
      return 1;
    }
    if (a[property] && b[property] && a[property] > b[property]) {
      return -1;
    }
    return 0;
  });
  sortedTasks = ascending ? sortedTasks : sortedTasks.reverse();
  sortedTasks = sortedTasks.sort((a, b) => (a.completed ? 1 : -1)); // Sort completed tasks to the bottom regardless of the sort settings
}

export const getSampleTasks = () => {
  const date = new Date(1996, 0, 1);
  return [
    {
      id: 1,
      title: "Welcome to tasks",
      description: "",
      userId: "",
      completed: false,
      createdAt: new Date(1996, 0, 1),
      updatedAt: date,
      deadline: new Date(2008, 0, 1),
    },
    {
      id: 2,
      title: "Please sign in to save and track tasks",
      description: "Have a good day! 😊",
      userId: "",
      completed: false,
      createdAt: new Date(2022, 0, 1),
      updatedAt: date,
      deadline: new Date(2006, 0, 1),
    },
  ];
};

// Infer the Task type from the schema
export type Task = z.infer<typeof TaskSchema>;
