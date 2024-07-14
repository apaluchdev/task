import TaskList from "@/components/task/task-list";
import { db } from "@/db";
import { getTasksByUserId } from "@/db/queries";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return <h1 className="text-4xl font-bold text-center mt-24">Please sign in</h1>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-left text-xl flex flex-col">
        <div className="flex justify-between w-full border-b pb-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ">Tasks</h1>
        </div>

        <div>
          <h2 className="scroll-m-20 text-1xl font-bold tracking-tight lg:text-2xl pb-4 pt-4">Priority</h2>
          <TaskList tasksProp={await getTasksByUserId(session?.user.id as string)} />
        </div>
      </div>
    </main>
  );
}
