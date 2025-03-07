import { Request, Response } from "express";
import { Task } from "../db/entities/Task";
import { AppDataSource } from "../db/data-source";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const getTask = async (req: Request, res: Response): Promise<any> => {
  console.log("hi");

  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, ACCESS_SECRET!) as {
      userId: number;
    };

    const tasks = await AppDataSource.getRepository(Task).find({
      where: { user: { id: decoded.userId } }, // Use user ID from token
      order: { createdAt: "DESC" },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Add a Task
export const postTask = async (req: Request, res: Response) => {
  try {
    const { task, userId } = req.body;
    const taskRepo = AppDataSource.getRepository(Task);
    const newTask = taskRepo.create({ task, user: { id: userId } });
    await taskRepo.save(newTask);
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
};
// Update Task
export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { task } = req.body;

    const taskRepo = AppDataSource.getRepository(Task);

    // Find the existing task
    const existingTask = await taskRepo.findOne({ where: { id: Number(id) } });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task properties
    existingTask.task = task;

    await taskRepo.save(existingTask);

    res.json({ message: "Task updated", updatedTask: existingTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await AppDataSource.getRepository(Task).delete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
