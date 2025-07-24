"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Package, ArrowLeft, CreditCard, Smartphone, Building, Truck, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const [orderSummary, setOrderSummary] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    upiId: "",
  })

  useEffect(() => {
    const savedOrder = localStorage.getItem("orderSummary")
    if (savedOrder) {
      setOrderSummary(JSON.parse(savedOrder))
    } else {
      router.push("/cart")
    }
  }, [router])

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "pincode"]
    const missingFields = requiredFields.filter((field) => !shippingAddress[field as keyof typeof shippingAddress])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping details.",
        variant: "destructive",
      })
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingAddress.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9]{10,15}$/
    if (!phoneRegex.test(shippingAddress.phone.replace(/\s/g, ""))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return false
    }

    // PIN code validation
    const pincodeRegex = /^[0-9]{6}$/
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter a valid 6-digit PIN code.",
        variant: "destructive",
      })
      return false
    }

    if (paymentMethod === "card") {
      const requiredPaymentFields = ["cardNumber", "expiryDate", "cvv", "cardName"]
      const missingPaymentFields = requiredPaymentFields.filter(
        (field) => !paymentDetails[field as keyof typeof paymentDetails],
      )

      if (missingPaymentFields.length > 0) {
        toast({
          title: "Missing Payment Information",
          description: "Please fill in all card details.",
          variant: "destructive",
        })
        return false
      }

      // Card number validation (basic)
      if (paymentDetails.cardNumber.replace(/\s/g, "").length < 13) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid card number.",
          variant: "destructive",
        })
        return false
      }

      // CVV validation
      if (paymentDetails.cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV.",
          variant: "destructive",
        })
        return false
      }
    }

    if (paymentMethod === "upi" && !paymentDetails.upiId) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const placeOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const orderData = {
        items: orderSummary.items,
        shippingAddress,
        paymentMethod,
        paymentDetails: paymentMethod === "cod" ? null : paymentDetails,
        subtotal: orderSummary.subtotal,
        discount: orderSummary.discount,
        shipping: orderSummary.shipping,
        total: orderSummary.total,
        appliedCoupon: orderSummary.appliedCoupon,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order")
      }

      // Clear cart and order summary
      localStorage.removeItem("cart")
      localStorage.removeItem("orderSummary")

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${result.order.id} has been confirmed.`,
      })

      // Redirect to order confirmation page
      router.push(`/order-confirmation?orderId=${result.order.id}`)
    } catch (error: any) {
      console.error("Order placement error:", error)
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Format card number input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Format expiry date input
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-white">
                      PIN Code *
                    </Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange("pincode", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="400001"
                      maxLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="House/Flat No., Street, Area"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white">
                      State *
                    </Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark" className="text-white">
                      Landmark
                    </Label>
                    <Input
                      id="landmark"
                      value={shippingAddress.landmark}
                      onChange={(e) => handleAddressChange("landmark", e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Near Metro Station"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="text-white flex items-center cursor-pointer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="text-white flex items-center cursor-pointer">
                      <Smartphone className="h-4 w-4 mr-2" />
                      UPI Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="text-white flex items-center cursor-pointer">
                      <Building className="h-4 w-4 mr-2" />
                      Net Banking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-white/10 rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="text-white flex items-center cursor-pointer">
                      <Truck className="h-4 w-4 mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="text-white">
                        Cardholder Name *
                      </Label>
                      <Input
                        id="cardName"
                        value={paymentDetails.cardName}
                        onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-white">
                        Card Number *
                      </Label>
                      <Input
                        id="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => handlePaymentChange("cardNumber", formatCardNumber(e.target.value))}
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-white">
                          Expiry Date *
                        </Label>
                        <Input
                          id="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", formatExpiryDate(e.target.value))}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-white">
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          value={paymentDetails.cvv}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value.replace(/\D/g, ""))}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Details */}
                {paymentMethod === "upi" && (
                  <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="upiId" className="text-white">
                        UPI ID *
                      </Label>
                      <Input
                        id="upiId"
                        value={paymentDetails.upiId}
                        onChange={(e) => handlePaymentChange("upiId", e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        placeholder="yourname@paytm"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="p-4 bg-black/20 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      You will be redirected to your bank's secure payment page to complete the transaction.
                    </p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="p-4 bg-black/20 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      Pay with cash when your order is delivered. Additional charges may apply.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {orderSummary.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{item.name}</div>
                        <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/10" />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  {orderSummary.appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({orderSummary.appliedCoupon.code})</span>
                      <span>-₹{orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{orderSummary.shipping === 0 ? "Free" : `₹${orderSummary.shipping}`}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>₹{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    `Place Order - ₹${orderSummary.total.toFixed(2)}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
