// Currency conversion and formatting service
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD"

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  rate: number // Rate relative to INR
}

// Updated exchange rates (as of 2024)
export const currencies: Record<Currency, CurrencyInfo> = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.011 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0095 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 1.8 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.018 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 0.016 },
}

export const currencyService = {
  // Convert amount from INR to target currency
  convertFromINR: (amount: number, targetCurrency: Currency): number => {
    if (targetCurrency === "INR") return amount
    const rate = currencies[targetCurrency].rate
    return amount * rate
  },

  // Convert amount from source currency to INR
  convertToINR: (amount: number, sourceCurrency: Currency): number => {
    if (sourceCurrency === "INR") return amount
    const rate = currencies[sourceCurrency].rate
    return amount / rate
  },

  // Convert between any two currencies
  convert: (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount

    // Convert to INR first, then to target currency
    const inrAmount = fromCurrency === "INR" ? amount : currencyService.convertToINR(amount, fromCurrency)
    return toCurrency === "INR" ? inrAmount : currencyService.convertFromINR(inrAmount, toCurrency)
  },

  // Format amount with currency symbol and proper locale
  formatAmount: (amountInINR: number, targetCurrency: Currency = "INR"): string => {
    const currencyInfo = currencies[targetCurrency]
    const convertedAmount = currencyService.convertFromINR(amountInINR, targetCurrency)

    // Special formatting for different currencies
    switch (targetCurrency) {
      case "JPY":
        return `${currencyInfo.symbol}${Math.round(convertedAmount).toLocaleString("ja-JP")}`
      case "INR":
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
      case "USD":
      case "CAD":
      case "AUD":
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "EUR":
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "GBP":
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      default:
        return `${currencyInfo.symbol}${convertedAmount.toFixed(2)}`
    }
  },

  // Format price with original value comparison
  formatPriceWithOriginal: (priceInINR: number, originalValueInINR: number, targetCurrency: Currency = "INR") => {
    const formattedPrice = currencyService.formatAmount(priceInINR, targetCurrency)
    const formattedOriginal = currencyService.formatAmount(originalValueInINR, targetCurrency)
    return {
      price: formattedPrice,
      originalValue: `Up to ${formattedOriginal}`,
      savings: Math.round((1 - priceInINR / originalValueInINR) * 100),
    }
  },

  // Get currency info
  getCurrencyInfo: (currency: Currency): CurrencyInfo => {
    return currencies[currency]
  },

  // Get all available currencies
  getAllCurrencies: (): CurrencyInfo[] => {
    return Object.values(currencies)
  },

  // Get user's preferred currency from localStorage or user profile
  getUserCurrency: (): Currency => {
    if (typeof window === "undefined") return "INR"

    // Try to get from user profile first
    const userData = localStorage.getItem("auth_user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.preferences?.currency) {
        return user.preferences.currency as Currency
      }
    }

    // Fallback to stored preference
    return (localStorage.getItem("preferred_currency") as Currency) || "INR"
  },

  // Set user's preferred currency
  setUserCurrency: (currency: Currency) => {
    localStorage.setItem("preferred_currency", currency)

    // Also update user profile if logged in
    const userData = localStorage.getItem("auth_user")
    if (userData) {
      const user = JSON.parse(userData)
      user.preferences = user.preferences || {}
      user.preferences.currency = currency
      localStorage.setItem("auth_user", JSON.stringify(user))
    }

    // Dispatch event for components to update
    window.dispatchEvent(new CustomEvent("currencyChange", { detail: currency }))
  },

  // Update exchange rates (in production, fetch from API)
  updateRates: async (): Promise<void> => {
    try {
      // In production, fetch real-time rates from an API
      console.log("Currency rates updated (simulated)")
    } catch (error) {
      console.error("Failed to update currency rates:", error)
    }
  },
}

// Initialize currency service
if (typeof window !== "undefined") {
  // Update rates on app start (in production)
  // currencyService.updateRates()
}
