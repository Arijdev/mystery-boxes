import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import Order from "@/app/lib/model/order";
import { Types } from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectDB();
    
    // Await params before accessing properties
    const { orderId } = await params;
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
    }
    
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();
    
    // Await params before accessing properties
    const { orderId } = await params;
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
    }
    
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "processing", 
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,  // Use the destructured orderId
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
