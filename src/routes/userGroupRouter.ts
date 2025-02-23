import express from "express";
import * as userGroupController from "../controllers/userGroupController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const userGroupRouter = express.Router();
userGroupRouter.use(authMiddleware);
// Routes for managing users in groups
userGroupRouter.post(
  "/add",

  userGroupController.addUserToGroup
);
userGroupRouter.delete(
  "/remove/:userId/:groupId",

  userGroupController.removeUserFromGroup
);
userGroupRouter.get("/:groupId/users", userGroupController.getUsersInGroup);
userGroupRouter.get("/:userId/groups", userGroupController.getGroupsForUser);

export default userGroupRouter;
