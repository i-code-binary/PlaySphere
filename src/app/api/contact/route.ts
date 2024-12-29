import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";

export async function POST(req: NextRequest) {
  try {
    if (req.method != "POST")
      return NextResponse.json({ status: 405, message: "Wrong Method" });
    const { email, query, name } = await req.json();
    if (!email || !query || !name)
      return NextResponse.json({
        status: 400,
        message: "All Fields are required",
      });
    const raiseQuery = await prisma.query.create({
      data: {
        email,
        name,
        query,
      },
    });
    if (!raiseQuery)
      return NextResponse.json({
        status: 500,
        message: "Internal Server error",
      });
    return NextResponse.json({
      status: 201,
      message: "Query raised successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Internal Server error" });
  }
}
