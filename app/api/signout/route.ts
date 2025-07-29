import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });
  response.cookies.set("token", "", { maxAge: 0 });
  return response;
}
