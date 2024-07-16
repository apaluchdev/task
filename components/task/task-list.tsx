"use client";

import React, { useEffect, useState } from "react";
import Task from "./task";
import { SelectTask } from "@/db/schema";
import { deleteTask, getTasks, getTasksByUserId, updateTask } from "@/db/queries";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddTaskForm from "./add-task-form";
import { useSession } from "next-auth/react";

interface Props {
  tasksProp: SelectTask[];
  useSampleTasks: boolean;
}

const TaskList: React.FC<Props> = ({ tasksProp, useSampleTasks }) => {
  const { data: session } = useSession();

  // If the user is not signed in, show sample tasks
  const initialTasks = useSampleTasks
    ? GetSampleTasks()
    : tasksProp.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)).sort((a, b) => (a.completed ? 1 : -1));

  const [tasks, setTasks] = useState<SelectTask[]>(initialTasks);
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
    setTasks(await getTasksByUserId(session?.user.id as string));
  }

  const AddTaskDialog = () => {
    return (
      <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={!session?.user?.id} variant="default">
            Add Task
          </Button>
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

  // If no tasks are found, show a message and the add task dialog
  if (tasks.length < 1)
    return (
      <div className="flex gap-4 flex-col items-left">
        <h1>No tasks yet!</h1>
        <div>
          <AddTaskDialog />
        </div>
      </div>
    );

  // TODO - Try adding ability to drag tasks around to rearrange them
  // TODO - Add loading state
  return (
    <div>
      <div className="ml-4 flex items-left flex-col gap-2 pb-8">
        {tasks.map((task) => (
          <div key={task.id} className="border-b pb-2 flex gap-4">
            <Task task={task} onToggle={onCheckChange} />
            <Button
              className={`hover:text-red-600 hover:bg-transparent hover:opacity-60 opacity-5`}
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

const GetSampleTasks = () => {
  console.log("Got sample tasks");
  const date = new Date(1996, 0, 1);
  return [
    {
      id: 1,
      title: "Welcome to tasks",
      description: "",
      userId: "",
      completed: false,
      createdAt: date,
      updatedAt: date,
      deadline: date,
    },
    {
      id: 2,
      title: "Please sign in to save and track tasks",
      description: "Have a good day! 😊",
      userId: "",
      completed: false,
      createdAt: date,
      updatedAt: date,
      deadline: date,
    },
  ];
};

export default TaskList;
