import { Request, Response } from "express";
import * as conversationService from "../services/conversationService";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { participants } = req.body;
    const conversation = await conversationService.createConversation(
      participants
    );
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Error creating conversation" });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const conversations = await conversationService.getUserConversations(
      userId
    );
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversations" });
  }
};

export const findConversation = async (
  req: Request | any,
  res: Response
): Promise<any> => {
  try {
    const senderId = req.user?.id;
    const receiverId = Number(req.params.receiverId);

    const conversation = await conversationService.findConversation(
      senderId,
      receiverId
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error finding conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
