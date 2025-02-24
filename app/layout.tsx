import { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
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
          {children}
        </Providers>
      </body>
    </html>
  )
}
