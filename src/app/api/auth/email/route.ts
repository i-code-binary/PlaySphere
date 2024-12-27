import { NextRequest, NextResponse } from "next/server";
import prisma from "../../models/prismaClient";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { status: 405, message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await req.json(); // Parse request body once
    const { role, email, password, name, adminPass } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { status: 400, message: "Email, Password, and Name are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { status: 409, message: "User already exists" },
        { status: 409 }
      );
    }

    if (role === "ADMIN") {
      // Admin-specific logic
      if (!adminPass || adminPass !== process.env.ADMIN_PASS) {
        return NextResponse.json(
          { status: 401, message: "Invalid Admin Password" },
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "ADMIN",
        },
      });

      return NextResponse.json(
        {
          status: 201,
          user,
          message: "User successfully registered as Admin",
        },
        { status: 201 }
      );
    } else {
      // Default to user registration
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "USER",
        },
      });

      return NextResponse.json(
        {
          status: 201,
          user,
          message: "User successfully registered",
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
