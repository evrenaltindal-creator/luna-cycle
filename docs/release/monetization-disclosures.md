# Monetization Disclosures

## Türkçe

Luna Cycle’ın Free katmanı, yalnızca düşük hassasiyetli onaylı footer alanlarında contextual ve non-personalized-first banner reklamlar gösterebilir. Sağlık ve döngü kayıtları reklam hedeflemesinde kullanılmaz, reklam isteği parametrelerine eklenmez ve reklam profili oluşturmak için kullanılmaz. Reklam ve consent SDK’ları, kendi belgeleri ve production yapılandırmaları kapsamında gerekli teknik cihaz veya consent bilgilerini işleyebilir.

Luna Plus, aylık veya yıllık **otomatik yenilenen mağaza aboneliği** olarak sunulabilir. Aktif Luna Plus entitlement’ı reklamsız deneyim ve advanced insights gibi premium yüzeyler sağlayabilir. Ürün adı, süre ve fiyat uygulamada mağazadan gelen localized product details üzerinden gösterilmelidir; fiyat, deneme veya indirim bu dokümanda sabitlenmemiştir.

Yenileme ve iptal Google Play veya App Store hesabı üzerinden yönetilir. “Restore purchases” mağazadaki entitlement durumunu yeniden sorgular. Local health backup premium erişim vermez. Ödeme ve ham kredi kartı bilgileri mağaza sağlayıcısı tarafından işlenir; Luna Cycle sağlık kayıtlarını billing payload’ına göndermez.

## English

The Luna Cycle Free tier may show contextual, non-personalized-first banner advertising only in approved low-sensitivity footer placements. Health and cycle records are not used for ad targeting, are not included in ad-request parameters and are not used to create advertising profiles. Advertising and consent SDKs may process technical device or consent-related information under their own documentation and final production configuration.

Luna Plus may be offered as an **auto-renewing monthly or yearly store subscription**. An active Luna Plus entitlement may provide an ad-free experience and premium surfaces such as advanced insights. Product name, duration and price must be displayed from localized store product details; no hardcoded price, trial or discount is stated here.

Renewal and cancellation are managed through the Google Play or Apple App Store account. “Restore purchases” re-queries store entitlement. A local health backup does not grant premium access. Payment processing and raw card details are handled by the store provider; Luna Cycle does not send health records in billing payloads.

## Required UI/store fields before publication

| Field | Source / rule |
|---|---|
| Subscription title | Real Google Play / StoreKit product detail |
| Duration | Real monthly or yearly store product |
| Price | Localized store price; never hardcode in copy |
| Auto-renewal | Must be visible before purchase |
| Cancellation | Managed through the relevant store account |
| Privacy Policy link | `[PRIVACY POLICY URL]` |
| Terms link | `[TERMS URL]` |
| Support contact | `[CONTACT EMAIL]` |
| Production AdMob ID | Configure only after real AdMob account approval; do not invent |
