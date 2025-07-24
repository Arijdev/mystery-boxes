import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const body = await request.json()
    const { reason } = body

    const order = await db.orders.findById(params.orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if order can be cancelled
    const cancellableStatuses = ["confirmed", "processing"]
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json({ error: `Cannot cancel order with status: ${order.status}` }, { status: 400 })
    }

    // Update order status to cancelled
    const updatedOrder = await db.orders.updateStatus(params.orderId, "cancelled")

    if (!updatedOrder) {
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
    }

    // Add cancellation details
    await db.orders.addCancellation(params.orderId, {
      reason: reason || "Customer requested cancellation",
      cancelledAt: new Date().toISOString(),
    })

    // In production, you would:
    // 1. Process refund if payment was made
    // 2. Update inventory
    // 3. Send cancellation email
    // 4. Notify fulfillment center

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order cancelled successfully",
    })
  } catch (error) {
    console.error("Order cancellation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
