import { z } from "zod";

export const createConversationSchema = z.object({
  participants: z
    .array(z.number())
    .min(2, "At least two participants are required."),
});

export const updateConversationSchema = z.object({
  lastMessageId: z.number(),
});
