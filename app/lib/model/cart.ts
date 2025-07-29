import mongoose, { Schema, Document, models } from "mongoose";

// Define the structure of a single cart item
const cartItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL to the image
    items: { type: String, required: true }, // additional label/tag info
    price: { type: Number, required: true },
    originalValue: { type: Number },
    quantity: { type: Number, required: true }
  },
  { _id: false } // Prevents auto-generation of _id for subdocuments
);

// Define the main Cart schema
const cartSchema = new Schema(
  {
    userId: { type: String, required: true },
    items: [cartItemSchema],
    appliedCoupon: {
      code: { type: String },
      discount: { type: Number },
      type: { type: String, enum: ["percentage", "fixed"] }
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Export or reuse if already compiled
export default models.Cart || mongoose.model("Cart", cartSchema);
