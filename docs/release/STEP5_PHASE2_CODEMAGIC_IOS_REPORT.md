# LUNA CYCLE — STEP 5 PHASE 2
# CODEMAGIC + iOS NATIVE BUILD / SIGNING READINESS REPORT

**Tarih:** 23 Ağustos 2026  
**Uygulama:** Luna Cycle  
**Bundle ID:** `com.lunacycle.app`  
**Kapsam:** Capacitor 8 iOS project, dependency sync, Codemagic YAML, unsigned simulator build pipeline, signing-ready configuration, native plugin inventory and artifact readiness.

## Executive result

**STEP 5 PHASE 2 STATUS: PIPELINE PREPARED — MACOS/XCODE AND APPLE CREDENTIAL VALIDATION DEFERRED.**

The repository now contains a root-level `codemagic.yaml` with two workflows: `luna-cycle-ios` for deterministic validation and unsigned iOS Simulator `.app` generation, and `luna-cycle-ios-release` for a future App Store archive/IPA after Codemagic code-signing identities and Apple Developer Portal credentials are configured. No Apple credential, certificate, provisioning profile, App Store Connect API key or production AdMob identifier was added to the repository.

The Windows environment successfully ran the web test/check/build chain and `npx cap sync ios`. The actual Xcode, Swift, simulator, Swift Package resolution, unsigned `.app`, signed archive and IPA cannot be claimed from Windows because `xcodebuild`, `swift` and CocoaPods are not available in this environment. Codemagic must run the iOS workflows on macOS.

## Acceptance matrix

| Area | Status | Evidence / conclusion |
|---|---:|---|
| iOS project present | **PASS** | `ios/App/App.xcodeproj` exists. The project contains an embedded `project.xcworkspace`; no separate top-level `.xcworkspace` or Podfile was found. |
| Capacitor iOS dependency | **PASS** | `@capacitor/core@8.5.0`, `@capacitor/cli@8.5.0` and `@capacitor/ios@8.5.0` are aligned on major 8; `@capacitor/ios` was added exact. |
| Capacitor sync iOS | **PASS** | `npx cap sync ios` completed and found 12 plugins. |
| Web tests | **PASS** | 59/59 Vitest tests passed after the iOS dependency change. |
| TypeScript | **PASS** | `corepack pnpm run check` completed in the chained validation command. |
| Web production build | **PASS** | `corepack pnpm run build` completed in the chained validation command. |
| Swift Package Manager | **PREPARED** | `ios/App/CapApp-SPM/Package.swift` uses `capacitor-swift-pm@8.5.0`; the Codemagic workflow runs `xcodebuild -resolvePackageDependencies`. Actual resolution is deferred to macOS. |
| CocoaPods | **NOT USED** | No Podfile was found; the workflow does not run `pod install` blindly. |
| Codemagic YAML | **PASS** | Root `codemagic.yaml` exists and passes Prettier YAML formatting validation. |
| Unsigned Simulator build | **DEFERRED** | Workflow is prepared with `CODE_SIGN_IDENTITY=""`, `CODE_SIGNING_REQUIRED=NO`, `CODE_SIGNING_ALLOWED=NO`; no Windows Xcode execution possible. |
| Simulator install/launch/smoke | **DEFERRED** | Requires a macOS simulator and a successfully built `.app`. |
| Apple signing-ready configuration | **PREPARED** | Release workflow includes `ios_signing: distribution_type: app_store` and `bundle_identifier: com.lunacycle.app`; no credential is configured, so no signing PASS is claimed. |
| Signed archive / IPA | **DEFERRED** | Requires Apple Developer membership, App Store Connect API key, certificate and matching provisioning profile configured in Codemagic. |
| Bundle ID | **PASS** | Debug/Release Xcode target settings contain `PRODUCT_BUNDLE_IDENTIFIER = com.lunacycle.app`. |
| Display name | **PASS** | `Info.plist` contains `CFBundleDisplayName = Luna Cycle`. |
| Version | **PASS** | `MARKETING_VERSION = 1.0.0`; `CURRENT_PROJECT_VERSION = 1`. No arbitrary version change was made. |
| Face ID usage description | **PASS** | `NSFaceIDUsageDescription` is present with a private-health-record context. Actual biometric runtime remains deferred. |
| ATT / IDFA | **TO BE VERIFIED** | `NSUserTrackingUsageDescription` is absent in the current plist; final iOS SDK privacy manifests and production AdMob configuration must determine the final ATT/IDFA declaration. |
| Local notifications | **PREPARED** | `LocalNotificationsPlugin` is registered; no push backend/capability was added. Native runtime acceptance is deferred. |
| Secure storage | **PREPARED** | Secure storage package and `SecureStorage` registration are present; native linker/compile test is deferred. |
| AdMob / UMP | **PREPARED** | `AdMobPlugin` is registered after sync; the package’s iOS SPM dependency must resolve Google Mobile Ads/UMP on macOS. Production ad configuration is deferred. |
| StoreKit billing | **DEFERRED** | No native StoreKit product/purchase plugin class is registered in the current iOS target; the JS billing contract remains separate. Real product query/purchase/restore cannot be claimed. |
| iOS biometric bridge | **DEFERRED** | No confirmed `NativeBiometric` registration or LocalAuthentication implementation is present in the current iOS target. |
| Privacy screen | **PREPARED** | `PrivacyScreenPlugin` is registered after sync; simulator/runtime lifecycle validation is deferred. |
| Filesystem/share/file picker | **PREPARED** | `FilesystemPlugin`, `SharePlugin` and `FilePickerPlugin` are registered. Native compile/runtime validation is deferred. |

