import { Request, Response } from "express";
import { User } from "../db/entities/User";
import { AppDataSource } from "../db/data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const ACCESS_SECRET: any = process.env.ACCESS_SECRET;
const REFRESH_SECRET: any = process.env.REFRESH_SECRET;

export const login = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_SECRET,
      {
        expiresIn: "15m", // Access token expires in 15 minutes
      }
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: "7d", // Refresh token expires in 7 days
    });
    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        // sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "Login successful",
        accessToken,
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
    console.log("");
  }
};
// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = AppDataSource.getRepository(User).create({
      email,
      password: hashedPassword,
    });
    await AppDataSource.getRepository(User).save(user);
    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  try {
    const refreshToken = req.cookies.refreshToken; // Get token from cookies
    console.log("refreshToken  : ", refreshToken);

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is required" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Find the user in the database
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        ACCESS_SECRET,
        { expiresIn: "15m" } // Access token expires in 15 minutes
      );
      // Remove password from user object before sending response
      const { password: _, ...userWithoutPassword } = user;
      res
        .status(200)
        .json({ accessToken: newAccessToken, user: userWithoutPassword });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  console.log("hi");

  try {
    res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // Enable in production
        // sameSite: "strict",
      })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Error logging out", error });
  }
};
