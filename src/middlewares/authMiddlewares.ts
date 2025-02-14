import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include user info
interface AuthRequest extends Request {
  user?: { id: number };
}

// Middleware to verify JWT token
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Invalid authorization format." });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: number;
    };
    req.user = { id: decoded.userId }; // Attach user ID to request
    next(); // Continue to the next middleware/controller
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
