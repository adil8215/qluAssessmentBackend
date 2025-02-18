import express from "express";
import * as attachmentController from "../controllers/attachmentController";
import upload from "../middlewares/uploadFile";
import { authMiddleware } from "../middlewares/authMiddlewares";
// import { validate } from "../middleware/validate";
// import { uploadAttachmentSchema, getAttachmentsSchema, deleteAttachmentSchema } from "../validations/attachmentValidation";

const attachmentRouter = express.Router();

attachmentRouter.post(
  "/upload",
  [upload.array("files", 10), authMiddleware], // Allow up to 10 files
  //   validate(uploadAttachmentSchema),
  attachmentController.uploadAttachments
);

attachmentRouter.get(
  "/:messageId",
  authMiddleware,
  attachmentController.getAttachments
);

attachmentRouter.delete(
  "/:attachmentId",
  authMiddleware,
  attachmentController.deleteAttachment
);

export default attachmentRouter;
