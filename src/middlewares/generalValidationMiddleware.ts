import { Request, Response, NextFunction } from "express";
import { validateOtpSchema } from "../validators/otpValidator";
import { z } from "zod";
import { createMessageSchema } from "../validators/messageValidation";

export const messageValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    createMessageSchema.parse(req.body);
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      res.type("application/json");
      res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: err.errors,
      });
      return; // Add return to prevent further execution
    }

    // Handle unexpected errors
    res.type("application/json");
    res.status(500).json({
      success: false,
      message: "An error occurred during validation.",
    });
  }
};