## Codemagic workflow design

The `luna-cycle-ios` workflow is intentionally non-signing. It enables Corepack/pnpm, installs using the repository lockfile, runs `test`, `check` and `build`, synchronizes Capacitor iOS, resolves Swift packages, prints project metadata and builds a generic iOS Simulator app with signing disabled. The `.app`, `.dSYM` and Xcode log are exposed as artifacts.

The `luna-cycle-ios-release` workflow is signing-ready but not signing-complete. It references the actual bundle identifier, runs the same deterministic validation and sync, resolves Swift packages, calls `xcode-project use-profiles` and then `xcode-project build-ipa`. It intentionally contains no secret group name or credential value. Codemagic UI must be configured with the Apple Developer Portal/App Store Connect integration, distribution certificate and matching App Store provisioning profile before this workflow can succeed.

## Important generated-file note

The Windows Capacitor sync generated local Swift Package paths with Windows separators in `ios/App/CapApp-SPM/Package.swift`. This is not used as evidence of a successful macOS build. The Codemagic workflow deliberately executes `npx cap sync ios` on macOS before `xcodebuild -resolvePackageDependencies`; the macOS-generated manifest is the source of truth for the CI build.

## Artifacts

No iOS `.app`, `.ipa`, `.xcarchive` or iOS SHA-256 artifact was produced in this Windows environment. Android RC artifacts remain covered by the Step 4 consolidation report and are not iOS evidence.

## Remaining gates

The remaining gates are macOS/Codemagic-only: resolve Swift packages, execute `xcodebuild -list`, confirm the `App` scheme, run unsigned simulator build, optionally install and launch the resulting `.app`, review native logs, verify StoreKit/AdMob/UMP/notifications/secure-storage compilation, configure Apple signing credentials, generate a signed archive/IPA and perform App Store Connect/TestFlight validation. Real Apple credential data must be supplied through Codemagic’s secret management and must not be committed.

## References

[1]: https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/ — Codemagic `codemagic.yaml` workflow structure and build machine configuration.

[2]: https://docs.codemagic.io/yaml-code-signing/ios-simulator-builds/ — Codemagic unsigned iOS Simulator build procedure.

[3]: https://docs.codemagic.io/yaml-code-signing/signing-ios/ — Codemagic iOS certificates, provisioning profiles and `ios_signing` configuration.

[4]: https://developer.apple.com/documentation/xcode — Apple Xcode build and project tooling documentation.

## Command execution record — Windows host

The requested sequence was executed against the repository root. `npm ci` was attempted first and correctly failed because this repository has no `package-lock.json` or npm shrinkwrap; its deterministic lockfile is `pnpm-lock.yaml`. To preserve the project’s package-manager contract, the equivalent `corepack pnpm install --frozen-lockfile` was run successfully, followed by `npm test`, `npm run check`, `npm run build` and `npx cap sync ios`.

The web test suite passed with 59/59 tests. TypeScript checking and the production build completed successfully, and Capacitor sync completed successfully while finding 12 iOS plugins, including `AdMobPlugin` and `PrivacyScreenPlugin`.

The macOS-only continuation was checked on the connected Windows host. `xcodebuild`, `xcrun`, `swift` and `pod` are not available. Therefore SPM resolve, `xcodebuild -scheme App -sdk iphonesimulator ... CODE_SIGNING_ALLOWED=NO`, simulator install/launch, signed archive and IPA generation remain **DEFERRED / NOT VERIFIED**, not failed product behavior.

## Command execution record — pnpm baseline

The requested pnpm sequence was executed again. `corepack enable` could not write the global `pnpx` shim on the Windows host and returned `EPERM`; this is a host permission limitation. The global-shim-independent equivalent then completed with `corepack pnpm`: frozen install, unit tests, TypeScript check, production build and `corepack pnpm exec cap sync ios` all passed. The test suite remained 59/59 and Capacitor sync found 12 iOS plugins.

A fresh native gate check confirmed that `xcodebuild`, `xcrun`, `swift` and `pod` are unavailable on this Windows host. SPM resolve and the unsigned Simulator command were therefore not executable here, and no `.app` artifact was found. These remain Codemagic macOS tasks rather than product failures.

## Four-step execution record — pnpm / SPM / Simulator / artifact

1. `corepack pnpm install` completed successfully with the existing `pnpm-lock.yaml` and pnpm 10.4.1.
2. SPM resolve was checked and remained **DEFERRED** because `xcodebuild` is unavailable on the Windows host.
3. The unsigned `xcodebuild` iOS Simulator build was checked and remained **DEFERRED** for the same reason.
4. A repository-wide `.app` artifact search returned **NOT FOUND**; no iOS `.app` was produced on Windows.

The corresponding Codemagic macOS workflow remains the execution path for steps 2–4.
