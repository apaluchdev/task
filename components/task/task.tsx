"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Task } from "@/types/task";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { getRemainingTime } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TaskCheckboxProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: () => void;
}

function getTimeRemainingString({ days, hours, minutes }: { days: number; hours: number; minutes: number }): string {
  return `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// An individual task component
const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ task, onToggle, onEdit }) => {
  const [tick, setTick] = useState(0); // State to trigger re-render

  const { days, hours, minutes } = getRemainingTime(task.deadline ?? undefined);
  const isOverdue = task.deadline && new Date() > task.deadline;

  // Update the time remaining every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prevTick) => prevTick + 1); // Update state to trigger re-render
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
        <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id ?? -1)} className="transition-colors duration-500 scale-125 hover:bg-slate-100 " id={task.id + ""} />
        <Label className={` text-base lg:text-xl tracking-tight hover:cursor-pointer`} htmlFor={task.id + ""}>
          <div className="flex flex-col">
            <h1>{task.title}</h1>
            {task.description && <p className="text-gray-500 text-sm">{task.description}</p>}
          </div>
        </Label>
        <EditButton />
      </div>

      {task.deadline && (
        <div className="flex flex-col text-slate-500 text-end min-w-24" suppressHydrationWarning>
          <p suppressHydrationWarning className="font-bold text-black">
            {isOverdue && !task.completed && <p className="text-red-500 tracking-tight font-bold text-base">OVERDUE</p>}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p>{!isOverdue && !task.completed && getTimeRemainingString({ days, hours, minutes })}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p suppressHydrationWarning>Deadline: {task.deadline.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="hidden">{tick}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCheckbox;
