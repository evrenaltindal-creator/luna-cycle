# Luna Cycle Final Privacy / Data Inventory

> **Historical inventory (23 August 2026):** This predates the free-first-release decision and describes planned monetization boundaries. Do not use its advertising or purchase rows as current store declarations. See [current release decision](FREE_FIRST_RELEASE_TR.md) and re-audit the final binaries.

**Tarih:** 23 Ağustos 2026  
**Package:** `com.lunacycle.app`  
**Scope:** Current React/TypeScript/Vite + Capacitor 8 release candidate.

## Health and cycle data

| Data object / field | Source | Current storage | Remote Luna backend | Ads | Billing | User control |
|---|---|---|---|---|---|---|
| `PeriodRecord` | Period start/end, length, cycle records | Native/local `periods` store; web local app storage | None in current architecture | Not sent | Not sent | Edit/delete, Clear All Data, uninstall/storage removal |
| `DailyLog` | Daily Check-In | Native/local `logs` store; web local app storage | None in current architecture | Not sent | Not sent | Edit/delete, Clear All Data, uninstall/storage removal |
| `flow`, `spotting` | Daily Check-In selections | Inside DailyLog | None | Not sent | Not sent | Via DailyLog controls |
| `cramps`, `energy` | Daily Check-In selections | Inside DailyLog | None | Not sent | Not sent | Via DailyLog controls |
| `moods`, `symptoms` | Daily Check-In multi-selects | Inside DailyLog | None | Not sent | Not sent | Via DailyLog controls |
| `notes` | User free-text note | Inside DailyLog | None | Not sent | Not sent | Edit/delete, Clear All Data |
| Cycle dates / predictions | Derived from local records | Computed in app; no remote health store | None | Prediction state not sent | Not sent | Source records can be edited/deleted |
| Estimated ovulation-timing range | Derived estimate | Computed/displayed locally after three completed cycle intervals | None | Not sent | Not sent | Not a fertile/safe-day label; source records can be edited/deleted |
| Theme, reminders, private notification setting | User preferences | Native/local `preferences` store; web local app storage | None | Not sent | Not sent | Settings/Clear All Data; theme may be retained by product behavior |

The current storage keys are `luna.periods.v1`, `luna.daily-logs.v1` and `luna.preferences.v1` for the web adapter. Native storage maps the same business data to native storage slots. This inventory does not make an absolute cryptographic or zero-risk claim.

## Backup and export

The user-triggered JSON backup contains `schema`, `version`, `exportedAt`, `periodRecords`, `dailyLogs` and `preferences`. It is not designed to contain entitlement, raw advertising consent responses, purchase tokens or ad identifiers. An imported backup cannot unlock Luna Plus. An exported file is outside the app’s remote control once the user saves or shares it.

## Monetization and consent data

| Component | Version | Purpose | Platform | Possible network / provider processing | Health data access |
|---|---|---|---|---|---|
| Google Play Billing KTX | `9.1.0` | Product query, purchase, acknowledgement, restore, entitlement and subscription management boundary | Android | Google Play may process purchase state, subscription status and transaction metadata according to Google’s service | **NONE** |
| Apple StoreKit boundary | Prepared contract; native runtime version pending | Product, purchase, restore and entitlement boundary for iOS | iOS | Apple may process store transaction and subscription metadata according to App Store services | **NONE** |
| `@capacitor-community/admob` | `8.1.0` | Banner/adaptive banner display and UMP-facing native boundary | Android/iOS | Google Mobile Ads/UMP may process provider-defined technical device, consent or ad-serving information; exact production fields require final SDK/config review | **NONE** |
| Google Mobile Ads native dependency | Supplied by selected AdMob plugin; current Android plugin line documented as GMA 25.4.x | Banner request/display | Android/iOS through plugin | Provider network request may contain technical/ad-serving data defined by final SDK | **NONE** |
| UMP consent dependency | Supplied by selected AdMob plugin | Consent information, form and privacy options | Android/iOS through plugin | Provider may process consent-related technical information | **NONE** |
| `@aparajita/capacitor-secure-storage` | `8.0.0` | Native/local storage boundary | Android/iOS | No Luna health backend request | **NONE outside local storage purpose** |
| `@capacitor/local-notifications` | `8.3.1` | Local reminder scheduling | Android/iOS | OS-managed local notification; no Luna remote health endpoint | **NONE** |
| Capacitor App / Filesystem / Share / Privacy Screen / Status Bar / Splash / Keyboard / Haptics | Capacitor 8 line; exact versions in `package.json` | Native lifecycle, file, sharing, privacy and UI functions | Android/iOS | Platform-managed operations; no Luna health backend | **NONE as a monetization boundary** |

## Analytics inventory

The current dependency inventory contains no Firebase Analytics, Google Analytics, Amplitude, Mixpanel, Segment or dedicated health analytics SDK. This is a static dependency conclusion for the current project state; platform-level diagnostics and store-provider processing must be handled in their own declarations.

## Advertising policy inventory

Ad requests accept only the entitlement/consent/slot policy needed for approved Free placements. Approved slots are `home_footer` and `insights_footer`. Health context, cycle phase, symptoms, moods, notes, prediction state, user ID, content URL, keywords and custom targeting are not passed. The banner is configured non-personalized-first with `npa: true`. When Luna Plus is active, the policy is zero ad SDK init/request/banner render.

## Local data flow

```text
User
  -> Luna local health store

User
  -> explicit JSON backup file

Free + consent allows ads
  -> minimal contextual/non-personalized ad SDK request
  -> no health payload

Luna Plus purchase
  -> Google Play / Apple App Store
  -> store entitlement metadata only; no health payload
```

## Retention and deletion

Local health data remains until the user edits/deletes it, uses Clear All Data, uninstalls the app or removes device storage. A user-exported file may persist outside the app and cannot be remotely deleted by Luna Cycle. Clear All Data does not cancel a store subscription; subscription cancellation belongs to the store account.
