# App Store Connect / TestFlight Readiness

## Verified repository values

| Field | Value | Status |
|---|---|---|
| App name | Luna Cycle | Repository verified |
| Platform | iOS | Repository target verified |
| Bundle ID | `com.lunacycle.app` | Xcode project/config verified |
| SKU | Not available in repository | Must be read from the real App Store Connect record |
| Apple App ID | Not available in repository | Must not be fabricated |
| Marketing version | `1.0.0` | Xcode project verified |
| Build number | `1` | Xcode project verified |
| Scheme | `App` | Project target; confirm with `xcodebuild -list` on macOS |

## Required App Store Connect setup

The Apple account owner must first confirm that an iOS app record named **Luna Cycle** exists and that its registered Bundle ID is exactly `com.lunacycle.app`. If no record exists, create it in App Store Connect using the real SKU selected by the owner; this document intentionally does not invent a SKU or Apple App ID.

Before a signed Codemagic run, configure the App Store Connect integration through Codemagic’s secure UI. The integration must provide the Apple Developer Team context and access to certificates/profiles without placing a `.p8` key, certificate, provisioning profile or password in the repository. The release workflow’s `ios_signing` block is intentionally limited to the real bundle identifier and App Store distribution type.

The signing sequence is: configure App Store Connect API access in Codemagic; create or select an App Store distribution certificate; create or select a matching App Store provisioning profile for `com.lunacycle.app`; run the release workflow; verify archive and IPA output; then upload the IPA. A successful archive without a successful signing/export result must not be reported as a TestFlight-ready build.

## TestFlight internal testing sequence

After upload, wait for App Store Connect processing to reach a usable state. Do not report TestFlight readiness while the build is still processing, invalid, or waiting for missing compliance information. Add internal testers only after the build is available, assign the processed build to the internal group, and install through the TestFlight app. A sideloaded IPA or locally installed simulator app is not TestFlight acceptance evidence.

Record the actual device model, iOS version, TestFlight install source, App Store Connect build number, Codemagic build ID, IPA size and IPA SHA-256 in the final report. Do not include tester passwords, purchase tokens, API keys or personal health data in the repository or report.

## Current status

| Gate | Status |
|---|---:|
| App Store Connect app record | NOT VERIFIED — account login required |
| Apple Developer membership | NOT VERIFIED — account login required |
| Codemagic App Store Connect integration | NOT CONFIGURED in repository |
| Distribution certificate/profile | NOT CONFIGURED in repository |
| Signed archive / IPA | DEFERRED — requires macOS and Apple signing |
| Upload / processing | DEFERRED — requires signed IPA and App Store Connect |
| TestFlight internal group | DEFERRED — requires processed build |
| Real iPhone acceptance | DEFERRED — requires TestFlight install |

No automatic App Store Review submission is part of this readiness plan. Internal testing must be completed before any production review submission is considered.
