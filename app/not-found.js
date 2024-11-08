import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertTriangle className="mx-auto h-24 w-24 text-yellow-500" />
        <h1 className="mt-6 text-4xl font-extrabold text-primary">404</h1>
        <p className="mt-2 text-3xl font-bold text-secondary-foreground">Page Not Found</p>
        <p className="mt-2 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          If you believe this is an error, please{" "}
          <Link href="/contact" className="font-medium text-primary hover:text-primary/80">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  )
}