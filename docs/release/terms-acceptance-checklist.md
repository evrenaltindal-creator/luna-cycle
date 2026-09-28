# Luna Cycle — first-launch terms gate

The TestFlight build now blocks entry until the user explicitly checks acceptance of the full in-app terms and taps **Kabul et ve devam et**. Downloading or installing alone is not treated as an in-app acceptance. Declining leaves the app inaccessible. The accepted terms version and UTC timestamp are stored in local preferences, not sent to a Luna server, not exported in backup, and removed by **Tüm yerel kayıtları sil**. A changed `TERMS_VERSION` prompts acceptance again. Settings lets users re-read the same in-app text.

This is a local UX record, **not server-side evidence that can identify a person or prove assent across devices**. The in-app text is labeled a TestFlight draft. It does not substitute for a country-specific legal review or for any separate privacy notice/consent obligation.

Before an App Store release:

- Replace the outstanding legal provider name, business/contact address, email, effective date and jurisdiction placeholders in the Turkish and English release drafts with verified facts.
- Have qualified counsel review the actual in-app text, store listing, privacy notice and any custom App Store EULA together. Consumer and statutory privacy rights must not be waived by a blanket disclaimer.
- Decide whether to rely on Apple's standard EULA or submit a custom EULA in App Store Connect; the current gate does not itself configure a custom EULA there.
- Remove the TestFlight-draft label only after the final terms are approved, and increment `TERMS_VERSION` whenever the displayed text materially changes.
