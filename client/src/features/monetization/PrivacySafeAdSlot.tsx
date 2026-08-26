// Style: Sessiz Ay Takvimi — footer-only, reserved-height, consent-derived and premium-safe native banner.

import { useEffect, useState } from "react";
import { AdService, type AdSlot } from "./ad.service";
import { useMonetization } from "./MonetizationContext";

export function PrivacySafeAdSlot({ slot }: { slot: AdSlot }) {
  const { entitlement, adConsent } = useMonetization();
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    let active = true;
    if (!AdService.canShowAds(entitlement, slot) || !adConsent.adRequestAllowed) {
      setFilled(false);
      void AdService.hideBanner();
      return () => { active = false; };
    }
    void AdService.loadBanner(slot, entitlement, adConsent)
      .then((loaded) => { if (active) setFilled(loaded); })
      .catch(() => { if (active) setFilled(false); });
    return () => { active = false; void AdService.hideBanner(); };
  }, [adConsent, entitlement, slot]);

  if (entitlement === "luna_plus") return null;
  return <div className="privacy-safe-ad-slot" data-ad-slot={slot} aria-label="Kişiselleştirilmemiş reklam alanı">
    {filled ? <span className="ad-status">Kişiselleştirilmemiş reklam</span> : <span className="ad-placeholder">Reklam alanı</span>}
  </div>;
}
