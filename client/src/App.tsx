// Style: Sessiz Gül Günlüğü — review terms before entering the private journal.
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import { getPreferences, savePreferences } from "./features/cycle/cycle.storage";
import { createTermsAcceptance, hasCurrentTermsAcceptance, TERMS_VERSION, termsSections } from "./features/legal/terms";

function TermsGate({ onAccept }: { onAccept: () => boolean }) {
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState(false);

  if (declined) return (
    <main className="terms-screen">
      <section className="terms-panel terms-declined">
        <span className="tiny-label">LUNA CYCLE</span>
        <h1>Karar senin.</h1>
        <p>Koşulları kabul etmeden uygulama açılamaz. İstersen metni yeniden inceleyebilirsin.</p>
        <button className="terms-primary" onClick={() => setDeclined(false)}>Koşulları yeniden oku</button>
      </section>
    </main>
  );

  return (
    <main className="terms-screen">
      <section className="terms-panel" aria-labelledby="terms-title">
        <span className="tiny-label">LUNA CYCLE / İLK AÇILIŞ</span>
        <h1 id="terms-title">Devam etmeden önce.</h1>
        <p className="terms-intro">Kullanım koşullarını okuyup kabul ettikten sonra kişisel alanın açılır. İndirmek tek başına kabul sayılmaz.</p>
        <div className="terms-meta">Kullanım Koşulları · Sürüm {TERMS_VERSION} · TestFlight taslağı</div>
        <div className="terms-document" tabIndex={0} aria-label="Luna Cycle kullanım koşullarının tam metni">
          {termsSections.map(section => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
        <p className="terms-privacy-note">Bu kabul, kişisel verilerin işlenmesi için ayrı bir açık rıza yerine geçmez.</p>
        <a className="terms-eula-link" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">Apple standart lisansını oku</a>
        <label className="terms-checkbox"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} />Kullanım koşullarını okudum ve kabul ediyorum.</label>
        {error && <p className="terms-error" role="alert">Kabul kaydı cihazda saklanamadı. Lütfen yeniden dene.</p>}
        <div className="terms-actions">
          <button className="terms-secondary" onClick={() => setDeclined(true)}>Kabul etmiyorum</button>
          <button className="terms-primary" disabled={!checked} onClick={() => { if (!onAccept()) setError(true); }}>Kabul et ve devam et</button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [accepted, setAccepted] = useState(() => hasCurrentTermsAcceptance(getPreferences().termsAcceptance));
  useEffect(() => {
    const onClear = () => setAccepted(false);
    window.addEventListener("luna-terms-cleared", onClear);
    return () => window.removeEventListener("luna-terms-cleared", onClear);
  }, []);
  if (accepted) return <Home />;
  return <TermsGate onAccept={() => {
    const saved = savePreferences({ ...getPreferences(), termsAcceptance: createTermsAcceptance() });
    if (saved) setAccepted(true);
    return saved;
  }} />;
}
