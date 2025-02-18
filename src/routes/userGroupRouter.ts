import express from "express";
import * as userGroupController from "../controllers/userGroupController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const userGroupRouter = express.Router();

// Routes for managing users in groups
userGroupRouter.post(
  "/add",
  authMiddleware,
  userGroupController.addUserToGroup
);
userGroupRouter.delete(
  "/remove/:userId/:groupId",
  authMiddleware,
  userGroupController.removeUserFromGroup
);
userGroupRouter.get(
  "/:groupId/users",
  authMiddleware,
  userGroupController.getUsersInGroup
);
userGroupRouter.get(
  "/:userId/groups",
  authMiddleware,
  userGroupController.getGroupsForUser
);

export default userGroupRouter;
