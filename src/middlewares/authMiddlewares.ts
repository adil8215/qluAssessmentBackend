import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Extend Request type to include user property
export interface AuthRequest extends Request {
  user?: { id: number };
}

// Middleware to verify JWT token from HTTP-only cookies
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("req cookies", req.cookies);
  const token = req.cookies?.access_token; // Extract token from cookies

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // Ensure no further code is executed
  }

  try {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: number;
    };
    req.user = { id: decoded.userId }; // Attach user ID to request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
    return; // Ensure no further code is executed
  }
};
