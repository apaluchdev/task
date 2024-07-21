"use server";

import { eq, inArray } from "drizzle-orm";
import { db } from ".";
import { SelectTask, tasks } from "./schema";
import { Task, TaskSchema } from "@/types/task";
import { z, ZodError } from "zod";
import { isRateLimitExceeded } from "@/lib/rate-limiter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);

  if (session?.user.id !== data.userId) {
    throw new Error("Cannot insert a task for another user");
  }

  await queryWrapper(async () => {
    await db.insert(tasks).values(TaskSchema.parse(data));
  });
}

export async function upsertTask(data: Task): Promise<void> {
  if (!data.id) insertTask(data);
  else updateTask(data.id, data);
}

// Read
export async function getTasks(): Promise<SelectTask[]> {
  const session = await getServerSession(authOptions);

  if (session?.user.email !== "apaluchdev@gmail.com") {
    throw new Error("Cannot read all tasks");
  }

  return await queryWrapper(async () => {
    return await db.select().from(tasks);
  });
}

// Read
export async function getTasksByUserId(userId: Task["userId"]): Promise<Task[]> {
  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    throw new Error("Cannot read tasks for another user");
  }

  return await queryWrapper(async () => {
    const dbTasks: SelectTask[] = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return dbTasks.map((t) => {
      return TaskSchema.parse(t);
    });
  });
}

// Update
export async function updateTask(id: Task["id"], data: Partial<Omit<Task, "id">>) {
  const session = await getServerSession(authOptions);

  if (!id) return;
  if (session?.user.id !== data.userId) {
    throw new Error("Cannot update a task for another user");
  }

  data.updatedAt = new Date();

  return await queryWrapper(async () => {
    await db.update(tasks).set(data).where(eq(tasks.id, id));
  });
}

// Delete
export async function deleteTask(id: Task["id"]) {
  if (!id) return;

  const taskToDelete = (await db.select().from(tasks).where(eq(tasks.id, id)))[0];

  if (!taskToDelete) return;

  if (taskToDelete.userId !== (await getServerSession(authOptions))?.user.id) {
    throw new Error("Cannot delete a task for another user");
  }

  return await queryWrapper(async () => {
    await db.delete(tasks).where(eq(tasks.id, id));
  });
}

// Delete multiple tasks
export async function deleteTasks(ids: Task["id"][]) {
  const session = await getServerSession(authOptions);
  if (!ids || ids.length === 0) return;

  const tasksToDelete = await db
    .select()
    .from(tasks)
    .where(
      inArray(
        tasks.id,
        ids.filter((id) => id !== undefined)
      )
    );

  tasksToDelete.forEach((task) => {
    if (task.userId !== session?.user.id) {
      throw new Error("Cannot delete a task for another user");
    }
  });

  return await queryWrapper(async () => {
    await db.delete(tasks).where(
      inArray(
        tasks.id,
        ids.filter((id) => id !== undefined)
      )
    );
  });
}
