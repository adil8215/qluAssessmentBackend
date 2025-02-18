import express from "express";
import * as conversationController from "../controllers/conversationController";
import { authMiddleware } from "../middlewares/authMiddlewares";

const conversationRouter = express.Router();

// Find an existing conversation between sender and receiver
conversationRouter.get(
  "/:receiverId",
  authMiddleware,
  conversationController.findConversation
);

conversationRouter.get(
  "/group/:groupId",
  authMiddleware,
  conversationController.getConversationByGroupId
);

export default conversationRouter;
