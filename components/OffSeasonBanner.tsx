import { Alert, AlertDescription } from "@/components/ui/alert"

interface OffSeasonBannerProps {
  isEnabled: boolean;
}

export function OffSeasonBanner({ isEnabled }: OffSeasonBannerProps) {
  if (!isEnabled) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <Alert className="bg-yellow-50 border-yellow-200 rounded-none">
        <AlertDescription className="text-yellow-800 text-center py-2">
          🎓 Off-Season Notice: Basketball and Football season is over. Come back in the Fall to buy/sell student tickets!
        </AlertDescription>
      </Alert>
    </div>
  );
} 