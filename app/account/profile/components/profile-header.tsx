import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordModel } from "pocketbase"
import { Star, Ticket } from "lucide-react"

interface ProfileHeaderProps {
  user: RecordModel
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar ? `https://pocketbase.scholarseats.com/api/files/users/${user.id}/${user.avatar}` : ''} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          <CardDescription className="text-xl">{user.email}</CardDescription>
        </div>
        <div className="flex items-center space-x-8 text-lg text-muted-foreground">
          <div className="flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Tickets Sold:</span>
            <span className="ml-1">{user.tickets_sold || 0}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Rating:</span>
            <span className="ml-1">{user.tickets_sold < 3 ? 'N/A' : `${user.seller_rating?.toFixed(0)}%`}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

