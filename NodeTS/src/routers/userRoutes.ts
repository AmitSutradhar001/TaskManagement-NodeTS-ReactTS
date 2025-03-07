import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/refresh-token", refreshToken);

export default userRouter;
