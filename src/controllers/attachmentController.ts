import { Request, Response } from "express";
import * as attachmentService from "../services/attachmentService";
import { Attachment } from "interfaces/attachment";

export const uploadAttachments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.files || !(req.files instanceof Array)) {
      res.status(400).json({ error: "No files uploaded" });
    }
    console.log("req files", req.files, req.body);
    const { messageId } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log(req.files);
    const attachments = await Promise.all(
      files.map((file) =>
        attachmentService.createAttachment(
          Number(messageId),
          file.mimetype,
          `/uploads/${file.filename}`
        )
      )
    );

    res.status(201).json({ message: "Attachments uploaded", attachments });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload attachments" });
  }
};

export const getAttachments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { messageId } = req.params;
    const attachments = await attachmentService.getAttachmentsByMessageId(
      Number(messageId)
    );

    res.status(200).json(attachments);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to retrieve attachments" });
  }
};

export const deleteAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { attachmentId } = req.params;
    const deletedAttachment = await attachmentService.deleteAttachment(
      Number(attachmentId)
    );

    if (!deletedAttachment) {
      res.status(404).json({ error: "Attachment not found" });
    }

    res.status(200).json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
};
