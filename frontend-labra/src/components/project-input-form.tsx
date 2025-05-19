import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export const ProjectInputForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => {
      return fetch(`http://localhost:3000/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Reset input field
      if (ref.current) {
        ref.current.value = "";
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    mutation.mutate(name);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <input
        ref={ref}
        type="text"
        name="name"
        placeholder="New project name"
        className="px-2 py-1 border rounded mr-2 text-sm"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
      >
        Add Project
      </button>
    </form>
  );
};
