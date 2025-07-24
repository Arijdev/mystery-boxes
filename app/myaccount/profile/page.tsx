"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Loader2, Save, X, Camera, Monitor, MapPin, Calendar } from "lucide-react"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { currencyService, type Currency } from "@/lib/currency"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("INR")
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    joinDate: "",
    profilePhoto: "",
    totalOrders: 0,
    totalSpent: 0,
    memberLevel: "Bronze",
    currency: "INR" as Currency,
  })

  const [originalProfile, setOriginalProfile] = useState(profile)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }
    setUser(currentUser)

    // Initialize currency
    const userCurrency = currencyService.getUserCurrency()
    setCurrentCurrency(userCurrency)

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrentCurrency(event.detail)
      setProfile((prev) => ({ ...prev, currency: event.detail }))
    }

    window.addEventListener("currencyChange", handleCurrencyChange as EventListener)

    // Load login history
    loadLoginHistory(currentUser.id)

    // Calculate account statistics
    calculateAccountStats(currentUser.id).then((stats) => {
      const profileData = {
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        state: currentUser.state || "",
        pincode: currentUser.pincode || "",
        landmark: currentUser.landmark || "",
        profilePhoto: currentUser.profilePhoto || "",
        currency: userCurrency,
        joinDate: new Date(currentUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        ...stats,
      }

      setProfile(profileData)
      setOriginalProfile(profileData)
      setLoading(false)
    })

    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange as EventListener)
    }
  }, [router])

  const loadLoginHistory = async (userId: string) => {
    try {
      // Simulate login history data (in production, fetch from API)
      const history = [
        {
          id: 1,
          device: "Chrome on Windows",
          browser: "Chrome 120.0",
          os: "Windows 11",
          location: "Nadia, West Bengal, India",
          ip: "203.192.xxx.xxx",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          current: true,
          success: true,
        },
        {
          id: 2,
          device: "Chrome on Android",
          browser: "Chrome 119.0",
          os: "Android 14",
          location: "Delhi, Delhi, India",
          ip: "117.247.xxx.xxx",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          current: false,
          success: true,
        },
        {
          id: 3,
          device: "Firefox on Windows",
          browser: "Firefox 120.0",
          os: "Windows 10",
          location: "Bangalore, Karnataka, India",
          ip: "49.207.xxx.xxx",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          current: false,
          success: false, // Failed login attempt
        },
      ]
      setLoginHistory(history)
    } catch (error) {
      console.error("Failed to load login history:", error)
    }
  }

  const calculateAccountStats = async (userId: string) => {
    try {
      // Fetch user's orders to calculate real statistics
      const response = await fetch(`/api/orders?userId=${userId}`)
      if (response.ok) {
        const result = await response.json()
        const orders = result.orders || []

        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)

        // Calculate member level based on total spent
        let memberLevel = "Bronze"
        if (totalSpent >= 100000) {
          memberLevel = "Platinum"
        } else if (totalSpent >= 50000) {
          memberLevel = "Gold"
        } else if (totalSpent >= 20000) {
          memberLevel = "Silver"
        }

        return {
          totalOrders,
          totalSpent,
          memberLevel,
        }
      }
    } catch (error) {
      console.error("Failed to calculate account stats:", error)
    }

    // Fallback to demo data if API fails
    return {
      totalOrders: 0,
      totalSpent: 0,
      memberLevel: "Bronze",
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleCurrencyChange = (currency: Currency) => {
    setProfile((prev) => ({ ...prev, currency }))
    setCurrentCurrency(currency)
    currencyService.setUserCurrency(currency)
  }

  const handlePhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingPhoto(true)

    try {
      // Convert file to base64 for storage (in production, upload to cloud storage)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64String = e.target?.result as string

        // Update profile photo immediately for preview
        setProfile((prev) => ({ ...prev, profilePhoto: base64String }))

        // Save to user profile
        if (user) {
          const result = await authService.updateProfile(user.id, {
            ...user,
            profilePhoto: base64String,
          })

          if (result.success && result.user) {
            setUser(result.user)
            toast({
              title: "Photo Updated",
              description: "Your profile photo has been updated successfully.",
            })
          } else {
            throw new Error(result.error || "Failed to update photo")
          }
        }
      }

      reader.onerror = () => {
        throw new Error("Failed to read file")
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      })
      // Revert photo change on error
      setProfile((prev) => ({ ...prev, profilePhoto: originalProfile.profilePhoto }))
    } finally {
      setUploadingPhoto(false)
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const validateForm = () => {
    if (!profile.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      })
      return false
    }

    if (!profile.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profile.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return false
    }

    if (!profile.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return false
    }

    const phoneRegex = /^[+]?[0-9]{10,15}$/
    if (!phoneRegex.test(profile.phone.replace(/\s/g, ""))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return false
    }

    if (profile.pincode && !/^[0-9]{6}$/.test(profile.pincode)) {
      toast({
        title: "Validation Error",
        description: "PIN code must be 6 digits",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!user || !validateForm()) return

    setSaving(true)

    try {
      const result = await authService.updateProfile(user.id, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        landmark: profile.landmark,
        profilePhoto: profile.profilePhoto,
        preferences: {
          ...user.preferences,
          currency: profile.currency,
        },
      })

      if (result.success && result.user) {
        setUser(result.user)
        setOriginalProfile(profile)
        setIsEditing(false)

        // Update global currency
        currencyService.setUserCurrency(profile.currency)

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(originalProfile)
    setCurrentCurrency(originalProfile.currency)
    setIsEditing(false)
  }

  const getMemberLevelColor = (level: string) => {
    switch (level) {
      case "Platinum":
        return "bg-gradient-to-r from-gray-400 to-gray-600"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      default:
        return "bg-gradient-to-r from-orange-400 to-orange-600"
    }
  }

  const formatCurrency = (amount: number) => {
    return currencyService.formatAmount(amount, currentCurrency)
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return "📱"
    } else if (device.includes("Windows") || device.includes("Mac")) {
      return "💻"
    } else {
      return "🖥️"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription className="text-gray-300">Manage your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {profile.profilePhoto ? (
                      <AvatarImage src={profile.profilePhoto || "/placeholder-user.svg"} alt={profile.name} />
                    ) : (
                      <AvatarImage src="/placeholder-user.svg?height=80&width=80" />
                    )}
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <Button
                      onClick={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      variant="outline"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                    >
                      {uploadingPhoto ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white">
                    PIN Code
                  </Label>
                  <Input
                    id="pincode"
                    value={profile.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="400001"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                  rows={3}
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="Maharashtra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark" className="text-white">
                    Landmark
                  </Label>
                  <Input
                    id="landmark"
                    value={profile.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70 placeholder:text-gray-400"
                    placeholder="Near Metro Station"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="text-white">
                    Member Since
                  </Label>
                  <Input
                    id="joinDate"
                    value={profile.joinDate}
                    disabled
                    className="bg-black/20 border-white/10 text-white disabled:opacity-70"
                  />
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">
                      Preferred Currency
                    </Label>
                    <select
                      id="currency"
                      value={profile.currency}
                      onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white"
                    >
                      <option value="INR">₹ Indian Rupee (INR)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                      <option value="GBP">£ British Pound (GBP)</option>
                      <option value="JPY">¥ Japanese Yen (JPY)</option>
                      <option value="AUD">A$ Australian Dollar (AUD)</option>
                      <option value="CAD">C$ Canadian Dollar (CAD)</option>
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Login History
              </CardTitle>
              <CardDescription className="text-gray-300">Recent login activity on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getDeviceIcon(session.device)}</div>
                      <div>
                        <div className="text-white font-medium flex items-center space-x-2">
                          <span>{session.device}</span>
                          {session.current && <Badge className="bg-green-600 text-xs">Current</Badge>}
                          {!session.success && <Badge className="bg-red-600 text-xs">Failed</Badge>}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {session.browser} • {session.os}
                        </div>
                        <div className="text-gray-400 text-sm flex items-center space-x-4">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {session.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatRelativeTime(session.timestamp)}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs">IP: {session.ip}</div>
                      </div>
                    </div>
                    {session.success && (
                      <div className="text-green-400 text-sm">{session.current ? "Active Now" : "Successful"}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Orders</span>
                <Badge className="bg-purple-600">{profile.totalOrders}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Spent</span>
                <Badge className="bg-green-600">{formatCurrency(profile.totalSpent)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Member Level</span>
                <Badge className={getMemberLevelColor(profile.memberLevel)}>{profile.memberLevel}</Badge>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>
                    Next Level:{" "}
                    {profile.memberLevel === "Bronze"
                      ? `Silver (${formatCurrency(20000)})`
                      : profile.memberLevel === "Silver"
                        ? `Gold (${formatCurrency(50000)})`
                        : profile.memberLevel === "Gold"
                          ? `Platinum (${formatCurrency(100000)})`
                          : "Max Level Reached!"}
                  </div>
                  {profile.memberLevel !== "Platinum" && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (profile.totalSpent /
                              (profile.memberLevel === "Bronze"
                                ? 20000
                                : profile.memberLevel === "Silver"
                                  ? 50000
                                  : 100000)) *
                              100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
              >
                <a href="/settings">Change Password</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
              >
                <a href="/settings">Notification Settings</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
              >
                <a href="/settings">Delete Account</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
