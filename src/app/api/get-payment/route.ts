import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token?.email) {
      return NextResponse.redirect("/authentication");
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect("/profile");
    }

    const payments = await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        currency: true,
        sports: true,
        month: true,
        paypalOrderId: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        paypalPayerId:true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      payments,
      message: "Successfully data fetched",
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
