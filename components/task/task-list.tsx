"use client";

import React, { useEffect, useState } from "react";
import { deleteTask, deleteTasks, getTasksByUserId, updateTask } from "@/db/queries";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddTaskForm from "./add-task-form";
import { useSession } from "next-auth/react";
import { sortTasksByProperty, Task } from "@/types/task";
import TaskCheckbox from "./task";
import { ScrollArea } from "../ui/scroll-area";
import { SortByDropdown } from "./sort-by-dropdown";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DeleteTaskAlert } from "./delete-task-alert";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  tasksProp: Task[];
}

const TaskList: React.FC<Props> = ({ tasksProp }) => {
  const { data: session } = useSession();

  // If the user is not signed in, show sample tasks
  const initialTasks = tasksProp;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [sort, setSort] = useState<{ key: string; direction: "Ascending" | "Descending" }>({
    key: "Date Created",
    direction: "Descending",
  });
  const [addEditTaskDialogOpen, setAddEditTaskDialogOpen] = React.useState(false);

  useEffect(() => {
    sortTasks(tasks);
    setTasks([...tasks]);
  }, [sort]);

  useEffect(() => {
    setSort((curr) => ({ key: curr.key, direction: (localStorage.getItem("sortPreference") as "Ascending" | "Descending") || curr.direction }));
  }, []);

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

    sortTasks(tasks);
    setTasks([...tasks]);

    if (!task.id) return;

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

  async function onDeleteCompleted() {
    const taskIds = tasks.filter((task) => task.completed).map((task) => task.id ?? -1);
    await deleteTasks(taskIds);
    toast({
      title: "Completed tasks cleared",
      duration: 2000,
    });

    const updatedTasks = tasks.filter((task) => !taskIds.includes(task.id ?? -1));
    setTasks(updatedTasks);
  }

  async function refreshTasks() {
    console.log("Refreshing tasks");
    setAddEditTaskDialogOpen(false);
    // TODO - Add a loading state
    const updatedTasks = await getTasksByUserId(session?.user.id as string);
    // sort tasks should not be setting state but just returning the sorted tasks
    sortTasks(updatedTasks);
    setTasks(updatedTasks);
    setSelectedTask(undefined);
  }

  function sortTasks(tasks: Task[]) {
    const isAscending = sort.direction === "Ascending";

    switch (sort.key) {
      case "Title":
        sortTasksByProperty(tasks, "title", isAscending);
        break;
      case "Date Created":
        sortTasksByProperty(tasks, "createdAt", isAscending);
        break;
      case "Deadline":
        sortTasksByProperty(tasks, "deadline", isAscending);
        break;
      default:
        sortTasksByProperty(tasks, "createdAt", isAscending);
    }
  }

  // Figure out how to reuse this but maybe not, we just need to edit the task from the task component
  const AddEditTaskDialog = ({ selectedTask }: { selectedTask: Task | undefined }) => {
    return (
      <Dialog open={addEditTaskDialogOpen} onOpenChange={setAddEditTaskDialogOpen}>
        <DialogTrigger asChild>
          <Button className="lg:scale-100 scale-90" disabled={!session?.user?.id} variant="default">
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Add Task" : "Edit Task"}</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <AddTaskForm task={selectedTask} onSubmitted={refreshTasks} />
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
          <AddEditTaskDialog selectedTask={selectedTask} />
        </div>
      </div>
    );

  // TODO - Try adding ability to drag tasks around to rearrange them
  // TODO - Add loading state
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between flex-wrap gap-2">
        <div className="flex gap-4">
          <AddEditTaskDialog selectedTask={selectedTask} />
        </div>
        <div className="flex gap-8 lg:scale-100 scale-90">
          <SortByDropdown setSort={setSort} sort={sort} />
        </div>
      </div>
      <ScrollArea className="max-h-[520px] overflow-y-auto border border-gray-200 rounded-xl p-4">
        <div className="ml-4 flex items-left flex-col gap-2 pb-8">
          {/* TODO - Try alternating the bg color of tasks */}
          {tasks.map((task) => (
            <div key={task.id} className={`border-b pb-2 flex gap-8`}>
              <TaskCheckbox
                task={task}
                onToggle={onCheckChange}
                onEdit={() => {
                  setSelectedTask(task);
                  setAddEditTaskDialogOpen(true);
                }}
              />
              <DeleteTaskAlert onDelete={() => onDelete(task.id ?? -1)} />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex w-full justify-between">
        <Button className="flex self-start lg:scale-100 scale-90" variant="outline" onClick={onDeleteCompleted}>
          Clear Completed
        </Button>
        <div className="flex items-center space-x-2 lg:scale-100 scale-90">
          <Switch checked={isPrivate} disabled={true} id="private-tasks" />
          <Label htmlFor="private-tasks">Private</Label>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
