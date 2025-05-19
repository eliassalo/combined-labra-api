import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project } from "./todo";
import { TaskComponent } from "./task";
import { TaskInputForm } from "./task-input-form";
import { useState } from "react";

const getProjectWithTasks = async (id: string) => {
  console.log(id);
  const response = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export type Task = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
};

export type ProjectWithTasks = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
};

type ProjectComponentProps = {
  project: Project;
};

export const ProjectComponent = ({ project }: ProjectComponentProps) => {
  const [showDelete, setShowDelete] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<ProjectWithTasks>({
    queryKey: [project.id],
    queryFn: () => getProjectWithTasks(project.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong</p>;
  }

  if (!data) {
    return <p>Could not find project with id: {project.id}</p>;
  }

  return (
    <div className="mb-8 p-4 border rounded">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          {project.name}
          <span className="ml-2 relative">
            <button
              onClick={() => setShowDelete(!showDelete)}
              className="text-gray-500 hover:text-gray-700 align-middle"
              style={{
                fontSize: "0.75rem",
                padding: "0 0.15rem",
                lineHeight: 1,
                minWidth: "auto",
                minHeight: "auto",
              }}
            >
              ...
            </button>
            {showDelete && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this project?"
                      )
                    ) {
                      deleteMutation.mutate(project.id);
                      setShowDelete(false);
                    }
                  }}
                  className="block w-full text-left px-3 py-1 text-red-500 hover:bg-red-50 text-sm whitespace-nowrap"
                >
                  Delete Project
                </button>
              </div>
            )}
          </span>
        </h2>
      </div>
      <ul className="space-y-2">
        {data.tasks.map((task) => (
          <TaskComponent key={task.id} task={task} projectId={project.id} />
        ))}
      </ul>
      <TaskInputForm projectId={project.id} />
    </div>
  );
};
