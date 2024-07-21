"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface TaskCheckboxProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: () => void;
}

// An individual task component
const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, onToggle, onEdit }) => {
  const EditButton: React.FC = () => {
    return (
      <Button className={`hover:text-black hover:bg-transparent hover:opacity-60 opacity-10`} size="icon" variant="ghost" onClick={onEdit}>
        <Pencil size={16} />
      </Button>
    );
  };

  return (
    <div className={`flex items-center justify-between tracking-tight w-full ${task.completed ? "text-gray-500 opacity-50" : ""}`} key={task.id}>
      <div className="flex items-center gap-4 ">
        <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id ?? -1)} className="scale-125 hover:bg-slate-100" id={task.id + ""} />
        <Label className={` text-base lg:text-xl tracking-tight hover:cursor-pointer`} htmlFor={task.id + ""}>
          <div className="flex flex-col">
            <h1>{task.title}</h1>
            {task.description && <p className="text-gray-500 text-sm">{task.description}</p>}
          </div>
        </Label>
        <EditButton />
      </div>

      {task.deadline && (
        <h3 className="text-xs pl-8 text-slate-500" suppressHydrationWarning>
          Deadline: {task.deadline.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </h3>
      )}
    </div>
  );
};

export default TaskCheckbox;
