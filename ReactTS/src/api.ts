import axios from "axios";

const API_URL = "http://localhost:7000/tasks"; // Adjust as needed

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/getTask`, {
      withCredentials: true,
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (task: string, userId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/postTask`,
      { task, userId },
      {
        withCredentials: true,
      }
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (task: { id: number; task: string }) => {
  try {
    const response = await axios.put(`${API_URL}/updateTask/${task.id}`, task, {
      withCredentials: true,
    });
    return response.data.updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/deleteTask/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
