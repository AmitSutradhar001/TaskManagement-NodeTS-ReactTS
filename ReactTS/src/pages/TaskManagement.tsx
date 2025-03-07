import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm.tsx";
import TaskList from "../components/TaskList.tsx";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading.tsx";
import { createTask, deleteTask, updateTask } from "../api.ts";
import { Task } from "../types.ts";

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkRefreshToken() {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:7000/users/refresh-token",
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          auth?.setdetails({
            accessToken: response.data.accessToken,
            user: response.data.user,
          });
          getTask(response.data.accessToken);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    async function getTask(token: string) {
      try {
        const res = await axios.get("http://localhost:7000/tasks/getTask", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.status === 200) {
          setTasks(res.data);
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    }

    if (!auth?.details) {
      checkRefreshToken();
    } else {
      getTask(auth.details.accessToken);
    }
  }, []);

  const handleSave = async (task: Task) => {
    try {
      if (editingTask) {
        const updatedTask = await updateTask(task);
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
        setEditingTask(null);
      } else {
        const newTask = await createTask(
          task.task,
          auth?.details?.user?.id ?? ""
        );
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleEdit = (task: Task) => setEditingTask(task);

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7000/users/logout/`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error logout task:", error);
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 shadow-md rounded">
        <div className="flex justify-between items-center gap-2 p-4">
          <h2 className="text-xl font-bold mb-2">Task Management</h2>
          <img
            onClick={handleLogout}
            className="bg-red-400 rounded-full cursor-pointer h-10 w-10"
            src="./shutdown.png"
          />
        </div>

        <TaskForm onSave={handleSave} editingTask={editingTask} />
        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </>
  );
};

export default TaskManagement;
