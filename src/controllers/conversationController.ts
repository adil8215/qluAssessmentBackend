import { Request, Response } from "express";
import * as conversationService from "../services/conversationService";
import { AuthenticatedRequest } from "interfaces/request";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { participants, group_id, conversation_type } = req.body;
    const conversation = await conversationService.createConversation(
      participants,
      group_id,
      conversation_type
    );
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error creating conversation" });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const conversations = await conversationService.getUserConversations(
      userId
    );
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversations" });
  }
};

export const findConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const senderId = (req as AuthenticatedRequest).user?.id;
    const receiverId = Number(req.params.receiverId);

    if (!senderId) {
      res.status(400).json({ error: "Sender ID is missing" }); // ✅ No type error
      return;
    }

    const conversation = await conversationService.findConversation(
      senderId,
      receiverId
    );

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" }); // ✅ No type error
      return;
    }

    res.status(200).json(conversation); // ✅ Send response
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversationByGroupId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { groupId } = req.params; // Extract groupId from the route parameter

  try {
    const conversation = await conversationService.findConversationByGroupId(
      Number(groupId)
    );

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
