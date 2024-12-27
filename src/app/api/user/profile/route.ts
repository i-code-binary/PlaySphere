import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../models/prismaClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { status: 405, message: "Method Not Allowed" },
      { status: 405 }
    );
  }
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token?.email) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unautorized request",
        },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: {
        email: true,
        name: true,
        role: true,
        payments: true,
        id: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        status: 201,
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 500,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
