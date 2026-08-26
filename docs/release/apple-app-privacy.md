# Apple App Privacy — Hazırlık Matrisi

**Uygulama:** Luna Cycle  
**Bundle ID:** `com.lunacycle.app`  
**Durum:** App Store Connect Privacy Nutrition Label için hazırlık notu. Final declaration, iOS native build, SDK privacy manifests ve production AdMob/UMP yapılandırmasıyla yeniden doğrulanmalıdır.

## Değerlendirme ilkesi

Apple formundaki “collected” ve “linked to you” cevapları, uygulamanın ve dahil edilen SDK’ların gerçek production davranışına göre verilmelidir. Luna Cycle health/cycle kayıtlarını uzak Luna backend’ine göndermeyecek şekilde tasarlanmıştır. Ancak store, advertising ve consent SDK’larının bağımsız veri işleme davranışı, final iOS binary ve provider documentation üzerinden ayrıca kontrol edilmelidir.

| Data type | Collected by Luna app? | Linked to user? | Used for tracking? | Purpose | Current preparation status |
|---|---|---|---|---|---|
| Health & Fitness: period/cycle records, symptoms, moods, notes, daily logs | **No remote collection in current architecture**; records remain primarily on device | No by Luna server | **No** | Tracking entered records and informational estimates | Ready as product fact; confirm against final iOS SDK declarations |
| Purchases: subscription state / transaction metadata | The app may read store entitlement state; raw card details are not processed by Luna | Store/provider controlled; not linked to health records by Luna | No | Luna Plus entitlement, restore and subscription management | Needs App Store Connect/provider review |
| Financial information: payment card details | **No by Luna** | No by Luna | No | Payment handled by App Store | Do not declare Luna as processing raw card data |
| Identifiers: IDFA / device or advertising identifiers | **TO BE VERIFIED on iOS**; Android AD_ID removal does not establish Apple status | To be verified | **TO BE VERIFIED** | Only if final SDK/config uses it | iOS native build and SDK privacy manifest review required |
| Usage data: product analytics | No analytics SDK in current dependency inventory | No | No | No product analytics currently implemented | Check Apple automatic/platform reporting separately |
| Diagnostics | No dedicated health analytics/diagnostics SDK in current app inventory | No by Luna app | No | Any platform/provider diagnostics must be reviewed | Needs final binary/store review |
| Advertising data / consent information | Free tier may invoke AdMob/UMP technical and consent flow; exact iOS fields depend on final provider config | Provider-specific; not health linked by Luna | **TO BE VERIFIED** | Contextual/non-personalized-first banner and consent management | Needs production AdMob/UMP and privacy manifest review |
| Other data: theme, reminder, private notification preference | Local-only in current app behavior | No | No | App preferences and local notifications | Ready as product fact |

## Health and advertising conclusions

Health and cycle records are not used for advertising and are not sent as ad request parameters. The app should not declare health data as used for ad tracking. Health data is also not intended to be linked to store purchases, consent state or advertising identifiers.

## ATT and IDFA

**App Tracking Transparency (ATT): TO BE VERIFIED.** The Android merged-manifest result showing `AD_ID` absent must not be interpreted as an Apple ATT or IDFA result. The final iOS native build must be inspected for IDFA access, tracking domains, provider configuration and any ATT prompt behavior before selecting the App Store Connect tracking answers.

**IDFA usage: TO BE VERIFIED.** If the final AdMob/UMP configuration uses no IDFA and no cross-app tracking, the final App Store Connect answer should reflect the provider’s documented behavior. That conclusion must not be pre-filled from the Android audit.

## Final submission checklist

Before submission, obtain the final iOS archive or TestFlight build, review each included SDK’s privacy manifest, confirm AdMob/UMP production configuration, determine whether ATT is required, and verify App Store Connect’s current data-type descriptions. Do not submit this preparation matrix as the final Apple privacy label without that review.
