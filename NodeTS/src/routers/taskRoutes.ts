import { Router } from "express";
import {
  getTask,
  postTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.get("/getTask", getTask);
taskRouter.post("/postTask", postTask);
taskRouter.put("/updateTask/:id", updateTask);
taskRouter.delete("/deleteTask/:id", deleteTask);

export default taskRouter;
