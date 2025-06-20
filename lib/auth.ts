import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Email verification token তৈরি করার ফাংশন
export function generateEmailToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
}

// Password reset token তৈরি করার ফাংশন
export function generateResetToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
}

// Nodemailer ট্রান্সপোর্টার সেটআপ
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true যদি 465 পোর্ট হয়
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email verification মেইল পাঠানোর ফাংশন
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

// Password reset মেইল পাঠানোর ফাংশন
export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
