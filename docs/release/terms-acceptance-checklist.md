# Luna Cycle — first-launch terms gate

The app blocks entry until the user explicitly checks acceptance of the full in-app terms and taps **Kabul et ve devam et**. Downloading or installing alone is not treated as an in-app acceptance. Declining leaves the app inaccessible. The accepted terms version and UTC timestamp are stored in local preferences, not sent to a Luna server, not exported in backup, and removed by **Tüm yerel kayıtları sil**. A changed `TERMS_VERSION` prompts acceptance again. Settings lets users re-read the same in-app text.

This is a local UX record, **not server-side evidence that can identify a person or prove assent across devices**. Terms version `2026-10-01.1` identifies the owner-authorized provider as Evren Altındal (Türkiye), with contact `info@ewocom.com`, in Turkish, English, Russian, German and Spanish. It supplements Apple's standard EULA and preserves mandatory consumer and personal-data rights. The product terms do not substitute for any separate privacy notice/consent obligation. No country-specific legal review is claimed.

Before an App Store release:

- Verify the provider/contact and privacy-policy URL in App Store Connect against the owner's approved information.
- Have qualified counsel review the actual in-app text, store listing, privacy notice and any custom App Store EULA together. Consumer and statutory privacy rights must not be waived by a blanket disclaimer.
- Decide whether to rely on Apple's standard EULA or submit a custom EULA in App Store Connect; the current gate does not itself configure a custom EULA there.
- The owner authorized publication and provider/contact disclosure; the TestFlight-draft label is removed. The version change requires existing testers to review and accept the updated terms.
