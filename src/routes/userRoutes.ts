import express from "express";
import { validateUser } from "../middlewares/validateUserSchema"; // Import the validation middleware
import {
  createUser,
  getAllUsers,
  getUserById,
  loginController,
  updateUser,
} from "../controllers/userController"; // Import the user controller

const userRouter = express.Router();

// Define the route with validation and controller
userRouter.post("/createUser", validateUser, createUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUserById/:id", getUserById);
userRouter.patch("/updateUser/:id", validateUser, updateUser);
userRouter.post("/login", loginController);
export default userRouter;
