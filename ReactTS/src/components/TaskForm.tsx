import { FC, useState, useEffect } from "react";
import { Task } from "../types";

interface TaskFormProps {
  onSave: (task: Task) => Promise<void>; // Change to async function
  editingTask?: Task | null;
}

const TaskForm: FC<TaskFormProps> = ({ onSave, editingTask }) => {
  const [task, setTask] = useState("");

  useEffect(() => {
    if (editingTask) setTask(editingTask.task);
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    onSave({ id: editingTask ? editingTask.id : Date.now(), task });
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 flex-1 rounded"
        placeholder="Enter task..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {editingTask ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default TaskForm;
