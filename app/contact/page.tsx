import Image from "next/image";
import Link from "next/link";
import { pageMetadata, SITE_URL, ENERGIESCAN_HREF } from "@/lib/seo";
import { JsonLd } from "@/components/SeoSchema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import { CONTACT, WHATSAPP_NUMMER } from "@/lib/content/contact";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { WhatsAppLink } from "@/components/WhatsAppButton";
import { WhatsAppTrackedButton } from "@/components/regio/WhatsAppTrackedButton";
import { EnergiescanUitleg } from "@/components/home/EnergiescanUitleg";
import { RegioBreadcrumb, RegioMain, H2 } from "@/components/regio/RegioBlokken";
import { AdviseurFoto, ADVISEUR_FOTO } from "@/components/regio/VerhaalSecties";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { GoogleScore } from "@/components/reviews/GoogleScore";
import { GoogleReviewsSectie } from "@/components/reviews/GoogleReviewsSectie";
import {
  EYEBROW, SECTIE_BASE, LEAD, TEKST, WIT_BLOK, GRIJS_BLOK, HERO_H1, HERO_INTRO,
  RASTER, RASTER_CEL, TEKSTLINK, H3_GROOT, KAARTKOP, KAARTTEKST, Kop,
} from "@/components/regio/regio-template-styles";
import regioStyles from "@/components/regio/regio.module.css";

export const metadata = pageMetadata("/contact");

// Opzet gelijk aan de maatregel- en regiopagina's: RegioMain met breadcrumb,
// hero met Google-score, sectienav, secties in SECTIE_BASE en een afsluitende
// strook. Alleen feiten die ook zichtbaar op de pagina staan gaan in de JSON-LD.
const SECTIE = SECTIE_BASE + " " + regioStyles.opkomen;

const WHATSAPP_VRAAG = WHATSAPP_NUMMER
  ? `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent("Ik heb een vraag over het verduurzamen van mijn woning.")}`
  : undefined;

const WHATSAPP_SCAN = WHATSAPP_NUMMER
  ? `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent("Ik wil graag een energiescan plannen.")}`
  : undefined;

const KAART = "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white p-6 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]";
const KAART_ICOON = "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-[var(--accent-700)]";

