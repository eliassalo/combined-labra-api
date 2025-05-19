import { useQuery } from "@tanstack/react-query";
import { ProjectComponent } from "./project";
import { ProjectInputForm } from "./project-input-form";

const getProjects = async () => {
  const response = await fetch("http://localhost:3000/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

// ----------------------------------------

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const Todo = () => {
  const { data, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <ProjectInputForm />
      {!data || data.length === 0 ? (
        <p className="text-gray-500">Add a project to start adding tasks</p>
      ) : (
        data.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))
      )}
    </div>
  );
};
