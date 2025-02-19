import client from "../db";
import crypto from "crypto";
import { sendOtpEmail } from "./emailService";

interface OtpRecord {
  id: number;
  userId: number;
  otp: string;
  createdAt: string;
}

// Function to generate a 6-digit OTP
function generateOtp(): string {
  const otp = crypto.randomInt(100000, 999999); // Generates a 6-digit random number
  return otp.toString();
}

async function requestOtp(userId: number): Promise<OtpRecord> {
  const otp = generateOtp();
  const query = {
    text: "INSERT INTO otp(userId, otp) VALUES($1, $2) RETURNING id, otp, createdAt",
    values: [userId, otp],
  };

  try {
    const res = await client.query(query);
    console.log("otp", res.rows[0]);
    return res.rows[0]; // Return the saved OTP record
  } catch (err) {
    console.error("Error saving OTP:", err);
    throw new Error("Error saving OTP");
  }
}

async function handleOtpRequest(userEmail: string, generatedOtp: string) {
  try {
    await sendOtpEmail(userEmail, generatedOtp);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Failed to send OTP email", error);
  }
}

async function deleteOtp(userId: number, otp: string): Promise<void> {
  const query = {
    text: "DELETE FROM otp WHERE userId = $1 AND otp = $2",
    values: [userId, otp],
  };

  try {
    await client.query(query);
    console.log("OTP deleted successfully");
  } catch (err) {
    console.error("Error deleting OTP:", err);
    throw new Error("Error deleting OTP");
  }
}

async function deleteOtpByUserId(userId: number): Promise<void> {
  const query = {
    text: "DELETE FROM otp WHERE userId = $1",
    values: [userId],
  };

  try {
    await client.query(query);
    console.log("OTP deleted successfully");
  } catch (err) {
    console.error("Error deleting OTP:", err);
    throw new Error("Error deleting OTP");
  }
}

// Function to validate the OTP (checking if it is correct and within a certain expiration time)
async function validateOtp(
  userId: number,
  otp: string
): Promise<{ valid: boolean; message: string }> {
  const query = {
    text: "SELECT * FROM otp WHERE userId = $1 AND otp = $2 ORDER BY createdAt DESC LIMIT 1",
    values: [userId, otp],
  };

  try {
    const res = await client.query(query);
    if (res.rows.length === 0) {
      throw new Error("Otp not found or incorrect");
    }

    const otpRecord = res.rows[0];
    const otpCreatedAt = new Date(otpRecord.createdAt);
    const otpExpiry = (new Date().getTime() - otpCreatedAt.getTime()) / 1000; // OTP expiry in seconds

    if (otpExpiry > 900) {
      throw new Error("OTP has expired");
    }

    // If OTP is valid, update the user's verified flag to true
    await client.query("UPDATE users SET verified_flag = true WHERE id = $1", [
      userId,
    ]);

    // Delete the OTP record as it's no longer needed
    await deleteOtp(userId, otp);

    return { valid: true, message: "OTP is valid and user is verified" };
  } catch (err: any) {
    console.error("Error validating OTP:", err);
    throw new Error(err);
  }
}

export {
  requestOtp,
  validateOtp,
  handleOtpRequest,
  deleteOtpByUserId,
  generateOtp,
};
