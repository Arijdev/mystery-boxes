"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Ticket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    type: "percentage" | "fixed"
  } | null>(null)
  const { toast } = useToast()
  const router = useRouter()


  const availableCoupons = {
    MYSTERY20: { discount: 0.2, type: "percentage" as const, minOrder: 2000 },
    FIRSTBOX: { discount: 500, type: "fixed" as const, minOrder: 3000 },
    SAVE100: { discount: 100, type: "fixed" as const, minOrder: 1000 },
  }

  let userId = localStorage.getItem("userId")
  // Load cart from MongoDB
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${userId}`)
        const data = await res.json()

        if (data?.cartItems) {
          setCartItems(data.cartItems)
          if (data.appliedCoupon) setAppliedCoupon(data.appliedCoupon)
        }
      } catch (err) {
        console.error("❌ Failed to load cart from MongoDB:", err)
      }
    }

    fetchCart()
  }, [])

  // Save cart to MongoDB
  // useEffect(() => {
  //   const saveCart = async () => {
  //     try {
  //       await fetch("/api/cart", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId, cartItems, appliedCoupon }),
  //       })
  //     } catch (err) {
  //       console.error("❌ Failed to save cart to MongoDB:", err)
  //     }
  //   }

  //   if (cartItems.length > 0) saveCart()
  // }, [cartItems, appliedCoupon])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = async (id: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: id }),
      })

      if (!res.ok) throw new Error("Failed to remove item")

      const item = cartItems.find((item) => item.id === id)
      setCartItems(cartItems.filter((item) => item.id !== id))

      toast({
        title: "Item Removed",
        description: `${item?.name} has been removed from your cart.`,
      })
    } catch (error) {
      console.error("Error removing item from cart:", error)
    }
  }


  const applyCoupon = () => {
    const coupon = availableCoupons[couponCode.toUpperCase() as keyof typeof availableCoupons]

    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      })
      return
    }

    if (subtotal < coupon.minOrder) {
      toast({
        title: "Minimum Order Not Met",
        description: `This coupon requires a minimum order of ₹${coupon.minOrder}.`,
        variant: "destructive",
      })
      return
    }

    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      discount: coupon.discount,
      type: coupon.type,
    })
    setCouponCode("")

    toast({
      title: "Coupon Applied!",
      description: `Coupon ${couponCode.toUpperCase()} has been applied successfully.`,
    })
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
    })
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      return
    }

    const orderSummary = {
      items: cartItems,
      subtotal,
      discount,
      shipping,
      total,
      appliedCoupon,
    }
    localStorage.setItem("orderSummary", JSON.stringify(orderSummary))
    router.push("/checkout")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount
    : 0
  const shipping = subtotal > 2000 ? 0 : 200
  const total = subtotal - discount + shipping

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
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <Badge className="bg-purple-600">{cartItems.length} Items</Badge>
        </div>

        {cartItems.length === 0 ? (
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-300 mb-6">Discover amazing mystery boxes and start your adventure!</p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                        <Badge variant="outline" className="border-green-400 text-green-400 mt-2">
                          {item.items}
                        </Badge>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-white">₹{item.price}</span>
                          <span className="text-sm text-gray-400 line-through">{item.originalValue}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Ticket className="h-5 w-5 mr-2" />
                    Coupon Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-600/20 rounded-lg border border-green-600/30">
                      <span className="text-green-400 font-medium">{appliedCoupon.code}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeCoupon}
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                          onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                        />
                        <Button
                          onClick={applyCoupon}
                          variant="outline"
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                        >
                          Apply
                        </Button>
                      </div>
                      <div className="text-sm text-gray-400">Try: MYSTERY20, FIRSTBOX, SAVE100</div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && <p className="text-green-400 text-sm">🎉 Free shipping on orders above ₹2,000!</p>}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={proceedToCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
