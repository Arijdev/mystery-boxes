import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://arijchowdhury:Arij1234@cluster0.ypvv5cp.mongodb.net/ecommarce?retryWrites=true&w=majority&appName=ecommerce"
    );

    isConnected = true;
    // console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
