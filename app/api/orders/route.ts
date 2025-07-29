import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/DB/connection";
import Order from "@/app/lib/model/order";
import type { OrderDocument } from "@/app/lib/model/order";
import { getUserFromRequest } from "@/app/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    let user = await getUserFromRequest(request);
    const userId = user?._id;
    // console.log(user._id);
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      discount,
      shipping,
      total,
      appliedCoupon
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Card validation
    if (paymentMethod === "card") {
      if (
        !paymentDetails?.cardNumber ||
        !paymentDetails?.expiryDate ||
        !paymentDetails?.cvv ||
        !paymentDetails?.cardName
      ) {
        return NextResponse.json(
          { error: "Complete card details are required" },
          { status: 400 }
        );
      }
    }

    // UPI validation
    if (paymentMethod === "upi") {
      if (!paymentDetails?.upiId) {
        return NextResponse.json(
          { error: "UPI ID is required" },
          { status: 400 }
        );
      }
    }

    // Subtotal calculation check
    const calculatedSubtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return NextResponse.json(
        { error: "Invalid subtotal calculation" },
        { status: 400 }
      );
    }

    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate failure
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { error: "Payment failed. Try again." },
        { status: 402 }
      );
    }

    // Create order
    const newOrder: OrderDocument = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentMethod === "cod" ? null : paymentDetails,
      subtotal,
      discount,
      shipping,
      total,
      appliedCoupon, // stored, but not validated
      status: "confirmed"
    });

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder._id,
        status: newOrder.status,
        total: newOrder.total,
        createdAt: newOrder.createdAt
      }
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    let user = await getUserFromRequest(request);
    const userId = user?._id;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
