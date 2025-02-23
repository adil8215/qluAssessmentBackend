import express from "express";
import * as conversationController from "../controllers/conversationController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const conversationRouter = express.Router();

// Find an existing conversation between sender and receiver
conversationRouter.use(authMiddleware);
conversationRouter.get("/:receiverId", conversationController.findConversation);

conversationRouter.get(
  "/group/:groupId",
  conversationController.getConversationByGroupId
);

conversationRouter.get(
  "/fetchUserConversations/:id",
  conversationController.getUserConversations
);
export default conversationRouter;
