// src/middlewares/validateUserSchema.ts
import { Request, Response, NextFunction } from "express";
import { userSchema } from "../validators/userAccountValidator"; // Import the Zod schema
import { z } from "zod";

// Middleware for validating user data
export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Validate the request body using the schema
    userSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If validation fails, send a 400 response with the validation errors
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      // Catch any unexpected errors and send a 500 response
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};
