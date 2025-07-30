import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import { getUserFromRequest } from "../../lib/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    console.log("Starting /api/me request");
    
    await connectDB();
    console.log("Database connected");
    
    const user = await getUserFromRequest(req);
    console.log("User from request:", user ? "found" : "not found");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.error("API /me error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

