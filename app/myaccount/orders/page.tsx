"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Eye, Loader2, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          credentials: "include", // ensures cookies (like JWT) are sent
        })

        if (response.ok) {
          const result = await response.json()
          setOrders(result.orders)
        } else {
          console.error("Failed to fetch orders: HTTP", response.status)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "shipped":
        return <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
      case "processing":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
      case "confirmed":
        return <Package className="h-3 w-3 sm:h-4 sm:w-4" />
      case "cancelled":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Package className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-600"
      case "shipped":
        return "bg-blue-600"
      case "processing":
        return "bg-yellow-600"
      case "confirmed":
        return "bg-purple-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Order History</h1>
        </div>
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="flex items-center space-x-2 text-white">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            <span className="text-sm sm:text-base">Loading orders...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Order History</h1>
        <Badge className="bg-purple-600 text-xs sm:text-sm px-2 py-1">
          {orders.length} Orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-12 text-center">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
            >
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-base sm:text-lg truncate">
                      Order #{order._id.slice(-8)}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-xs sm:text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      ₹{order.total.toFixed(2)}
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1 text-xs`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image || "/mystery.png"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base truncate">
                            {item.name}
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-medium text-sm sm:text-base flex-shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-white/10 space-y-2 sm:space-y-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    <Link href={`/order-details/${order._id}`}>
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-transparent w-full sm:w-auto"
                    >
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
