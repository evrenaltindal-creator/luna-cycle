# Privacy Contradiction Audit

**Tarih:** 23 Ağustos 2026  
**Karşılaştırılan kaynaklar:** `cycle.storage.ts`, `billing.service.ts`, `ad.service.ts`, `consent.service.ts`, `admob.adapter.ts`, `package.json`, Android merged manifest ve Step 4 RC raporu.

## Sonuç

Current release candidate source ile hazırlanan privacy/store claims arasında bilinen bir ürün-gerçekliği çelişkisi bulunmadı. **Privacy Contradictions: NONE FOUND — subject to final platform/provider review.**

| Policy / store claim | Source evidence | Result |
|---|---|---:|
| Health records remain primarily local | `cycle.storage.ts` uses native/local storage adapters for periods, logs and preferences; no Luna health backend path is present in the reviewed source | **PASS** |
| No health analytics SDK | `package.json` dependency inventory has no Firebase Analytics, Google Analytics, Amplitude, Mixpanel, Segment or health analytics SDK | **PASS** |
| Health data is not sent to ads | `ad.service.ts` request model contains only slot, consent and `nonPersonalized`; no health module import | **PASS** |
| Health data is not sent to billing | `billing.service.ts` imports product config, billing types and store adapters only | **PASS** |
| Advertising consent is separate | `consent.service.ts` uses `luna.monetization.ad-consent.v1` and stores policy-derived booleans; it is not part of health backup | **PASS** |
| Premium stops ads | `AdService` returns premium hard-stop for Luna Plus and native adapter shutdown path exists | **PASS by policy; runtime device measurement deferred** |
| Only approved ad slots are used | `AdSlot` and safe slot policy contain `home_footer` and `insights_footer` only | **PASS** |
| Free basic tracking remains available | Core tracking, Daily Check-In, Calendar, local reminders, privacy controls, storage and import/export are not documented as premium-only | **PASS** |
| Backup does not grant premium | Backup model contains records/logs/preferences and no entitlement or purchase token; import has no premium unlock path | **PASS** |
| Clear All Data does not cancel store purchase | `clearAllData` clears local health stores; billing/store entitlement is a separate boundary | **PASS** |
| No absolute security claim | Privacy and Terms drafts explicitly avoid “unhackable”, “100% impossible to access” and “zero data ever leaves device” wording | **PASS** |
| Android AD_ID absent | Merged manifest audit after removal directives showed no `AD_ID` or `ACCESS_ADSERVICES_AD_ID`; `INTERNET` remained and SDK `ACCESS_NETWORK_STATE` remained | **PASS** |

## Open, non-contradictory deferred items

The following are not source contradictions; they are final platform/provider verification items. The production AdMob account and production ad unit are not configured. Native UMP behavior was not measured on a device. Android runtime network traffic was not captured because the Windows environment did not expose `adb`. iOS StoreKit, ATT/IDFA, privacy manifests and native AdMob behavior were not built or measured. Google Play Data Safety and Apple App Privacy checkboxes must therefore remain **NEEDS REVIEW / TO BE VERIFIED** until the final store binaries and provider configuration exist.

## Claims explicitly not used

The documents do not claim 100% accuracy, exact ovulation prediction, medical-grade status, clinical proof, full anonymity, that zero data leaves the device in every circumstance, unhackability or guaranteed privacy. Health-record wording is limited to “primarily remain on the device” and “designed to stay on your device”, while acknowledging independent platform and third-party provider processing.

## Release gate

If a future source change adds a remote health request, analytics SDK, health-derived ad parameter, billing health payload, raw token in export/logs, or an iOS tracking path inconsistent with the final Apple declaration, the corresponding policy and store forms must be revised before release. Product logic was not modified during Step 5 Phase 1 documentation work.
