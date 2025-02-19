// src/services/userService.ts
import client from "../db";
import { userSchema } from "../validators/userAccountValidator"; // Update to reflect schema without 'status'
import bcrypt from "bcrypt";
import { handleOtpRequest, requestOtp } from "./otpService";
import { generateAccessToken } from "./jwtService";

// Service to create a new user
export const createUser = async (userData: any) => {
  // ✅ Validate user input
  const validation = userSchema.safeParse(userData);
  if (!validation.success) {
    throw new Error("Validation failed");
  }

  const {
    name,
    hashed_password,
    username,
    email,
    contactNumber,
    otherInfo,
    imgUrl,
  } = validation.data;

  // ✅ Check if email already exists
  const emailCheck = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );
  if (emailCheck.rows.length > 0) {
    throw new Error("Email is already in use. Please use a different email.");
  }

  // ✅ Check if username already exists
  const usernameCheck = await client.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );
  if (usernameCheck.rows.length > 0) {
    throw new Error(
      "Username is already taken. Please choose a different username."
    );
  }

  // ✅ Hash the password
  let password;
  if (hashed_password) {
    password = await bcrypt.hash(hashed_password, 10);
  }

  // ✅ Insert new user
  const query = `
    INSERT INTO users (name, hashed_password, username, email, contact_number, other_info, img_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;

  const result = await client.query(query, [
    name,
    password,
    username,
    email,
    contactNumber,
    JSON.stringify(otherInfo),
    imgUrl,
  ]);

  // ✅ Generate and send OTP
  const otp = await requestOtp(result.rows[0].id);
  if (email && otp) {
    await handleOtpRequest(email, otp.otp);
  }

  return result.rows[0];
};

// Service to get all users
export const getAllUsers = async (): Promise<any> => {
  const result = await client.query("SELECT * FROM users");
  return result.rows;
};

// Service to get a user by ID
export const getUserById = async (id: number) => {
  const result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

// Service to update a user
export const updateUser = async (id: number, userData: any) => {
  const { name, username, email, contactNumber, otherInfo, imgUrl } = userData;

  const query = `
    UPDATE users
    SET name = $1, username = $2, email = $3, contact_number = $4, other_info = $5, img_url = $6
    WHERE id = $7 RETURNING *
  `;

  const result = await client.query(query, [
    name,
    username,
    email,
    contactNumber,
    JSON.stringify(otherInfo),
    imgUrl,
    id,
  ]);

  return result.rows[0];
};

// Service to delete a user
export const deleteUser = async (id: number) => {
  const result = await client.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const login = async (email: string, password: string) => {
  // Find user by email
  const result = await client.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  // Check if the password matches
  const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  if (!user.verified_flag) {
    throw new Error("User not verified. Please complete OTP verification.");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateAccessToken(user.id);

  return { accessToken, refreshToken, user };
};

export const updateUserContactInfo = async (id: number, userData: any) => {
  const { email, contact_number } = userData;

  const query = `
    UPDATE users
    SET email = $1, contact_number = $2
    WHERE id = $3 RETURNING *
  `;

  const result = await client.query(query, [email, contact_number, id]);

  return result.rows[0];
};

export const updateUserProfile = async (
  id: number,
  userData: any,
  file?: Express.Multer.File
) => {
  const { name, username } = userData;
  let img_url: string | null = null;

  if (file) {
    const filePath = `uploads/${file.filename}`;
    img_url = filePath; // Store relative path
  }

  const query = `
    UPDATE users
    SET name = $1, username = $2, img_url = COALESCE($3, img_url)
    WHERE id = $4 RETURNING *;
  `;

  const result = await client.query(query, [name, username, img_url, id]);

  return result.rows[0];
};
