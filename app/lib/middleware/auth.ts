import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/DB/connection";
import { UserModel } from "../model/user";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set in environment variables");
}

export async function getUserFromRequest(request: NextRequest): Promise<any | null> {
  const token = request.cookies.get("token")?.value;
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as JwtPayloadWithId;

    await connectDB();
    const user = await UserModel.findById({ _id: decoded.userId });

    if (!user) {
      console.error("User not found for ID:", decoded.id);
      return null;
    }

    return user
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
