"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailsPage() {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

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
        } else {
          toast({
            title: "Order Not Found",
            description: "The order you're looking for could not be found.",
            variant: "destructive",
          })
          router.push("/myaccount/orders")
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, toast, router])

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Cancellation Reason Required",
        description: "Please provide a reason for cancelling the order.",
        variant: "destructive",
      })
      return
    }

    setCancelling(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: cancelReason }),
      })

      const result = await response.json()

      if (response.ok) {
        setOrderData(result.order)
        setShowCancelDialog(false)
        setCancelReason("")
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to cancel order")
      }
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCancelling(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-400" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "confirmed":
        return <Package className="h-5 w-5 text-purple-400" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Package className="h-5 w-5 text-gray-400" />
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

  const canCancelOrder = (status: string) => {
    return ["confirmed", "processing"].includes(status)
  }

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
              <Link href="/myaccount/orders">Back to Orders</Link>
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
          <Button
            asChild
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
          >
            <Link href="/myaccount/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Header */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">{orderData.id}</CardTitle>
                  <p className="text-gray-300 mt-1">
                    Placed on{" "}
                    {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${getStatusColor(orderData.status)} flex items-center space-x-2 text-lg px-4 py-2`}
                  >
                    {getStatusIcon(orderData.status)}
                    <span className="capitalize">{orderData.status}</span>
                  </Badge>
                  <div className="text-2xl font-bold text-white mt-2">₹{orderData.total.toFixed(2)}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                        <Badge variant="outline" className="border-green-400 text-green-400 mt-1">
                          {item.items}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">₹{item.price.toFixed(2)}</div>
                        <div className="text-gray-400 text-sm">Qty: {item.quantity}</div>
                        <div className="text-white font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Tracking */}
              {orderData.tracking && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Order Tracking
                    </CardTitle>
                    {orderData.tracking.trackingNumber && (
                      <div className="text-gray-300">
                        <span className="text-sm">Tracking Number: </span>
                        <code className="bg-black/20 px-2 py-1 rounded text-purple-400">
                          {orderData.tracking.trackingNumber}
                        </code>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderData.tracking.updates.map((update: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getStatusIcon(update.status)}</div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{update.message}</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(update.timestamp).toLocaleString("en-IN")}
                            </div>
                            {update.location && (
                              <div className="text-gray-400 text-sm flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {update.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{orderData.subtotal.toFixed(2)}</span>
                  </div>
                  {orderData.appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({orderData.appliedCoupon.code})</span>
                      <span>-₹{orderData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{orderData.shipping === 0 ? "Free" : `₹${orderData.shipping}`}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>₹{orderData.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 space-y-1">
                    <div className="text-white font-medium">{orderData.shippingAddress.fullName}</div>
                    <div>{orderData.shippingAddress.address}</div>
                    <div>
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} -{" "}
                      {orderData.shippingAddress.pincode}
                    </div>
                    <div>{orderData.shippingAddress.phone}</div>
                    <div>{orderData.shippingAddress.email}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Payment Method</span>
                      <span className="text-white capitalize">{orderData.paymentMethod}</span>
                    </div>
                    {orderData.paymentMethod === "card" && orderData.paymentDetails && (
                      <div className="mt-2 text-sm">
                        <div>Card ending in ****{orderData.paymentDetails.cardNumber.slice(-4)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canCancelOrder(orderData.status) && (
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                            Cancel Order
                          </DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cancelReason" className="text-white">
                              Reason for cancellation *
                            </Label>
                            <Textarea
                              id="cancelReason"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Please provide a reason for cancelling this order..."
                              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 mt-2"
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent"
                          >
                            Keep Order
                          </Button>
                          <Button
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {cancelling ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Order"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {orderData.status === "cancelled" && orderData.cancellation && (
                    <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                      <div className="text-red-400 font-medium mb-1">Order Cancelled</div>
                      <div className="text-gray-300 text-sm">Reason: {orderData.cancellation.reason}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        Cancelled on {new Date(orderData.cancellation.cancelledAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <Link href="/myaccount/orders">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Orders
                    </Link>
                  </Button>

                  {orderData.status === "delivered" && (
                    <Button
                      variant="outline"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-transparent"
                    >
                      Reorder Items
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
