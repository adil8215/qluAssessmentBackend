import { Request, Response } from "express";
import * as userGroupService from "../services/userGroupService"; // Import the user-group service
import { z } from "zod";
import { AddUserToGroupSchema } from "../validators/groupValidation"; // Assuming you've created Zod schemas

// Add a user to a group with a role
export const addUserToGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("req", req.body);
  try {
    const validatedData = AddUserToGroupSchema.parse(req.body);
    const { user_id, group_id, role } = validatedData;
    const addedUser = await userGroupService.addUserToGroup(
      user_id,
      group_id,
      role
    );
    res.status(201).json(addedUser);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const groupId = parseInt(req.params.groupId);
    if (isNaN(userId) || isNaN(groupId)) {
      res.status(400).json({ error: "Invalid user or group ID" });
      return;
    }

    const removedUser = await userGroupService.removeUserFromGroup(
      userId,
      groupId
    );
    res.status(200).json(removedUser);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Get all users in a group
export const getUsersInGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ error: "Invalid group ID" });
      return;
    }

    const users = await userGroupService.getUsersInGroup(groupId);
    res.status(200).json(users);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Get all groups a user belongs to
export const getGroupsForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const groups = await userGroupService.getGroupsForUser(userId);
    res.status(200).json(groups);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};
