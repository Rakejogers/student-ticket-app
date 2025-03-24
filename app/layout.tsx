import { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import { OffSeasonBanner } from '@/components/OffSeasonBanner'
import { config } from '@/lib/config'
import "./globals.css"

export const metadata: Metadata = {
  title: 'Scholar Seats',
  description: 'Buy and sell student tickets for events',
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