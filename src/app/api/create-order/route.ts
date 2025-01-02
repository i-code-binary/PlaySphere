import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";
import { AxiosError } from "axios";
import { Cashfree } from "cashfree-pg";

export async function POST(req: NextRequest) {
  try {
    if (req.method != "POST") {
      return NextResponse.json(
        { status: 405, message: "Wrong Method" },
        { status: 405 }
      );
    }

    const { amount, sports, month } = await req.json();
    if (!amount || !sports || !month) {
      return NextResponse.json(
        { status: 400, message: "All fields are required" },
        { status: 400 }
      );
    }
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token?.email) {
      return NextResponse.redirect("/authentication");
    }
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: {
        name: true,
        email: true,
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.redirect("/authentication");
    }

    const apiKey = process.env.CASHFREE_API_KEY;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!apiKey || !secretKey) {
      console.error("Missing Cashfree credentials");
      return NextResponse.json(
        { status: 500, message: "Payment gateway configuration error" },
        { status: 500 }
      );
    }

    // 3. Create order with detailed error logging
    Cashfree.XClientId = process.env.CASHFREE_API_KEY;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
    // 4. Create payment record in database

    const request = {
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: user.id,
        customer_name: user.name || "Guest",
        customer_email: user.email,
        customer_phone: "8797466094",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-verification`,
      },
      order_note: "Aditya: Hii are you enjoying our product!!",
    };
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    console.log("Response", response);
    if (!response)
      return NextResponse.json(
        { status: 500, message: "Failed to create payment order" },
        { status: 500 }
      );
    const sessionId = response?.data?.payment_session_id;
    const order_id = response?.data?.order_id;
    if (!sessionId || !order_id)
      return NextResponse.json(
        { status: 500, message: "Failed to create payment order" },
        { status: 500 }
      );
// console.log(order_id)
    const paymentid = await prisma.paymentId.create({
      data: {
        orderId: order_id,
        month: month,
        sports: sports,
        email: user.email,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 20),
      },
    });

    if (!paymentid) {
      console.error("Failed to create payment record in database");
      return NextResponse.redirect(
        new URL("/payment-cancel?error=Failed_to_save_Order", req.url)
      );
    }
    return NextResponse.json(
      {
        status: 200,
        message: "Order created successfully",
        sessionId: sessionId,
        orderId: order_id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Cashfree order creation error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return NextResponse.json(
        {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || "Failed to create payment order",
          error: error.message,
        },
        { status: error.response?.status || 500 }
      );
    } else if (error instanceof Error) {
      // Handle general JavaScript errors
      console.error("General error during Cashfree order creation:", {
        message: error.message,
      });

      return NextResponse.json(
        {
          status: 500,
          message: "An error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      // Handle unknown errors
      console.error("Unknown error during Cashfree order creation:", error);

      return NextResponse.json(
        {
          status: 500,
          message: "An unexpected error occurred",
          error: String(error),
        },
        { status: 500 }
      );
    }
  }
}
