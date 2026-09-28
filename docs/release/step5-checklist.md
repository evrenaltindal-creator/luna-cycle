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
| Pricing disclosure | **FREE FIRST RELEASE** | Verify App Store Connect price is Free; no subscription, purchase or ad placement is included in this release. |

## Product and privacy gates

Before submission, verify that all current features, including personal insights, work without payment; no paywall, purchase button, subscription or ad placement appears. Confirm that no false medical claim appears in the app or metadata.

Confirm that PeriodRecord, DailyLog, flow, spotting, cramps, energy, moods, symptoms, notes, cycle dates and predictions remain local-first and are not sent to a Luna health backend or analytics service. Confirm that backup/import does not trigger any purchase or ad flow.

## Android and iOS technical gates

Android local RC checks are complete for TypeScript, 59/59 tests, web build, Capacitor sync, `assembleDebug`, `bundleRelease`, manifest `AD_ID` removal and RC artifact hashes. Android device runtime network audit, UMP runtime, real Play Billing, internal testing install source and fingerprint hardware QA remain deferred/not verified.

Before iOS submission, run an Xcode archive and check that the first-release binary has no registered StoreKit purchase bridge, no ad request/placement, and accurate ATT/IDFA and SDK privacy declarations. Test safe area, notification, biometric and export/import behavior on device.

## Store-specific work not yet completed

Google Play Console app setup, tester account and internal test track require separate verification. Confirm App Store Connect price is Free before any iOS submission. Future paid models are outside this release.

## Final sign-off

A release manager and legal reviewer should sign off the completed legal placeholders, store forms, production SDK privacy configuration and device acceptance evidence. Until then, the status is **STEP 5 PHASE 1 DOCUMENTATION READY — STORE SUBMISSION DEFERRED**.
