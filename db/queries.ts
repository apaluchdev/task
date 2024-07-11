"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { InsertTask, SelectTask, tasks } from "./schema";

// Create
export async function insertTask(data: InsertTask) {
  await db.insert(tasks).values(data);
}

// Read
export async function getTasks(): Promise<SelectTask[]> {
  return await db.select().from(tasks);
}

// Update
export async function updateTask(id: SelectTask["id"], data: Partial<Omit<SelectTask, "id">>) {
  data.updatedAt = new Date();
  await db.update(tasks).set(data).where(eq(tasks.id, id));
}

// Delete
export async function deleteTask(id: SelectTask["id"]) {
  await db.delete(tasks).where(eq(tasks.id, id));
}