export default function Contact() {
  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[
          { naam: "Home", url: "/" },
          { naam: "Contact", url: "/contact" },
        ]} />

        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact met Gijs",
          url: SITE_URL + "/contact",
          mainEntity: {
            "@type": "Organization",
            "@id": SITE_URL + "/#organization",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "klantenservice",
              telephone: "+31742340777",
              email: CONTACT.email,
              availableLanguage: "nl",
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:30",
                closes: "17:30",
              },
            },
          },
        }} />

        <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
          <p className={EYEBROW + " mb-4"}>Contact</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
            <div className="flex flex-col gap-5">
              <h1 className={HERO_H1}>Even samen naar jouw huis kijken?</h1>
              <p className={HERO_INTRO}>
                Je hoeft nog niet te weten welke maatregel bij je past. Bel, app of mail ons gerust. We bekijken samen
                wat een logische volgende stap is voor jouw woning, met één vast aanspreekpunt van de eerste vraag tot
                en met de uitvoering.
              </p>
              <GoogleScore />
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="accent" size="lg" href={CONTACT.phoneHref} iconLeft="phone">Bel {CONTACT.phone}</Button>
                <WhatsAppLink
                  plaats="contactpagina_hero"
                  tekst="Stel je vraag via WhatsApp"
                  href={WHATSAPP_VRAAG}
                  className="gijs-btn gijs-btn--secondary gijs-btn--lg"
                />
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
                Telefonisch bereikbaar van 08:30 tot 17:30. Liever schrijven? Vul het{" "}
                <Link href="#formulier" className={TEKSTLINK}>contactformulier</Link> in of mail{" "}
                <a href={`mailto:${CONTACT.email}`} className={TEKSTLINK}>{CONTACT.email}</a>.
              </p>
            </div>
            {/* Geen foto maar het beeldmerk: rustiger op een contactpagina en altijd
                op de huisstijl, zonder dat er een toevallige stockfoto naast staat. */}
            <div className="flex aspect-[3/2] lg:aspect-auto lg:h-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--surface-tint)] p-10 sm:p-14">
              <Image
                src="/images/shared/logo/logo.png"
                alt="Gijs"
                width={912} height={520} priority
                sizes="(max-width: 1024px) 60vw, 360px"
                className="h-auto w-full max-w-[300px] lg:max-w-[360px]"
              />
            </div>
          </div>
        </header>

        <MeasureSectionNav tweeRegelsMobiel sections={[
          { id: "bereiken", label: "Bereiken" },
          { id: "formulier", label: "Formulier" },
          { id: "energiescan", label: "Energiescan" },
          { id: "kantoor", label: "Kantoor" },
        ]} />

        {/* Hoe je Gijs bereikt: drie gelijkwaardige manieren, daarnaast de adviseur
            zodat meteen duidelijk is wie je aan de lijn krijgt. */}
        <section id="bereiken" className={SECTIE + " mt-8 lg:mt-12"}>
          <Kop
            eyebrow="Hoe bereik je ons?"
            titel="Zo kom je in contact met Gijs"
            lead="Kies wat jou het beste uitkomt. Je spreekt steeds dezelfde persoon, die je ook verder begeleidt."
          />
          {/* Geen items-start: de kaartenrij en het adviseurblok worden even hoog. */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8 xl:gap-14">
            <ul className={RASTER + " gap-4 lg:gap-5"}>
              <li className={KAART + " " + RASTER_CEL(3, 0)}>
                <span className={KAART_ICOON}><Icon name="phone" size="md" /></span>
                <h3 className={KAARTKOP}>Bellen</h3>
                <p className={KAARTTEKST}>Op werkdagen bereikbaar van 08:30 tot 17:30.</p>
                <a href={CONTACT.phoneHref} className={"mt-auto pt-1 break-words " + TEKSTLINK}>{CONTACT.phone}</a>
              </li>
              <li className={KAART + " " + RASTER_CEL(3, 1)}>
                <span className={KAART_ICOON}><Icon name="message-circle" size="md" /></span>
                <h3 className={KAARTKOP}>WhatsApp</h3>
                <p className={KAARTTEKST}>Handig voor een korte vraag tussendoor.</p>
                <WhatsAppLink
                  plaats="contactpagina_kaart"
                  tekst="Stuur een bericht"
                  href={WHATSAPP_VRAAG}
                  className={"mt-auto pt-1 break-words " + TEKSTLINK}
                />
              </li>
              <li className={KAART + " " + RASTER_CEL(3, 2)}>
                <span className={KAART_ICOON}><Icon name="mail" size="md" /></span>
                <h3 className={KAARTKOP}>Mailen</h3>
                <p className={KAARTTEKST}>Fijn voor een uitgebreide vraag of een bijlage.</p>
                <a href={`mailto:${CONTACT.email}`} className={"mt-auto pt-1 break-words " + TEKSTLINK}>{CONTACT.email}</a>
              </li>
            </ul>

            <aside aria-labelledby="thom-titel" className="flex flex-col gap-4 rounded-[var(--radius-lg)] bg-[var(--accent-100)] p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <AdviseurFoto src={ADVISEUR_FOTO.thom.src} alt={ADVISEUR_FOTO.thom.alt} className="size-16 sm:size-[72px]" />
                <h3 id="thom-titel" className={KAARTKOP}>Thom denkt graag met je mee</h3>
              </div>
              <p className={KAARTTEKST}>
                Hij kijkt onafhankelijk naar je woning en vertelt eerlijk wat er mogelijk is. Van het eerste gesprek tot
                de uitvoering blijft hij je aanspreekpunt.
              </p>
              <div className="mt-auto pt-1">
                <WhatsAppTrackedButton plaats="contactpagina_adviseurblok" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right">Vraag een gratis energiescan aan</WhatsAppTrackedButton>
              </div>
            </aside>
          </div>
        </section>

        {/* Contactformulier in het grijze blok, zodat het rustig op de pagina staat. */}
        <section id="formulier" className={SECTIE}>
          <div className={GRIJS_BLOK}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="flex flex-col gap-4">
                <p className={EYEBROW}>Contactformulier</p>
                <h2 className={H2}>Vertel ons over je huis</h2>
                <p className={TEKST}>
                  Een vraag of een eerste idee is genoeg. Beschrijf kort je woning en waar je aan denkt, dan nemen we
                  contact met je op.
                </p>
                <p className={TEKST}>
                  Weet je nog niet goed waar je moet beginnen? Dat hoeft ook niet. Daar helpen we je juist bij.
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-white p-6 sm:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* De gratis energiescan: de concrete volgende stap vanaf deze pagina. */}
        <section id="energiescan" className={SECTIE}>
          <Kop
            eyebrow="Energiescan"
            titel="Gratis energiescan aan huis"
            lead="Gratis en vrijblijvend, ter waarde van €349. Een adviseur komt langs, kijkt samen met je naar je woning en bespreekt wat er mogelijk is."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className={WIT_BLOK + " border border-[var(--border-default)] flex flex-col gap-5"}>
              <h3 className={H3_GROOT}>Wat je aan de scan hebt</h3>
              <EnergiescanUitleg />
              <div className="flex flex-wrap gap-3 pt-1">
                <WhatsAppTrackedButton plaats="contactpagina_energiescan" href={WHATSAPP_SCAN ?? ENERGIESCAN_HREF} size="md" iconRight="arrow-right">Plan een gratis energiescan</WhatsAppTrackedButton>
                <Button variant="secondary" size="md" href={CONTACT.phoneHref} iconLeft="phone">Bel {CONTACT.phone}</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className={H3_GROOT}>Liever eerst zelf rondkijken?</h3>
              <p className={LEAD}>
                In de digitale woningscan bekijk je op een voorbeeldwoning welke maatregelen er zijn en wat ze doen. Het
                is geen verplichte voorbereiding: je kunt ook direct contact opnemen.
              </p>
              <div>
                <Button variant="accent" size="md" href="/woning" iconRight="arrow-right">Ik wil mijn woning verduurzamen</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Google-reviews, live. Zonder geldige data verdwijnt deze sectie helemaal. */}
        <GoogleReviewsSectie
          className={SECTIE}
          titel="Ervaringen met Gijs"
          intro="Lees hoe andere woningeigenaren het contact, het advies en de uitvoering door Gijs hebben ervaren."
        />

        <section id="kantoor" className={SECTIE}>
          <Kop eyebrow="Kantoor" titel="Hier vind je Gijs" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <div className={GRIJS_BLOK + " flex flex-col gap-5"}>
              <address className="not-italic">
                <ul className="flex flex-col gap-4">
                  <li className="flex items-start gap-3">
                    <span className={KAART_ICOON + " shrink-0"}><Icon name="map-pin" size="md" /></span>
                    <span className={TEKST}>
                      Kantooradres<br />{CONTACT.street}<br />{CONTACT.city}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={KAART_ICOON + " shrink-0"}><Icon name="phone" size="md" /></span>
                    <a href={CONTACT.phoneHref} className={TEKSTLINK}>{CONTACT.phone}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={KAART_ICOON + " shrink-0"}><Icon name="mail" size="md" /></span>
                    <a href={`mailto:${CONTACT.email}`} className={"break-words " + TEKSTLINK}>{CONTACT.email}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className={KAART_ICOON + " shrink-0"}><Icon name="clock" size="md" /></span>
                    <span className={TEKST}>Telefonisch bereikbaar van 08:30 tot 17:30</span>
                  </li>
                </ul>
              </address>
              {CONTACT.kvk && <p className="text-[15px] text-[var(--text-muted)]">KvK: {CONTACT.kvk}</p>}
              <SocialLinks />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className={H3_GROOT}>Langskomen is niet nodig</h3>
              <p className={LEAD}>
                Ons kantoor is geen reguliere bezoeklocatie. Telefonisch of online helpen we je graag verder, ook met
                vragen over een lopende afspraak. Voor je woning zelf komen we juist naar jou toe, tijdens de
                energiescan aan huis.
              </p>
            </div>
          </div>
        </section>

        <section className={`scroll-mt-52 ${regioStyles.opkomen}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-7 sm:px-10 sm:py-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
            <p className="max-w-xl text-[clamp(16px,0.95rem+0.2vw,18px)] leading-[1.6] text-zinc-700 [text-wrap:pretty]">
              Nog een vraag, of wil je gewoon even sparren over je woning? Bel ons, of vraag een gratis energiescan aan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 self-start shrink-0">
              <Button href={CONTACT.phoneHref} variant="accent" size="md" iconLeft="phone">Bel {CONTACT.phone}</Button>
              <WhatsAppTrackedButton plaats="contactpagina_afsluiting" href={ENERGIESCAN_HREF} size="md" iconRight="arrow-right" variant="secondary">Vraag een gratis energiescan aan</WhatsAppTrackedButton>
            </div>
          </div>
        </section>
      </RegioMain>
      <Footer />
    </>
  );
}
