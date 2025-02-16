import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z.number().optional(),
  senderId: z.number().optional(),
  receiverId: z.number(),
  messageText: z.string().min(1, "Message cannot be empty."),
  messageType: z
    .enum(["text", "image", "video", "audio"])
    .default("text")
    .optional(),
});

export const updateMessageSchema = z.object({
  messageId: z.number(),
  readAt: z.string().optional(),
});
