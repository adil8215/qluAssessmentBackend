import { validateOtpController } from "../controllers/otpController";
import express from "express";
import { otpValidationMiddleware } from "../middlewares/validateOtpSchema";

const otpRouter = express.Router();

otpRouter.post("/validateOtp", otpValidationMiddleware, validateOtpController);

export default otpRouter;
