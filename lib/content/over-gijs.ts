// Inhoud voor /over-gijs. Alleen bevestigde bedrijfsinformatie (zie CONTACT in
// lib/content/contact.ts), de eerder goedgekeurde tekst over Gijs en Thom, en
// de expliciet aangeleverde merklaag ("Iedereen kent wel een Gijs", "Energie
// voor Synergie", 18+ jaar ervaring). Reviews zijn bewust een placeholder
// totdat de Google-koppeling actief is. Team en "Een Gijs" gebruiken inmiddels
// echte, aangeleverde foto's (public/over-gijs); waar nog geen passende echte
// foto beschikbaar is, blijft het beeld bewust weg (geen stockfoto erbij
// verzinnen) in plaats van een placeholder te tonen.

// TODO: alleen invullen zodra bevestigd; nooit een indicatie geven die er niet is.
export const CIJFERBEWIJS = {
  ervaringJaren: 18,
  googleBeoordeling: null as number | null,
  aantalReviews: null as number | null,
} as const;

// De vier "Een Gijs…"-uitspraken. `kop` volgt op "Een Gijs". Eerlijkheid en
// vakkennis zijn bewust samengevoegd tot één uitspraak (korter verhaal, zie
// ook het founder-hoofdstuk voor de uitgebreide 18+ jaar ervaring).
// Alle vier hebben een beeld (public/over-gijs). "brengt het simpel" en "kent
// zijn vak" zijn echte foto's; "luistert altijd" en "denkt mee" zijn
// gegenereerde beelden, expliciet goedgekeurd voor deze twee plekken.
export const EEN_GIJS = [
  {
    kop: "luistert altijd.",
    tekst: "Eerst begrijpen wat er speelt, daarna pas kijken wat logisch is.",
    beeld: "/images/over-gijs/een-gijs/een-gijs-luistert-altijd.png",
    positie: "50% 35%",
    alt: "Een man luistert aandachtig tijdens een gesprek op de bank",
  },
  {
    kop: "brengt het simpel.",
    tekst: "Geen ingewikkelde vaktaal als hetzelfde ook duidelijk uitgelegd kan worden.",
    beeld: "/images/over-gijs/een-gijs/een-gijs-praat-normaal.jpg",
    positie: "50% 38%",
    alt: "Twee mannen in gesprek op straat bij een Nederlandse woning",
  },
  {
    kop: "denkt altijd mee.",
    tekst: "Niet naar één maatregel kijken, maar naar de woning, de wensen van de bewoner en hoe alles met elkaar samenhangt.",
    beeld: "/images/over-gijs/een-gijs/een-gijs-denkt-mee.png",
    positie: "50% 30%",
    alt: "Twee mannen lopen samen door een woonstraat en kijken naar een woning",
  },
  {
    kop: "is eerlijk, en kent zijn vak.",
    tekst: `Past een maatregel niet bij je woning? Dan hoor je dat gewoon. Dat kan omdat Gijs weet waar hij het over heeft: ${CIJFERBEWIJS.ervaringJaren}+ jaar ervaring met isolatie, installaties, subsidies en financiering.`,
    // Vervangt de eerdere foto (installateur zonder valbeveiliging op een hellend dak) om
    // veiligheidsredenen, op verzoek van Max. v2 van de vervangfoto.
    beeld: "/images/over-gijs/een-gijs/een-gijs-weet-wat-hij-doet-v2.png",
    positie: "55% 25%",
    alt: "Een medewerker van Gijs loopt tevreden bij een woning vandaan",
  },
] as const;

export const KERNWAARDEN = [
  { woord: "Persoonlijk", tekst: "Altijd een gesprek, niet alleen een rapport." },
  { woord: "Eerlijk", tekst: "Ook als het advies is om iets (nog) niet te doen." },
  { woord: "Onafhankelijk", tekst: "Geen vaste pakketten, wel wat technisch en financieel logisch is." },
  { woord: "Deskundig", tekst: `${CIJFERBEWIJS.ervaringJaren}+ jaar ervaring, en een advies waar je op kunt bouwen.` },
] as const;

export const GIJS_HELPT_BIJ = "isolatie, installaties, energieopwekking, subsidies, financiering, energiescans en vervolgstappen richting uitvoering";

// Geen bio's, functies of quotes verzinnen. Foto's zijn echte, aangeleverde
// portretten (public/over-gijs); `fotoPositie` stuurt alleen de uitsnede.
export const TEAM = [
  { naam: "Thom", functie: "Oprichter", foto: "/images/over-gijs/thom/thom-portret.png", fotoPositie: "50% 50%" },
  { naam: "Naud", functie: "Accountmanager", foto: "/images/over-gijs/team/naud.jpeg", fotoPositie: "50% 50%" },
  { naam: "Kim", functie: "Backoffice manager", foto: "/images/over-gijs/team/kim.png", fotoPositie: "50% 50%" },
] as const;
