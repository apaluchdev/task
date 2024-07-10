"use client";

import React, { useState } from "react";
import Task from "./task";
import { SelectTask } from "@/db/schema";
import { updateTask } from "@/db/queries";
import { toast } from "../ui/use-toast";

interface Props {
  tasksProp: SelectTask[];
}

const TaskList: React.FC<Props> = ({ tasksProp }) => {
  const [tasks, setTasks] = useState<SelectTask[]>(tasksProp.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));

  async function onCheckChange(id: number) {
    let task = tasks.find((task) => task.id === id);
    if (!task) {
      return;
    }

    await updateTask(task.id, { ...task, completed: !task.completed });

    toast({
      title: "Task Updated",
      variant: "default",
    });

    task.completed = !task.completed;
    const updatedTasks: SelectTask[] = [...tasks];
    setTasks(updatedTasks.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).sort((a, b) => (a.completed ? 1 : -1)));
  }

  // TODO - Try adding ability to drag tasks around to rearrange them
  // TODO - Add loading state
  return (
    <div>
      <div className="ml-4 flex items-left flex-col gap-2">
        {tasks.map((task) => (
          <div key={task.id} className="border-b pb-2">
            <Task task={task} onToggle={onCheckChange} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
