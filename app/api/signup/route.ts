import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import { UserModel } from "@/app/lib/model/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, password,photo } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    const newUser = new UserModel({
      name,
      email,
      phoneNo: phone,
      password,
      photo, // Optional profile photo
      createdAt: new Date()
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(
      { message: "User created", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
