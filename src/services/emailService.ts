import nodemailer from "nodemailer";

/**
 * Sends an OTP email to the specified user.
 * @param email - The recipient's email address.
 * @param otp - The OTP code to send.
 */
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // Create a transporter using your SMTP configuration.
  const transporter = nodemailer.createTransport({
    // Set up your email configuration here
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.SMTP_PASS,
    },
  });

  // Setup email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Your App" <noreply@yourdomain.com>', // sender address
    to: email, // receiver's email
    subject: "Your OTP Code", // email subject
    text: `Your OTP code is: ${otp}`, // plain text body
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`, // HTML body
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.response);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}
