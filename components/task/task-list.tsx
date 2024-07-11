"use client";

import React, { useState } from "react";
import Task from "./task";
import { SelectTask } from "@/db/schema";
import { deleteTask, getTasks, updateTask } from "@/db/queries";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddTaskForm from "./add-task-form";

interface Props {
  tasksProp: SelectTask[];
}

const TaskList: React.FC<Props> = ({ tasksProp }) => {
  const [tasks, setTasks] = useState<SelectTask[]>(tasksProp.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));
  const [addTaskDialogOpen, setAddTaskDialogOpen] = React.useState(false);

  async function onCheckChange(id: number) {
    let task = tasks.find((task) => task.id === id);
    if (!task) {
      return;
    }

    toast({
      title: "Task Updated",
      variant: "default",
      duration: 1000,
    });

    task.completed = !task.completed;

    const updatedTasks: SelectTask[] = [...tasks];
    setTasks(updatedTasks.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).sort((a, b) => (a.completed ? 1 : -1)));

    await updateTask(task.id, { ...task, completed: task.completed });
  }

  async function onDelete(taskId: number) {
    await deleteTask(taskId);
    toast({
      title: "Task Deleted",
      duration: 2000,
    });

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  }

  async function onAddTask() {
    setAddTaskDialogOpen(false);
    // TODO - Add a loading state
    setTasks(await getTasks());
  }

  const AddTaskDialog = () => {
    return (
      <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Add Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Add a new task</DialogDescription>
          </DialogHeader>
          <AddTaskForm onSubmitted={onAddTask} />
        </DialogContent>
      </Dialog>
    );
  };

  // TODO - Try adding ability to drag tasks around to rearrange them
  // TODO - Add loading state
  return (
    <div>
      <div className="ml-4 flex items-left flex-col gap-2 pb-8">
        {tasks.map((task) => (
          <div key={task.id} className="border-b pb-2 flex gap-4">
            <Task task={task} onToggle={onCheckChange} />
            <Button
              className=" hover:text-red-600 hover:bg-transparent hover:opacity-80 opacity-5"
              size="icon"
              variant="ghost"
              onClick={() => onDelete(task.id)}
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
      <AddTaskDialog />
    </div>
  );
};

export default TaskList;
