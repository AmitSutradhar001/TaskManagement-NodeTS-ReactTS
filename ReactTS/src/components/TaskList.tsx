import { FC } from "react";
import TaskItem from "./TaskItem";

export interface Task {
  id: number;
  task: string;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  console.log(tasks);

  return (
    <ul className="list-none">
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TaskList;
