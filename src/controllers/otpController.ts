import { Request, Response } from "express";
import { validateOtp } from "../services/otpService"; // Import the OTP validation function

export const validateOtpController = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  console.log("otp", req.body);
  try {
    // Call the validateOtp function from the service to check the OTP
    const validation = await validateOtp(userId, otp);

    // Respond with validation result
    res.type("application/json");
    res.json(validation);
  } catch (err: any) {
    console.log("");
    console.error("Error during OTP validation:", err);
    res.type("application/json");
    res.status(400).json({ error: err?.message });
  }
};
