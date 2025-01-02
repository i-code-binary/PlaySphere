import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";
import { Cashfree } from "cashfree-pg";

enum PAYMENTSTATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token;
    if (!token) {
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=missing_token`,
      });
    }
    const existingOrder = await prisma.paymentId.findFirst({
      where: { orderId: token },
    });

    if (!existingOrder)
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=No_Order_id_Found`,
      });
    const order_id = token;

    const existingPayment = await prisma.payment.findFirst({
      where: { paypalOrderId: token },
    });
    if (existingPayment)
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=order_already_made`,
      });
    Cashfree.XClientId = process.env.CASHFREE_API_KEY;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
    const orderData = await Cashfree.PGOrderFetchPayments(
      "2023-08-01",
      order_id
    );
    if (!orderData) {
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=invalid_order`,
      });
    }
    let StatusOfPayment: PAYMENTSTATUS = PAYMENTSTATUS.PENDING;
    const paymentstatus = orderData.data?.[0]?.payment_status;
    if (paymentstatus === "SUCCESS") StatusOfPayment = PAYMENTSTATUS.COMPLETED;
    else if (paymentstatus === "CANCELLED" || paymentstatus === "FAILED")
      StatusOfPayment = PAYMENTSTATUS.FAILED;
    else StatusOfPayment = PAYMENTSTATUS.PENDING;
    const userId = existingOrder.userId;
    if (!userId)
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=User_id_Not_Found`,
      });

    const paymentAmount = orderData.data?.[0]?.order_amount;
    if (!paymentAmount) {
      console.error("Invalid payment data:", orderData);
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=invalid_payment_data`,
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: paymentAmount,
        currency: "INR",
        sports: existingOrder.sports,
        month: existingOrder.month,
        paypalOrderId: token,
        paypalPayerId: userId,
        status: StatusOfPayment,
        paymentMethod: "Cashfree",
      },
    });
    if (!payment) {
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=Failed to create Payment. Please contact official. Your order id is ${token}. Please note this for future reference`,
      });
    }
    if (payment.status != PAYMENTSTATUS.COMPLETED)
      return NextResponse.json({
        status: 301,
        url: `/payment-cancel?error=Payment_failed.`
      });
    return NextResponse.json({
      status: 201,
      url: `/payment-success?token=Payment Successful for ${existingOrder?.sports} for ${existingOrder?.month} with orderId ${token}`,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({
      status: 301,
      url: `/payment-cancel?error=server_error`,
    });
  }
}
