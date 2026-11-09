import type { Alinea } from "./regio-lokaal";
import type { GemeenteVerhaal, LokaalProfiel, ProfielFoto } from "./gemeente-verhalen";

// Zet het verhaal van een gemeente of plaats om naar het profiel waarmee de gedeelde pagina-opbouw
// (LokaalProfielPagina, het Winterswijk-ontwerp) werkt. Alleen wat het verhaal zelf bevat wordt
// gebruikt; ontbreekt iets, dan blijft dat onderdeel weg. Er wordt niets overgenomen van een andere plaats.

const zin = (t: string) => (/[.!?]$/.test(t.trim()) ? t.trim() : `${t.trim()}.`);
const klein = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Twee keuzekaarten uit de eigen bouwperiodes van de pagina: oudste en nieuwste periode, met de
 *  bestaande periodetekst en het eigen percentage. */
function kaartenUitBouwperiodes(naam: string, perioden: { label: string; percentage: number; tekst: string }[]): NonNullable<LokaalProfiel["inzichten"]>["kaarten"] {
  const oudst = perioden[0];
  const nieuwst = perioden[perioden.length - 1];
  return [
    {
      titel: `Woon je in een woning van ${klein(oudst.label)}?`,
      tekst: `In ${naam} is ${oudst.percentage}% van de woningen in deze periode gebouwd. ${oudst.tekst}`,
      links: [{ tekst: "Bekijk spouwmuurisolatie", href: "/maatregelen/spouwmuurisolatie" }],
    },
    {
      titel: `Woon je in een woning van ${klein(nieuwst.label)}?`,
      tekst: `In ${naam} is ${nieuwst.percentage}% van de woningen in deze periode gebouwd. ${nieuwst.tekst}`,
      links: [
        { tekst: "Zonnepanelen", href: "/maatregelen/zonnepanelen" },
        { tekst: "Warmtepomp", href: "/maatregelen/warmtepomp" },
      ],
    },
  ];
}

