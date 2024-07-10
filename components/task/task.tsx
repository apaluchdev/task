"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { SelectTask } from "@/db/schema";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteTask } from "@/db/queries";
import { toast } from "../ui/use-toast";

interface Props {
  task: SelectTask;
  onToggle: (id: number) => void;
}

// An individual task component
const Task: React.FC<Props> = ({ task, onToggle }) => {
  async function onDelete(taskId: number) {
    await deleteTask(taskId);
    toast({
      title: "Task Deleted",
      description: <div>The task</div>,
      variant: "destructive",
    });

    // TODO - tasks need to be refreshed after a deletion
  }

  return (
    <div className={`flex items-center gap-4 tracking-tight ${task.completed ? "text-gray-500 opacity-50" : ""}`} key={task.id}>
      <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} className="scale-125 hover:bg-slate-100" id={task.id + ""} />
      <Label className={`text-xl tracking-tight hover:cursor-pointer`} htmlFor={task.id + ""}>
        {task.title} {task.description ? " - " + task.description : ""}
      </Label>
      {/* Fix the color of the icon not turning red when hovered */}
      <Button className=" hover:text-red-600 hover:bg-transparent hover:opacity-80 opacity-5" size="icon" variant="ghost" onClick={() => onDelete(task.id)}>
        <Trash />
      </Button>
    </div>
  );
};

export default Task;
