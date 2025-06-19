import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateEmailToken, sendVerificationEmail } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  // Prevent duplicate registrations.
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      // emailVerified is null until verification completes.
    },
  });

  // Generate and send email token.
  const token = generateEmailToken(email);
  try {
    await sendVerificationEmail(email, token);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return NextResponse.json({ message: "Registration successful. Check your email for verification." });
}
