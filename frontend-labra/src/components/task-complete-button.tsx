import { useMutation } from "@tanstack/react-query";

interface TaskCompleteButtonProps {
  taskId: string;
  completed: boolean;
  onSuccess?: () => void;
}

export function TaskCompleteButton(props: TaskCompleteButtonProps) {
  const { taskId, completed, onSuccess } = props;

  const mutation = useMutation({
    mutationFn: async (newCompleted: boolean) => {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => mutation.mutate(!completed)}
        disabled={mutation.isPending}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm font-medium">
        {completed ? "Completed" : "Mark as done"}
      </span>
    </label>
  );
}
