import TaskList from "@/components/task/task-list";
import { getTasksByUserId } from "@/db/queries";
import { authOptions } from "@/lib/auth";
import { getSampleTasks } from "@/types/task";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-5xl items-left text-xl flex flex-col gap-8">
        <div className="flex justify-between w-full border-b pb-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ">Tasks</h1>
        </div>
        <div>
          {/* <h2 className="scroll-m-20 text-1xl font-bold tracking-tight lg:text-2xl pb-4 pt-4">Priority</h2> */}
          {session?.user.id && <TaskList tasksProp={await getTasksByUserId(session?.user.id as string)} />}
          {!session?.user.id && <TaskList tasksProp={session ? [] : getSampleTasks()} />}
        </div>
      </div>
    </main>
  );
}
