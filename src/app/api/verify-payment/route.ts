import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";
import axios from "axios";

// In your payment success API route (api/payment/success/route.ts)
export async function GET(req: NextRequest) {
  try {
    // 1. Get PayPal token
    const paypalToken = req.nextUrl.searchParams.get("token");
    if (!paypalToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancel?error=missing_token`
      );
    }

    // 4. Get PayPal order details first
    const orderData = await getPayPalOrderDetails(paypalToken);
    if (!orderData) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancel?error=invalid_order`
      );
    }

    const existingOrder = await prisma.paymentId.findFirst({
      where: { orderId: paypalToken },
    });

    if (!existingOrder)
      return NextResponse.redirect("/payment-cancel?error=No_Order_id_Found");
    // 5. Find user with either method

    const userId = existingOrder.userId;
    if (!userId)
      return NextResponse.redirect("/payment-cancel?error=User_id_Not_Found");

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(orderData.purchase_units[0].amount.value),
        currency: orderData.purchase_units[0].amount.currency_code,
        sports: existingOrder.sports,
        month: existingOrder.month,
        paypalOrderId: paypalToken,
        paypalPayerId: orderData.payer.payer_id,
        status: "COMPLETED",
        paymentMethod: "PayPal",
      },
    });
    if (!payment) {
      return NextResponse.json(
        {
          status: 500,
          message: "Failed to create Payment. Please contact Official",
        },
        { status: 500 }
      );
    }
    // 4. Clear cookies and redirect to success or failure page
    const response = NextResponse.json(
      {
        status: 201,
        message: `Payment successful for ${existingOrder.sports} for ${existingOrder.month}`,
      },
      { status: 201 }
    );
    response.cookies.delete("userEmail");

    return response;
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-cancel?error=server_error`
    );
  }
}

// Helper functions

async function getPayPalOrderDetails(token: string) {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_ID}`
    ).toString("base64");

    const response = await axios.get(
      `${process.env.PAYPAL_REQUEST_URL}/${token}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("PayPal API error:", error);
    return null;
  }
}
