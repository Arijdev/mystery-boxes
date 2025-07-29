import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import Order from "@/app/lib/model/order";

export async function POST(request: NextRequest,{ params }: { params: { orderId: string } }) 
{
  try {
    await connectDB();

    const body = await request.json();
    const { reason } = body;

    const order = await Order.findById(params.orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const cancellableStatuses = ["confirmed", "processing"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update status and cancellation info
    order.status = "cancelled";
    order.cancellation = {
      reason: reason || "Customer requested cancellation",
      cancelledAt: new Date().toISOString()
    };

    await order.save();

    return NextResponse.json({
      success: true,
      order,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
