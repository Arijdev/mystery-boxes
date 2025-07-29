// app/lib/model/order.ts

import mongoose, { Schema, Document, models } from "mongoose";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CardPaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export interface UpiPaymentDetails {
  upiId: string;
}

export type PaymentDetails = CardPaymentDetails | UpiPaymentDetails | null;

export interface CancellationDetails {
  reason: string;
  cancelledAt: string;
}

export interface OrderDocument extends Document {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "upi";
  paymentDetails: PaymentDetails;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon?: {
    code: string;
    discountValue: number;
  };
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  cancellation?: CancellationDetails;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

const ShippingAddressSchema = new Schema<ShippingAddress>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: String,
  state: String,
  postalCode: String,
  country: String
});

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      required: true
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
      default: null
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    appliedCoupon: {
      code: String,
      discountValue: Number
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    cancellation: {
      reason: String,
      cancelledAt: String
    }
  },
  { timestamps: true }
);

const Order =
  models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
