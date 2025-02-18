import { Request, Response } from "express";
import * as groupService from "../services/groupService"; // Import the group service
import { z } from "zod";
import { GroupSchema, UpdateGroupSchema } from "../validators/groupValidation";
import * as userGroupService from "../services/userGroupService";
// Create a new group
export const createGroup = async (
  req: Request | any,
  res: Response
): Promise<any> => {
  try {
    const validatedData = GroupSchema.parse(req.body);
    const group = await groupService.createGroup(
      validatedData.group_name,
      validatedData.group_desc,
      "active",
      req.user?.id
    );

    await userGroupService.addUserToGroup(
      req.user?.id,
      group.group_id,
      "admin"
    );
    return res.status(201).json(group);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// Get group by ID
export const getGroupById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const group = await groupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.status(200).json(group);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a group's details
export const updateGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
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

    return res.status(200).json(updatedGroup);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a group
export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const deletedGroup = await groupService.deleteGroup(groupId);
    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    return res.status(200).json(deletedGroup);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserGroups = async (
  req: Request | any,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const groups = await groupService.getUserGroups(userId);
    return res.status(200).json(groups);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
