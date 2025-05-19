import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

type TaskInputFormProps = {
  projectId: string;
};

interface TaskFormData {
  name: string;
}

export const TaskInputForm = ({ projectId }: TaskInputFormProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => {
      return fetch(`http://localhost:3000/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [projectId] });

      // Reset input field
      if (ref.current) {
        ref.current.value = "";
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const taskData: TaskFormData = {
      name: formData.get("name") as string,
    };

    mutation.mutate(taskData.name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={ref} type="text" name="name" placeholder="Task name" />
      <button type="submit">Submit</button>
    </form>
  );
};
