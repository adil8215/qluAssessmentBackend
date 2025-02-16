import { Request, Response } from "express";
import * as messageService from "../services/messageService";
import * as conversationService from "../services/conversationService";
import { getSocketInstance } from "../utils/socket";
export const sendMessage = async (
  req: Request | any,
  res: Response
): Promise<any> => {
  try {
    const senderId = req.user?.id;
    const { receiverId, messageText, messageType } = req.body;

    // 1. Check if a conversation exists
    let conversation = await conversationService.findConversation(
      senderId,
      receiverId
    );

    // 2. If not, create a new conversation
    if (!conversation) {
      conversation = await conversationService.createConversation([
        senderId,
        receiverId,
      ]);
    }

    // 3. Send the message in the conversation
    const message = await messageService.createMessage(
      conversation.conversation_id,
      senderId,
      receiverId,
      messageText,
      messageType
    );

    // 4. Update conversation with the latest message
    await conversationService.updateLastMessage(
      conversation.conversation_id,
      message.message_id
    );
    const io = getSocketInstance();

    const room = `conversation_${conversation.conversation_id}`;

    io.to(room).emit("message", {
      sender_id: senderId, // ✅ snake_case
      message_text: messageText, // ✅ snake_case
      conversation_id: conversation.conversation_id,
      created_at: new Date().toISOString(),
    });

    return res.status(201).json({ message, conversation });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//   export const markMessageAsRead = async (req: Request, res: Response) => {
//     try {
//       const { messageId, readAt } = req.body;
//       const updatedMessage = await messageService.markMessageAsRead(messageId, readAt);
//       return res.status(200).json(updatedMessage);
//     } catch (error) {
//       console.error("Error marking message as read:", error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   };

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = Number(req.params.id);
    const messages = await messageService.getMessagesByConversation(
      conversationId
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};
