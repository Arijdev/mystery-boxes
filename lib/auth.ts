// Simple authentication system (in production, use NextAuth.js or similar)
interface User {
  id: string
  email: string
  name: string
  phone: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  landmark?: string
  profilePhoto?: string
  createdAt: string
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    orderUpdates: boolean
    newProducts: boolean
    promotions: boolean
    newsletter: boolean
    twoFactorEnabled: boolean
    loginAlerts: boolean
    sessionTimeout: string
    passwordExpiry: boolean
    theme: "light" | "dark" | "system"
    language: string
    currency: string
    timezone: string
    dateFormat: string
    autoLogout: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// In-memory user storage (replace with real database in production)
const users: User[] = [
  {
    id: "user-1",
    email: "john.doe@example.com",
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "123 Mystery Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Near Metro Station",
    profilePhoto: "",
    createdAt: "2024-01-15T10:30:00Z",
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      orderUpdates: true,
      newProducts: true,
      promotions: false,
      newsletter: false,
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: "30",
      passwordExpiry: false,
      theme: "dark",
      language: "en",
      currency: "INR",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      autoLogout: "60",
    },
  },
  {
    id: "demo-user",
    email: "demo@mysteryvault.com",
    name: "Demo User",
    phone: "+91 98765 43210",
    address: "Demo Address, Demo City",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Demo Landmark",
    profilePhoto: "",
    createdAt: "2024-01-01T00:00:00Z",
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      marketingEmails: true,
      orderUpdates: true,
      newProducts: true,
      promotions: true,
      newsletter: true,
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: "60",
      passwordExpiry: false,
      theme: "dark",
      language: "en",
      currency: "INR",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      autoLogout: "60",
    },
  },
]

export const authService = {
  // Sign in user
  signIn: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials
    if (email === "demo@mysteryvault.com" && password === "demo123") {
      const user = users.find((u) => u.email === "demo@mysteryvault.com")!
      localStorage.setItem("auth_user", JSON.stringify(user))
      return { success: true, user }
    }

    // Check if user exists
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { success: false, error: "User not found. Please check your email address." }
    }

    // In production, verify password hash
    if (password.length < 6) {
      return { success: false, error: "Invalid password. Please try again." }
    }

    localStorage.setItem("auth_user", JSON.stringify(user))
    return { success: true, user }
  },

  // Sign up new user
  signUp: async (userData: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." }
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      profilePhoto: "",
      createdAt: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        marketingEmails: true,
        orderUpdates: true,
        newProducts: true,
        promotions: false,
        newsletter: false,
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: "30",
        passwordExpiry: false,
        theme: "dark",
        language: "en",
        currency: "INR",
        timezone: "Asia/Kolkata",
        dateFormat: "DD/MM/YYYY",
        autoLogout: "60",
      },
    }

    users.push(newUser)
    localStorage.setItem("auth_user", JSON.stringify(newUser))
    return { success: true, user: newUser }
  },

  // Sign out user
  signOut: async (): Promise<void> => {
    localStorage.removeItem("auth_user")
    // Clear cart and other user-specific data
    localStorage.removeItem("cart")
    localStorage.removeItem("orderSummary")
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("auth_user")
    return userData ? JSON.parse(userData) : null
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    updates: Partial<User>,
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem("auth_user", JSON.stringify(users[userIndex]))

    return { success: true, user: users[userIndex] }
  },

  // Change password
  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, verify current password hash
    if (currentPassword.length < 6) {
      return { success: false, error: "Current password is incorrect" }
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long" }
    }

    // In production, hash and store new password
    return { success: true }
  },

  // Delete account
  deleteAccount: async (userId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // In production, verify password
    if (password.length < 6) {
      return { success: false, error: "Password is incorrect" }
    }

    // Remove user from storage
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      users.splice(userIndex, 1)
    }

    // Clear local storage
    localStorage.removeItem("auth_user")
    localStorage.removeItem("cart")
    localStorage.removeItem("orderSummary")

    return { success: true }
  },
}
