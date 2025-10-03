import dotenv from "dotenv";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../index";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string): Promise<void> => {
  try {
    // 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpToken.create({
      data: {
        email,
        token: otp,
        expiresAt,
      },
    });

    await resend.emails.send({
      from: "n8n-clone@yourdomain.com", // Replace with your verified domain
      to: email,
      subject: "Verify your email - 8n8",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for signing up! Please use the following code to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message from 8n8.</p>
        </div>
      `,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWorkflowExecutionEmail = async (
  email: string,
  workflowTitle: string,
  status: "success" | "failed",
  error?: string,
): Promise<void> => {
  try {
    const subject =
      status === "success"
        ? `workflow "${workflowTitle}" completed successfully`
        : `workflow "${workflowTitle}" failed`;

    const statusColor = status === "success" ? "#28a745" : "#dc3545";
    const statusText =
      status === "success" ? "Completed Successfully" : "Failed";

    await resend.emails.send({
      from: "n8n-clone@yourdomain.com", // Replace with your verified domain
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Workflow Execution Update</h2>
          <p><strong>Workflow:</strong> ${workflowTitle}</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: ${statusColor}; margin: 0;">${statusText}</h3>
          </div>
          ${error ? `<p><strong>Error:</strong> ${error}</p>` : ""}
          <p>You can view more details in your n8n Clone dashboard.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message from n8n Clone.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending workflow execution email:", error);
  }
};
