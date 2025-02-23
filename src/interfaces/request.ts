import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    // add other properties as needed
  };
}
