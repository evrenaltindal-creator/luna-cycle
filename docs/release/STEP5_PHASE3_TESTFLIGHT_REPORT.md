# LUNA CYCLE — STEP 5 PHASE 3
# TESTFLIGHT INTERNAL TESTING + iOS NATIVE ACCEPTANCE REPORT

**Tarih:** 26 Ağustos 2026  
**App:** Luna Cycle  
**Bundle ID:** `com.lunacycle.app`  
**Display name:** Luna Cycle  
**Version/build baseline:** `1.0.0 (1)`  
**Deployment target:** iOS 15.0  
**Package manager:** pnpm  
**Kapsam:** App Store Connect/TestFlight readiness, Codemagic signed build preparation and iOS native acceptance.

## Executive result

**STEP 5 PHASE 3 STATUS: NOT COMPLETE.**

The Windows-side precheck is complete and the repository is ready for a Codemagic macOS run. The real TestFlight acceptance gate cannot be closed from the current Windows environment because Xcode, Swift, simulator tooling, Apple signing credentials, App Store Connect access and a real iPhone/TestFlight session are not available here. No signed IPA, App Store Connect upload, processed TestFlight build or real iPhone result was fabricated.

## Gate summary

| Gate | Result | Evidence / reason |
|---|---:|---|
| Windows precheck | **COMPLETE** | Frozen pnpm install, tests, TypeScript, web build and Capacitor iOS sync completed. |
| pnpm install | **PASS** | `corepack pnpm install --frozen-lockfile` completed with the existing lockfile. |
| Unit tests | **PASS** | 59/59 tests passed. |
| TypeScript | **PASS** | `corepack pnpm run check` completed successfully. |
| Web build | **PASS** | `corepack pnpm run build` completed successfully. |
| Capacitor iOS sync | **PASS** | `corepack pnpm exec cap sync ios` completed and found 12 plugins. |
| SPM resolve | **DEFERRED** | `xcodebuild` is not installed on Windows. |
| Xcode project validation | **DEFERRED** | `xcodebuild -list` requires macOS/Xcode. |
| Unsigned Simulator compile | **DEFERRED** | `xcodebuild`, `xcrun` and Swift are unavailable. |
| Simulator `.app` | **NOT GENERATED** | No iOS `.app` was found after the Windows run. |
| Release archive | **DEFERRED** | Requires macOS/Xcode. |
| Code signing | **NOT CONFIGURED / DEFERRED** | No Apple certificate, provisioning profile, Team ID or App Store Connect credential was available or committed. |
| IPA | **NOT GENERATED** | Signed archive was not possible on Windows. |
| App Store Connect upload | **DEFERRED** | Requires signed IPA and authenticated App Store Connect integration. |
| Build processing | **DEFERRED** | No upload was performed. |
| TestFlight Internal Testing | **NOT READY** | No processed App Store Connect build or internal group assignment was available. |
| Real iPhone install | **NOT VERIFIED** | No TestFlight install session was performed. |

## Native acceptance status

The following TestFlight acceptance items remain **NOT VERIFIED**: cold launch, onboarding/home, synthetic data persistence, Daily Check-In create/edit/delete, Calendar navigation and edit/delete, basic versus advanced Insights gating, Light/Dark/System theme persistence, local notification permission and delivery, biometric lock, background privacy overlay, import/export, safe area, keyboard, no-crash behavior, UMP runtime, Free test ads and StoreKit product/purchase/restore flows.

The repository-level privacy boundary remains unchanged. Health records are intended to stay in local storage, purchase tokens are not part of export, raw consent payloads are not part of export, and the monetization source tree is separated from health modules. Runtime network, Xcode log and crash audit still require a real macOS/TestFlight session and must not be claimed from static inspection alone.

## StoreKit and AdMob limitation

The current iOS synced plugin registration includes AdMob/UMP, but the repository does not contain a confirmed native StoreKit purchase plugin implementation or a registered iOS biometric bridge. Consequently, StoreKit product query/purchase/restore and iOS biometric results are **NOT VERIFIED**, even if the JavaScript contracts exist. Free Ads and UMP must be tested with test identifiers until production AdMob identifiers and consent configuration are supplied.

## Required Codemagic/macOS run

Run the repository-root `codemagic.yaml` workflow on a macOS worker. The validation workflow must execute Corepack/pnpm install, tests, TypeScript check, web build, `pnpm exec cap sync ios`, SPM resolution, `xcodebuild -list`, unsigned Simulator compile and `.app` artifact collection. The release workflow must then use Codemagic secure Apple integration, apply matching App Store distribution signing, generate an IPA and record its size, SHA-256, Codemagic build ID and App Store Connect build number.

After upload, wait for App Store Connect processing. Only a processed build assigned to an Internal Testing group and installed from TestFlight can begin the real iPhone acceptance checklist. Do not submit to App Review as part of this phase.

## Current required inputs

| Input | Current status |
|---|---|
| App Store Connect app record | Must be checked while logged in; no fake App ID/SKU |
| Apple Developer membership | Must be checked in the owner’s Apple account |
| App Store Connect API key | Must be configured in Codemagic secure integration; never commit `.p8` |
| Team ID | Must be supplied through Apple/Codemagic integration |
| Distribution certificate | Must be provisioned by Codemagic secure signing |
| App Store provisioning profile | Must match `com.lunacycle.app` |
| Real iPhone | Required for TestFlight acceptance |
| Production AdMob IDs | Not configured; use test ads until supplied |

## Final classification

**Windows precheck:** COMPLETE.  
**iOS signed build:** NOT COMPLETE.  
**TestFlight Core Acceptance:** NOT COMPLETE.  
**iOS Monetization Acceptance:** DEFERRED.  
**Overall Step 5 Phase 3:** NOT COMPLETE.

## References

[1]: https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/ — Codemagic YAML workflow configuration.

[2]: https://docs.codemagic.io/yaml-code-signing/ios-simulator-builds/ — Codemagic iOS Simulator build guidance.

[3]: https://docs.codemagic.io/yaml-code-signing/signing-ios/ — Codemagic iOS code signing guidance.

[4]: https://developer.apple.com/testflight/ — Apple TestFlight overview.

[5]: https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/ — Apple App Store Connect build upload guidance.
