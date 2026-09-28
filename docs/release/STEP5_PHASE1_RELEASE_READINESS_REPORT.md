# LUNA CYCLE — STEP 5 PHASE 1 RELEASE READINESS

> **Historical report:** This August 2026 snapshot predates the free-first-release decision and the September 2026 removal of ovulation estimates. Its old monetization and health-feature descriptions must not be used as current store declarations.

**Tarih:** 23 Ağustos 2026  
**Uygulama:** Luna Cycle  
**Package / Bundle ID:** `com.lunacycle.app`  
**Kapsam:** Privacy Policy, Terms, Data Safety, Health Apps declaration, Apple App Privacy, store metadata, screenshot plan, age rating, reviewer notes, data inventory ve release checklist.

## Genel sonuç

Step 5 Phase 1’de uygulama koduna yeni ürün özelliği eklenmedi. Mevcut local-first health architecture, Free + Luna Plus monetization, contextual/non-personalized-first ads ve native boundary davranışları dokümantasyon için kaynak gerçekleri olarak kullanıldı.

**STEP 5 PHASE 1 STATUS: DOCUMENTATION READY — STORE SUBMISSION NOT YET READY.**

Dokümanlar hazırlanmıştır; ancak legal identity/contact placeholders, production store configuration, Google Play/App Store formlarının son cevapları, native iOS doğrulaması ve gerçek mağaza runtime testleri tamamlanmadan yayın submission’ı yapılmamalıdır.

## Çıktı matrisi

| Çıktı | Durum | Açıklama |
|---|---:|---|
| Privacy Policy TR | **READY WITH PLACEHOLDERS** | Local health records, ads, consent, billing, retention, deletion ve medical disclaimer bölümleri mevcut. |
| Privacy Policy EN | **READY WITH PLACEHOLDERS** | Türkçe metinle kapsam olarak eşdeğer. |
| Terms TR | **READY WITH PLACEHOLDERS** | Acceptance, eligibility, service, medical disclaimer, subscriptions, ads, liability ve governing law placeholder mevcut. |
| Terms EN | **READY WITH PLACEHOLDERS** | Türkçe metinle kapsam olarak eşdeğer. |
| Google Play Data Safety | **NEEDS REVIEW** | Local-only health data ile third-party SDK/store processing ayrıştırıldı; final production SDK ve Play formuyla doğrulama gerekiyor. |
| Google Health Apps declaration | **NEEDS REVIEW** | Period/menstrual tracking ve informational estimates olarak hazırlandı; güncel Play policy/form ile son kontrol gerekiyor. |
| Apple App Privacy | **NEEDS REVIEW** | Health, purchases, identifiers, usage, diagnostics ve ads/consent matrix hazır; iOS archive, privacy manifests, ATT/IDFA ve production config bekleniyor. |
| Turkish store listing | **READY WITH PLACEHOLDERS** | Short/long description, Luna Plus disclosure, privacy/terms/support URL placeholder’ları mevcut. |
| English store listing | **READY WITH PLACEHOLDERS** | Türkçe metinle kapsam olarak eşdeğer. |
| Keywords | **READY AS CANDIDATES** | English/Türkçe adaylar; rakip trademark stuffing yok. Final ülke/dil seçimi gerekiyor. |
| Screenshot plan | **READY** | Sekiz ekran için headline, subheadline, show/not-show ve synthetic-data kuralları mevcut. |
| Age rating inputs | **READY AS INPUT NOTES** | Violence/sexual content/gambling/UGC/health/ads/IAP girdileri hazır; nihai rating mağaza formuna bırakıldı. |
| Reviewer notes | **READY WITH PLACEHOLDERS** | Accountless core flow, local records, ads, premium, notifications, biometrics ve deferred test durumu açıklanıyor. |
| Monetization disclosure | **READY WITH CONFIG PLACEHOLDERS** | Free contextual ads, Luna Plus auto-renewal, localized price ve store-managed cancellation açıklanıyor. |
| Data inventory | **READY** | Health fields, storage, backup, SDK/dependency matrix ve data flow metni mevcut. |
| Privacy contradiction audit | **NONE FOUND** | Reviewed source ile doküman claims arasında bilinen çelişki bulunmadı; final provider/iOS review açık. |
| Release checklist | **READY** | Legal, store, product, Android/iOS ve final sign-off gates mevcut. |

## Ürün ve veri gerçekleri

Luna Cycle’ın current release’i PeriodRecord, DailyLog, flow, spotting, cramps, energy, moods, symptoms, notes, cycle dates, predictions ve estimated ovulation gibi verileri öncelikle cihazda tutacak şekilde tasarlanmıştır. İncelenen kaynaklarda Luna tarafından işletilen remote health backend’i veya health analytics SDK’sı bulunmamaktadır. Core health tracking için Luna hesabı veya remote login/register akışı bulunmadığı dokümante edilmiştir.

