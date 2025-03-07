import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Task } from "./entities/Task";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // ❗ Set to false in production
  logging: true,
  entities: [User, Task],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => console.log("📦 Database Connected"))
  .catch((err) => console.error("❌ Database Connection Failed", err));
