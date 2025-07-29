import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for a user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
  photo: string; 
  createdAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email"]
  },
  password: { type: String, required: true, minlength: 6 },
  phoneNo: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
  },
  photo: { type: String, default: "" }, // <-- ✅ New field
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash the password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (plainPassword: string) {
  return bcrypt.compare(plainPassword, this.password);
};

// Safely export the model
const modelName = "UserModel";
export const UserModel: Model<IUser> =
  (mongoose.models?.[modelName] as Model<IUser>) ||
  mongoose.model<IUser>(modelName, userSchema);