export function leidProfielAf(v: GemeenteVerhaal, opties: {
  /** Naam voor koppen: de plaats, of de gemeente als de pagina over de gemeente gaat. */
  naam: string;
  gemeente: string;
  foto: ProfielFoto;
}): LokaalProfiel {
  const { naam, gemeente } = opties;
  // Op de gemeentepagina (naam === gemeente) en als de gemeentenaam geen echte plaatsnaam is,
  // gebruik de opgegeven naamDisplay (bijv. "de gemeente Noordoostpolder") in template-zinnen.
  const naamVoorTekst = (naam === gemeente && v.naamDisplay) ? v.naamDisplay : naam;
  const w = v.woningen;
  const blok = v.woningInzichtenBlok;
  const advies = v.persoonlijkAdviesBlok;
  const typeAdvies = v.woningtypeAdvies;

  let inzichten: LokaalProfiel["inzichten"];
  if (w) {
    const alineas: (string | Alinea)[] = blok
      ? [zin(blok.percentage ? `${blok.percentage} ${blok.percentageTekst}` : blok.percentageTekst), blok.bodytekst]
      : [w.lead];

    const kaarten: NonNullable<LokaalProfiel["inzichten"]>["kaarten"] = blok
      ? blok.kaarten.map(k => ({ titel: k.titel, tekst: k.tekst, links: [{ tekst: k.linkTekst, href: k.href }] }))
      : typeAdvies
        ? [
            { titel: typeAdvies.ouder.kop, alineas: typeAdvies.ouder.alineas, links: [{ tekst: typeAdvies.ouder.linkTekst, href: typeAdvies.ouder.linkHref }] },
            { titel: typeAdvies.nieuwer.kop, alineas: typeAdvies.nieuwer.alineas, links: [] },
          ]
        : kaartenUitBouwperiodes(naamVoorTekst, w.bouwperiodes);

    // Deterministische afwisseling Thom/Naud op basis van gemeentenaam (elke gemeente krijgt altijd
    // dezelfde adviseur, maar buurge­meenten wisselen af zodat het niet overal Thom is).
    let _h = 0;
    for (const c of gemeente) _h = (_h * 31 + c.charCodeAt(0)) >>> 0;
    const _isNaud = _h % 2 === 1;
    const _voornaam = _isNaud ? "Naud" : "Thom";

    const adviseur: NonNullable<LokaalProfiel["inzichten"]>["adviseur"] = blok
      ? { h3: blok.adviseur.h3, tekst: [blok.adviseur.tekst], adviseur: blok.adviseur.naam }
      : advies
        ? { h3: advies.h2, tekst: advies.alineas, adviseur: _isNaud ? "naud" : "thom" }
        : typeAdvies
          ? {
              h3: `Naud kijkt graag even mee in ${naamVoorTekst}`,
              adviseur: "naud",
              tekst: [
                [`Twijfel je of jouw woning geschikt is voor spouwmuurisolatie, of heb je toch liever vloerverwarming of zonnepanelen? Naud komt graag bij je langs in ${naamVoorTekst} voor een gratis en vrijblijvende energiescan. Samen kijken jullie naar jouw woning, wat er mogelijk is en welke maatregelen echt bij je passen.`],
                ["Wil je daarna verder verduurzamen? Gijs begeleidt en ontzorgt je van A tot Z."],
              ],
            }
          : {
              h3: `${_voornaam} komt graag langs in ${naamVoorTekst}`,
              adviseur: _isNaud ? "naud" : "thom",
              tekst: [[`Tijdens een gratis energiescan aan huis kijkt ${_voornaam} precies wat er bij jouw woning in ${naamVoorTekst} technisch mogelijk is en welke stap het meeste oplevert. ${_voornaam} ontzorgt je van A tot Z.`]],
            };

    inzichten = {
      h2: blok ? blok.h2 : "Wat vertelt het bouwjaar over jouw woning?",
      alineas,
      cijfers: w.kerncijfers.slice(0, 4),
      extraCijfers: w.kerncijfers.slice(4),
      bouwjaarLead: "Zo is de woningvoorraad verdeeld over de bouwperiodes.",
      bouwperiodes: w.bouwperiodes,
      bronnen: [w.bron],
      bronNoot: w.voetnoot,
      kaarten,
      adviseur,
    };
  }

  return {
    hero: {
      foto: opties.foto,
      intro: v.intro,
      layout: "portret",
      kernenZin: `Gijs werkt in ${naamVoorTekst} en in`,
    },
    inzichten,
    buurtschappen: { eyebrow: "In de buurt", h2: `Plaatsen in de gemeente ${gemeente}` },
    afsluiting: {
      tekst: `Klaar om je woning in ${naamVoorTekst} te verduurzamen? Start de woningscan en zie welke isolatie en installaties bij jouw woning passen. Gijs helpt je graag op weg.`,
      scanKnop: true,
    },
  };
}

/** Pagina voor een plaats zonder eigen woningcijfers of verhaal: alleen de gegevens die er zijn
 *  (naam, gemeente, plaatsnaambord, intro en vragen van de gemeente). Er komen geen cijfers of
 *  teksten bij die niet over deze plaats gaan; het woninginzichtenblok blijft dan weg. */
export function basisPagina(opties: {
  plaats: string;
  gemeente: string;
  gemeenteHref: string;
  foto: ProfielFoto;
  gemeenteIntro?: Alinea[];
  faq: GemeenteVerhaal["faq"];
}): { verhaal: GemeenteVerhaal; profiel: LokaalProfiel } {
  const { plaats, gemeente } = opties;
  const intro: Alinea[] = [
    [`${plaats} hoort bij de gemeente `, { tekst: gemeente, href: opties.gemeenteHref }, `. Wil je je woning in ${plaats} beter isoleren? Hieronder vind je de isolatiemaatregelen. Gemeentelijke subsidies en regelingen controleer je bij je eigen gemeente.`],
    ...(opties.gemeenteIntro ?? []),
  ];
  const verhaal: GemeenteVerhaal = {
    seo: { title: `Isolatie in ${plaats} | Gijs`, description: "" },
    kicker: `${plaats}, gemeente ${gemeente}`,
    h1: `Isolatie in ${plaats}`,
    intro,
    kernen: [],
    lokaal: { titel: "", alineas: [], kernTekst: {}, ontwikkeling: { titel: "", tekst: "" } },
    faq: opties.faq,
    verwant: [],
  };
  const profiel: LokaalProfiel = {
    hero: {
      foto: opties.foto,
      intro,
      layout: "portret",
    },
    afsluiting: {
      tekst: `Je woning isoleren in ${plaats}? Start de woningscan en ontdek welke mogelijkheden bij jouw woning passen.`,
      scanKnop: true,
    },
  };
  return { verhaal, profiel };
}
