import { z } from "zod";

// Schema for creating a group
export const GroupSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  group_desc: z.string().optional(),
});

// Schema for updating a group
export const UpdateGroupSchema = GroupSchema.partial();

// Schema for adding a user to a group
export const AddUserToGroupSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  group_id: z.number().int().positive("Group ID must be a positive integer"),
  role: z.string().min(1, "Role is required"),
});

// Schema for removing a user from a group
export const RemoveUserFromGroupSchema = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
  groupId: z.number().int().positive("Group ID must be a positive integer"),
});
