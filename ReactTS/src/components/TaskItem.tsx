import { FC } from "react";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-white p-2 shadow rounded mb-2">
      <span>{task.task}</span>
      <div className="flex gap-2">
        <button onClick={() => onEdit(task)} className="text-yellow-500">
          ✏️
        </button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">
          🗑
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
