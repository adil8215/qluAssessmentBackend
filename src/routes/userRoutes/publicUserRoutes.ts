import express from "express";
import { validateUser } from "../../middlewares/validateUserSchema";
import {
  createUser,
  loginController,
  sendOtp,
  checkUserStatus,
} from "../../controllers/userController";

const publicUserRouter = express.Router();

// Public Routes (No Authentication Required)
publicUserRouter.post("/createUser", validateUser, createUser);
publicUserRouter.post("/login", loginController);
publicUserRouter.get("/sendOtp/:id", sendOtp);

export default publicUserRouter;
