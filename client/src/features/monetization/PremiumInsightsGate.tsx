// Style: Sessiz Ay Takvimi — premium gate davetkâr ama baskısız; temel veriyi saklamaz.

import { useState, type ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useMonetization } from "./MonetizationContext";
import { canAccessFeature } from "./monetization.config";
import { LunaPlusPanel } from "./LunaPlusPanel";

export function PremiumInsightsGate({ children }: { children: ReactNode }) {
  const { entitlement, isLoading } = useMonetization();
  const [open, setOpen] = useState(false);
  if (isLoading || canAccessFeature(entitlement, "advanced_insights")) return <>{children}</>;
  return <>
    <section className="surface premium-insights-gate" aria-labelledby="premium-insights-title">
      <LockKeyhole size={20} />
      <div><span className="tiny-label">LUNA PLUS</span><h3 id="premium-insights-title">Kayıtlarına daha uzun bir pencereden bak.</h3><p>Gelişmiş kişisel içgörüler temel döngü takibinden ayrı, isteğe bağlı bir katmandır.</p></div>
      <button className="text-link" onClick={() => setOpen(true)}>Luna Plus’ı keşfet</button>
    </section>
    {open && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><LunaPlusPanel onClose={() => setOpen(false)} /></div>}
  </>;
}
