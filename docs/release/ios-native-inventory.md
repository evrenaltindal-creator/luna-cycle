# iOS Native Integration Inventory

**Application:** Luna Cycle  
**Bundle identifier:** `com.lunacycle.app`  
**App name:** `Luna Cycle`  
**Deployment target:** iOS 15.0  
**Dependency manager:** Swift Package Manager through the generated local `ios/App/CapApp-SPM/Package.swift`. No Podfile is present in the current iOS project, so the pipeline must not run `pod install` blindly.

## Native project identity

| Item | Current value | Evidence / status |
|---|---|---|
| iOS project | `ios/App/App.xcodeproj` | Present in repository |
| Workspace | `ios/App/App.xcodeproj/project.xcworkspace` | Embedded project workspace path; no separate `.xcworkspace` was found |
| Xcode scheme | `App` | Native target name in `project.pbxproj`; must be confirmed by `xcodebuild -list` on macOS |
| Bundle ID | `com.lunacycle.app` | Debug and Release target settings |
| Display name | `Luna Cycle` | `Info.plist` `CFBundleDisplayName` |
| Marketing version | `1.0.0` | Debug and Release `MARKETING_VERSION` |
| Build number | `1` | Debug and Release `CURRENT_PROJECT_VERSION` |
| Minimum iOS | `15.0` | Project settings and `CapApp-SPM` platforms |
| Signing | Automatic project setting; no CI credentials committed | Signing-ready configuration only; signed build deferred |

## Plugin and native dependency inventory

| Integration | Package/version | iOS support / manager | Registration or compile status |
|---|---|---|---|
| Capacitor runtime | `@capacitor/core@8.5.0`, Swift package `capacitor-swift-pm@8.5.0` | iOS 15 / SwiftPM | Present in `CapApp-SPM`; compile must run on macOS |
| Capacitor iOS CLI package | `@capacitor/ios@8.5.0` | Capacitor 8 | Added to `package.json`; `npx cap sync ios` completed on Windows |
| Secure storage | `@aparajita/capacitor-secure-storage@8.0.0` | iOS 15 / SwiftPM; `keychain-swift` dependency | `SecureStorage` registered; native compile deferred |
| Local notifications | `@capacitor/local-notifications@8.3.1` | Capacitor SwiftPM | `LocalNotificationsPlugin` registered; local-only behavior, no push backend |
| AdMob / UMP | `@capacitor-community/admob@8.1.0` | iOS 15 / SwiftPM; Google Mobile Ads `13.6.0`, UMP `3.1.x` | `AdMobPlugin` registered after latest sync; test IDs only until production config exists |
| Billing / StoreKit | Custom JS/native contract; no native StoreKit plugin class in current `packageClassList` | Native Swift implementation not present in current synced registration | **DEFERRED**; product/purchase/restore compile and runtime require future StoreKit bridge |
| Biometric | Custom Android/native contract; no `NativeBiometric` class after latest iOS sync | No confirmed iOS LocalAuthentication implementation in current target | **DEFERRED**; do not claim iOS biometric compile PASS |
| Privacy/background protection | `@capacitor/privacy-screen@2.0.1` | Capacitor plugin / SwiftPM | `PrivacyScreenPlugin` registered after sync; runtime deferred |
| File import/export | `@capawesome/capacitor-file-picker@8.0.4`, `@capacitor/filesystem@8.1.3`, `@capacitor/share@8.0.1` | SwiftPM | `FilePickerPlugin`, `FilesystemPlugin`, `SharePlugin` registered |
| Status bar / splash | `@capacitor/status-bar@8.0.3`, `@capacitor/splash-screen@8.0.2` | SwiftPM | Registered; config present |
| Keyboard / haptics / app | `@capacitor/keyboard@8.0.5`, `@capacitor/haptics@8.0.2`, `@capacitor/app@8.1.1` | SwiftPM | Registered |

## Permission and tracking audit

`Info.plist` contains `NSFaceIDUsageDescription` with a health-privacy context and does not currently contain `NSUserTrackingUsageDescription`. The latter must remain absent unless the final iOS production configuration actually requests ATT/IDFA. Android’s `AD_ID` removal is not evidence about iOS tracking behavior.

The iOS project includes no push backend or push capability in the reviewed project. Notifications are intended to remain local. Final Xcode capability and entitlements review is still required.

## Important Windows-to-macOS note

The latest Capacitor sync completed on Windows and generated local Swift Package paths using Windows separators in `Package.swift`. Codemagic must run `npx cap sync ios` on macOS before resolving packages; the generated macOS manifest is the source of truth for the build. No manual edit to the generated `Package.swift` should be committed as a substitute for macOS sync.
