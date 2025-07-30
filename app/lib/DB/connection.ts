import mongoose from "mongoose";

export async function connectDB() {
  // Check mongoose connection state instead of global variable
  if (mongoose.connections[0].readyState === 1) {
    return; // Already connected
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(mongoUri, {
      bufferCommands: false, // Disable mongoose buffering for serverless
    });
    
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
