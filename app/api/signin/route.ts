import { NextResponse } from "next/server";
import { authService } from "@/lib/auth";
import { connectDB } from "@/app/lib/DB/connection";
import { cookies } from "next/headers"; // ✅ Needed for setting cookie

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const result = await authService.signIn(email, password);

    if (!result || !result.success) {
      const errorMsg = result?.error || "Invalid credentials";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/"
      });
    }

    return NextResponse.json(
      { success: true, user: result.user },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error: any) {
    console.error("Sign-in error:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

