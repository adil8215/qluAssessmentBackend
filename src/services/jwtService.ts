import jwt, { JwtPayload } from "jsonwebtoken";

// Ensure environment variables are defined
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET ?? "";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET ?? "";

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing JWT secret keys in environment variables. Ensure ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are set."
  );
}

const ACCESS_TOKEN_EXPIRY: string | null | any =
  process.env.ACCESS_TOKEN_EXPIRY || "1h";
const REFRESH_TOKEN_EXPIRY: string | null | any =
  process.env.REFRESH_TOKEN_EXPIRY || "7d";

// Type definitions
export interface AccessTokenPayload extends JwtPayload {
  userId: number;
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: number;
}

// Generate access token
export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Access token expired:", error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid access token:", error);
    } else {
      console.error("Error verifying access token:", error);
    }
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Refresh token expired:", error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid refresh token:", error);
    } else {
      console.error("Error verifying refresh token:", error);
    }
    return null;
  }
};
