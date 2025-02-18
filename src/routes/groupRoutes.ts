import express from "express";
import * as groupController from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const groupRouter = express.Router();

// Routes for group CRUD operations
groupRouter.post("/createGroup", authMiddleware, groupController.createGroup);
groupRouter.get(
  "/fetchGroupById/:groupId",
  authMiddleware,
  groupController.getGroupById
);
groupRouter.put(
  "/updateGroup/:groupId",
  authMiddleware,
  groupController.updateGroup
);
groupRouter.delete(
  "/deleteGroup/:groupId",
  authMiddleware,
  groupController.deleteGroup
);
groupRouter.get("/user-groups", authMiddleware, groupController.getUserGroups);
export default groupRouter;
