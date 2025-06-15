import { NextRequest, NextResponse } from "next/server";
import prisma from "../models/prismaClient";
import { getToken } from "next-auth/jwt";

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
    const queries = await prisma.query.findMany();
    if (!queries)
      return NextResponse.json(
        { message: "No queries found", data: [] },
        { status: 200 }
      );

    return NextResponse.json(
      { message: "Queries found", data: queries },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 }
    );
  }
}
