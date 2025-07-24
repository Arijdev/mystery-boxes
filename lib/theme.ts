"use client"

// Theme management system
export type Theme = "light" | "dark" | "system"

export const themeService = {
  getTheme: (): Theme => {
    if (typeof window === "undefined") return "dark"
    return (localStorage.getItem("theme") as Theme) || "dark"
  },

  setTheme: (theme: Theme) => {
    localStorage.setItem("theme", theme)
    applyTheme(theme)

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }))
  },

  initTheme: () => {
    const theme = themeService.getTheme()
    applyTheme(theme)

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", () => {
        if (themeService.getTheme() === "system") {
          applyTheme("system")
        }
      })
    }
  },

  // Get current effective theme (resolves system to actual theme)
  getEffectiveTheme: (): "light" | "dark" => {
    const theme = themeService.getTheme()
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  },
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  const body = document.body

  // Remove existing theme classes
  root.classList.remove("light", "dark")
  body.classList.remove("light", "dark")

  let effectiveTheme: "light" | "dark"

  if (theme === "system") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  } else {
    effectiveTheme = theme
  }

  // Apply theme classes
  root.classList.add(effectiveTheme)
  body.classList.add(effectiveTheme)
  root.setAttribute("data-theme", effectiveTheme)

  // Update CSS custom properties for smooth transitions
  if (effectiveTheme === "light") {
    root.style.setProperty("--bg-primary", "255 255 255")
    root.style.setProperty("--bg-secondary", "248 250 252")
    root.style.setProperty("--bg-card", "255 255 255")
    root.style.setProperty("--text-primary", "15 23 42")
    root.style.setProperty("--text-secondary", "71 85 105")
    root.style.setProperty("--text-muted", "100 116 139")
    root.style.setProperty("--border-color", "226 232 240")
    root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")
  } else {
    root.style.setProperty("--bg-primary", "15 23 42")
    root.style.setProperty("--bg-secondary", "30 41 59")
    root.style.setProperty("--bg-card", "30 41 59")
    root.style.setProperty("--text-primary", "248 250 252")
    root.style.setProperty("--text-secondary", "203 213 225")
    root.style.setProperty("--text-muted", "148 163 184")
    root.style.setProperty("--border-color", "51 65 85")
    root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")
  }
}

// Theme hook for React components
export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    // Initialize theme
    const currentTheme = themeService.getTheme()
    setThemeState(currentTheme)
    setEffectiveTheme(themeService.getEffectiveTheme())
    themeService.initTheme()

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setThemeState(event.detail)
      setEffectiveTheme(themeService.getEffectiveTheme())
    }

    window.addEventListener("themeChange", handleThemeChange as EventListener)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (themeService.getTheme() === "system") {
        setEffectiveTheme(themeService.getEffectiveTheme())
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      window.removeEventListener("themeChange", handleThemeChange as EventListener)
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    themeService.setTheme(newTheme)
  }

  return {
    theme,
    effectiveTheme,
    setTheme,
    isLight: effectiveTheme === "light",
    isDark: effectiveTheme === "dark",
  }
}

// Import useState for the hook
import { useState, useEffect } from "react"
