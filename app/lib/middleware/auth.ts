import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/DB/connection";
import { UserModel } from "../model/user";

interface JwtPayloadWithId extends jwt.JwtPayload {
  userId: string; // ✅ Correct property name to match your JWT creation
}

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set in environment variables");
}

export async function getUserFromRequest(request: NextRequest): Promise<any | null> {
  try {
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    console.log("🔍 Token found, verifying..."); // Add debug logging
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
    
    if (!decoded || !decoded.userId) {
      console.log("Invalid token payload - missing userId");
      return null;
    }

    console.log("🔍 Token verified, userId:", decoded.userId); // Add debug logging
    
    await connectDB();
    
    // ✅ Correct MongoDB query syntax
    const user = await UserModel.findById(decoded.userId).select("-password");
    
    if (!user) {
      console.error("User not found for ID:", decoded.userId); // ✅ Correct property name
      return null;
    }

    console.log("✅ User found:", user.email); // Add debug logging
    return user.toObject(); // ✅ Convert to plain object
    
  } catch (error: any) {
    console.error("getUserFromRequest error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return null;
  }
}
