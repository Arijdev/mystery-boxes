"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Star, Gift, Zap, Heart, Sparkles, Package, Users, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, UserCircle, Package2, Ticket, HelpCircle, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"
import { useTranslation, type Language } from "@/lib/i18n"
import { themeService } from "@/lib/theme"
import { currencyService, type Currency } from "@/lib/currency"

export default function MysteryBoxStore() {
  const [cartItems, setCartItems] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("INR")
  const { toast } = useToast()
  const { t } = useTranslation(currentLanguage)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Initialize theme
    themeService.initTheme()

    // Initialize language
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setCurrentLanguage(savedLanguage)

    // Initialize currency
    const userCurrency = currencyService.getUserCurrency()
    setCurrentCurrency(userCurrency)

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrentCurrency(event.detail)
    }

    window.addEventListener("currencyChange", handleCurrencyChange as EventListener)

    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange as EventListener)
    }
  }, [])

  // Load cart count from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartItems(totalItems)
    }
  }, [])

  const addToCart = (box: any) => {
    const savedCart = localStorage.getItem("cart")
    const cart = savedCart ? JSON.parse(savedCart) : []

    const existingItem = cart.find((item: any) => item.id === box.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...box, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    setCartItems(totalItems)

    toast({
      title: "Added to Cart!",
      description: `${box.name} has been added to your cart.`,
    })
  }

  const handleSignOut = async () => {
    await authService.signOut()
    setUser(null)
    setCartItems(0)
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    })
  }

  const mysteryBoxes = [
    {
      id: 1,
      name: "Gaming Legends Box",
      price: 3999.99,
      originalValue: 12000,
      category: "gaming",
      image: "/legend.png",
      description: "Epic gaming gear and collectibles",
      items: "5-7 items",
      rating: 4.8,
      reviews: 234,
      popular: true,
    },
    {
      id: 2,
      name: "Tech Innovator Box",
      price: 6399.99,
      originalValue: 16000,
      category: "tech",
      image: "/tech.png",
      description: "Latest gadgets and tech accessories",
      items: "4-6 items",
      rating: 4.9,
      reviews: 189,
      popular: false,
    },
    {
      id: 3,
      name: "Lifestyle Essentials Box",
      price: 2799.99,
      originalValue: 8000,
      category: "lifestyle",
      image: "/Lifestyle.png",
      description: "Curated lifestyle and wellness items",
      items: "6-8 items",
      rating: 4.7,
      reviews: 156,
      popular: false,
    },
    {
      id: 4,
      name: "Collector's Rare Box",
      price: 10399.99,
      originalValue: 32000,
      category: "collectibles",
      image: "/Collector.png",
      description: "Rare finds and limited edition items",
      items: "3-5 items",
      rating: 4.9,
      reviews: 98,
      popular: true,
    },
    {
      id: 5,
      name: "Fitness Power Box",
      price: 4799.99,
      originalValue: 14400,
      category: "fitness",
      image: "/Fitness.png",
      description: "Premium fitness and workout gear",
      items: "4-7 items",
      rating: 4.6,
      reviews: 203,
      popular: false,
    },
    {
      id: 6,
      name: "Artisan Craft Box",
      price: 3599.99,
      originalValue: 9600,
      category: "crafts",
      image: "/artisan.png",
      description: "Handcrafted items from local artisans",
      items: "5-8 items",
      rating: 4.8,
      reviews: 167,
      popular: false,
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredBoxes =
    selectedCategory === "all" ? mysteryBoxes : mysteryBoxes.filter((box) => box.category === selectedCategory)

  const formatPrice = (priceInINR: number, originalValueInINR: number) => {
    return currencyService.formatPriceWithOriginal(priceInINR, originalValueInINR, currentCurrency)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">{t("mysteryVault")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* My Account Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 border-white/10 backdrop-blur-sm">
                  <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                    <Link href="/myaccount/profile" className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-2" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                    <Link href="/myaccount/orders" className="flex items-center">
                      <Package2 className="h-4 w-4 mr-2" />
                      {t("orders")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                    <Link href="/myaccount/coupons" className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2" />
                      {t("coupons")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                    <Link href="/myaccount/help" className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t("help")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                >
                  <Link href="/auth/signin">{t("signIn")}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Link href="/auth/signup">{t("signUp")}</Link>
                </Button>
              </div>
            )}

            {/* Shopping Cart */}
            <Button
              asChild
              variant="outline"
              className="relative border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
            >
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("cart")}
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    {cartItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t("unlockUnknown")}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">{t("storeTagline")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-green-400">50,000+ Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400">Premium Quality Items</span>
              </div>
            </div>
            {/* Currency Display */}
            <div className="text-center mb-4">
              <span className="text-gray-300 text-sm">
                Prices shown in {currencyService.getCurrencyInfo(currentCurrency).name}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-black/20 border border-white/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All
              </TabsTrigger>
              <TabsTrigger value="gaming" className="data-[state=active]:bg-purple-600">
                Gaming
              </TabsTrigger>
              <TabsTrigger value="tech" className="data-[state=active]:bg-purple-600">
                Tech
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="data-[state=active]:bg-purple-600">
                Lifestyle
              </TabsTrigger>
              <TabsTrigger value="collectibles" className="data-[state=active]:bg-purple-600">
                Collectibles
              </TabsTrigger>
              <TabsTrigger value="fitness" className="data-[state=active]:bg-purple-600">
                Fitness
              </TabsTrigger>
              <TabsTrigger value="crafts" className="data-[state=active]:bg-purple-600">
                Crafts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Mystery Boxes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBoxes.map((box) => {
              const pricing = formatPrice(box.price, box.originalValue)
              return (
                <Card
                  key={box.id}
                  className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 group"
                >
                  <CardHeader className="relative">
                    {box.popular && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <img
                        src={box.image || "/mystery.png"}
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardTitle className="text-white text-xl">{box.name}</CardTitle>
                    <CardDescription className="text-gray-300">{box.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium">{box.rating}</span>
                        <span className="text-gray-400">({box.reviews})</span>
                      </div>
                      <Badge variant="outline" className="border-green-400 text-green-400">
                        {box.items}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">{pricing.price}</span>
                        <span className="text-sm text-gray-400 line-through">{pricing.originalValue}</span>
                      </div>
                      <div className="text-sm text-green-400">Save up to {pricing.savings}%</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => addToCart(box)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {t("addToCart")}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Why Choose MysteryVault?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Curated Quality</h4>
              <p className="text-gray-300">
                Every item is hand-picked by our experts to ensure premium quality and value.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Surprise & Delight</h4>
              <p className="text-gray-300">
                Experience the joy of unboxing something unexpected and amazing every time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Money-Back Guarantee</h4>
              <p className="text-gray-300">Not satisfied? We offer a 30-day money-back guarantee on all purchases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">{t("mysteryVault")}</span>
              </div>
              <p className="text-gray-400">Discover the extraordinary in every box.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Gaming</li>
                <li>Technology</li>
                <li>Lifestyle</li>
                <li>Collectibles</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/myaccount/help" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/myaccount/help" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/myaccount/help" className="hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/myaccount/help" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Newsletter</li>
                <li>Social Media</li>
                <li>Reviews</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MysteryVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
