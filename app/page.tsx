import { AddTaskDialog } from "@/components/task/add-task-dialog";
import TaskList from "@/components/task/task-list";
import { db } from "@/db";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-left text-xl flex flex-col">
        <div className="flex justify-between w-full border-b pb-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ">Tasks</h1>
          <AddTaskDialog />
        </div>

        <div>
          <h2 className="scroll-m-20 text-1xl font-bold tracking-tight lg:text-2xl pb-4 pt-4">Priority</h2>
          <TaskList tasksProp={await db.query.tasks.findMany()} />
        </div>
      </div>
    </main>
  );
}
