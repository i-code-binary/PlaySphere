import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { email, query, name } = body;
    if (!email || !query || !name) {
      return NextResponse.json(
        { message: "All Fields are required" },
        { status: 400 }
      );
    }

   await prisma.query.create({
      data: {
        email,
        name,
        query,
      },
    });

    return NextResponse.json(
      { message: "Query raised successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 }
    );
  }
}