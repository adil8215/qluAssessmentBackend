import express from "express";
import { validateUser } from "../middlewares/validateUserSchema"; // Import the validation middleware
import {
  createUser,
  getAllUsers,
  getLoggedInUser,
  getUserById,
  loginController,
  updateUser,
} from "../controllers/userController"; // Import the user controller
import { authMiddleware } from "../middlewares/authMiddlewares";

const userRouter = express.Router();

// Define the route with validation and controller
userRouter.post("/createUser", validateUser, createUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUserById/:id", getUserById);
userRouter.patch("/updateUser/:id", validateUser, updateUser);
userRouter.post("/login", loginController);
userRouter.get("/getLoggedInUser", authMiddleware, getLoggedInUser);

export default userRouter;
