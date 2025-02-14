import { z } from "zod"; // Import Zod

export const validateOtpSchema = z.object({
  userId: z.number().int().positive(), // userId must be a positive integer
  otp: z.string().length(6).regex(/^\d+$/), // OTP must be a 6-digit number
});
