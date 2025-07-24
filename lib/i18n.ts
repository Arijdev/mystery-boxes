// Internationalization system
export type Language = "en" | "bn" | "hi"

export const languages = {
  en: "English",
  bn: "বাংলা",
  hi: "हिंदी",
}

export const translations = {
  en: {
    // Navigation
    home: "Home",
    profile: "Profile",
    orders: "Orders",
    coupons: "Coupons",
    help: "Help Center",
    settings: "Settings",
    signOut: "Sign Out",
    signIn: "Sign In",
    signUp: "Sign Up",

    // Common
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    success: "Success",
    error: "Error",

    // Settings
    accountSettings: "Account Settings",
    profileInfo: "Profile Information",
    notifications: "Notifications",
    security: "Security",
    preferences: "Preferences",

    // Profile
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Address",
    city: "City",
    state: "State",
    pincode: "PIN Code",
    landmark: "Landmark",

    // Notifications
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Receive order updates via email",
    smsNotifications: "SMS Notifications",
    smsNotificationsDesc: "Receive order updates via SMS",
    pushNotifications: "Push Notifications",
    pushNotificationsDesc: "Receive browser notifications",
    marketingEmails: "Marketing Emails",
    marketingEmailsDesc: "Receive promotional offers and news",
    orderUpdates: "Order Updates",
    orderUpdatesDesc: "Get notified about order status changes",
    newProducts: "New Products",
    newProductsDesc: "Be the first to know about new mystery boxes",

    // Security
    password: "Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    twoFactorAuthDesc: "Add an extra layer of security to your account",
    loginHistory: "Login History",
    loginHistoryDesc: "View your recent login activity",

    // Preferences
    theme: "Theme",
    themeDesc: "Choose your preferred theme",
    language: "Language",
    languageDesc: "Choose your preferred language",
    currency: "Currency",
    currencyDesc: "Choose your preferred currency",
    timezone: "Timezone",
    timezoneDesc: "Set your local timezone",

    // Theme options
    light: "Light",
    dark: "Dark",
    system: "System",

    // Messages
    profileUpdated: "Profile updated successfully",
    passwordChanged: "Password changed successfully",
    settingsSaved: "Settings saved successfully",
    invalidPassword: "Current password is incorrect",
    passwordMismatch: "Passwords do not match",
    weakPassword: "Password must be at least 6 characters long",

    // Store
    mysteryVault: "MysteryVault",
    unlockUnknown: "Unlock the Unknown",
    storeTagline: "Discover amazing products in our curated mystery boxes. Every box is a new adventure!",
    addToCart: "Add to Cart",
    cart: "Cart",

    // Auth
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    enterCredentials: "Enter your credentials to access your account",
    joinUs: "Join us and start your mystery box adventure",
  },

  bn: {
    // Navigation
    home: "হোম",
    profile: "প্রোফাইল",
    orders: "অর্ডার",
    coupons: "কুপন",
    help: "সহায়তা কেন্দ্র",
    settings: "সেটিংস",
    signOut: "সাইন আউট",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",

    // Common
    save: "পরিবর্তন সংরক্ষণ করুন",
    cancel: "বাতিল",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    loading: "লোড হচ্ছে...",
    success: "সফল",
    error: "ত্রুটি",

    // Settings
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    profileInfo: "প্রোফাইল তথ্য",
    notifications: "বিজ্ঞপ্তি",
    security: "নিরাপত্তা",
    preferences: "পছন্দসমূহ",

    // Profile
    fullName: "পূর্ণ নাম",
    email: "ইমেইল ঠিকানা",
    phone: "ফোন নম্বর",
    address: "ঠিকানা",
    city: "শহর",
    state: "রাজ্য",
    pincode: "পিন কোড",
    landmark: "ল্যান্ডমার্ক",

    // Notifications
    emailNotifications: "ইমেইল বিজ্ঞপ্তি",
    emailNotificationsDesc: "ইমেইলের মাধ্যমে অর্ডার আপডেট পান",
    smsNotifications: "এসএমএস বিজ্ঞপ্তি",
    smsNotificationsDesc: "এসএমএসের মাধ্যমে অর্ডার আপডেট পান",
    pushNotifications: "পুশ বিজ্ঞপ্তি",
    pushNotificationsDesc: "ব্রাউজার বিজ্ঞপ্তি পান",
    marketingEmails: "মার্কেটিং ইমেইল",
    marketingEmailsDesc: "প্রচারমূলক অফার এবং সংবাদ পান",
    orderUpdates: "অর্ডার আপডেট",
    orderUpdatesDesc: "অর্ডার স্ট্যাটাস পরিবর্তনের বিজ্ঞপ্তি পান",
    newProducts: "নতুন পণ্য",
    newProductsDesc: "নতুন মিস্ট্রি বক্স সম্পর্কে প্রথম জানুন",

    // Security
    password: "পাসওয়ার্ড",
    currentPassword: "বর্তমান পাসওয়ার্ড",
    newPassword: "নতুন পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
    twoFactorAuth: "দ্বি-ফ্যাক্টর প্রমাণীকরণ",
    twoFactorAuthDesc: "আপনার অ্যাকাউন্টে অতিরিক্ত নিরাপত্তা যোগ করুন",
    loginHistory: "লগইন ইতিহাস",
    loginHistoryDesc: "আপনার সাম্প্রতিক লগইন কার্যকলাপ দেখুন",

    // Preferences
    theme: "থিম",
    themeDesc: "আপনার পছন্দের থিম বেছে নিন",
    language: "ভাষা",
    languageDesc: "আপনার পছন্দের ভাষা বেছে নিন",
    currency: "মুদ্রা",
    currencyDesc: "আপনার পছন্দের মুদ্রা বেছে নিন",
    timezone: "সময় অঞ্চল",
    timezoneDesc: "আপনার স্থানীয় সময় অঞ্চল সেট করুন",

    // Theme options
    light: "হালকা",
    dark: "অন্ধকার",
    system: "সিস্টেম",

    // Messages
    profileUpdated: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
    passwordChanged: "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে",
    settingsSaved: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে",
    invalidPassword: "বর্তমান পাসওয়ার্ড ভুল",
    passwordMismatch: "পাসওয়ার্ড মিলছে না",
    weakPassword: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",

    // Store
    mysteryVault: "মিস্ট্রি ভল্ট",
    unlockUnknown: "অজানাকে আনলক করুন",
    storeTagline: "আমাদের কিউরেটেড মিস্ট্রি বক্সে আশ্চর্যজনক পণ্য আবিষ্কার করুন। প্রতিটি বক্স একটি নতুন অ্যাডভেঞ্চার!",
    addToCart: "কার্টে যোগ করুন",
    cart: "কার্ট",

    // Auth
    welcomeBack: "স্বাগতম",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    enterCredentials: "আপনার অ্যাকাউন্ট অ্যাক্সেস করতে আপনার পরিচয়পত্র লিখুন",
    joinUs: "আমাদের সাথে যোগ দিন এবং আপনার মিস্ট্রি বক্স অ্যাডভেঞ্চার শুরু করুন",
  },

  hi: {
    // Navigation
    home: "होम",
    profile: "प्रोफाइल",
    orders: "ऑर्डर",
    coupons: "कूपन",
    help: "सहायता केंद्र",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    signIn: "साइन इन",
    signUp: "साइन अप",

    // Common
    save: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    loading: "लोड हो रहा है...",
    success: "सफल",
    error: "त्रुटि",

    // Settings
    accountSettings: "खाता सेटिंग्स",
    profileInfo: "प्रोफाइल जानकारी",
    notifications: "सूचनाएं",
    security: "सुरक्षा",
    preferences: "प्राथमिकताएं",

    // Profile
    fullName: "पूरा नाम",
    email: "ईमेल पता",
    phone: "फोन नंबर",
    address: "पता",
    city: "शहर",
    state: "राज्य",
    pincode: "पिन कोड",
    landmark: "लैंडमार्क",

    // Notifications
    emailNotifications: "ईमेल सूचनाएं",
    emailNotificationsDesc: "ईमेल के माध्यम से ऑर्डर अपडेट प्राप्त करें",
    smsNotifications: "एसएमएस सूचनाएं",
    smsNotificationsDesc: "एसएमएस के माध्यम से ऑर्डर अपडेट प्राप्त करें",
    pushNotifications: "पुश सूचनाएं",
    pushNotificationsDesc: "ब्राउज़र सूचनाएं प्राप्त करें",
    marketingEmails: "मार्केटिंग ईमेल",
    marketingEmailsDesc: "प्रचारक ऑफर और समाचार प्राप्त करें",
    orderUpdates: "ऑर्डर अपडेट",
    orderUpdatesDesc: "ऑर्डर स्थिति परिवर्तन की सूचना प्राप्त करें",
    newProducts: "नए उत्पाद",
    newProductsDesc: "नए मिस्ट्री बॉक्स के बारे में पहले जानें",

    // Security
    password: "पासवर्ड",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    changePassword: "पासवर्ड बदलें",
    twoFactorAuth: "द्विकारक प्रमाणीकरण",
    twoFactorAuthDesc: "अपने खाते में अतिरिक्त सुरक्षा जोड़ें",
    loginHistory: "लॉगिन इतिहास",
    loginHistoryDesc: "अपनी हाल की लॉगिन गतिविधि देखें",

    // Preferences
    theme: "थीम",
    themeDesc: "अपनी पसंदीदा थीम चुनें",
    language: "भाषा",
    languageDesc: "अपनी पसंदीदा भाषा चुनें",
    currency: "मुद्रा",
    currencyDesc: "अपनी पसंदीदा मुद्रा चुनें",
    timezone: "समय क्षेत्र",
    timezoneDesc: "अपना स्थानीय समय क्षेत्र सेट करें",

    // Theme options
    light: "हल्का",
    dark: "गहरा",
    system: "सिस्टम",

    // Messages
    profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट हो गया",
    passwordChanged: "पासवर्ड सफलतापूर्वक बदल गया",
    settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं",
    invalidPassword: "वर्तमान पासवर्ड गलत है",
    passwordMismatch: "पासवर्ड मेल नहीं खाते",
    weakPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",

    // Store
    mysteryVault: "मिस्ट्री वॉल्ट",
    unlockUnknown: "अज्ञात को अनलॉक करें",
    storeTagline: "हमारे क्यूरेटेड मिस्ट्री बॉक्स में अद्भुत उत्पादों की खोज करें। हर बॉक्स एक नया रोमांच है!",
    addToCart: "कार्ट में जोड़ें",
    cart: "कार्ट",

    // Auth
    welcomeBack: "वापस स्वागत है",
    createAccount: "खाता बनाएं",
    enterCredentials: "अपने खाते तक पहुंचने के लिए अपनी साख दर्ज करें",
    joinUs: "हमसे जुड़ें और अपना मिस्ट्री बॉक्स एडवेंचर शुरू करें",
  },
}

export const useTranslation = (language: Language = "en") => {
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t }
}
