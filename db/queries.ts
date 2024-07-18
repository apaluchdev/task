"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { SelectTask, tasks } from "./schema";
import { Task, TaskSchema } from "@/types/task";
import { z, ZodError } from "zod";
import { isRateLimitExceeded } from "@/lib/rate-limiter";

const queryWrapper = async <T>(queryFunction: () => Promise<T>): Promise<T> => {
  try {
    if (await isRateLimitExceeded()) throw new Error("Rate limit exceeded");

    return await queryFunction();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Validation error: " + error.errors);
    }
    throw error;
  }
};

// Create
export async function insertTask(data: Task): Promise<void> {
  await queryWrapper(async () => {
    await db.insert(tasks).values(TaskSchema.parse(data));
  });
}

// Read
export async function getTasks(): Promise<SelectTask[]> {
  return await queryWrapper(async () => {
    return await db.select().from(tasks);
  });
}

// Read
export async function getTasksByUserId(userId: Task["userId"]): Promise<Task[]> {
  return await queryWrapper(async () => {
    const dbTasks: SelectTask[] = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return dbTasks.map((t) => {
      return TaskSchema.parse(t);
    });
  });
}

// Update
export async function updateTask(id: Task["id"], data: Partial<Omit<Task, "id">>) {
  if (!id) return;
  data.updatedAt = new Date();

  return await queryWrapper(async () => {
    await db.update(tasks).set(data).where(eq(tasks.id, id));
  });
}

// Delete
export async function deleteTask(id: Task["id"]) {
  if (!id) return;

  return await queryWrapper(async () => {
    await db.delete(tasks).where(eq(tasks.id, id));
  });
}