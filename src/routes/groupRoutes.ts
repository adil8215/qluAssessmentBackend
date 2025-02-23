import express from "express";
import * as groupController from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const groupRouter = express.Router();

// Routes for group CRUD operations
groupRouter.use(authMiddleware);
groupRouter.post("/createGroup", groupController.createGroup);
groupRouter.get("/fetchGroupById/:groupId", groupController.getGroupById);
groupRouter.put("/updateGroup/:groupId", groupController.updateGroup);
groupRouter.delete("/deleteGroup/:groupId", groupController.deleteGroup);
groupRouter.get("/user-groups", groupController.getUserGroups);
export default groupRouter;
