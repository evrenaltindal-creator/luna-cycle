# Luna Cycle — Step 5 Phase 1 Release Checklist

**Status:** Documentation and metadata package prepared; final store submission is not yet authorized.

## Legal and public documents

| Item | Status | Required before publication |
|---|---:|---|
| Privacy Policy TR | **READY WITH PLACEHOLDERS** | Replace `[LEGAL NAME]`, `[CONTACT EMAIL]`, `[BUSINESS ADDRESS]`, `[JURISDICTION]`, `[EFFECTIVE DATE]`; obtain legal review; publish stable HTTPS URL. |
| Privacy Policy EN | **READY WITH PLACEHOLDERS** | Same completion and review. |
| Terms TR | **READY WITH PLACEHOLDERS** | Complete governing law, legal entity, contact and effective date after legal review. |
| Terms EN | **READY WITH PLACEHOLDERS** | Same completion and review. |
| Google Data Safety | **NEEDS REVIEW** | Reconcile final production AdMob/UMP, Billing and platform diagnostics behavior with Play Console’s current questionnaire. |
| Google Health Apps declaration | **NEEDS REVIEW** | Submit only after policy and listing review; preserve “informational estimates / not a medical device” wording. |
| Apple App Privacy | **NEEDS REVIEW** | Inspect final iOS archive, SDK privacy manifests, ATT and IDFA behavior. |

## Store metadata

| Item | Status | Required before publication |
|---|---:|---|
| Turkish listing | **READY WITH PLACEHOLDERS** | Replace privacy/terms/support URLs and verify current store length limits. |
| English listing | **READY WITH PLACEHOLDERS** | Replace URLs and verify current store length limits. |
| Keywords | **READY AS CANDIDATES** | Select final country/language set without competitor names or trademark stuffing. |
| Screenshot plan | **READY** | Capture only synthetic demo data; verify current device dimensions and store crop requirements. |
| Age rating inputs | **READY AS INPUT NOTES** | Complete platform questionnaire; do not infer final age rating. |
| Monetization disclosure | **READY WITH CONFIG PLACEHOLDERS** | Add real store product links/details and production AdMob disclosure only after configuration. |

## Product and privacy gates

Before submission, verify that basic tracking remains Free, Advanced Insights is the only intended premium-gated surface currently documented, and the paywall has visible close, localized product price, monthly/yearly options, restore and store-managed cancellation information. Confirm that no fake countdown, hidden close, deceptive discount or medical claim appears in the app or metadata.

Confirm that PeriodRecord, DailyLog, flow, spotting, cramps, energy, moods, symptoms, notes, cycle dates, predictions and estimated ovulation remain local-first and are not sent to a Luna health backend, analytics service, ad request or billing payload. Confirm that backup/import contains no entitlement, raw consent, purchase token or ad ID and cannot unlock premium.

## Android and iOS technical gates

Android local RC checks are complete for TypeScript, 59/59 tests, web build, Capacitor sync, `assembleDebug`, `bundleRelease`, manifest `AD_ID` removal and RC artifact hashes. Android device runtime network audit, UMP runtime, real Play Billing, internal testing install source and fingerprint hardware QA remain deferred/not verified.

iOS StoreKit 2 and native ads remain deferred. Before iOS submission, run Xcode/Codemagic archive, StoreKit sandbox purchase/restore/cancel, UMP/AdMob runtime, ATT/IDFA review, safe area, notification, biometric and export/import checks.

## Store-specific work not yet completed

Google Play Console app setup, subscription products/base plans, tester account and internal test track are not configured in this documentation task. Real AdMob App ID/ad units are not configured. Store prices must be read from localized product details; no price in this checklist is a promise.

## Final sign-off

A release manager and legal reviewer should sign off the completed legal placeholders, store forms, production SDK privacy configuration and device acceptance evidence. Until then, the status is **STEP 5 PHASE 1 DOCUMENTATION READY — STORE SUBMISSION DEFERRED**.
