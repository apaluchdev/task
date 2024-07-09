import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { db } from "@/server/db";
import { sql } from "@vercel/postgres";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-left text-xl flex flex-col">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-2">Tasks</h1>
        </div>
        <div>
          <h2 className="scroll-m-20 text-1xl font-bold tracking-tight lg:text-2xl pb-4 pt-4">Priority</h2>
          <Tasks />
        </div>
      </div>
    </main>
  );
}

async function Tasks(): Promise<JSX.Element> {
  const tasks = await db.query.tasks.findMany();

  return (
    <div className="ml-4 flex items-left flex-col gap-6">
      {tasks.map((task) => (
        <div className="flex items-center gap-4 tracking-tight" key={task.id}>
          {/* TODO On check, switch text to gray */}
          <Checkbox className="scale-125" id={task.id + ""} />
          <Label className="text-xl tracking-tight" htmlFor={task.id + ""}>
            {task.title} {task.description ? " - " + task.description : ""}
          </Label>
        </div>
      ))}
    </div>
  );
}
