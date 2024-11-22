import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordModel } from "pocketbase"

interface ProfileHeaderProps {
  user: RecordModel
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar ? `https://your-pb-url.com/api/files/users/${user.id}/${user.avatar}` : ''} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
          <CardDescription className="text-xl">{user.email}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

