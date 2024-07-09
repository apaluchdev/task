CREATE TABLE IF NOT EXISTS "tsk_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	"deadline" timestamp
);
--> statement-breakpoint
DROP TABLE "tsk_image";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "tsk_task" USING btree ("title");