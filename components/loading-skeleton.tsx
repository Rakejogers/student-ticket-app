import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TicketSkeleton() {
  return (
    <Card className="border bg-card rounded-t-lg border-t border-border">
      <CardHeader className="p-4 bg-muted border border-border rounded-t-lg">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="h-15 bg-card p-5 border border-border border-b-0 border-t-0">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-card rounded-b-lg border border-border border-t-0">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </CardFooter>
    </Card>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <TicketSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}