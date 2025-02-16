import express from "express";
import * as messageController from "../controllers/messageController";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../validators/messageValidation";
import { messageValidationMiddleware } from "../middlewares/generalValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddlewares";

const messageRouter = express.Router();

messageRouter.post(
  "/sendMessage",
  [messageValidationMiddleware, authMiddleware],
  messageController.sendMessage
);

messageRouter.get(
  "/getMessagesByConversationId/:id",
  messageController.getConversationMessages
);
// router.put("/", validateRequest(updateMessageSchema), messageController.markMessageAsRead);

export default messageRouter;
