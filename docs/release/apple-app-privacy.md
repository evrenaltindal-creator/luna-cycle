# Apple App Privacy — Hazırlık Matrisi

**Uygulama:** Luna Cycle  
**Bundle ID:** `com.lunacycle.tracker`

**Durum:** App Store Connect Privacy Nutrition Label için hazırlık notu. Final declaration, iOS native build ve dahil edilen SDK privacy manifestleriyle yeniden doğrulanmalıdır.

## Değerlendirme ilkesi

Apple formundaki “collected” ve “linked to you” cevapları, uygulamanın ve dahil edilen SDK’ların gerçek production davranışına göre verilmelidir. Luna Cycle health/cycle kayıtlarını uzak Luna backend’ine göndermeyecek şekilde tasarlanmıştır. İlk sürüm satın alma veya reklam gösterimi başlatmaz; buna rağmen paketlenen üçüncü taraf SDK'ların davranışı final iOS binary üzerinden kontrol edilmelidir.

| Data type | Collected by Luna app? | Linked to user? | Used for tracking? | Purpose | Current preparation status |
|---|---|---|---|---|---|
| Health & Fitness: period/cycle records, symptoms, moods, notes, daily logs | **No remote collection in current architecture**; records remain primarily on device | No by Luna server | **No** | Tracking entered records and informational estimates | Ready as product fact; confirm against final iOS SDK declarations |
| Purchases: subscription state / transaction metadata | **Not used in first release** | No | No | No purchase flow | Recheck if future paid model is introduced |
| Financial information: payment card details | **No by Luna** | No by Luna | No | No in-app payment flow | Recheck if future paid model is introduced |
| Identifiers: IDFA / device or advertising identifiers | **TO BE VERIFIED on iOS**; Android AD_ID removal does not establish Apple status | To be verified | **TO BE VERIFIED** | Only if final SDK/config uses it | iOS native build and SDK privacy manifest review required |
| Usage data: product analytics | No analytics SDK in current dependency inventory | No | No | No product analytics currently implemented | Check Apple automatic/platform reporting separately |
| Diagnostics | No dedicated health analytics/diagnostics SDK in current app inventory | No by Luna app | No | Any platform/provider diagnostics must be reviewed | Needs final binary/store review |
| Advertising data / consent information | No ad request or consent UI is started by first-release app code | To be verified for included SDKs | **TO BE VERIFIED** | No in-app ad placement in first release | Audit final binary and SDK privacy manifests |
| Other data: theme, reminder, private notification preference | Local-only in current app behavior | No | No | App preferences and local notifications | Ready as product fact |

## Health and advertising conclusions

Health and cycle records are not used for advertising. The first release does not start purchase or ad requests. The app should not declare health data as used for ad tracking.

## ATT and IDFA

**App Tracking Transparency (ATT): TO BE VERIFIED.** The Android merged-manifest result showing `AD_ID` absent must not be interpreted as an Apple ATT or IDFA result. The final iOS native build must be inspected for IDFA access, tracking domains, provider configuration and any ATT prompt behavior before selecting the App Store Connect tracking answers.

**IDFA usage: TO BE VERIFIED.** No first-release ad request is intended, but the final packaged iOS SDKs still need inspection. That conclusion must not be pre-filled from the Android audit.

## Final submission checklist

Before submission, obtain the final iOS archive or TestFlight build, review each included SDK’s privacy manifest, confirm no ad or purchase flow initializes, determine whether ATT is required, and verify App Store Connect’s current data-type descriptions. Do not submit this preparation matrix as the final Apple privacy label without that review.
