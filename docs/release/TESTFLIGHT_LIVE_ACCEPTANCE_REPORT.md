# LUNA CYCLE — TESTFLIGHT LIVE ACCEPTANCE

## Current decision

GitHub Actions Run #10 completed successfully with Xcode 26.6 and the iOS 26.5 SDK. This release includes the native StoreKit 2 billing bridge and LocalAuthentication biometric bridge. The workflow prepared the signing keychain and provisioning profile, verified the Apple Distribution identity, created the signed archive, exported the IPA, uploaded the release artifacts, and uploaded the IPA to TestFlight.

App Store Connect reports upload processing for version `1.0.0` build `10` as `Complete`. No export-compliance action is pending. The build's TestFlight beta status is `Ready to Submit`, which makes it eligible for internal distribution. No App Review or TestFlight external beta review submission was made.

| Field | Result | Evidence / note |
|---|---|---|
| Repository secrets | **9/9** | GitHub repository secret-name count; values were not read or recorded |
| Workflow | **PASS** | GitHub Actions Run #10 completed successfully |
| Xcode | **26.6 (17F113)** | Workflow toolchain validation |
| iOS SDK | **26.5** | Workflow SDK validation; required major version 26 or later |
| Archive | **PASS** | `Create signed Release archive` completed successfully |
| Code signing | **PASS** | Signing configuration, temporary keychain/profile preparation, and Apple Distribution identity verification completed successfully |
| IPA | **GENERATED** | Downloaded release artifact contains the exported IPA |
| IPA size | **3,221,056 bytes** | Local artifact verification |
| IPA SHA-256 | `410dee72eda95a259e0e4ed53197b926f7015e60e50c471980f284f072a9d944` | Local SHA-256 verification |
| App Store Connect upload | **PASS** | `Upload IPA to TestFlight` completed successfully |
| Apple upload processing | **COMPLETE / READY FOR TESTING** | App Store Connect Build Uploads reports `Complete` |
| Version | **1.0.0** | App Store Connect build metadata |
| Build | **10** | App Store Connect build metadata |
| TestFlight beta status | **READY TO SUBMIT** | Build can be distributed to internal testers; it was not submitted for external testing or App Review |
| Export compliance | **RESOLVED** | `Missing Compliance` cleared after the approved exemption declaration |
| Internal group | **ASSIGNED** | Internal group `test` is attached to Build 10 |
| Internal testers | **0** | No tester was added or invited |
| What to Test | **NOT SET** | Tester-facing build notes require approved text before saving |
| StoreKit products | **NOT CONFIGURED** | App Store Connect has no subscription group or subscription products; `luna_plus_monthly` and `luna_plus_yearly` cannot be purchased until configured |
| TestFlight install | **NOT VERIFIED** | No real-device installation was performed |
| Real iPhone acceptance | **NOT COMPLETE** | Device testing remains outside this CI/upload acceptance run |

## Run #10 evidence

GitHub Actions Run #10: https://github.com/evrenaltindal-creator/luna-cycle/actions/runs/33316461185

The run used commit `4b81f6867ad684d222af78b8387e5d5f7a1b9dcd` and completed on August 30, 2026. Every workflow step completed successfully, including unit tests, TypeScript validation, web build, Capacitor sync, Swift package resolution, unsigned simulator compilation of the native StoreKit and biometric bridges, signing checks, archive creation, IPA export, artifact upload, TestFlight upload, and temporary signing-material cleanup.

## Scope boundary

No secret value, signing file, provisioning profile, Base64 payload, certificate private key, P12 password, keychain password, or App Store Connect API private key is recorded in this report or committed to the repository.

No tester was added, no tester invitation was sent, no external testing review was requested, and no App Review submission was made.

## Final status

CI / SIGNING / IPA / UPLOAD ACCEPTANCE: **PASS**

APPLE UPLOAD PROCESSING: **COMPLETE — READY FOR TESTING**

REAL DEVICE ACCEPTANCE: **NOT VERIFIED — REQUIRES AN AUTHORIZED TESTER AND DEVICE SESSION**
