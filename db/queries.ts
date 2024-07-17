"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { InsertTask, SelectTask, tasks } from "./schema";
import { Task, TaskSchema } from "@/types/task";
import { z } from "zod";

// Create
export async function insertTask(data: Task) {
  try {
    const parsedTask = TaskSchema.parse(data);
    await db.insert(tasks).values(parsedTask);
  } catch (error) {
    // Using Zod for validation
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.errors);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

// Read
export async function getTasks(): Promise<SelectTask[]> {
  return await db.select().from(tasks);
}

// Read
export async function getTasksByUserId(userId: Task["userId"]): Promise<Task[]> {
  const dbTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));

  var parsedTasks: Task[] = [];
  try {
    parsedTasks = dbTasks.map((task) => {
      return TaskSchema.parse(task);
    });
  } catch (error) {
    // Using Zod for validation
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.errors);
    }
  }

  return parsedTasks;
}

// Update
export async function updateTask(id: Task["id"], data: Partial<Omit<Task, "id">>) {
  if (!id) return;

  data.updatedAt = new Date();
  await db.update(tasks).set(data).where(eq(tasks.id, id));
}

// Delete
export async function deleteTask(id: Task["id"]) {
  if (!id) return;

  await db.delete(tasks).where(eq(tasks.id, id));
}
