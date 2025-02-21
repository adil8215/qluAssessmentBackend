import express from "express";
import { validateUser } from "../middlewares/validateUserSchema"; // Import the validation middleware
import {
  checkUserStatus,
  createUser,
  getAllUsers,
  getLoggedInUser,
  getUserById,
  loginController,
  logout,
  sendOtp,
  updateUser,
  updateUserContactInfo,
  updateUserProfile,
} from "../controllers/userController"; // Import the user controller
import { authMiddleware } from "../middlewares/authMiddlewares";
import upload from "../middlewares/uploadFile";

const userRouter = express.Router();

// Define the route with validation and controller
userRouter.post("/createUser", validateUser, createUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUserById/:id", getUserById);
userRouter.patch("/updateUser/:id", validateUser, updateUser);
userRouter.post("/login", loginController);
userRouter.get("/getLoggedInUser", authMiddleware, getLoggedInUser);
userRouter.get("/sendOtp/:id", sendOtp);

userRouter.patch("/updateContact/:id", updateUserContactInfo);

// Route to update name, username, status, and profile photo
userRouter.patch(
  "/updateProfile/:id",
  upload.single("file"),
  updateUserProfile
);

userRouter.use("/check-token", checkUserStatus);

userRouter.get("/logout", logout);
export default userRouter;
