import { Button } from "@/components/ui/button"
import pb from '@/app/pocketbase'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast";

export default function LoginButton() {
  const router = useRouter();

  const oauthLogin = async () => {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
    console.log(authData)
    const email = authData.meta?.email;
    const emailDomain = email?.split('@')[1];

    if (emailDomain === 'uky.edu') {
      if (authData.meta?.isNew) {
        router.push("/onboarding")
      } else {
        router.push("/browse/events")
      }
    } else {
      await pb.collection('users').delete(authData.record.id);
      toast({
        title: "Access Denied",
        description: "You must use a uky.edu email to access this application.",
        variant: "destructive",
      });
    }
  }

  return (
    <Button variant="default" size="sm" onClick={oauthLogin}>
      Login
    </Button>
  )
} 