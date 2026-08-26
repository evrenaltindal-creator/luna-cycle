# Store Reviewer Notes — Apple / Google

## Common reviewer note

Luna Cycle is a local-first period and menstrual cycle tracking application. No Luna account or login is required for core tracking. The reviewer can open the app, complete onboarding, add synthetic period records, use Calendar and Daily Check-In, review basic predictions, inspect Settings and test local export/import without an account.

Core health records are designed to remain primarily on the device. The current release does not operate a remote health-data backend or health analytics service. Period records, daily logs, symptoms, moods, notes and cycle dates are not sent to advertising or billing systems.

Predictions are approximate informational estimates. Luna Cycle is not a medical device and does not provide diagnosis, treatment, contraception guidance or emergency medical decisions. The store listing and in-app disclaimer communicate this limitation.

## Advertising review note

The Free tier may show contextual, non-personalized-first banner advertising only in approved low-sensitivity footer placements: `home_footer` and `insights_footer`. Health data is not used for advertising targeting, is not included in ad request parameters and is not used to build ad profiles. The Luna Plus entitlement is designed to stop ad initialization, requests and active banner display.

Ad consent is separate from health-data controls. The app may present the relevant UMP/privacy-options flow on supported native platforms. Production AdMob account configuration and native UMP runtime verification are not included in this local release-candidate acceptance and should be completed before production advertising.

## Subscription review note

Luna Plus may be offered as an auto-renewing monthly or yearly store subscription. Product name, duration and price are read from localized store product details. Restore purchases re-queries store entitlement. Renewal and cancellation are managed through the Google Play or Apple App Store account. A local health backup cannot unlock Luna Plus.

The current local release candidate has not been accepted as proof of real Play Console billing, internal testing, or App Store sandbox transaction behavior. Those store-specific tests remain deferred until the corresponding test environment is available.

## Privacy and device features

Biometric/device-credential lock is optional and uses the platform verification boundary; the app does not intend to collect biometric data itself. Reminders are local notifications, and private notification text can be kept generic. Export/import is user-triggered. Clear All Data clears local health data but does not cancel an external store subscription.

## Test account

No Luna account test credentials are required because the current core flow is accountless/local-first. A Google Play or Apple App Store billing sandbox/test account may be required by the store’s own testing mechanism; that account is separate from Luna and is not included in this project.

## Reviewer access placeholders

- Privacy Policy URL: `[PRIVACY POLICY URL]`
- Terms of Use URL: `[TERMS URL]`
- Support contact: `[CONTACT EMAIL]`
- Legal developer/company: `[LEGAL NAME]`
