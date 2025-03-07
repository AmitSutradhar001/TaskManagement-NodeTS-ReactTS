import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import { Server } from "http";
import { config } from "dotenv";
import userRouter from "./routers/userRoutes";
import taskRouter from "./routers/taskRoutes";
import cors from "cors";
config();
const app: Application = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json()); // ✅ This enables parsing JSON in request body
app.use(express.urlencoded({ extended: true })); // ✅ (Optional) Allows form data
app.use(cookieParser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from ts!");
});
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {};
app.use(errorHandler);
const PORT: Number = Number(process.env.PORT) || 5000;
const server: Server = app.listen(PORT, () =>
  console.log(`Server is on Port ${PORT}!`)
);
