import { Button } from "@/components/ui/button"
import pb from '@/app/pocketbase'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const router = useRouter();

  const oauthLogin = async () => {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
    console.log(authData)
    if(authData.meta?.isNew){
      router.push("/onboarding")
    } else{
      router.push("/browse/events")
    }
  }

  return (
    <Button variant="default" size="sm" onClick={oauthLogin}>
      Login
    </Button>
  )
} 