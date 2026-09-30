import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SunsetPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Scholar Seats is being sunset</CardTitle>
          <CardDescription>Thank you for being part of it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This project is no longer accepting new accounts and is winding down. We&apos;re
            grateful to everyone who bought, sold, and helped build this community at UK.
            Thank you for your support!
          </p>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
