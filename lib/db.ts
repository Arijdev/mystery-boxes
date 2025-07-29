// Simple in-memory database simulation (in production, use PostgreSQL, MongoDB, etc.)
interface Order {
  id: string;
  userId: string;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  paymentDetails?: any;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon?: any;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
  cancellation?: {
    reason: string;
    cancelledAt: string;
  };
  tracking?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    updates: Array<{
      status: string;
      message: string;
      timestamp: string;
      location?: string;
    }>;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

// In-memory storage (replace with real database in production)
const orders: Order[] = [];
const users: User[] = [];

export const db = {
  orders: {
    create: async (
      orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
    ): Promise<Order> => {
      const order: Order = {
        ...orderData,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tracking: {
          updates: [
            {
              status: "confirmed",
              message: "Order confirmed and being processed",
              timestamp: new Date().toISOString()
            }
          ]
        }
      };
      orders.push(order);
      return order;
    },

    findById: async (id: string): Promise<Order | null> => {
      return orders.find((order) => order.id === id) || null;
    },

    findByUserId: async (userId: string): Promise<Order[]> => {
      return orders
        .filter((order) => order.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    updateStatus: async (
      id: string,
      status: Order["status"]
    ): Promise<Order | null> => {
      const orderIndex = orders.findIndex((order) => order.id === id);
      if (orderIndex === -1) return null;

      const statusMessages = {
        pending: "Order is pending confirmation",
        confirmed: "Order confirmed and being processed",
        processing: "Order is being prepared for shipment",
        shipped: "Order has been shipped",
        delivered: "Order has been delivered",
        cancelled: "Order has been cancelled"
      };

      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
        tracking: {
          ...orders[orderIndex].tracking,
          updates: [
            ...(orders[orderIndex].tracking?.updates || []),
            {
              status,
              message:
                statusMessages[status] || `Order status updated to ${status}`,
              timestamp: new Date().toISOString()
            }
          ]
        }
      };

      // Add tracking number for shipped orders
      if (
        status === "shipped" &&
        !orders[orderIndex].tracking?.trackingNumber
      ) {
        orders[orderIndex].tracking = {
          ...orders[orderIndex].tracking,
          trackingNumber: `TRK${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 6)
            .toUpperCase()}`,
          carrier: "BlueDart Express",
          estimatedDelivery: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updates: orders[orderIndex].tracking?.updates ?? []
        };
      }

      return orders[orderIndex];
    },

    addCancellation: async (
      id: string,
      cancellation: { reason: string; cancelledAt: string }
    ): Promise<Order | null> => {
      const orderIndex = orders.findIndex((order) => order.id === id);
      if (orderIndex === -1) return null;

      orders[orderIndex] = {
        ...orders[orderIndex],
        cancellation,
        updatedAt: new Date().toISOString()
      };

      return orders[orderIndex];
    },

    getAll: async (): Promise<Order[]> => {
      return orders;
    }
  },

  users: {
    create: async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
      const user: User = {
        ...userData,
        id: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      return user;
    },

    findByEmail: async (email: string): Promise<User | null> => {
      return users.find((user) => user.email === email) || null;
    },

    findById: async (id: string): Promise<User | null> => {
      return users.find((user) => user.id === id) || null;
    }
  }
};

// Utility function to validate coupon codes
export const validateCoupon = (code: string, subtotal: number) => {
  const coupons: Record<
    string,
    { discount: number; type: "percentage" | "fixed"; minOrder: number }
  > = {
    MYSTERY20: { discount: 0.2, type: "percentage", minOrder: 2000 },
    FIRSTBOX: { discount: 500, type: "fixed", minOrder: 3000 },
    SAVE100: { discount: 100, type: "fixed", minOrder: 1000 },
    GAMING50: { discount: 50, type: "fixed", minOrder: 1500 },
    TECH30: { discount: 0.3, type: "percentage", minOrder: 5000 }
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return null;

  if (subtotal < coupon.minOrder) {
    return {
      error: `Minimum order of ₹${coupon.minOrder} required for this coupon`
    };
  }

  return coupon;
};
