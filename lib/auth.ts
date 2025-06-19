import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export function generateEmailToken(email: string) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not set in the environment.");
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // set to true if using SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/(auth)/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Please click the link below to verify your email:</p>
           <p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}
