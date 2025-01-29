'use client'

import { ThemeProvider } from "@/components/theme-provider"
import PageTheme from '@/components/layout-theme'
import { ClientLayout } from '@/components/client-layout'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next'

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(Cookies.get('theme') || 'system')

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    Cookies.set('theme', newTheme)
  }

  // Initialize theme from cookie on mount
  useEffect(() => {
    const savedTheme = Cookies.get('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PageTheme theme={theme}>
        <div className="min-h-screen flex flex-col">
          <ClientLayout theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </div>
      </PageTheme>
    </ThemeProvider>
  )
} 