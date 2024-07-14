ALTER TABLE "tsk_task" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tsk_task" ADD CONSTRAINT "tsk_task_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
