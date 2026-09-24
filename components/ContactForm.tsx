"use client";
import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/content/contact";
import { Button } from "@/components/ds/core/Button";

export default function ContactForm() {
  const [message,setMessage]=useState("");
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setMessage("Verzenden is nog niet aangesloten. Je bericht is niet verstuurd en je invoer blijft staan. Bel of mail Gijs om je vraag te stellen.");}
  const field="rounded-[var(--radius-field)] border border-[var(--border-strong)] bg-white px-4 py-3 font-normal focus:outline-none focus:border-[var(--accent-700)] focus:shadow-[var(--shadow-focus)]";
  return <form onSubmit={submit} className="grid gap-5" aria-describedby="contact-status">
    <p id="contact-status" className="rounded-[var(--radius-md)] bg-white/70 p-4 text-sm">Dit is een lokaal prototype. Het formulier verstuurt nog geen berichten. Je kunt wel bellen of mailen naar <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
    <label className="grid gap-2 font-semibold" htmlFor="contact-name">Naam<input id="contact-name" name="name" autoComplete="name" required maxLength={100} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-email">E-mailadres<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-phone">Telefoonnummer (optioneel)<input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={field}/></label>
    <label className="grid gap-2 font-semibold" htmlFor="contact-question">Waar kunnen we je mee helpen?<textarea id="contact-question" name="message" required maxLength={5000} rows={4} className={field}/></label>
    <p className="text-sm">Je hoeft nog geen maatregel of merk te kiezen.</p>
    <Button type="submit" variant="accent" size="lg" className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">Controleer mijn bericht · prototype</Button>
    <p role="status" className="text-sm font-semibold">{message}</p>
  </form>;
}