Bu durum, cihaz veya üçüncü taraf platformlarının mutlak risksiz olduğu anlamına gelmez. Dokümanlarda “100% secure”, “unhackable”, “fully anonymous”, “zero data leaves the device” veya benzeri blanket iddialar kullanılmamıştır. Kullanılan ifade, health records’ın “primarily remain on the device” ve “designed to stay on your device” şeklinde sınırlandırılmıştır.

Free katmanda yalnız `home_footer` ve `insights_footer` için contextual/non-personalized-first banner policy’si belgelenmiştir. Health data ad targeting, ad request parameter veya ad profile amacıyla kullanılmaz. Luna Plus aktif entitlement durumunda ad initialization, request ve banner display durdurulmalıdır. Advertising/consent SDK’larının teknik veya consent-related processing’i provider documentation ve production configuration ile ayrıca doğrulanmalıdır.

## Legal placeholders

Yayın öncesinde aşağıdaki alanlar gerçek bilgilerle doldurulmalıdır:

| Placeholder | Gerekli değer |
|---|---|
| `[LEGAL NAME]` | Gerçek geliştirici/şirket adı |
| `[CONTACT EMAIL]` | Privacy ve support iletişim adresi |
| `[BUSINESS ADDRESS]` | Hukuken gerekli gerçek iş adresi |
| `[JURISDICTION]` | Uygulanacak hukuk ve ülke/yargı alanı |
| `[EFFECTIVE DATE]` | Yayınlanacak politika/koşul yürürlük tarihi |
| `[PRIVACY POLICY URL]` | HTTPS privacy policy URL’si |
| `[TERMS URL]` | HTTPS terms URL’si |

Country-specific age, children’s privacy, data-controller, international transfer, retention, legal basis and consumer-rights wording legal review sonrasında kesinleştirilmelidir.

## Deferred / not verified items

Google Play gerçek Billing purchase, monthly/yearly product setup, internal testing track, tester account, Play acknowledgement runtime, pending/cancel/restore/lifecycle expiry ve install-source doğrulaması **DEFERRED — PLAY CONSOLE / TEST ENV REQUIRED** durumundadır.

Production AdMob App ID ve production ad unit yapılandırılmamıştır; production advertising **DEFERRED** durumundadır. Google test ID’siyle local code/build hazırlığı yapılmıştır, fakat gerçek banner impression ve UMP runtime cihaz üzerinde **NOT VERIFIED** durumundadır.

iOS StoreKit 2 purchase/restore/cancel, iOS native AdMob/UMP, privacy manifests, ATT/IDFA ve Xcode/Codemagic validation **DEFERRED / TO BE VERIFIED** durumundadır. Android `AD_ID` kaldırma sonucu Apple tracking cevabı olarak kullanılamaz.

## Source-of-truth files

- `docs/release/privacy-policy-tr.md`
- `docs/release/privacy-policy-en.md`
- `docs/release/terms-tr.md`
- `docs/release/terms-en.md`
- `docs/release/google-data-safety.md`
- `docs/release/google-health-declaration.md`
- `docs/release/apple-app-privacy.md`
- `docs/release/store-listing-tr.md`
- `docs/release/store-listing-en.md`
- `docs/release/keywords.md`
- `docs/release/screenshot-plan.md`
- `docs/release/age-rating-notes.md`
- `docs/release/reviewer-notes.md`
- `docs/release/monetization-disclosures.md`
- `docs/release/data-inventory.md`
- `docs/release/privacy-contradictions.md`
- `docs/release/step5-checklist.md`

## Final decision

**Privacy Policy TR/EN:** READY WITH PLACEHOLDERS  
**Terms TR/EN:** READY WITH PLACEHOLDERS  
**Data Safety / Health declaration / Apple App Privacy:** NEEDS REVIEW  
**Store listing TR/EN:** READY WITH PLACEHOLDERS  
**Metadata, screenshot and reviewer package:** READY WITH PLACEHOLDERS  
**Privacy contradictions:** NONE FOUND  
**Store-specific runtime items:** DEFERRED  
**Step 5 Phase 1:** DOCUMENTATION READY; publication remains blocked until placeholders, legal review and platform/provider verification are complete.

## References

[1]: https://developers.google.com/admob/android/privacy — Google User Messaging Platform Android privacy documentation.

[2]: https://github.com/capacitor-community/admob — Capacitor Community AdMob repository and Capacitor 8 plugin documentation.

[3]: https://developer.apple.com/app-store/app-privacy-details/ — Apple App Privacy Details guidance.
