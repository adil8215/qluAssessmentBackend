import express from "express";
import { authMiddleware } from "../../middlewares/authMiddlewares";
import upload from "../../middlewares/uploadFile";
import {
  checkUserStatus,
  getAllUsers,
  getLoggedInUser,
  getUserById,
  updateUser,
  updateUserContactInfo,
  updateUserProfile,
  logout,
} from "../../controllers/userController";

const privateUserRouter = express.Router();

// Apply authentication middleware to all private routes
privateUserRouter.use(authMiddleware);

// Private Routes (Require Authentication)
privateUserRouter.get("/getAllUsers", getAllUsers);
privateUserRouter.get("/getUserById/:id", getUserById);
privateUserRouter.patch("/updateUser/:id", updateUser);
privateUserRouter.get("/getLoggedInUser", getLoggedInUser);
privateUserRouter.patch("/updateContact/:id", updateUserContactInfo);
privateUserRouter.patch(
  "/updateProfile/:id",
  upload.single("file"),
  updateUserProfile
);
privateUserRouter.get("/logout", logout);
privateUserRouter.get("/check-token", checkUserStatus);

export default privateUserRouter;
