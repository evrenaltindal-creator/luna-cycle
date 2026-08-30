# LUNA CYCLE — TESTFLIGHT LIVE ACCEPTANCE

## Current decision

GitHub Actions Run #8 completed successfully with Xcode 26.6 and the iOS 26.5 SDK. The workflow prepared the signing keychain and provisioning profile, verified the Apple Distribution identity, created the signed archive, exported the IPA, uploaded the release artifacts, and uploaded the IPA to TestFlight.

App Store Connect reports upload processing for version `1.0.0` build `8` as `Complete`. Export compliance was resolved by declaring that the app implements none of the proprietary or non-OS standard encryption algorithms listed by Apple. The build's TestFlight beta status is `Ready to Submit`, which makes it eligible for internal distribution. No App Review or TestFlight external beta review submission was made.

| Field | Result | Evidence / note |
|---|---|---|
| Repository secrets | **9/9** | GitHub repository secret-name count; values were not read or recorded |
| Workflow | **PASS** | GitHub Actions Run #8 completed successfully |
| Xcode | **26.6 (17F113)** | Workflow toolchain validation |
| iOS SDK | **26.5** | Workflow SDK validation; required major version 26 or later |
| Archive | **PASS** | `Create signed Release archive` completed successfully |
| Code signing | **PASS** | Signing configuration, temporary keychain/profile preparation, and Apple Distribution identity verification completed successfully |
| IPA | **GENERATED** | Downloaded release artifact contains the exported IPA |
| IPA size | **3,187,212 bytes** | Local artifact verification |
| IPA SHA-256 | `76bb35673038fc3785d0d08e24abdf292ab180ea64ba13737243c93329586f10` | Local SHA-256 verification |
| App Store Connect upload | **PASS** | `Upload IPA to TestFlight` completed successfully |
| Apple upload processing | **COMPLETE / READY FOR TESTING** | App Store Connect Build Uploads reports `Complete` |
| Version | **1.0.0** | App Store Connect build metadata |
| Build | **8** | App Store Connect build metadata |
| TestFlight beta status | **READY TO SUBMIT** | Build can be distributed to internal testers; it was not submitted for external testing or App Review |
| Export compliance | **RESOLVED** | `Missing Compliance` cleared after the approved exemption declaration |
| Internal group | **ASSIGNED** | Internal group `test` is attached to Build 8 |
| Internal testers | **0** | No tester was added or invited |
| TestFlight install | **NOT VERIFIED** | No real-device installation was performed |
| Real iPhone acceptance | **NOT COMPLETE** | Device testing remains outside this CI/upload acceptance run |

## Run #8 evidence

GitHub Actions Run #8: https://github.com/evrenaltindal-creator/luna-cycle/actions/runs/33278435742

The run used commit `4c2f2849639303d9869b01c6e94deb369a4d1d13` and completed on August 30, 2026. Every workflow step completed successfully, including unit tests, TypeScript validation, web build, Capacitor sync, Swift package resolution, signing checks, archive creation, IPA export, artifact upload, TestFlight upload, and temporary signing-material cleanup.

## Scope boundary

No secret value, signing file, provisioning profile, Base64 payload, certificate private key, P12 password, keychain password, or App Store Connect API private key is recorded in this report or committed to the repository.

No tester was added, no tester invitation was sent, no external testing review was requested, and no App Review submission was made.

## Final status

CI / SIGNING / IPA / UPLOAD ACCEPTANCE: **PASS**

APPLE UPLOAD PROCESSING: **COMPLETE — READY FOR TESTING**

REAL DEVICE ACCEPTANCE: **NOT VERIFIED — REQUIRES AN AUTHORIZED TESTER AND DEVICE SESSION**
