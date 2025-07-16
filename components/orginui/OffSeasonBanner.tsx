"use client"

import { Button } from "@/components/ui/button"
import { config } from "@/lib/config";
import { useState, useEffect } from "react";

export default function OffSeasonBanner() {
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem('offSeasonBannerClosed');
    setIsClosed(closed === 'true');

    if (!config.isOffSeason) {
      setIsClosed(true);
    }
  }, []);

  if (isClosed) return null;

  return (
    // To make the notification fixed, add classes like `fixed bottom-4 inset-x-4` to the container element.
    <div className="bg-yellow-50 border-yellow-200 z-50 rounded-md border px-4 py-3 shadow-lg">
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:items-center">
        <p className="text-sm text-center md:text-center text-yellow-800">
          🎓 Off-Season Notice: Basketball and Football season is over. Come back in the Fall to buy/sell student tickets!
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={() => {
            localStorage.setItem('offSeasonBannerClosed', 'true');
            setIsClosed(true);
          }}>Close</Button>
        </div>
      </div>
    </div>
  )
}
