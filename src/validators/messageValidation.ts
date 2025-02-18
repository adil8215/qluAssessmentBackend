import { z } from "zod";

// validations/messageValidation.ts

export const createMessageSchema = z.object({
  conversationId: z.coerce.number().optional(),
  senderId: z.coerce.number().optional(),
  receiverId: z.coerce.number({
    invalid_type_error: "Receiver ID must be a number",
  }),
  messageText: z.string().min(1, "Message cannot be empty."),
  messageType: z.string().optional(),
  conversation_type: z.string().optional(),
  group_id: z.string().nullable(),
  attachments: z.any(),
});

export const updateMessageSchema = z.object({
  messageId: z.number(),
  readAt: z.string().optional(),
});
