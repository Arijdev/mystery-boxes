"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Copy, Plus, Calendar, Percent } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CouponsPage() {
  const [couponCode, setCouponCode] = useState("")
  const { toast } = useToast()

  const [availableCoupons, setAvailableCoupons] = useState([
    {
      id: 1,
      code: "MYSTERY20",
      title: "20% Off Any Box",
      description: "Get 20% discount on any mystery box",
      discount: "20%",
      minOrder: "₹2,000",
      expiryDate: "2024-12-31",
      isActive: true,
    },
    {
      id: 2,
      code: "FIRSTBOX",
      title: "First Purchase Discount",
      description: "₹500 off on your first mystery box purchase",
      discount: "₹500",
      minOrder: "₹3,000",
      expiryDate: "2024-12-31",
      isActive: true,
    },
    {
      id: 3,
      code: "SAVE100",
      title: "Save ₹100",
      description: "₹100 off on orders above ₹1000",
      discount: "₹100",
      minOrder: "₹1,000",
      expiryDate: "2024-12-31",
      isActive: true,
    },
    {
      id: 4,
      code: "GAMING50",
      title: "Gaming Box Special",
      description: "₹50 off on gaming mystery boxes",
      discount: "₹50",
      minOrder: "₹1,500",
      expiryDate: "2024-01-20",
      isActive: false,
    },
  ])

  const usedCoupons = [
    {
      id: 1,
      code: "WELCOME10",
      title: "Welcome Bonus",
      usedDate: "2024-01-15",
      savedAmount: "₹400",
    },
    {
      id: 2,
      code: "NEWYEAR2024",
      title: "New Year Special",
      usedDate: "2024-01-01",
      savedAmount: "₹800",
    },
  ]

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied!",
        description: `Coupon code ${code} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy coupon code",
        variant: "destructive",
      })
    }
  }

  const addCouponToAccount = () => {
    const validCoupons = ["MYSTERY20", "FIRSTBOX", "SAVE100", "GAMING50", "TECH30", "WELCOME25", "STUDENT15"]

    if (!couponCode.trim()) {
      toast({
        title: "Empty Coupon Code",
        description: "Please enter a coupon code.",
        variant: "destructive",
      })
      return
    }

    const upperCaseCode = couponCode.toUpperCase()

    if (!validCoupons.includes(upperCaseCode)) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid or has expired.",
        variant: "destructive",
      })
      return
    }

    // Check if coupon already exists
    const existingCoupon = availableCoupons.find((c) => c.code === upperCaseCode)
    if (existingCoupon) {
      toast({
        title: "Coupon Already Added",
        description: "This coupon is already in your account.",
        variant: "destructive",
      })
      return
    }

    // Define coupon details
    const couponDetails = {
      MYSTERY20: {
        title: "20% Off Any Box",
        description: "Get 20% discount on any mystery box",
        discount: "20%",
        minOrder: "₹2,000",
      },
      FIRSTBOX: {
        title: "First Purchase Discount",
        description: "₹500 off on your first mystery box purchase",
        discount: "₹500",
        minOrder: "₹3,000",
      },
      SAVE100: {
        title: "Save ₹100",
        description: "₹100 off on orders above ₹1000",
        discount: "₹100",
        minOrder: "₹1,000",
      },
      GAMING50: {
        title: "Gaming Box Special",
        description: "₹50 off on gaming mystery boxes",
        discount: "₹50",
        minOrder: "₹1,500",
      },
      TECH30: {
        title: "Tech Discount",
        description: "₹30 off on tech mystery boxes",
        discount: "₹30",
        minOrder: "₹1,200",
      },
      WELCOME25: { title: "Welcome Offer", description: "25% off for new users", discount: "25%", minOrder: "₹1,500" },
      STUDENT15: {
        title: "Student Discount",
        description: "15% off for students",
        discount: "15%",
        minOrder: "₹1,000",
      },
    }

    const details = couponDetails[upperCaseCode as keyof typeof couponDetails]

    // Add new coupon
    const newCoupon = {
      id: Date.now(),
      code: upperCaseCode,
      title: details.title,
      description: details.description,
      discount: details.discount,
      minOrder: details.minOrder,
      expiryDate: "2024-12-31",
      isActive: true,
    }

    setAvailableCoupons([newCoupon, ...availableCoupons])
    setCouponCode("")

    toast({
      title: "Coupon Added!",
      description: `Coupon ${upperCaseCode} has been added to your account successfully.`,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCouponToAccount()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Coupons & Offers</h1>
        <Badge className="bg-green-600">{availableCoupons.filter((c) => c.isActive).length} Active</Badge>
      </div>

      {/* Add Coupon Code */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Coupon Code
          </CardTitle>
          <CardDescription className="text-gray-300">
            Have a coupon code? Enter it here to add to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter coupon code (e.g., MYSTERY20)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={addCouponToAccount}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Add Coupon
            </Button>
          </div>
          <div className="mt-3 text-sm text-gray-400">
            Try these codes: MYSTERY20, FIRSTBOX, SAVE100, GAMING50, TECH30, WELCOME25, STUDENT15
          </div>
        </CardContent>
      </Card>

      {/* Available Coupons */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Available Coupons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCoupons.map((coupon) => (
            <Card
              key={coupon.id}
              className={`bg-black/40 border-white/10 backdrop-blur-sm ${!coupon.isActive ? "opacity-50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ticket className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-white">{coupon.title}</CardTitle>
                  </div>
                  <Badge className={coupon.isActive ? "bg-green-600" : "bg-red-600"}>
                    {coupon.isActive ? "Active" : "Expired"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">{coupon.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-bold text-lg">{coupon.discount}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">Min. Order</div>
                    <div className="text-white font-medium">{coupon.minOrder}</div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-purple-400 font-mono text-lg">{coupon.code}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(coupon.code)}
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                    disabled={!coupon.isActive}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Used Coupons */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recently Used</h2>
        <div className="space-y-3">
          {usedCoupons.map((coupon) => (
            <Card key={coupon.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{coupon.title}</div>
                      <div className="text-gray-400 text-sm">Code: {coupon.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">Saved {coupon.savedAmount}</div>
                    <div className="text-gray-400 text-sm">
                      Used on {new Date(coupon.usedDate).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
