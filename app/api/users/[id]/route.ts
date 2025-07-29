import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/app/lib/model/user";
import { getUserFromRequest } from "@/app/lib/middleware/auth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();

    const userDoc = await UserModel.findById(user._id);

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (updates.name) userDoc.name = updates.name;
    if (updates.email) userDoc.email = updates.email;
    if (updates.phoneNo) userDoc.phoneNo = updates.phoneNo;
    if (updates.photo) userDoc.photo = updates.photo;

    if (updates.password) {
      if (!updates.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(updates.currentPassword,userDoc.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const isSamePassword = await bcrypt.compare(updates.password,userDoc.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password must be different" },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      userDoc.password = hashedPassword;
    }

    await userDoc.save();

    return NextResponse.json({ user: userDoc.toObject() }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating User:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
