import { connectDB } from "@/app/lib/DB/connection";
import { UserModel } from "@/app/lib/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authService = {
  signIn: async (email: string, password: string) => {
    try {
      await connectDB();
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.warn(`Login failed: No user with email ${email}`);
        return { success: false, error: "User not found" };
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return { success: false, error: "Invalid password" };
      }
      const userData = user.toObject() as any;
      delete userData.password;
      // ✅ Create JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!, // ensure this is set in your .env file
        { expiresIn: "1d" }
      );

      return {
        success: true,
        user: userData,
        token // ✅ return token
      };
    } catch (error) {
      console.error("authService signIn error:", error);
      return { success: false, error: "Server error" };
    }
  },

  signUp: async (userData: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
  }) => {
    await connectDB();

    const existing = await UserModel.findOne({ email: userData.email });
    if (existing) return { success: false, error: "Email already registered" };

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await UserModel.create({
      ...userData,
      password: hashedPassword
    });

    const userWithoutPassword = newUser.toObject() as any;
    delete userWithoutPassword.password;

    return { success: true, user: userWithoutPassword };
  },

  signOut: async () => {
    await fetch("/api/signout", {
      method: "POST",
      credentials: "include"
    });
  },

  getCurrentUser: async (): Promise<any | null> => {
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json"
        }
      });

      if (!res.ok) {
        console.warn("❌ Failed to fetch /api/me");
        return null;
      }

      const user = await res.json();

      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  updateProfile: async (userId: string, updates: any) => {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update profile" };
    }

    return { success: true, user: data.user || data };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Server error" };
  }
},

getAddress: async (): Promise<{ success: true; address: any } | { success: false; error: any }> => {
  try {
    const res = await fetch("/api/address", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to fetch address" };
    }
    return { success: true, address: data.address };
  } catch (error) {
    console.error("Address fetch error:", error);
    return { success: false, error: "Server error" };
  }
},

updateAddress: async ( userId: string, updates: any ) => {
  try {
    const res = await fetch(`/api/address/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update address" };
    }

    return { success: true, address: data.address };
  } catch (error) {
    console.error("Address update error:", error);
    return { success: false, error: "Server error" };
  }
},

deleteAccount: async (userId: string, password: string) => {
    try {
      await connectDB();

      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: "Incorrect password" };
      }

      await UserModel.findByIdAndDelete(userId);

      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: "Server error" };
    }
  }
};

// getUserFromRequest: async (req: Request): Promise<any | null> => {
//   try {
//     const token = req.headers.get("Authorization")?.replace("Bearer ", "");
//     if (!token) return null;

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     if (!decoded || !decoded.userId) return null;

//     await connectDB();
//     const user = await UserModel.findById(decoded.userId).select("-password");
//     return user ? user.toObject() : null;
//   } catch (error) {
//     console.error("Error getting user from request:", error);
//     return null;
//   }
// }
