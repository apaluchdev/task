// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { boolean, index, pgTableCreator, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tsk_${name}`);

export const tasks = createTable(
  "task",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    completed: boolean("completed").default(false).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    deadline: timestamp("deadline"),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  })
);

export type InsertTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;

// INSERT INTO tsk_task (title, description, userId, updatedAt, deadline)
// VALUES ('Task Title', 'Task Description', "User123", NULL, '2023-12-31 23:59:59');
