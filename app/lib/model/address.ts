import mongoose, { Schema, Document, Types } from "mongoose";

export interface AddressDocument extends Document {
  userId: string; // 🔄 use proper ObjectId type
  address: string;
  pincode: string;
  city: string;
  state: string;
  landmark?: string;
}

const addressSchema = new Schema<AddressDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // ✅ only one address per user
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Export model safely
export const AddressModel =
  mongoose.models.Address || mongoose.model<AddressDocument>("Address", addressSchema);
