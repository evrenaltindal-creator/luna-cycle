// Style: Sessiz Gül Günlüğü — review terms before entering the private journal.
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import { getPreferences, savePreferences } from "./features/cycle/cycle.storage";
import { createTermsAcceptance, hasCurrentTermsAcceptance, PRIVACY_POLICY_URL, TERMS_VERSION, termsSections } from "./features/legal/terms";
import { getLanguage, initializeLanguage, t } from "./i18n";
import { LanguageSelector } from "./i18n/LanguageSelector";
import { detectLanguage } from "./i18n/language";

function TermsGate({ onAccept }: { onAccept: () => boolean }) {
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState(false);

  if (declined) return (
    <main className="terms-screen">
      <section className="terms-panel terms-declined">
        <span className="tiny-label">LUNA CYCLE</span>
        <LanguageSelector compact />
        <h1>{t("Karar senin.")}</h1>
        <p>{t("Koşulları kabul etmeden uygulama açılamaz. İstersen metni yeniden inceleyebilirsin.")}</p>
        <button className="terms-primary" onClick={() => setDeclined(false)}>{t("Koşulları yeniden oku")}</button>
      </section>
    </main>
  );

  return (
    <main className="terms-screen">
      <section className="terms-panel" aria-labelledby="terms-title">
        <span className="tiny-label">LUNA CYCLE / {t("İLK AÇILIŞ")}</span>
        <LanguageSelector compact />
        <h1 id="terms-title">{t("Devam etmeden önce.")}</h1>
        <p className="terms-intro">{t("Kullanım koşullarını okuyup kabul ettikten sonra kişisel alanın açılır. İndirmek tek başına kabul sayılmaz.")}</p>
        <div className="terms-meta">{t("Kullanım Koşulları")} · {t("Sürüm")} {TERMS_VERSION}</div>
        <div className="terms-document" tabIndex={0} aria-label={t("Luna Cycle kullanım koşullarının tam metni")}>
          {termsSections.map(section => (
            <section key={section.title}>
              <h2>{t(section.title)}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}
            </section>
          ))}
        </div>
        <p className="terms-privacy-note">{t("Bu kabul, kişisel verilerin işlenmesi için ayrı bir açık rıza yerine geçmez.")}</p>
        <a className="terms-eula-link" href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">{t("Gizlilik politikasını oku")}</a>
        <a className="terms-eula-link" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">{t("Apple standart lisansını oku")}</a>
        <label className="terms-checkbox"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} />{t("Kullanım koşullarını okudum ve kabul ediyorum.")}</label>
        {error && <p className="terms-error" role="alert">{t("Kabul kaydı cihazda saklanamadı. Lütfen yeniden dene.")}</p>}
        <div className="terms-actions">
          <button className="terms-secondary" onClick={() => setDeclined(true)}>{t("Kabul etmiyorum")}</button>
          <button className="terms-primary" disabled={!checked} onClick={() => { if (!onAccept()) setError(true); }}>{t("Kabul et ve devam et")}</button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [language, setLanguageState] = useState(() => getPreferences().language ?? detectLanguage());
  if (getLanguage() !== language) initializeLanguage(language);
  const [accepted, setAccepted] = useState(() => hasCurrentTermsAcceptance(getPreferences().termsAcceptance));
  useEffect(() => {
    const onClear = () => setAccepted(false);
    const onLanguage = () => setLanguageState(getLanguage());
    window.addEventListener("luna-terms-cleared", onClear);
    window.addEventListener("luna-language-changed", onLanguage);
    return () => { window.removeEventListener("luna-terms-cleared", onClear); window.removeEventListener("luna-language-changed", onLanguage); };
  }, []);
  if (accepted) return <Home />;
  return <TermsGate onAccept={() => {
    const saved = savePreferences({ ...getPreferences(), termsAcceptance: createTermsAcceptance() });
    if (saved) setAccepted(true);
    return saved;
  }} />;
}
