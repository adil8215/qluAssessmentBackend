import { z } from "zod";

export const uploadAttachmentSchema = z.object({
  messageId: z
    .number({ invalid_type_error: "Message ID must be a number" })
    .int()
    .positive("Message ID must be a positive integer"),
});

export const getAttachmentsSchema = z.object({
  messageId: z.string().regex(/^\d+$/, "Message ID must be a valid number"),
});

export const deleteAttachmentSchema = z.object({
  attachmentId: z
    .string()
    .regex(/^\d+$/, "Attachment ID must be a valid number"),
});
