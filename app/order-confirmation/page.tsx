"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, CheckCircle, Truck, Home, Loader2 } from "lucide-react"

export default function OrderConfirmationPage() {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const result = await response.json()
          setOrderData(result.order)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
            <p className="text-gray-300 mb-6">The order you're looking for could not be found.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/">Return to Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">MysteryVault</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
              <p className="text-gray-300 mb-4">
                Thank you for your purchase. Your mystery boxes are being prepared for shipment.
              </p>
              <Badge className="bg-purple-600 text-lg px-4 py-2">{orderData.id}</Badge>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Order Date:</span>
                  <div className="text-white">{new Date(orderData.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <div>
                  <span className="text-gray-400">Payment Method:</span>
                  <div className="text-white capitalize">{orderData.paymentMethod}</div>
                </div>
                <div>
                  <span className="text-gray-400">Total Amount:</span>
                  <div className="text-white font-bold">₹{orderData.total.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-600 capitalize">{orderData.status}</Badge>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-white font-semibold">Items Ordered:</h3>
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-white">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-semibold mb-2">Shipping Address:</h3>
                <div className="text-gray-300 text-sm">
                  <div>{orderData.shippingAddress.fullName}</div>
                  <div>{orderData.shippingAddress.address}</div>
                  <div>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} -{" "}
                    {orderData.shippingAddress.pincode}
                  </div>
                  <div>{orderData.shippingAddress.phone}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Order Processing</div>
                  <div className="text-gray-400 text-sm">We're preparing your mystery boxes</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Shipping</div>
                  <div className="text-gray-400 text-sm">Your order will be shipped within 1-2 business days</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Delivery</div>
                  <div className="text-gray-400 text-sm">Expected delivery in 3-5 business days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/myaccount/orders">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
