import { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import { OffSeasonBanner } from '@/components/OffSeasonBanner'
import { config } from '@/lib/config'
import "./globals.css"

export const metadata: Metadata = {
  title: 'Scholar Seats',
  description: 'Buy and sell University of Kentucky student tickets easily with Scholar Seats. Get great deals on football, basketball, and other UK events. Secure, fast, and student-friendly ticket exchange. Join now!',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <OffSeasonBanner isEnabled={config.isOffSeason} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
