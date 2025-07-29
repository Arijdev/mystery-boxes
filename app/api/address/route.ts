import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/app/lib/DB/connection";
import { AddressModel } from "@/app/lib/model/address";
import { getUserFromRequest } from "@/app/lib/middleware/auth";

export async function PUT(req: NextRequest) {
  try {
    // await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const updates = await req.json();

    let address = await AddressModel.findOne({ userId: user._id });

    if (address) {
      address.set(updates);
      await address.save();
    } else {
      // Create new address
      address = new AddressModel({
        ...updates
      });
      await address.save();
    }

    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    console.error("Error updating/creating address:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await AddressModel.findOne({ userId: user._id });
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
