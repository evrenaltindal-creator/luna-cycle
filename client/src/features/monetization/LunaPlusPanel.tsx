// Style: Sessiz Ay Takvimi — paywall sakin editorial yüzey, açık kapatma ve fiyat dürüstlüğü.

import { useEffect, useState } from "react";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useMonetization } from "./MonetizationContext";
import { PRODUCT_IDS } from "./monetization.config";

const benefits = ["Reklamsız deneyim", "Gelişmiş kişisel içgörüler", "Uzun dönem eğilimleri", "Gelişmiş raporlar"];

export function LunaPlusPanel({ onClose }: { onClose?: () => void }) {
  const { entitlement, isPremium, isLoading, getProducts, purchase, restore, manageSubscription } = useMonetization();
  const [products, setProducts] = useState<Awaited<ReturnType<typeof getProducts>>>([]);
  useEffect(() => { let active = true; void getProducts().then((next) => { if (active) setProducts(next); }).catch(() => { if (active) setProducts([]); }); return () => { active = false; }; }, [getProducts]);
  const buy = async (productId: string) => {
    let result;
    try { result = await purchase(productId); } catch { toast.info("Mağaza bağlantısı şu anda kullanılamıyor."); return; }
    if (result.state === "SUCCESS" || result.state === "ALREADY_OWNED") toast.success("Luna Plus durumun yenilendi.");
    else if (result.state === "USER_CANCELLED") return;
    else toast.info(result.message ?? "Satın alma şu anda kullanılamıyor.");
  };
  const restorePurchases = async () => {
    let next;
    try { next = await restore(); } catch { toast.info("Satın alımlar şu anda doğrulanamıyor."); return; }
    toast.info(next.isPremium ? "Luna Plus satın alımın geri yüklendi." : "Aktif bir Luna Plus satın alımı bulunamadı.");
  };
  const manage = async () => { try { if (await manageSubscription()) toast.info("Abonelik yönetimi açıldı."); else toast.info("Abonelik yönetimi mağaza bağlantısı hazır olduğunda kullanılacak."); } catch { toast.info("Abonelik yönetimi şu anda kullanılamıyor."); } };
  return <section className="luna-plus-panel surface" aria-labelledby="luna-plus-title">
    <div className="section-top">
      <div><span className="tiny-label">LUNA PLUS</span><h3 id="luna-plus-title">Daha uzun bir bakış.</h3></div>
      <Sparkles size={20} className="sage-icon" />
    </div>
    <p>Temel döngü takibi ücretsiz kalır. Luna Plus, yalnızca gelişmiş içgörü yüzeylerini ve reklamsız deneyimi destekler.</p>
    <div className="luna-plus-status"><strong>{isLoading ? "Durum kontrol ediliyor…" : isPremium ? "Luna Plus aktif" : "Mevcut plan: Free"}</strong><span>{entitlement === "luna_plus" ? "Mağaza durumu doğrulandı." : "Temel özelliklerin tamamı açık."}</span></div>
    {!isPremium && <div className="luna-plus-actions">{[PRODUCT_IDS.monthly, PRODUCT_IDS.yearly].map((productId) => { const product = products.find((item) => item.id === productId); const label = productId === PRODUCT_IDS.monthly ? "Aylık plan" : "Yıllık plan"; const available = Boolean(product?.localizedPrice); return <button className="secondary-button" key={productId} onClick={() => void buy(productId)} disabled={isLoading || !available}>{label} <small>{available ? `${product?.localizedPrice ?? ""} · ${product?.billingPeriod === "P1Y" ? "yıllık" : "aylık"}` : "Mağazada kullanılamıyor"}</small></button>; })}</div>}
    <div className="luna-plus-benefits">{benefits.map((benefit) => <span key={benefit}>· {benefit}</span>)}</div>
    <div className="luna-plus-footer">{isPremium && <button className="text-link" onClick={() => void manage()}>Aboneliği yönet</button>}{!isPremium && <button className="text-link" onClick={() => void restorePurchases()}><RefreshCw size={15} /> Satın alımları geri yükle</button>}{onClose && <button className="icon-button" aria-label="Luna Plus panelini kapat" onClick={onClose}><X size={17} /></button>}</div>
  </section>;
}
