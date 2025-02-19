// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";
import { loginSchema } from "../validators/userAccountValidator";
import { AuthRequest } from "../middlewares/authMiddlewares";
import {
  deleteOtpByUserId,
  generateOtp,
  requestOtp,
} from "../services/otpService";
import { sendOtpEmail } from "../services/emailService";

// Controller to create a user
export const createUser = async (req: Request, res: Response) => {
  console.log("body", req.body);
  try {
    const user = await userService.createUser(req.body);
    console.log("user", user);
    res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Controller to get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a single user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to update a user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const updatedUser = await userService.updateUser(Number(id), req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await userService.deleteUser(Number(id));
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body); // Validate request

    // Call login service
    const { accessToken, refreshToken, user } = await userService.login(
      email,
      password
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out successfully" });
};

export const getLoggedInUser = (req: AuthRequest, res: Response): any => {
  if (!req.user) {
    return res.status(403).json({ message: "User not found." });
  }
  res.json({ userId: req.user.id });
};

export const updateUserContactInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params; // Get user ID from request params
  console.log("req.body", req.body);
  try {
    const updatedUser = await userService.updateUserContactInfo(
      Number(id),
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params; // User ID from params
  const file = req.file; // Uploaded file

  try {
    const updatedUser = await userService.updateUserProfile(
      Number(id),
      req.body,
      file
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await deleteOtpByUserId(Number(id));
    const user = await userService.getUserById(Number(id));
    const otpRecord = await requestOtp(Number(id));
    await sendOtpEmail(user?.email, otpRecord.otp);
    res.status(200).json("Otp send sucessfully");
  } catch (error) {
    console.log("error sending otp", error);
  }
};
