import { Request, Response } from "express";
import * as userGroupService from "../services/userGroupService"; // Import the user-group service
import { z } from "zod";
import { AddUserToGroupSchema } from "../validators/groupValidation"; // Assuming you've created Zod schemas

// Add a user to a group with a role
export const addUserToGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("req", req.body);
  try {
    const validatedData = AddUserToGroupSchema.parse(req.body);
    const { user_id, group_id, role } = validatedData;
    const addedUser = await userGroupService.addUserToGroup(
      user_id,
      group_id,
      role
    );
    return res.status(201).json(addedUser);
  } catch (error: any) {
    console.log("error", error);
    return res.status(400).json({ error: error.message });
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    const groupId = parseInt(req.params.groupId);
    if (isNaN(userId) || isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid user or group ID" });
    }

    const removedUser = await userGroupService.removeUserFromGroup(
      userId,
      groupId
    );
    return res.status(200).json(removedUser);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all users in a group
export const getUsersInGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const users = await userGroupService.getUsersInGroup(groupId);
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all groups a user belongs to
export const getGroupsForUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const groups = await userGroupService.getGroupsForUser(userId);
    return res.status(200).json(groups);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
