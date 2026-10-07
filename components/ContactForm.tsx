"use client";
import { useRef, useState, type FormEvent } from "react";
import { verstuurContactMail } from "@/lib/contact-mail";
import { Button } from "@/components/ds/core/Button";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [versturen, setVersturen] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (versturen) return; // voorkomt dubbel versturen bij snel dubbelklikken
    setVersturen(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const { verstuurd: ok, fout } = await verstuurContactMail({
      naam: data.get("name"),
      email: data.get("email"),
      telefoon: data.get("phone"),
      bericht: data.get("message"),
      bedrijf: data.get("company"),
    }).catch(() => ({ verstuurd: false, fout: "Je bericht kon niet worden verstuurd. Bel of mail Gijs rechtstreeks." }));
    setVersturen(false);
    if (ok) { setVerstuurd(true); form.current?.reset(); return; }
    setMessage(fout ?? "Je bericht kon niet worden verstuurd. Bel of mail Gijs rechtstreeks.");
  }

  const field="rounded-[var(--radius-field)] border border-[var(--border-strong)] bg-white px-4 py-3 font-normal focus:outline-none focus:border-[var(--accent-700)] focus:shadow-[var(--shadow-focus)]";

  if (verstuurd) {
    return <div role="status" className="rounded-[var(--radius-md)] bg-white/70 p-6 text-center">
      <p className="font-semibold text-[var(--gijs-donkergroen)]">Bedankt voor je bericht. Gijs neemt zo snel mogelijk contact met je op.</p>
    </div>;
  }

  return <form ref={form} onSubmit={submit} className="grid gap-5" aria-describedby="contact-status">
    {/* Honeypot: voor mensen onzichtbaar (geen display:none, dat herkennen sommige bots), maar
        formulier-bots vullen dit vaak automatisch in. Zie lib/contact-mail.ts. */}
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="contact-company">Bedrijf</label>
      <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
    <label className="grid gap-2 font-semibold" htmlFor="contact-name">Naam<input id="contact-name" name="name" autoComplete="name" required maxLength={100} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-email">E-mailadres<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-phone">Telefoonnummer (optioneel)<input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-question">Waar kunnen we je mee helpen?<textarea id="contact-question" name="message" required maxLength={5000} rows={4} className={field}/></label>
    <p className="text-sm">Je hoeft nog geen maatregel of merk te kiezen.</p>
    <Button type="submit" variant="accent" size="lg" loading={versturen} disabled={versturen} className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">{versturen ? "Bericht versturen…" : "Verstuur bericht"}</Button>
    {message && <p id="contact-status" role="alert" className="text-sm font-semibold gijs-error">{message}</p>}
  </form>;
}
