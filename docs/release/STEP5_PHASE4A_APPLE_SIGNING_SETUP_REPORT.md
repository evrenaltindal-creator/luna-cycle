

## Browser verification update — 26 August 2026

Apple Developer Account session was successfully opened. The account page showed an active Apple Developer Program membership and a valid renewal state. The exact team identifier was visible in the authenticated account but is intentionally not reproduced in this report.

The Identifiers list was then checked. The account did not list `com.lunacycle.app`. An explicit App ID creation flow was attempted with description `Luna Cycle` and Bundle ID `com.lunacycle.app`, with no optional capabilities selected. Apple rejected the registration with the message: **“An attribute in the provided entity has an invalid value. An App ID with identifier 'com.lunacycle.app' is not available. Please enter a different string.”**

Therefore the exact Bundle ID is currently **NOT AVAILABLE / BLOCKED** for this Apple team. No alternate Bundle ID was created because changing the Bundle ID would break the repository baseline and was not authorized. The registration form was left without creating an identifier.

Updated classification: Apple Developer Program **ACTIVE**; exact Bundle ID `com.lunacycle.app` **NOT REGISTERED / UNAVAILABLE**; signed build readiness **NOT READY**. App Store Connect app record, API key, distribution certificate, provisioning profile and Codemagic Apple integration remain unverified or not configured.

## Bundle ID registration result — 26 August 2026

The approved replacement identifier `com.lunacycle.tracker` was registered successfully in the authenticated Apple Developer account. The Identifiers list now displays `Luna Cycle` with identifier `com.lunacycle.tracker`. No optional capability was enabled during registration.

Status: **PASS — Bundle ID registered.**

Repository migration is now complete. The root Capacitor config, synchronized iOS Capacitor metadata, Xcode Debug/Release `PRODUCT_BUNDLE_IDENTIFIER` values, Android namespace/applicationId/MainActivity package, and Codemagic release `bundle_identifier` now use `com.lunacycle.tracker`. No credential or private key was added to the repository.

Windows validation after migration: `corepack pnpm test` completed successfully, `corepack pnpm run check` completed successfully, `corepack pnpm run build` completed successfully, and `corepack pnpm exec cap sync ios` completed successfully. Native macOS SPM resolution, Xcode build, signing, and TestFlight upload remain pending because they require the Codemagic macOS workflow and Apple signing configuration.

Next required work is to create or verify the matching App Store Connect app record before configuring Codemagic signing.
