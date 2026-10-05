import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/contact");
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import { CONTACT, WHATSAPP_NUMMER } from "@/lib/content/contact";
import { Button } from "@/components/ds/core/Button";

export default function Contact() {
  return (
    <><Header /><main className="mx-auto px-6 py-16 md:py-24 text-[var(--gijs-donkergroen)]" style={{ maxWidth: "var(--container-wide)" }}>
      <p className="mb-3 text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Contact met Gijs</p>
      <h1 className="mb-6 text-[var(--gijs-donkergroen)]">Even samen naar jouw huis kijken?</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">Je hoeft nog niet precies te weten welke maatregel bij je past. Bel of mail ons gerust. Samen bekijken we wat een logische volgende stap is.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {WHATSAPP_NUMMER&&<a className="gijs-btn gijs-btn--accent gijs-btn--lg" href={`https://wa.me/${WHATSAPP_NUMMER}`} target="_blank" rel="noopener noreferrer">Stel je vraag via WhatsApp</a>}
        <Button variant="accent" size="lg" href={CONTACT.phoneHref}>Bel {CONTACT.phone}</Button>
        <Button variant="secondary" size="lg" href="#contactformulier">Stel je vraag</Button>
      </div><p className="mt-4 text-[var(--text-muted)]">Telefonisch bereikbaar van 08:30 tot 17:30.</p>
      <div className="mt-12 grid gap-10 md:grid-cols-2 [&>*]:min-w-0">
        <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] p-8"><h2 className="text-[length:var(--fs-display-3)] text-[var(--gijs-donkergroen)] mb-5">Hier vind je Gijs</h2>
          <address className="not-italic text-lg leading-9">Kantooradres<br/>{CONTACT.street}<br />{CONTACT.city}<br />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br /><a href={CONTACT.phoneHref}>Tel: {CONTACT.phone}</a>
            {CONTACT.kvk && <><br />KvK: {CONTACT.kvk}</>}
          </address><p className="mt-4 leading-relaxed">Ons kantoor is geen reguliere bezoeklocatie. Telefonisch of online helpen we je graag, ook met vragen over bestaande afspraken.</p><div className="mt-5"><SocialLinks /></div>
        </section>
        <section id="contactformulier" className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] p-6 md:p-8 scroll-mt-36 self-start"><h2 className="mb-3 text-[length:var(--fs-display-3)] text-[var(--gijs-donkergroen)]">Vertel ons over je huis</h2><p className="mb-6">Een vraag of een eerste idee is genoeg. Hieronder kun je je bericht alvast opstellen.</p><ContactForm/></section>
        <section id="energiescan" className="py-4 scroll-mt-36 md:col-span-2"><h2 className="text-[length:var(--fs-display-3)] text-[var(--gijs-donkergroen)] mb-4">Gratis energiescan aan huis</h2><p className="mb-4 text-xl font-semibold">Gratis en vrijblijvend, ter waarde van €349.</p><p className="mb-4">Je kunt direct contact opnemen. De digitale woningscan is geen verplichte voorbereiding.</p>
          <p className="text-lg mb-6">Met de digitale woningscan bekijk je mogelijkheden op een voorbeeldwoning. Voor persoonlijk advies over jouw eigen huis kun je een gratis energiescan aan huis bespreken.</p>
          <div className="flex flex-wrap gap-3"><Button variant="accent" size="lg" href="/woning" iconRight="arrow-right">Start de woningscan</Button><Button variant="secondary" size="lg" href={CONTACT.phoneHref} className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">Bel om een energiescan te plannen</Button></div>
        </section>
      </div>
    </main><Footer /></>
  );
}
