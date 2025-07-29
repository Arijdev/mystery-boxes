import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/DB/connection";
import Cart from "@/app/lib/model/cart";
import { getUserFromRequest } from "@/app/lib/middleware/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    let user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    let userId = user?._id;
    const body = await req.json();
    let { cartItems, appliedCoupon, newItem } = body;

    // If `newItem` is passed, get userId from cookie token and convert to `cartItems`
    if (newItem) {
      cartItems = [newItem];
    }
    if (!userId || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid data" },
        { status: 400 }
      );
    }

    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      // Merge new items into existing cart
      for (const newItem of cartItems) {
        const existingItem = existingCart.items.find(
          (item: any) => item.id === newItem.id
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity || 1;
        } else {
          existingCart.items.push({
            ...newItem,
            quantity: newItem.quantity || 1
          });
        }
      }

      existingCart.appliedCoupon = appliedCoupon || null;
      await existingCart.save();

      return NextResponse.json({
        success: true,
        cartItems: existingCart.items
      });
    } else {
      const createdCart = await Cart.create({
        userId,
        items: cartItems.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1
        })),
        appliedCoupon: appliedCoupon || null
      });

      return NextResponse.json({
        success: true,
        cartItems: createdCart.items
      });
    }
  } catch (error) {
    console.error("[CART_SAVE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ cartItems: [] }, { status: 200 });
    }
    let userId = user?._id;

    const existingCart = await Cart.findOne({ userId });

    return NextResponse.json({
      cartItems: existingCart?.items || []
    });
  } catch (error) {
    console.error("[CART_FETCH_ERROR]", error);
    return NextResponse.json({ cartItems: [] }, { status: 200 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    let userId = user?._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "Missing item ID" },
        { status: 400 }
      );
    }

    // Use MongoDB $pull to remove the item directly from the array
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { id: itemId } } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cartItems: result.items
    });
  } catch (error) {
    console.error("[CART_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
