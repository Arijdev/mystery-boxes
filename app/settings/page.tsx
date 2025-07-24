"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  Monitor,
  Sun,
  Moon,
  Globe,
  Clock,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"
import { useTranslation, type Language, languages } from "@/lib/i18n"
import { themeService, type Theme } from "@/lib/theme"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark")
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useTranslation(currentLanguage)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    newProducts: true,
    promotions: false,
    newsletter: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "dark" as Theme,
    language: "en" as Language,
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    autoLogout: "60",
  })

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    // Initialize theme
    const savedTheme = themeService.getTheme()
    setCurrentTheme(savedTheme)
    themeService.initTheme()

    // Initialize language
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setCurrentLanguage(savedLanguage)

    setUser(currentUser)
    setProfileData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      city: currentUser.city || "",
      state: currentUser.state || "",
      pincode: currentUser.pincode || "",
      landmark: currentUser.landmark || "",
    })

    if (currentUser.preferences) {
      setNotificationSettings({
        emailNotifications: currentUser.preferences.emailNotifications ?? true,
        smsNotifications: currentUser.preferences.smsNotifications ?? true,
        pushNotifications: currentUser.preferences.pushNotifications ?? false,
        marketingEmails: currentUser.preferences.marketingEmails ?? false,
        orderUpdates: currentUser.preferences.orderUpdates ?? true,
        newProducts: currentUser.preferences.newProducts ?? true,
        promotions: currentUser.preferences.promotions ?? false,
        newsletter: currentUser.preferences.newsletter ?? false,
      })

      setPreferences({
        theme: currentUser.preferences.theme || "dark",
        language: currentUser.preferences.language || "en",
        currency: currentUser.preferences.currency || "INR",
        timezone: currentUser.preferences.timezone || "Asia/Kolkata",
        dateFormat: currentUser.preferences.dateFormat || "DD/MM/YYYY",
        autoLogout: currentUser.preferences.autoLogout || "60",
      })
    }

    setLoading(false)
  }, [router])

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: boolean | string) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))

    if (field === "theme") {
      const theme = value as Theme
      setCurrentTheme(theme)
      themeService.setTheme(theme)
    }

    if (field === "language") {
      const language = value as Language
      setCurrentLanguage(language)
      localStorage.setItem("language", language)
    }
  }

  const saveProfile = async () => {
    if (!user) return

    // Validation
    if (!profileData.name || !profileData.email || !profileData.phone) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const result = await authService.updateProfile(user.id, {
        ...profileData,
        preferences: {
          ...user.preferences,
          ...notificationSettings,
          ...securitySettings,
          ...preferences,
        },
      })

      if (result.success && result.user) {
        setUser(result.user)
        toast({
          title: t("success"),
          description: t("profileUpdated"),
        })
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (!user) return

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: t("error"),
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: t("error"),
        description: t("weakPassword"),
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordMismatch"),
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const result = await authService.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword)

      if (result.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setShowPasswordDialog(false)
        toast({
          title: t("success"),
          description: t("passwordChanged"),
        })
      } else {
        throw new Error(result.error || "Failed to change password")
      }
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    if (!user) return

    if (!deletePassword) {
      toast({
        title: t("error"),
        description: "Please enter your password to delete your account.",
        variant: "destructive",
      })
      return
    }

    setDeleting(true)

    try {
      const result = await authService.deleteAccount(user.id, deletePassword)

      if (result.success) {
        toast({
          title: t("success"),
          description: "Your account has been deleted successfully.",
        })
        router.push("/")
      } else {
        throw new Error(result.error || "Failed to delete account")
      }
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const menuItems = [
    { id: "profile", label: t("profileInfo"), icon: User },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "security", label: t("security"), icon: Shield },
    { id: "preferences", label: t("preferences"), icon: Palette },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">{t("mysteryVault")}</h1>
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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{t("accountSettings")}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? "bg-purple-600 text-white"
                              : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {t("profileInfo")}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          {t("fullName")} *
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange("name", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          {t("email")} *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">
                          {t("phone")} *
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode" className="text-white">
                          {t("pincode")}
                        </Label>
                        <Input
                          id="pincode"
                          value={profileData.pincode}
                          onChange={(e) => handleProfileChange("pincode", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">
                        {t("address")}
                      </Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleProfileChange("address", e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">
                          {t("city")}
                        </Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => handleProfileChange("city", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">
                          {t("state")}
                        </Label>
                        <Input
                          id="state"
                          value={profileData.state}
                          onChange={(e) => handleProfileChange("state", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landmark" className="text-white">
                          {t("landmark")}
                        </Label>
                        <Input
                          id="landmark"
                          value={profileData.landmark}
                          onChange={(e) => handleProfileChange("landmark", e.target.value)}
                          className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      {t("notifications")}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Communication Preferences</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("emailNotifications")}</div>
                          <div className="text-gray-400 text-sm">{t("emailNotificationsDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("smsNotifications")}</div>
                          <div className="text-gray-400 text-sm">{t("smsNotificationsDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("pushNotifications")}</div>
                          <div className="text-gray-400 text-sm">{t("pushNotificationsDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Content Preferences</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("orderUpdates")}</div>
                          <div className="text-gray-400 text-sm">{t("orderUpdatesDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.orderUpdates}
                          onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("newProducts")}</div>
                          <div className="text-gray-400 text-sm">{t("newProductsDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.newProducts}
                          onCheckedChange={(checked) => handleNotificationChange("newProducts", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("marketingEmails")}</div>
                          <div className="text-gray-400 text-sm">{t("marketingEmailsDesc")}</div>
                        </div>
                        <Switch
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Promotions & Offers</div>
                          <div className="text-gray-400 text-sm">Get notified about special deals and discounts</div>
                        </div>
                        <Switch
                          checked={notificationSettings.promotions}
                          onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Newsletter</div>
                          <div className="text-gray-400 text-sm">Receive our weekly newsletter with updates</div>
                        </div>
                        <Switch
                          checked={notificationSettings.newsletter}
                          onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        {t("security")}
                      </CardTitle>
                      <CardDescription className="text-gray-300">Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("password")}</div>
                          <div className="text-gray-400 text-sm">Last changed 30 days ago</div>
                        </div>
                        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent"
                            >
                              {t("changePassword")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/90 border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle>{t("changePassword")}</DialogTitle>
                              <DialogDescription className="text-gray-300">
                                Enter your current password and choose a new one
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-white">
                                  {t("currentPassword")}
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                    className="pr-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                  >
                                    {showPasswords.current ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-white">
                                  {t("newPassword")}
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                    className="pr-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                  >
                                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">
                                  {t("confirmPassword")}
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                    className="pr-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                  >
                                    {showPasswords.confirm ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setShowPasswordDialog(false)}
                                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent"
                              >
                                {t("cancel")}
                              </Button>
                              <Button
                                onClick={changePassword}
                                disabled={saving}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {saving ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Changing...
                                  </>
                                ) : (
                                  t("changePassword")
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{t("twoFactorAuth")}</div>
                          <div className="text-gray-400 text-sm">{t("twoFactorAuthDesc")}</div>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Login Alerts</div>
                          <div className="text-gray-400 text-sm">Get notified of new login attempts</div>
                        </div>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Password Expiry</div>
                          <div className="text-gray-400 text-sm">Require password change every 90 days</div>
                        </div>
                        <Switch
                          checked={securitySettings.passwordExpiry}
                          onCheckedChange={(checked) => handleSecurityChange("passwordExpiry", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Session Timeout</div>
                          <div className="text-gray-400 text-sm">Automatically log out after inactivity</div>
                        </div>
                        <Select
                          value={securitySettings.sessionTimeout}
                          onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                        >
                          <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">{t("loginHistory")}</CardTitle>
                      <CardDescription className="text-gray-300">{t("loginHistoryDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            device: "Chrome on Windows",
                            location: "Mumbai, India",
                            time: "2 hours ago",
                            current: true,
                          },
                          { device: "Safari on iPhone", location: "Mumbai, India", time: "1 day ago", current: false },
                          { device: "Chrome on Android", location: "Delhi, India", time: "3 days ago", current: false },
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <Monitor className="h-5 w-5 text-purple-400" />
                              </div>
                              <div>
                                <div className="text-white font-medium">{session.device}</div>
                                <div className="text-gray-400 text-sm">
                                  {session.location} • {session.time}
                                </div>
                              </div>
                            </div>
                            {session.current && (
                              <div className="text-green-400 text-sm font-medium">Current Session</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      {t("preferences")}
                    </CardTitle>
                    <CardDescription className="text-gray-300">Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium flex items-center">
                          {currentTheme === "light" ? (
                            <Sun className="h-4 w-4 mr-2" />
                          ) : currentTheme === "dark" ? (
                            <Moon className="h-4 w-4 mr-2" />
                          ) : (
                            <Monitor className="h-4 w-4 mr-2" />
                          )}
                          {t("theme")}
                        </div>
                        <div className="text-gray-400 text-sm">{t("themeDesc")}</div>
                      </div>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value) => handlePreferenceChange("theme", value)}
                      >
                        <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="light">{t("light")}</SelectItem>
                          <SelectItem value="dark">{t("dark")}</SelectItem>
                          <SelectItem value="system">{t("system")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          {t("language")}
                        </div>
                        <div className="text-gray-400 text-sm">{t("languageDesc")}</div>
                      </div>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          {Object.entries(languages).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {t("currency")}
                        </div>
                        <div className="text-gray-400 text-sm">{t("currencyDesc")}</div>
                      </div>
                      <Select
                        value={preferences.currency}
                        onValueChange={(value) => handlePreferenceChange("currency", value)}
                      >
                        <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="INR">₹ INR</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                          <SelectItem value="GBP">£ GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {t("timezone")}
                        </div>
                        <div className="text-gray-400 text-sm">{t("timezoneDesc")}</div>
                      </div>
                      <Select
                        value={preferences.timezone}
                        onValueChange={(value) => handlePreferenceChange("timezone", value)}
                      >
                        <SelectTrigger className="w-40 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Date Format</div>
                        <div className="text-gray-400 text-sm">Choose your preferred date format</div>
                      </div>
                      <Select
                        value={preferences.dateFormat}
                        onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                      >
                        <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Auto Logout</div>
                        <div className="text-gray-400 text-sm">Automatically sign out after inactivity</div>
                      </div>
                      <Select
                        value={preferences.autoLogout}
                        onValueChange={(value) => handlePreferenceChange("autoLogout", value)}
                      >
                        <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Danger Zone */}
              <Card className="bg-black/40 border-red-600/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-gray-300">Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Delete Account</div>
                      <div className="text-gray-400 text-sm">
                        Permanently delete your account and all associated data
                      </div>
                    </div>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("delete")} Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-red-400 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Delete Account
                          </DialogTitle>
                          <DialogDescription className="text-gray-300">
                            This action cannot be undone. This will permanently delete your account and remove all
                            associated data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                            <div className="text-red-400 font-medium mb-2">This will delete:</div>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>• Your profile and account information</li>
                              <li>• Order history and tracking data</li>
                              <li>• Saved addresses and payment methods</li>
                              <li>• Coupons and loyalty points</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deletePassword" className="text-white">
                              Enter your password to confirm
                            </Label>
                            <Input
                              id="deletePassword"
                              type="password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                              placeholder="Enter your password"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowDeleteDialog(false)
                              setDeletePassword("")
                            }}
                            className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent"
                          >
                            {t("cancel")}
                          </Button>
                          <Button onClick={deleteAccount} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                            {deleting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Account"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    t("save")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
