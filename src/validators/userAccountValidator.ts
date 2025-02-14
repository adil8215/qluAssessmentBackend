// src/validators/userAccountValidator.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"), // Will be validated if provided
  hashed_password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .optional(),
  otherInfo: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  imgUrl: z.string().url("Invalid image URL").optional(),
});

// Use partial schema for updates
export const userUpdateSchema = userSchema.partial();

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
