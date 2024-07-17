"use client";

import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Task } from "@/types/task";

interface Props {
  task: Task;
  onToggle: (id: number) => void;
}

// An individual task component
const TaskCheckbox: React.FC<Props> = ({ task, onToggle }) => {
  return (
    <div className={`flex items-center gap-4 tracking-tight ${task.completed ? "text-gray-500 opacity-50" : ""}`} key={task.id}>
      <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id ?? -1)} className="scale-125 hover:bg-slate-100" id={task.id + ""} />
      <Label className={`text-xl tracking-tight hover:cursor-pointer`} htmlFor={task.id + ""}>
        <div className="flex flex-col">
          <h1>{task.title}</h1>
          {task.description && <p className="text-gray-500 text-sm">{task.description}</p>}
        </div>
      </Label>
    </div>
  );
};

export default TaskCheckbox;
