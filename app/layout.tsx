import { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
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
          {children}
        </Providers>
      </body>
    </html>
  )
}