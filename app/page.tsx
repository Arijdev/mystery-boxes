"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Star,
  Gift,
  Zap,
  Heart,
  Sparkles,
  Package,
  Users,
  Shield,
  User,
  UserCircle,
  Package2,
  Ticket,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) {
          setUser(null)
          return
        }
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching current user:", error)
        setUser(null)
      }
    }
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    themeService.initTheme()

    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setCurrentLanguage(savedLanguage)
    
    const userCurrency = currencyService.getUserCurrency()
    setCurrentCurrency(userCurrency)
    const handleCurrencyChange = (event: CustomEvent) => setCurrentCurrency(event.detail)
    window.addEventListener("currencyChange", handleCurrencyChange as EventListener)
    return () => window.removeEventListener("currencyChange", handleCurrencyChange as EventListener)
  }, [])


  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const res = await fetch("/api/cart", { credentials: "include" })
          const data = await res.json()
          const cartItems = data.cartItems || []
          const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartItems(totalItems)
        } catch (error) {
          console.error("Failed to load cart from server", error)
        }
      }
      fetchCart()
    } else {
      setCartItems(0)
    }
  }, [user])

  const addToCart = async (box: any) => {
    if (!user) {
      toast({ 
        title: "Sign In Required", 
        description: "Please sign in to add items to your cart.",
        variant: "destructive"
      })
      return
    }

    try {
      const cartItem = {
        id: box.id,
        name: box.name,
        description: box.description,
        image: box.image,
        items: box.items,
        price: box.price,
        quantity: 1,
      }
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: [cartItem] }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add to cart")
      }
      const data = await res.json()
      const cartItems = data.cartItems || []
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartItems(totalItems)

      toast({ title: "Added to Cart!", description: `${box.name} has been added to your cart.` })
    } catch (error) {
      console.error("Failed to add item to cart", error)
      toast({ 
        title: "Error", 
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      })
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    document.body.style.overflow = 'unset'
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleSignOut = async () => {
    await authService.signOut()
    setUser(null)
    setCartItems(0)
    toast({ title: "Signed Out", description: "You have been signed out successfully." })
    closeMobileMenu()
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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">MysteryVault</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span className="max-w-[100px] truncate">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-black/90 border-white/10 backdrop-blur-sm">
                      <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                        <Link href="/myaccount/profile" className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                        <Link href="/myaccount/orders" className="flex items-center">
                          <Package2 className="h-4 w-4 mr-2" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                        <Link href="/myaccount/coupons" className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2" />
                          Coupons
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                        <Link href="/myaccount/help" className="flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">
                        <Link href="/settings" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20 cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    asChild
                    variant="outline"
                    className="relative border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                  >
                    <Link href="/cart" className="flex items-center relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {cartItems > 0 && (
                        <Badge className="absolute -top-2 -right-3 h-5 w-5 text-xs bg-red-500 flex items-center justify-center">
                          {cartItems}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Cart for signed-in users on mobile */}
              {user && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="relative border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent p-2"
                >
                  <Link href="/cart" className="flex items-center relative">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 text-xs bg-red-500 flex items-center justify-center">
                        {cartItems > 9 ? '9+' : cartItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}

              {/* Menu Button */}
              <button
                className="p-2 rounded text-purple-400 hover:bg-black/30"
                onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-black/95 backdrop-blur-md border-l border-white/20 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-semibold text-white">Menu</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!user ? (
                <div className="space-y-4">
                  <Link 
                    href="/auth/signin" 
                    onClick={closeMobileMenu}
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent text-base"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    onClick={closeMobileMenu}
                    className="block w-full"
                  >
                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-400/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{user.name}</p>
                        <p className="text-purple-200 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Link
                      href="/myaccount/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all"
                    >
                      <UserCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">Profile</span>
                    </Link>

                    <Link
                      href="/myaccount/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all"
                    >
                      <Package2 className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">Orders</span>
                    </Link>

                    <Link
                      href="/myaccount/coupons"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all"
                    >
                      <Ticket className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">Coupons</span>
                    </Link>

                    <Link
                      href="/myaccount/help"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all"
                    >
                      <HelpCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">Help</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all"
                    >
                      <Settings className="h-5 w-5 text-purple-400" />
                      <span className="text-base font-medium">Settings</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/20" />

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 p-4 rounded-xl text-red-400 hover:bg-red-600/20 transition-all w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-base font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Unlock the Unknown
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-300 px-4">
              Discover amazing products in our curated mystery boxes. Every box is a new adventure!
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Users className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-green-400 text-sm sm:text-base text-center sm:text-left">50,000+ Happy Customers</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-blue-400 text-sm sm:text-base text-center sm:text-left">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span className="text-yellow-400 text-sm sm:text-base text-center sm:text-left">Premium Quality Items</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="text-gray-300 text-sm">
                Prices shown in Indian Rupee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="flex space-x-2 w-max min-w-full">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="gaming" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Gaming
                </TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Tech
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Lifestyle
                </TabsTrigger>
                <TabsTrigger value="collectibles" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Collectibles
                </TabsTrigger>
                <TabsTrigger value="fitness" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Fitness
                </TabsTrigger>
                <TabsTrigger value="crafts" className="data-[state=active]:bg-purple-600 whitespace-nowrap px-4 py-2">
                  Crafts
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Mystery Boxes Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBoxes.map((box) => {
              const pricing = formatPrice(box.price, box.originalValue)
              return (
                <Card
                  key={box.id}
                  className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/60 transition-all duration-300 group"
                >
                  <CardHeader className="relative p-4 sm:p-6">
                    {box.popular && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <img
                        src={box.image || "/mystery.png"}
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <CardTitle className="text-white text-lg sm:text-xl">{box.name}</CardTitle>
                    <CardDescription className="text-gray-300 text-sm">{box.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium text-sm">{box.rating}</span>
                        <span className="text-gray-400 text-sm">({box.reviews})</span>
                      </div>
                      <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                        {box.items}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-bold text-white">₹{box.price}</span>
                        <span className="text-sm text-gray-400 line-through">₹{box.originalValue}</span>
                      </div>
                      <div className="text-sm text-green-400">Save up to 67%</div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 sm:p-6 pt-0">
                    <Button
                      onClick={() => addToCart(box)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-12">Why Choose MysteryVault?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Curated Quality</h4>
              <p className="text-gray-300 text-sm sm:text-base">
                Every item is hand-picked by our experts to ensure premium quality and value.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Surprise & Delight</h4>
              <p className="text-gray-300 text-sm sm:text-base">
                Experience the joy of unboxing something unexpected and amazing every time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">Money-Back Guarantee</h4>
              <p className="text-gray-300 text-sm sm:text-base">Not satisfied? We offer a 30-day money-back guarantee on all purchases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">MysteryVault</span>
              </div>
              <p className="text-gray-400 text-sm">Discover the extraordinary in every box.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Gaming</li>
                <li>Technology</li>
                <li>Lifestyle</li>
                <li>Collectibles</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
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
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Newsletter</li>
                <li>Social Media</li>
                <li>Reviews</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p className="text-sm">&copy; 2024 MysteryVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
