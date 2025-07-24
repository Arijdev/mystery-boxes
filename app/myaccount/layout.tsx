"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, UserCircle, Package2, Ticket, HelpCircle, ArrowLeft } from "lucide-react"

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/myaccount/profile", label: "Profile", icon: UserCircle },
    { href: "/myaccount/orders", label: "Orders", icon: Package2 },
    { href: "/myaccount/coupons", label: "Coupons", icon: Ticket },
    { href: "/myaccount/help", label: "Help Center", icon: HelpCircle },
  ]

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
              Back to Store
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">My Account</h2>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
