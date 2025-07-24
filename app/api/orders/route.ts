import { type NextRequest, NextResponse } from "next/server"
import { db, validateCoupon } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      discount,
      shipping,
      total,
      appliedCoupon,
      userId = "guest-user", // In production, get from authentication
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 })
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return NextResponse.json({ error: "Complete shipping address is required" }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    // Validate payment details based on method
    if (paymentMethod === "card") {
      if (
        !paymentDetails?.cardNumber ||
        !paymentDetails?.expiryDate ||
        !paymentDetails?.cvv ||
        !paymentDetails?.cardName
      ) {
        return NextResponse.json({ error: "Complete card details are required" }, { status: 400 })
      }
    }

    if (paymentMethod === "upi") {
      if (!paymentDetails?.upiId) {
        return NextResponse.json({ error: "UPI ID is required" }, { status: 400 })
      }
    }

    // Validate coupon if applied
    if (appliedCoupon) {
      const couponValidation = validateCoupon(appliedCoupon.code, subtotal)
      if (!couponValidation || couponValidation.error) {
        return NextResponse.json({ error: couponValidation?.error || "Invalid coupon code" }, { status: 400 })
      }
    }

    // Calculate and verify totals
    const calculatedSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return NextResponse.json({ error: "Invalid subtotal calculation" }, { status: 400 })
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate payment failure (5% chance for demo purposes)
    if (Math.random() < 0.05) {
      return NextResponse.json({ error: "Payment processing failed. Please try again." }, { status: 402 })
    }

    // Create order in database
    const order = await db.orders.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentMethod === "cod" ? null : paymentDetails,
      subtotal,
      discount,
      shipping,
      total,
      appliedCoupon,
      status: "confirmed",
    })

    // In production, you would:
    // 1. Send confirmation email
    // 2. Update inventory
    // 3. Trigger fulfillment process
    // 4. Send SMS notifications
    // 5. Log analytics events

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "guest-user"
    const orderId = searchParams.get("orderId")

    if (orderId) {
      const order = await db.orders.findById(orderId)
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ order })
    }

    const orders = await db.orders.findByUserId(userId)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
