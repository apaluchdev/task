import { db } from "./db";
import { InsertTask, tasks } from "./db/schema";

export async function insertTask(data: InsertTask) {
  await db.insert(tasks).values(data);
}

export async function getTasks() {
  return await db.select().from(tasks);
}
