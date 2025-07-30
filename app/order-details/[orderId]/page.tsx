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
// ✅ Import mystery boxes data
import { mysteryBoxes, getBoxById, type MysteryBox } from "@/lib/mysteryBoxes"

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

  // ✅ Enhanced helper function with debugging
  const getCompleteItemData = (item: any) => {
    console.log("Order item:", item) // Debug log
    console.log("Looking for mystery box with ID:", item.id) // Debug log
    console.log("Available mystery boxes:", mysteryBoxes) // Debug log
    
    // Try to find mystery box by ID
    const mysteryBox = getBoxById(item.id)
    console.log("Found mystery box:", mysteryBox) // Debug log
    
    // If not found by direct ID, try to find by name matching
    let foundBox = mysteryBox
    if (!foundBox && item.name) {
      foundBox = mysteryBoxes.find(box => 
        box.name.toLowerCase() === item.name.toLowerCase()
      )
      console.log("Found by name matching:", foundBox) // Debug log
    }

    // Return enhanced item data
    const result = {
      ...item,
      description: foundBox?.description || item.description || "Premium mystery box with curated items",
      items: foundBox?.items || item.items || "Multiple items",
      image: foundBox?.image || item.image || "/mystery.png",
      name: item.name || foundBox?.name || "Mystery Box",
      // Add original mystery box data for reference
      mysteryBoxData: foundBox
    }
    
    console.log("Final item data:", result) // Debug log
    return result
  }

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: "include" // Add credentials if needed
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log("Order data received:", result) // Debug log
          setOrderData(result.order)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("Failed to fetch order:", response.status, errorData)
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
        credentials: "include"
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              <h1 className="text-lg sm:text-2xl font-bold text-white">MysteryVault</h1>
            </Link>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent text-xs sm:text-sm px-2 sm:px-4"
          >
            <Link href="/myaccount/orders">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Orders</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

          {/* Order Header */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white text-lg sm:text-2xl truncate">
                    Order #{orderData?.id?.slice(-8) || orderData?._id?.slice(-8) || 'Loading...'}
                  </CardTitle>
                  <p className="text-gray-300 mt-1 text-xs sm:text-sm">
                    {orderData?.createdAt ? (
                      <>
                        Placed on{" "}
                        {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                          weekday: typeof window !== 'undefined' && window?.innerWidth < 640 ? undefined : "long",
                          year: "numeric",
                          month: typeof window !== 'undefined' && window?.innerWidth < 640 ? "short" : "long",
                          day: "numeric",
                        })}
                      </>
                    ) : (
                      'Loading order date...'
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right">
                  <Badge
                    className={`${getStatusColor(orderData?.status || 'pending')} flex items-center space-x-1 sm:space-x-2 text-xs sm:text-lg px-2 sm:px-4 py-1 sm:py-2`}
                  >
                    {getStatusIcon(orderData?.status || 'pending')}
                    <span className="capitalize">{orderData?.status || 'Loading...'}</span>
                  </Badge>
                  <div className="text-xl sm:text-2xl font-bold text-white sm:mt-2">
                    ₹{orderData?.total?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-white text-lg sm:text-xl">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  {orderData?.items?.map((item: any, index: number) => {
                    // ✅ Get complete item data with enhanced debugging
                    const completeItem = getCompleteItemData(item)
                    
                    return (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-black/20 rounded-lg">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={completeItem.image}
                            alt={completeItem.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log("Image failed to load:", completeItem.image)
                              e.currentTarget.src = "/mystery.png" // Fallback image
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                            {completeItem.name}
                          </h3>
                          {/* ✅ Enhanced description display */}
                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-1">
                            {completeItem.description}
                          </p>
                          {/* ✅ Enhanced items display with debug indicator */}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                              {completeItem.items}
                            </Badge>
                            
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-white font-semibold text-sm sm:text-base">₹{item.price?.toFixed(2)}</div>
                          <div className="text-gray-400 text-xs sm:text-sm">Qty: {item.quantity}</div>
                          <div className="text-white font-bold text-sm sm:text-base">₹{(item.price * item.quantity)?.toFixed(2)}</div>
                        </div>
                      </div>
                    )
                  }) || <div className="text-white">Loading items...</div>}
                </CardContent>
              </Card>

              {/* Order Tracking */}
              {orderData?.tracking && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Order Tracking
                    </CardTitle>
                    {orderData.tracking.trackingNumber && (
                      <div className="text-gray-300">
                        <span className="text-xs sm:text-sm">Tracking Number: </span>
                        <code className="bg-black/20 px-2 py-1 rounded text-purple-400 text-xs sm:text-sm break-all">
                          {orderData.tracking.trackingNumber}
                        </code>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      {orderData.tracking.updates?.map((update: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getStatusIcon(update.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm sm:text-base">{update.message}</div>
                            <div className="text-gray-400 text-xs sm:text-sm">
                              {new Date(update.timestamp).toLocaleString("en-IN")}
                            </div>
                            {update.location && (
                              <div className="text-gray-400 text-xs sm:text-sm flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{update.location}</span>
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
            <div className="space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-white text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>₹{orderData?.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  {orderData?.appliedCoupon && (
                    <div className="flex justify-between text-green-400 text-sm sm:text-base">
                      <span>Discount ({orderData.appliedCoupon.code})</span>
                      <span>-₹{orderData?.discount?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span>{orderData?.shipping === 0 ? "Free" : `₹${orderData?.shipping || '0'}`}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>₹{orderData?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {orderData?.shippingAddress && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-gray-300 space-y-1 text-sm sm:text-base">
                      <div className="text-white font-medium">{orderData.shippingAddress.fullName}</div>
                      <div className="break-words">{orderData.shippingAddress.address}</div>
                      <div>
                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} -{" "}
                        {orderData.shippingAddress.pincode}
                      </div>
                      <div className="break-all">{orderData.shippingAddress.phone}</div>
                      <div className="break-all">{orderData.shippingAddress.email}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              {orderData?.paymentMethod && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-gray-300 text-sm sm:text-base">
                      <div className="flex items-center justify-between">
                        <span>Payment Method</span>
                        <span className="text-white capitalize">{orderData.paymentMethod}</span>
                      </div>
                      {orderData.paymentMethod === "card" && orderData.paymentDetails && (
                        <div className="mt-2 text-xs sm:text-sm">
                          <div>Card ending in ****{orderData.paymentDetails.cardNumber?.slice(-4)}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Actions */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-white text-lg sm:text-xl">Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {canCancelOrder(orderData?.status || '') && (
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent text-sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-white/10 text-white mx-4 max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center text-lg">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                            Cancel Order
                          </DialogTitle>
                          <DialogDescription className="text-gray-300 text-sm">
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cancelReason" className="text-white text-sm">
                              Reason for cancellation *
                            </Label>
                            <Textarea
                              id="cancelReason"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Please provide a reason for cancelling this order..."
                              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 mt-2 text-sm"
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
                          <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent w-full sm:w-auto"
                          >
                            Keep Order
                          </Button>
                          <Button
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
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

                  {orderData?.status === "cancelled" && orderData?.cancellation && (
                    <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                      <div className="text-red-400 font-medium mb-1 text-sm">Order Cancelled</div>
                      <div className="text-gray-300 text-xs sm:text-sm break-words">
                        Reason: {orderData.cancellation.reason}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Cancelled on {new Date(orderData.cancellation.cancelledAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent text-sm"
                  >
                    <Link href="/myaccount/orders">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Orders
                    </Link>
                  </Button>

                  {orderData?.status === "delivered" && (
                    <Button
                      variant="outline"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-transparent text-sm"
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
