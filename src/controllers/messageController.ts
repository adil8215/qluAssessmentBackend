import { Request, Response } from "express";
import * as messageService from "../services/messageService";
import * as conversationService from "../services/conversationService";
import { getSocketInstance } from "../utils/socket";
import { getUsersInGroup } from "../services/userGroupService";
import {
  createAttachment,
  getAttachmentsByMessageId,
} from "../services/attachmentService";
export const sendMessage = async (
  req: Request | any,
  res: Response
): Promise<any> => {
  try {
    const senderId = req.user?.id;
    const {
      receiverId,
      messageText,
      messageType,
      conversation_type,
      group_id,
    } = req.body;
    const groupId = group_id == "" ? null : Number(group_id);
    console.log("payload", req.body);

    // 1. Check if a conversation exists
    let conversation;
    if (!groupId && receiverId) {
      conversation = await conversationService.findConversation(
        senderId,
        receiverId
      );

      // 2. If not, create a new conversation
      if (!conversation) {
        conversation = await conversationService.createConversation(
          [senderId, receiverId],
          groupId,
          conversation_type
        );
      }
    } else if (groupId && !receiverId) {
      conversation = await conversationService.findConversationByGroupId(
        groupId
      );

      // 2. If not, create a new conversation
      if (!conversation) {
        const participants = await getUsersInGroup(groupId);
        console.log("actual", participants);
        const participantIds = participants.map((member) => member.id);
        console.log("participants", participantIds, conversation);
        conversation = await conversationService.createConversation(
          participantIds,
          groupId,
          conversation_type
        );
      }
    }

    // 3. Send the message in the conversation
    const message = await messageService.createMessage(
      conversation.conversation_id,
      senderId,
      receiverId,
      messageText,
      messageType
    );

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        await createAttachment(
          message.message_id, // Associate the attachment with the current message
          file.mimetype, // File type (e.g., 'image/png')
          file.path // The file path or URL where it's stored
        );
      }
    }

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

    // Fetch messages by conversation ID
    const messages = await messageService.getMessagesByConversation(
      conversationId
    );

    // Fetch attachments for each message
    for (const message of messages) {
      console.log("message", message);
      const attachments = await getAttachmentsByMessageId(message.message_id);
      message.attachments = attachments; // Add attachments to the message
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};
