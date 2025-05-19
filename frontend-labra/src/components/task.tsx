import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "./project";
import { useState } from "react";
import { TaskCompleteButton } from "./task-complete-button";

type TaskComponentProps = {
  projectId: string;
  task: Task;
};

export const TaskComponent = ({ projectId, task }: TaskComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [projectId] });
    },
  });

  // ----------------------------------------
  //
  // ----------------------------------------
  if (isEditing) {
    return (
      <div>
        <p>Edit Task</p>

        <button
          onClick={() => {
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
        <button onClick={() => {}}>Save</button>
      </div>
    );
  }

  // ----------------------------------------
  //
  // ----------------------------------------
  return (
    <li className="flex items-center p-2 border rounded">
      <div className="flex items-center gap-2 flex-grow">
        <span className={task.completed ? "line-through text-gray-500" : ""}>
          {task.name}
        </span>
        <TaskCompleteButton
          taskId={task.id}
          completed={task.completed}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: [projectId] })
          }
        />
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this task?")) {
              deleteMutation.mutate(task.id);
            }
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
};
