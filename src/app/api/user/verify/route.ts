import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../models/prismaClient";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    if (req.method != "POST") {
      return NextResponse.json(
        { status: 405, message: "Wrong Method" },
        { status: 405 }
      );
    }
    const { amount, currency, sports, month } = await req.json();
    if (!amount || !currency || !sports || !month) {
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
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2), // This ensures 2 decimal places
          },
          description: `Payment for ${sports}`,
        },
      ],
      application_context: {
        brand_name: "PlaySphere",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancel`,
      },
    };
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_ID}`
    ).toString("base64");
    const response = await axios.post(
      process.env.PAYPAL_REQUEST_URL!,
      orderData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    const order = response.data;
    if (!order) {
      return NextResponse.json(
        { status: 500, message: "Error while creating order" },
        { status: 500 }
      );
    }
    const paymentid = await prisma.paymentId.create({
      data: {
        orderId: order.id,
        month: month,
        sports: sports,
        email: user.email,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 20),
      },
    });
    if (!paymentid)
      return NextResponse.redirect(
        "/payment-cancel?error=`Failed_to_save_Order`"
      );
    const res = NextResponse.json({
      status: 200,
      message: "User verified and PayPal order created successfully",
      orderDetails: order,
      user,
    });
    res.cookies.set("userEmail", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });
    return res;
  } catch (error) {
    console.error("Error during request processing:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server error" },
      { status: 500 }
    );
  }
}
