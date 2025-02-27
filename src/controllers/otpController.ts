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
  } catch (err: unknown) {
    let errorMessage = "Internal server error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};
