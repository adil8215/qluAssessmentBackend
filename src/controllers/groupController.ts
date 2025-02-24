import { Request, Response } from "express";
import * as groupService from "../services/groupService"; // Import the group service
import { z } from "zod";
import { GroupSchema, UpdateGroupSchema } from "../validators/groupValidation";
import * as userGroupService from "../services/userGroupService";
import { AuthenticatedRequest } from "interfaces/request";
// Create a new group
export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = GroupSchema.parse(req.body);
    const userId = (req as AuthenticatedRequest).user?.id;
    if (userId) {
      const group = await groupService.createGroup(
        validatedData.group_name,
        validatedData.group_desc,
        "active",
        userId
      );

      await userGroupService.addUserToGroup(userId, group.group_id, "admin");
      res.status(201).json(group);
    }
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Get group by ID
export const getGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ error: "Invalid group ID" });
    }

    const group = await groupService.getGroupById(groupId);
    if (!group) {
      res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Update a group's details
export const updateGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ error: "Invalid group ID" });
    }

    // Validate request body
    const validatedData = UpdateGroupSchema.parse(req.body);

    // Call service function with only defined values
    const updatedGroup = await groupService.updateGroup(
      groupId,
      validatedData.group_name || "", // Ensure a valid string
      validatedData.group_desc || "", // Ensure a valid string
      "active" // Default status
    );

    res.status(200).json(updatedGroup);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

// Delete a group
export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ error: "Invalid group ID" });
    }

    const deletedGroup = await groupService.deleteGroup(groupId);
    if (!deletedGroup) {
      res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json(deletedGroup);
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export const getUserGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
    }
    if (userId) {
      const groups = await groupService.getUserGroups(userId);
      res.status(200).json(groups);
    }
  } catch (error: unknown) {
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};
