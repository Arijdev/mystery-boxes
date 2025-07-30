import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import { getUserFromRequest } from "../../lib/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
    
  } catch (error: any) {
    console.error("API /me error:", error);
    return NextResponse.json({ 
      error: "Authentication failed",
      details: error.message 
    }, { status: 401 });
  }
} // ✅ This closing brace was missing
