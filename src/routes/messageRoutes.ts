import express from "express";
import * as messageController from "../controllers/messageController";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../validators/messageValidation";
import { messageValidationMiddleware } from "../middlewares/generalValidationMiddleware";
import { authMiddleware } from "../middlewares/authMiddlewares";
import upload from "../middlewares/uploadFile";

const messageRouter = express.Router();
messageRouter.use(authMiddleware);
messageRouter.post(
  "/sendMessage",
  [upload.array("attachments"), messageValidationMiddleware],
  messageController.sendMessage
);

messageRouter.get(
  "/getMessagesByConversationId/:id",
  messageController.getConversationMessages
);
// router.put("/", validateRequest(updateMessageSchema), messageController.markMessageAsRead);

export default messageRouter;
