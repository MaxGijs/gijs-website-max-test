// Datamodel voor de lokale SEO-structuur: Nederland → provincie → gemeente
// → plaats. Eén template per niveau (app/regio/...), geen losse page.tsx per
// plaats. Namen, gemeente-plaatsrelaties en plaatsnaamborden komen uit de
// aangeleverde "Gemeenteborden"-set (lib/content/lokale-seo.ts,
// public/images/regio/gemeenteborden/<Gemeente>/<Kern>.png). Er wordt hier niets aan
// toegevoegd dat niet in die set staat.
//
// Twee vlaggen per gemeente en plaats:
// - gepubliceerd: de pagina bestaat en wordt gelinkt. Zet dit alleen aan als
//   de inhoud gecontroleerd is (naam, relatie, afbeelding).
// - indexeerbaar: de pagina mag in zoekmachines en de sitemap. Alleen voor
//   complete, geverifieerde pagina's (geen doorway-pagina's). Werkt bovenop
//   SEO_INDEXABLE in lib/seo.ts: previews blijven altijd noindex.
//
// Unieke, plaatsgerichte inhoud (Berkum, Borne, Hengelo, Enschede) staat los hiervan in
// lib/content/regio-lokaal.ts; de templates tonen die als hij er is, anders de generieke opzet.
import { LOKALE_SEO_GEMEENTEN } from "./lokale-seo";

export type RegioProvincie = { slug: string; naam: string; gepubliceerd: boolean; indexeerbaar: boolean };
export type RegioGemeente = {
  slug: string;
  naam: string;
  provincie: string;
  plaatsen: string[];
  // Alleen invullen met een geverifieerde, officiële link van de gemeente
  // zelf (bijv. www.<gemeente>.nl/subsidie...). Zonder deze link toont de
  // gemeentelijke-subsidiesectie geen knop — Gijs zoekt gemeentelijke
  // subsidies niet voor de klant uit en verzint geen gemeentelink.
  officieleSubsidieUrl?: string;
  gepubliceerd: boolean;
  indexeerbaar: boolean;
};
export type RegioPlaats = {
  slug: string;
  naam: string;
  gemeente: string;
  provincie: string;
  // Plaatsnaambord uit de Gemeenteborden-set; ontbreekt voor plaatsen buiten Twente (bijv. Berkum).
  afbeelding?: string;
  gepubliceerd: boolean;
  indexeerbaar: boolean;
};

export const slugify = (naam: string) =>
  naam.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const REGIO_PROVINCIES: RegioProvincie[] = [
  { slug: "overijssel", naam: "Overijssel", gepubliceerd: true, indexeerbaar: true },
  { slug: "gelderland", naam: "Gelderland", gepubliceerd: false, indexeerbaar: false },
];

// Welke gemeenten en plaatsen live staan. Sleutel = gemeente-slug.
// Een plaats met dezelfde naam als de gemeente (bijv. Borne in Borne) krijgt
// geen eigen plaatspagina: die valt samen met de gemeentepagina.
const PUBLICATIE: Record<string, { indexeerbaar: boolean; plaatsen: Record<string, { indexeerbaar: boolean }> }> = {
  // Plaatsen staan bewust op indexeerbaar: false — dunne pagina's (noindex,
  // follow via createMetadata's robots.follow:true), totdat ze net als de
  // gemeentepagina's eigen, unieke content krijgen. Ze blijven wel
  // gepubliceerd (bestaan en worden gelinkt), alleen niet in de sitemap
  // (zie REGIO_INDEXEERBARE_PADEN hieronder, die op indexeerbaar filtert).
  // Hertme en Zenderen zijn officieel dorpen (geen buurtschap), dus krijgen een eigen,
  // indexeerbare pagina — net als de rest van deze lijst, op verzoek van Max na het leggen van de
  // aangeleverde plaatsenset naast https://nl.wikipedia.org/wiki/Lijst_van_steden_en_dorpen_in_Overijssel
  // (2026-10-19). Pure buurtschappen (geen eigen voorzieningen/dorpsstatus) blijven indexeerbaar: false.
  borne: { indexeerbaar: true, plaatsen: { hertme: { indexeerbaar: true }, zenderen: { indexeerbaar: true } } },
  // Beckum: enige kerkdorp van de gemeente, bronverifieerd herkenningspunt ('t Proggiehoes).
  hengelo: { indexeerbaar: true, plaatsen: { beckum: { indexeerbaar: true } } },
  // Boekelo, Glanerbrug, Lonneker, Usselo: dorpen met elk een bronverifieerd rijksmonument als
  // herkenningspunt. Twekkelo: buurtschap, maar met voldoende unieke, bronverifieerde content
  // (Johanneskerk, drie essen/zoutwinning) om toch een eigen pagina te verdienen.
  enschede: { indexeerbaar: true, plaatsen: { boekelo: { indexeerbaar: true }, glanerbrug: { indexeerbaar: true }, lonneker: { indexeerbaar: true }, usselo: { indexeerbaar: true }, twekkelo: { indexeerbaar: true } } },
  // Aadorp en Bornerbroek zijn dorpen; Harbrinkhoek-Mariaparochie is een dorp dat de gemeentegrens
  // met Tubbergen overschrijdt. Azelo, Bavinkel, Deldenerbroek, Tusveld en Weitemanslanden zijn
  // buurtschappen zonder eigen voorzieningen en blijven daarom indexeerbaar: false.
  almelo: { indexeerbaar: true, plaatsen: { aadorp: { indexeerbaar: true }, bornerbroek: { indexeerbaar: true }, "harbrinkhoek-mariaparochie": { indexeerbaar: true }, azelo: { indexeerbaar: false }, bavinkel: { indexeerbaar: false }, deldenerbroek: { indexeerbaar: false }, tusveld: { indexeerbaar: false }, weitemanslanden: { indexeerbaar: false } } },
  oldenzaal: { indexeerbaar: true, plaatsen: {} },
  "hof-van-twente": { indexeerbaar: true, plaatsen: { bentelo: { indexeerbaar: true }, delden: { indexeerbaar: true }, diepenheim: { indexeerbaar: true }, goor: { indexeerbaar: true }, hengevelde: { indexeerbaar: true }, markelo: { indexeerbaar: true } } },
  // Pilot B uit de Deep Research-uitbreiding (2026-10-19): gemeentenaam en zoekplaats lopen hier
  // sterk uiteen, dus Rijssen en Holten, Nijverdal en Vriezenveen/Vroomshoop krijgen eigen pagina's.
  // Beuseberg, Dijkerhoek, Espelo, Ligtenberg en Neerdorp zijn buurtschappen, geen dorpen.
  "rijssen-holten": { indexeerbaar: true, plaatsen: { rijssen: { indexeerbaar: true }, holten: { indexeerbaar: true }, beuseberg: { indexeerbaar: false }, dijkerhoek: { indexeerbaar: false }, espelo: { indexeerbaar: false }, ligtenberg: { indexeerbaar: false }, neerdorp: { indexeerbaar: false } } },
  // Daarle, Daarlerveen en Haarle zijn net als Nijverdal officieel dorpen.
  hellendoorn: { indexeerbaar: true, plaatsen: { nijverdal: { indexeerbaar: true }, daarle: { indexeerbaar: true }, daarlerveen: { indexeerbaar: true }, haarle: { indexeerbaar: true } } },
  // Den Ham, De Pollen, Geerdijk en Westerhaar-Vriezenveensewijk zijn net als Vriezenveen en
  // Vroomshoop officieel dorpen. "Westerhoeven" bleek bij gericht onderzoek (2026-10-19, een
  // gemeentelijke nieuwsbrief) geen officiële kern te zijn maar een verspreide-huizengebied
  // ("Verspreide huizen De Westerhoeve"); de Wikipedia-bronlijst had dit dus fout. Terug op
  // indexeerbaar: false, net als Bruinehaar en Weitemanslanden (buurtschappen).
  twenterand: { indexeerbaar: true, plaatsen: { vriezenveen: { indexeerbaar: true }, vroomshoop: { indexeerbaar: true }, "den-ham": { indexeerbaar: true }, geerdijk: { indexeerbaar: true }, "de-pollen": { indexeerbaar: true }, "westerhaar-vriezenveensewijk": { indexeerbaar: true }, westerhoeven: { indexeerbaar: false }, bruinehaar: { indexeerbaar: false }, weitemanslanden: { indexeerbaar: false } } },
  // Wierden, Tubbergen, Dinkelland, Haaksbergen en Losser: nieuwe gemeentepagina's (pilot B-uitbreiding,
  // 23 oktober 2026). Alle kernen met bord zijn indexeerbaar; kernen zonder bord ('t Loo, Beerkdorp,
  // Nijstad in Dinkelland) blijven false.
  wierden: {
    indexeerbaar: true,
    plaatsen: {
      enter: { indexeerbaar: true },
      "hoge-hexel": { indexeerbaar: true },
      ijpelo: { indexeerbaar: true },
      notter: { indexeerbaar: true },
      rectum: { indexeerbaar: true },
      wierden: { indexeerbaar: true },
      zuna: { indexeerbaar: true },
    },
  },
  tubbergen: {
    indexeerbaar: true,
    plaatsen: {
      albergen: { indexeerbaar: true },
      fleringen: { indexeerbaar: true },
      geesteren: { indexeerbaar: true },
      harbrinkhoek: { indexeerbaar: true },
      hezingen: { indexeerbaar: true },
      langeveen: { indexeerbaar: true },
      manderveen: { indexeerbaar: true },
      mariaparochie: { indexeerbaar: true },
      reutum: { indexeerbaar: true },
      tubbergen: { indexeerbaar: true },
      vasse: { indexeerbaar: true },
    },
  },
  dinkelland: {
    indexeerbaar: true,
    plaatsen: {
      "t-loo": { indexeerbaar: false },
      beerkdorp: { indexeerbaar: false },
      berghum: { indexeerbaar: true },
      breklenkamp: { indexeerbaar: true },
      denekamp: { indexeerbaar: true },
      deurningen: { indexeerbaar: true },
      dulder: { indexeerbaar: true },
      gammelke: { indexeerbaar: true },
      "het-stift": { indexeerbaar: true },
      lattrop: { indexeerbaar: true },
      lemselo: { indexeerbaar: true },
      nijstad: { indexeerbaar: false },
      noordijk: { indexeerbaar: true },
      nutter: { indexeerbaar: true },
      ootmarsum: { indexeerbaar: true },
      "oud-ootmarsum": { indexeerbaar: true },
      rossum: { indexeerbaar: true },
      saasveld: { indexeerbaar: true },
      tilligte: { indexeerbaar: true },
      volthe: { indexeerbaar: true },
      weerselo: { indexeerbaar: true },
    },
  },
  haaksbergen: {
    indexeerbaar: true,
    plaatsen: {
      buurse: { indexeerbaar: true },
      haaksbergen: { indexeerbaar: true },
      "sint-isidorushoeve": { indexeerbaar: true },
    },
  },
  losser: {
    indexeerbaar: true,
    plaatsen: {
      beuningen: { indexeerbaar: true },
      "de-lutte": { indexeerbaar: true },
      glane: { indexeerbaar: true },
      losser: { indexeerbaar: true },
      overdinkel: { indexeerbaar: true },
    },
  },
  // Dalfsen, Deventer, Hardenberg, Kampen, Olst-Wijhe, Ommen, Raalte, Staphorst, Steenwijkerland en
  // Zwartewaterland: nieuwe gemeentepagina's (uitbreiding Overijssel, 27 oktober 2026). Kernen
  // indexeerbaar: false totdat er unieke plaatsinhoud (woningcijfers, tekst) per kern beschikbaar is.
  dalfsen: {
    indexeerbaar: true,
    plaatsen: {
      dalfsen: { indexeerbaar: false },
      nieuwleusen: { indexeerbaar: false },
      lemelerveld: { indexeerbaar: false },
      hoonhorst: { indexeerbaar: false },
      oudleusen: { indexeerbaar: false },
      dalmsholte: { indexeerbaar: false },
      gerner: { indexeerbaar: false },
      hessum: { indexeerbaar: false },
      ankum: { indexeerbaar: false },
      broekhuizen: { indexeerbaar: false },
      dalfserveld: { indexeerbaar: false },
      "de-marshoek": { indexeerbaar: false },
      "de-meele": { indexeerbaar: false },
      "den-hulst": { indexeerbaar: false },
      emmen: { indexeerbaar: false },
      engeland: { indexeerbaar: false },
      holt: { indexeerbaar: false },
      lenthe: { indexeerbaar: false },
      mataram: { indexeerbaar: false },
      millingen: { indexeerbaar: false },
      "ooster-dalfsen": { indexeerbaar: false },
      oudleusenerveld: { indexeerbaar: false },
      rechteren: { indexeerbaar: false },
      rosengaerde: { indexeerbaar: false },
      ruitenveen: { indexeerbaar: false },
      slennebroek: { indexeerbaar: false },
      strenkhaar: { indexeerbaar: false },
      vennenberg: { indexeerbaar: false },
      welsum: { indexeerbaar: false },
    },
  },
  deventer: {
    indexeerbaar: true,
    plaatsen: {
      deventer: { indexeerbaar: false },
      bathmen: { indexeerbaar: false },
      diepenveen: { indexeerbaar: false },
      colmschate: { indexeerbaar: false },
      schalkhaar: { indexeerbaar: false },
      lettele: { indexeerbaar: false },
      okkenbroek: { indexeerbaar: false },
      apenhuizen: { indexeerbaar: false },
      averlo: { indexeerbaar: false },
      dortherhoek: { indexeerbaar: false },
      frieswijk: { indexeerbaar: false },
      linde: { indexeerbaar: false },
      loo: { indexeerbaar: false },
      molenbelt: { indexeerbaar: false },
      "oude-molen": { indexeerbaar: false },
      oxe: { indexeerbaar: false },
      pieriksmars: { indexeerbaar: false },
      rande: { indexeerbaar: false },
      snipperling: { indexeerbaar: false },
      tjoene: { indexeerbaar: false },
      zuidloo: { indexeerbaar: false },
    },
  },
  hardenberg: {
    indexeerbaar: true,
    plaatsen: {
      hardenberg: { indexeerbaar: false },
      dedemsvaart: { indexeerbaar: false },
      gramsbergen: { indexeerbaar: false },
      slagharen: { indexeerbaar: false },
      marienberg: { indexeerbaar: false },
      balkbrug: { indexeerbaar: false },
      bergentheim: { indexeerbaar: false },
      heemse: { indexeerbaar: false },
      "de-krim": { indexeerbaar: false },
      lutten: { indexeerbaar: false },
      sibculo: { indexeerbaar: false },
      kloosterhaar: { indexeerbaar: false },
      radewijk: { indexeerbaar: false },
      "oud-avereest": { indexeerbaar: false },
      holthone: { indexeerbaar: false },
      diffelen: { indexeerbaar: false },
      rheeze: { indexeerbaar: false },
      brucht: { indexeerbaar: false },
      ane: { indexeerbaar: false },
      "de-haandrik": { indexeerbaar: false },
      "t-bergje": { indexeerbaar: false },
      "t-haantje": { indexeerbaar: false },
      anerveen: { indexeerbaar: false },
      anevelde: { indexeerbaar: false },
      benedenvaart: { indexeerbaar: false },
      braamberg: { indexeerbaar: false },
      bruchterveld: { indexeerbaar: false },
      collendoorn: { indexeerbaar: false },
      collendoornerveen: { indexeerbaar: false },
      "de-belt": { indexeerbaar: false },
      "de-haar": { indexeerbaar: false },
      "de-maat": { indexeerbaar: false },
      "de-meene": { indexeerbaar: false },
      "de-mulderij": { indexeerbaar: false },
      "de-pol": { indexeerbaar: false },
      "de-schans": { indexeerbaar: false },
      "den-huizen": { indexeerbaar: false },
      "den-kaat": { indexeerbaar: false },
      "den-oosterhuis": { indexeerbaar: false },
      "den-velde": { indexeerbaar: false },
      "den-westerhuis": { indexeerbaar: false },
      ebbenbroek: { indexeerbaar: false },
      engeland: { indexeerbaar: false },
      "gouden-ploeg": { indexeerbaar: false },
      "groot-oever": { indexeerbaar: false },
      hanekamp: { indexeerbaar: false },
      heemserveen: { indexeerbaar: false },
      holtheme: { indexeerbaar: false },
      hoogenweg: { indexeerbaar: false },
      keiendorp: { indexeerbaar: false },
      loozen: { indexeerbaar: false },
      "lutten-oever": { indexeerbaar: false },
      lutterhartje: { indexeerbaar: false },
      "noord-stegeren": { indexeerbaar: false },
      "oud-bergentheim": { indexeerbaar: false },
      "oud-lutten": { indexeerbaar: false },
      rheezerveen: { indexeerbaar: false },
      schuinesloot: { indexeerbaar: false },
      "sluis-7": { indexeerbaar: false },
      sponturfwijk: { indexeerbaar: false },
      strooiendorp: { indexeerbaar: false },
      venebrugge: { indexeerbaar: false },
      westerhuizingerveld: { indexeerbaar: false },
      witman: { indexeerbaar: false },
    },
  },
  kampen: {
    indexeerbaar: true,
    plaatsen: {
      kampen: { indexeerbaar: false },
      ijsselmuiden: { indexeerbaar: false },
      grafhorst: { indexeerbaar: false },
      zalk: { indexeerbaar: false },
      wilsum: { indexeerbaar: false },
      kamperveen: { indexeerbaar: false },
      "s-heerenbroek": { indexeerbaar: false },
      bisschopswetering: { indexeerbaar: false },
      "de-heuvels": { indexeerbaar: false },
      "de-zande": { indexeerbaar: false },
      oosterholt: { indexeerbaar: false },
      veecaten: { indexeerbaar: false },
      zuideinde: { indexeerbaar: false },
    },
  },
  "olst-wijhe": {
    indexeerbaar: true,
    plaatsen: {
      olst: { indexeerbaar: false },
      wijhe: { indexeerbaar: false },
      wesepe: { indexeerbaar: false },
      herxen: { indexeerbaar: false },
      boerhaar: { indexeerbaar: false },
      boskamp: { indexeerbaar: false },
      "den-nul": { indexeerbaar: false },
      duur: { indexeerbaar: false },
      eikelhof: { indexeerbaar: false },
      elshof: { indexeerbaar: false },
      fortmond: { indexeerbaar: false },
      hengforden: { indexeerbaar: false },
      marle: { indexeerbaar: false },
      middel: { indexeerbaar: false },
      welsum: { indexeerbaar: false },
      welsumerveld: { indexeerbaar: false },
    },
  },
  ommen: {
    indexeerbaar: true,
    plaatsen: {
      ommen: { indexeerbaar: false },
      vilsteren: { indexeerbaar: false },
      beerze: { indexeerbaar: false },
      stegeren: { indexeerbaar: false },
      varsen: { indexeerbaar: false },
      giethmen: { indexeerbaar: false },
      archem: { indexeerbaar: false },
      junne: { indexeerbaar: false },
      lemele: { indexeerbaar: false },
      witharen: { indexeerbaar: false },
      arrien: { indexeerbaar: false },
      arrierveld: { indexeerbaar: false },
      beerzerveld: { indexeerbaar: false },
      besthmen: { indexeerbaar: false },
      dalmsholte: { indexeerbaar: false },
      eerde: { indexeerbaar: false },
      emsland: { indexeerbaar: false },
      hoogengraven: { indexeerbaar: false },
      nieuwebrug: { indexeerbaar: false },
      ommerbosch: { indexeerbaar: false },
      ommerschans: { indexeerbaar: false },
      ommerveld: { indexeerbaar: false },
      rotbrink: { indexeerbaar: false },
      stegerveld: { indexeerbaar: false },
      vinkenbuurt: { indexeerbaar: false },
      zeesse: { indexeerbaar: false },
    },
  },
  raalte: {
    indexeerbaar: true,
    plaatsen: {
      raalte: { indexeerbaar: false },
      heino: { indexeerbaar: false },
      heeten: { indexeerbaar: false },
      luttenberg: { indexeerbaar: false },
      marienheem: { indexeerbaar: false },
      broekland: { indexeerbaar: false },
      "de-hooge-wegen": { indexeerbaar: false },
      "laag-zuthem": { indexeerbaar: false },
      lierderholthuis: { indexeerbaar: false },
      "nieuw-heeten": { indexeerbaar: false },
    },
  },
  staphorst: {
    indexeerbaar: true,
    plaatsen: {
      staphorst: { indexeerbaar: false },
      rouveen: { indexeerbaar: false },
      ijhorst: { indexeerbaar: false },
      "de-lichtmis": { indexeerbaar: false },
      lankhorst: { indexeerbaar: false },
      punthorst: { indexeerbaar: false },
      "de-leijen": { indexeerbaar: false },
      halfweg: { indexeerbaar: false },
      hamingen: { indexeerbaar: false },
      westerhuizingerveld: { indexeerbaar: false },
    },
  },
  steenwijkerland: {
    indexeerbaar: true,
    plaatsen: {
      steenwijk: { indexeerbaar: false },
      vollenhove: { indexeerbaar: false },
      oldemarkt: { indexeerbaar: false },
      giethoorn: { indexeerbaar: false },
      "sint-jansklooster": { indexeerbaar: false },
      tuk: { indexeerbaar: false },
      steenwijkerwold: { indexeerbaar: false },
      wanneperveen: { indexeerbaar: false },
      blokzijl: { indexeerbaar: false },
      kuinre: { indexeerbaar: false },
      "belt-schutsloot": { indexeerbaar: false },
      blankenham: { indexeerbaar: false },
      ossenzijl: { indexeerbaar: false },
      willemsoord: { indexeerbaar: false },
      paasloo: { indexeerbaar: false },
      scheerwolde: { indexeerbaar: false },
      baarlo: { indexeerbaar: false },
      baars: { indexeerbaar: false },
      barsbeek: { indexeerbaar: false },
      basse: { indexeerbaar: false },
      basserveld: { indexeerbaar: false },
      "blauwe-hand": { indexeerbaar: false },
      "de-bult": { indexeerbaar: false },
      "de-klosse": { indexeerbaar: false },
      "de-kolk": { indexeerbaar: false },
      "de-krieger": { indexeerbaar: false },
      "de-pol": { indexeerbaar: false },
      doosje: { indexeerbaar: false },
      dwarsgracht: { indexeerbaar: false },
      eese: { indexeerbaar: false },
      eesveen: { indexeerbaar: false },
      heetveld: { indexeerbaar: false },
      ijsselham: { indexeerbaar: false },
      jonen: { indexeerbaar: false },
      kadoelen: { indexeerbaar: false },
      kalenberg: { indexeerbaar: false },
      kallenkote: { indexeerbaar: false },
      leeuwte: { indexeerbaar: false },
      marijenkampen: { indexeerbaar: false },
      moespot: { indexeerbaar: false },
      molenhoek: { indexeerbaar: false },
      muggenbeet: { indexeerbaar: false },
      nederland: { indexeerbaar: false },
      onna: { indexeerbaar: false },
      poepershoek: { indexeerbaar: false },
      roekebosch: { indexeerbaar: false },
      ronduite: { indexeerbaar: false },
      thij: { indexeerbaar: false },
      westeinde: { indexeerbaar: false },
      wetering: { indexeerbaar: false },
      "witte-paarden": { indexeerbaar: false },
      zuideinde: { indexeerbaar: false },
      zuidveen: { indexeerbaar: false },
    },
  },
  zwartewaterland: {
    indexeerbaar: true,
    plaatsen: {
      hasselt: { indexeerbaar: false },
      genemuiden: { indexeerbaar: false },
      zwartsluis: { indexeerbaar: false },
      mastenbroek: { indexeerbaar: false },
      baarlo: { indexeerbaar: false },
      cellemuiden: { indexeerbaar: false },
      "de-velde": { indexeerbaar: false },
      genne: { indexeerbaar: false },
      "genne-overwaters": { indexeerbaar: false },
      holten: { indexeerbaar: false },
      "kamperzeedijk-oost": { indexeerbaar: false },
      "kamperzeedijk-west": { indexeerbaar: false },
      kievitsnest: { indexeerbaar: false },
      "nieuwe-wetering": { indexeerbaar: false },
      roebolligehoek: { indexeerbaar: false },
      streukel: { indexeerbaar: false },
      zwartewatersklooster: { indexeerbaar: false },
    },
  },
  // Zwolle heeft officieel één woonplaats (Zwolle). De sub-kernen zijn wijken en buurtschappen.
  // Westenholte (voormalige gemeente), Stadshagen (grote nieuwbouwwijk), Windesheim (historisch dorp),
  // Wijthmen, Herfte en Haerst (buurtschappen in het Vechtdal) krijgen elk een eigen pagina met eigen inhoud.
  // Alle overige buurtschappen en gehuchten uit de Zwolse plaatsnaamborden-set krijgen een basisroute
  // (gepubliceerd, niet in sitemap) zodat bezoekers via de kernenlijst op de gemeentepagina kunnen doorklikken.
  zwolle: {
    indexeerbaar: true,
    plaatsen: {
      berkum: { indexeerbaar: true },
      westenholte: { indexeerbaar: true },
      stadshagen: { indexeerbaar: true },
      windesheim: { indexeerbaar: true },
      wijthmen: { indexeerbaar: true },
      herfte: { indexeerbaar: true },
      haerst: { indexeerbaar: true },
      // Buurtschappen en gehuchten: vindbaar via Gijs en indexeerbaar voor zoekmachines.
      frankhuis: { indexeerbaar: true },
      langenholte: { indexeerbaar: true },
      spoolde: { indexeerbaar: true },
      harculo: { indexeerbaar: true },
      "hoog-zuthem": { indexeerbaar: true },
      brinkhoek: { indexeerbaar: true },
      bruggenhoek: { indexeerbaar: true },
      "de-lichtmis": { indexeerbaar: true },
      katerveer: { indexeerbaar: true },
      oldeneel: { indexeerbaar: true },
      schelle: { indexeerbaar: true },
      veldhoek: { indexeerbaar: true },
      zalne: { indexeerbaar: true },
      "de-ruiten": { indexeerbaar: true },
      "nieuwe-wetering": { indexeerbaar: true },
      "oud-ittersum": { indexeerbaar: true },
      "oude-wetering": { indexeerbaar: true },
      tolhuislanden: { indexeerbaar: true },
    },
  },
};

// Gemeenten en wijken buiten de Gemeenteborden-set (die alleen Twente dekt). Bewust alleen de
// plaatsen die een eigen pagina hebben: een volledige kernenlijst van deze gemeenten staat niet in
// de aangeleverde data en wordt niet verzonnen.
const EXTRA_GEMEENTEN: { naam: string; kernen: { naam: string; bord?: string }[] }[] = [
  { naam: "Zwolle", kernen: [
    { naam: "Zwolle", bord: "/images/regio/gemeenteborden/Zwolle/Zwolle.webp" },
    { naam: "Berkum", bord: "/images/regio/gemeenteborden/Zwolle/Berkum.webp" },
    { naam: "Westenholte", bord: "/images/regio/gemeenteborden/Zwolle/Westenholte.webp" },
    { naam: "Stadshagen", bord: "/images/regio/gemeenteborden/Zwolle/Stadshagen.png" },
    { naam: "Windesheim", bord: "/images/regio/gemeenteborden/Zwolle/Windesheim.webp" },
    { naam: "Wijthmen", bord: "/images/regio/gemeenteborden/Zwolle/Wijthmen.webp" },
    { naam: "Herfte", bord: "/images/regio/gemeenteborden/Zwolle/Herfte.webp" },
    { naam: "Haerst", bord: "/images/regio/gemeenteborden/Zwolle/Haerst.webp" },
    { naam: "Frankhuis", bord: "/images/regio/gemeenteborden/Zwolle/Frankhuis.webp" },
    { naam: "Langenholte", bord: "/images/regio/gemeenteborden/Zwolle/Langenholte.webp" },
    { naam: "Spoolde", bord: "/images/regio/gemeenteborden/Zwolle/Spoolde.webp" },
    { naam: "Harculo", bord: "/images/regio/gemeenteborden/Zwolle/Harculo.webp" },
    { naam: "Hoog Zuthem", bord: "/images/regio/gemeenteborden/Zwolle/Hoog-Zuthem.webp" },
    { naam: "Brinkhoek", bord: "/images/regio/gemeenteborden/Zwolle/Brinkhoek.webp" },
    { naam: "Bruggenhoek", bord: "/images/regio/gemeenteborden/Zwolle/Bruggenhoek.webp" },
    { naam: "De Lichtmis", bord: "/images/regio/gemeenteborden/Zwolle/De-Lichtmis.webp" },
    { naam: "Katerveer", bord: "/images/regio/gemeenteborden/Zwolle/Katerveer.webp" },
    { naam: "Oldeneel", bord: "/images/regio/gemeenteborden/Zwolle/Oldeneel.webp" },
    { naam: "Schelle", bord: "/images/regio/gemeenteborden/Zwolle/Schelle.webp" },
    { naam: "Veldhoek", bord: "/images/regio/gemeenteborden/Zwolle/Veldhoek.webp" },
    { naam: "Zalné", bord: "/images/regio/gemeenteborden/Zwolle/Zalne.webp" },
    { naam: "De Ruiten", bord: "/images/regio/gemeenteborden/Zwolle/De-Ruiten.webp" },
    { naam: "Nieuwe Wetering", bord: "/images/regio/gemeenteborden/Zwolle/Nieuwe-Wetering.webp" },
    { naam: "Oud-Ittersum", bord: "/images/regio/gemeenteborden/Zwolle/Oud-Ittersum.webp" },
    { naam: "Oude Wetering", bord: "/images/regio/gemeenteborden/Zwolle/Oude-Wetering.webp" },
    { naam: "Tolhuislanden", bord: "/images/regio/gemeenteborden/Zwolle/Tolhuislanden.webp" },
  ] },
  // Nieuwe gemeentepagina's, uitbreiding Overijssel (27 oktober 2026).
  // Alle kernen met een plaatsnaambord uit de aangeleverde Gemeenteborden-set.
  { naam: "Dalfsen", kernen: [
    { naam: "Dalfsen", bord: "/images/regio/gemeenteborden/Dalfsen/Dalfsen.webp" },
    { naam: "Nieuwleusen", bord: "/images/regio/gemeenteborden/Dalfsen/Nieuwleusen.webp" },
    { naam: "Lemelerveld", bord: "/images/regio/gemeenteborden/Dalfsen/Lemelerveld.webp" },
    { naam: "Hoonhorst", bord: "/images/regio/gemeenteborden/Dalfsen/Hoonhorst.webp" },
    { naam: "Oudleusen", bord: "/images/regio/gemeenteborden/Dalfsen/Oudleusen.webp" },
    { naam: "Dalmsholte", bord: "/images/regio/gemeenteborden/Dalfsen/Dalmsholte.webp" },
    { naam: "Gerner", bord: "/images/regio/gemeenteborden/Dalfsen/Gerner.webp" },
    { naam: "Hessum", bord: "/images/regio/gemeenteborden/Dalfsen/Hessum.webp" },
    { naam: "Ankum", bord: "/images/regio/gemeenteborden/Dalfsen/Ankum.webp" },
    { naam: "Broekhuizen", bord: "/images/regio/gemeenteborden/Dalfsen/Broekhuizen.webp" },
    { naam: "Dalfserveld", bord: "/images/regio/gemeenteborden/Dalfsen/Dalfserveld.webp" },
    { naam: "De Marshoek", bord: "/images/regio/gemeenteborden/Dalfsen/De Marshoek.webp" },
    { naam: "De Meele", bord: "/images/regio/gemeenteborden/Dalfsen/De Meele.webp" },
    { naam: "Den Hulst", bord: "/images/regio/gemeenteborden/Dalfsen/Den Hulst.webp" },
    { naam: "Emmen", bord: "/images/regio/gemeenteborden/Dalfsen/Emmen.webp" },
    { naam: "Engeland", bord: "/images/regio/gemeenteborden/Dalfsen/Engeland.webp" },
    { naam: "Holt", bord: "/images/regio/gemeenteborden/Dalfsen/Holt.webp" },
    { naam: "Lenthe", bord: "/images/regio/gemeenteborden/Dalfsen/Lenthe.webp" },
    { naam: "Mataram", bord: "/images/regio/gemeenteborden/Dalfsen/Mataram.webp" },
    { naam: "Millingen", bord: "/images/regio/gemeenteborden/Dalfsen/Millingen.webp" },
    { naam: "Ooster-Dalfsen", bord: "/images/regio/gemeenteborden/Dalfsen/Ooster-Dalfsen.webp" },
    { naam: "Oudleusenerveld", bord: "/images/regio/gemeenteborden/Dalfsen/Oudleusenerveld.webp" },
    { naam: "Rechteren", bord: "/images/regio/gemeenteborden/Dalfsen/Rechteren.webp" },
    { naam: "Rosengaerde", bord: "/images/regio/gemeenteborden/Dalfsen/Rosengaerde.webp" },
    { naam: "Ruitenveen", bord: "/images/regio/gemeenteborden/Dalfsen/Ruitenveen.webp" },
    { naam: "Slennebroek", bord: "/images/regio/gemeenteborden/Dalfsen/Slennebroek.webp" },
    { naam: "Strenkhaar", bord: "/images/regio/gemeenteborden/Dalfsen/Strenkhaar.webp" },
    { naam: "Vennenberg", bord: "/images/regio/gemeenteborden/Dalfsen/Vennenberg.webp" },
    { naam: "Welsum", bord: "/images/regio/gemeenteborden/Dalfsen/Welsum.webp" },
  ] },
  { naam: "Deventer", kernen: [
    { naam: "Deventer", bord: "/images/regio/gemeenteborden/Deventer/Deventer.webp" },
    { naam: "Bathmen", bord: "/images/regio/gemeenteborden/Deventer/Bathmen.webp" },
    { naam: "Diepenveen", bord: "/images/regio/gemeenteborden/Deventer/Diepenveen.webp" },
    { naam: "Colmschate", bord: "/images/regio/gemeenteborden/Deventer/Colmschate.webp" },
    { naam: "Schalkhaar", bord: "/images/regio/gemeenteborden/Deventer/Schalkhaar.webp" },
    { naam: "Lettele", bord: "/images/regio/gemeenteborden/Deventer/Lettele.webp" },
    { naam: "Okkenbroek", bord: "/images/regio/gemeenteborden/Deventer/Okkenbroek.webp" },
    { naam: "Apenhuizen", bord: "/images/regio/gemeenteborden/Deventer/Apenhuizen.webp" },
    { naam: "Averlo", bord: "/images/regio/gemeenteborden/Deventer/Averlo.webp" },
    { naam: "Dortherhoek", bord: "/images/regio/gemeenteborden/Deventer/Dortherhoek.webp" },
    { naam: "Frieswijk", bord: "/images/regio/gemeenteborden/Deventer/Frieswijk.webp" },
    { naam: "Linde", bord: "/images/regio/gemeenteborden/Deventer/Linde.webp" },
    { naam: "Loo", bord: "/images/regio/gemeenteborden/Deventer/Loo.webp" },
    { naam: "Molenbelt", bord: "/images/regio/gemeenteborden/Deventer/Molenbelt.webp" },
    { naam: "Oude Molen", bord: "/images/regio/gemeenteborden/Deventer/Oude Molen.webp" },
    { naam: "Oxe", bord: "/images/regio/gemeenteborden/Deventer/Oxe.webp" },
    { naam: "Pieriksmars", bord: "/images/regio/gemeenteborden/Deventer/Pieriksmars.webp" },
    { naam: "Rande", bord: "/images/regio/gemeenteborden/Deventer/Rande.webp" },
    { naam: "Snipperling", bord: "/images/regio/gemeenteborden/Deventer/Snipperling.webp" },
    { naam: "Tjoene", bord: "/images/regio/gemeenteborden/Deventer/Tjoene.webp" },
    { naam: "Zuidloo", bord: "/images/regio/gemeenteborden/Deventer/Zuidloo.webp" },
  ] },
  { naam: "Hardenberg", kernen: [
    { naam: "Hardenberg", bord: "/images/regio/gemeenteborden/Hardenberg/Hardenberg.webp" },
    { naam: "Dedemsvaart", bord: "/images/regio/gemeenteborden/Hardenberg/Dedemsvaart.webp" },
    { naam: "Gramsbergen", bord: "/images/regio/gemeenteborden/Hardenberg/Gramsbergen.webp" },
    { naam: "Slagharen", bord: "/images/regio/gemeenteborden/Hardenberg/Slagharen.webp" },
    { naam: "Mariënberg", bord: "/images/regio/gemeenteborden/Hardenberg/Mariënberg.webp" },
    { naam: "Balkbrug", bord: "/images/regio/gemeenteborden/Hardenberg/Balkbrug.webp" },
    { naam: "Bergentheim", bord: "/images/regio/gemeenteborden/Hardenberg/Bergentheim.webp" },
    { naam: "Heemse", bord: "/images/regio/gemeenteborden/Hardenberg/Heemse.webp" },
    { naam: "De Krim", bord: "/images/regio/gemeenteborden/Hardenberg/De Krim.webp" },
    { naam: "Lutten", bord: "/images/regio/gemeenteborden/Hardenberg/Lutten.webp" },
    { naam: "Sibculo", bord: "/images/regio/gemeenteborden/Hardenberg/Sibculo.webp" },
    { naam: "Kloosterhaar", bord: "/images/regio/gemeenteborden/Hardenberg/Kloosterhaar.webp" },
    { naam: "Radewijk", bord: "/images/regio/gemeenteborden/Hardenberg/Radewijk.webp" },
    { naam: "Oud Avereest", bord: "/images/regio/gemeenteborden/Hardenberg/Oud Avereest.webp" },
    { naam: "Holthone", bord: "/images/regio/gemeenteborden/Hardenberg/Holthone.webp" },
    { naam: "Diffelen", bord: "/images/regio/gemeenteborden/Hardenberg/Diffelen.webp" },
    { naam: "Rheeze", bord: "/images/regio/gemeenteborden/Hardenberg/Rheeze.webp" },
    { naam: "Brucht", bord: "/images/regio/gemeenteborden/Hardenberg/Brucht.webp" },
    { naam: "Ane", bord: "/images/regio/gemeenteborden/Hardenberg/Ane.webp" },
    { naam: "De Haandrik", bord: "/images/regio/gemeenteborden/Hardenberg/De Haandrik.webp" },
    { naam: "'t Bergje", bord: "/images/regio/gemeenteborden/Hardenberg/'t Bergje.webp" },
    { naam: "'t Haantje", bord: "/images/regio/gemeenteborden/Hardenberg/'t Haantje.webp" },
    { naam: "Anerveen", bord: "/images/regio/gemeenteborden/Hardenberg/Anerveen.webp" },
    { naam: "Anevelde", bord: "/images/regio/gemeenteborden/Hardenberg/Anevelde.webp" },
    { naam: "Benedenvaart", bord: "/images/regio/gemeenteborden/Hardenberg/Benedenvaart.webp" },
    { naam: "Braamberg", bord: "/images/regio/gemeenteborden/Hardenberg/Braamberg.webp" },
    { naam: "Bruchterveld", bord: "/images/regio/gemeenteborden/Hardenberg/Bruchterveld.webp" },
    { naam: "Collendoorn", bord: "/images/regio/gemeenteborden/Hardenberg/Collendoorn.webp" },
    { naam: "Collendoornerveen", bord: "/images/regio/gemeenteborden/Hardenberg/Collendoornerveen.webp" },
    { naam: "De Belt", bord: "/images/regio/gemeenteborden/Hardenberg/De Belt.webp" },
    { naam: "De Haar", bord: "/images/regio/gemeenteborden/Hardenberg/De Haar.webp" },
    { naam: "De Maat", bord: "/images/regio/gemeenteborden/Hardenberg/De Maat.webp" },
    { naam: "De Meene", bord: "/images/regio/gemeenteborden/Hardenberg/De Meene.webp" },
    { naam: "De Mulderij", bord: "/images/regio/gemeenteborden/Hardenberg/De Mulderij.webp" },
    { naam: "De Pol", bord: "/images/regio/gemeenteborden/Hardenberg/De Pol.webp" },
    { naam: "De Schans", bord: "/images/regio/gemeenteborden/Hardenberg/De Schans.webp" },
    { naam: "Den Huizen", bord: "/images/regio/gemeenteborden/Hardenberg/Den Huizen.webp" },
    { naam: "Den Kaat", bord: "/images/regio/gemeenteborden/Hardenberg/Den Kaat.webp" },
    { naam: "Den Oosterhuis", bord: "/images/regio/gemeenteborden/Hardenberg/Den Oosterhuis.webp" },
    { naam: "Den Velde", bord: "/images/regio/gemeenteborden/Hardenberg/Den Velde.webp" },
    { naam: "Den Westerhuis", bord: "/images/regio/gemeenteborden/Hardenberg/Den Westerhuis.webp" },
    { naam: "Ebbenbroek", bord: "/images/regio/gemeenteborden/Hardenberg/Ebbenbroek.webp" },
    { naam: "Engeland", bord: "/images/regio/gemeenteborden/Hardenberg/Engeland.webp" },
    { naam: "Gouden Ploeg", bord: "/images/regio/gemeenteborden/Hardenberg/Gouden Ploeg.webp" },
    { naam: "Groot-Oever", bord: "/images/regio/gemeenteborden/Hardenberg/Groot-Oever.webp" },
    { naam: "Hanekamp", bord: "/images/regio/gemeenteborden/Hardenberg/Hanekamp.webp" },
    { naam: "Heemserveen", bord: "/images/regio/gemeenteborden/Hardenberg/Heemserveen.webp" },
    { naam: "Holtheme", bord: "/images/regio/gemeenteborden/Hardenberg/Holtheme.webp" },
    { naam: "Hoogenweg", bord: "/images/regio/gemeenteborden/Hardenberg/Hoogenweg.webp" },
    { naam: "Keiendorp", bord: "/images/regio/gemeenteborden/Hardenberg/Keiendorp.webp" },
    { naam: "Loozen", bord: "/images/regio/gemeenteborden/Hardenberg/Loozen.webp" },
    { naam: "Lutten-Oever", bord: "/images/regio/gemeenteborden/Hardenberg/Lutten-Oever.webp" },
    { naam: "Lutterhartje", bord: "/images/regio/gemeenteborden/Hardenberg/Lutterhartje.webp" },
    { naam: "Noord-Stegeren", bord: "/images/regio/gemeenteborden/Hardenberg/Noord-Stegeren.webp" },
    { naam: "Oud-Bergentheim", bord: "/images/regio/gemeenteborden/Hardenberg/Oud-Bergentheim.webp" },
    { naam: "Oud-Lutten", bord: "/images/regio/gemeenteborden/Hardenberg/Oud-Lutten.webp" },
    { naam: "Rheezerveen", bord: "/images/regio/gemeenteborden/Hardenberg/Rheezerveen.webp" },
    { naam: "Schuinesloot", bord: "/images/regio/gemeenteborden/Hardenberg/Schuinesloot.webp" },
    { naam: "Sluis 7", bord: "/images/regio/gemeenteborden/Hardenberg/Sluis 7.webp" },
    { naam: "Sponturfwijk", bord: "/images/regio/gemeenteborden/Hardenberg/Sponturfwijk.webp" },
    { naam: "Strooiendorp", bord: "/images/regio/gemeenteborden/Hardenberg/Strooiendorp.webp" },
    { naam: "Venebrugge", bord: "/images/regio/gemeenteborden/Hardenberg/Venebrugge.webp" },
    { naam: "Westerhuizingerveld", bord: "/images/regio/gemeenteborden/Hardenberg/Westerhuizingerveld.webp" },
    { naam: "Witman", bord: "/images/regio/gemeenteborden/Hardenberg/Witman.webp" },
  ] },
  { naam: "Kampen", kernen: [
    { naam: "Kampen", bord: "/images/regio/gemeenteborden/Kampen/Kampen.webp" },
    { naam: "IJsselmuiden", bord: "/images/regio/gemeenteborden/Kampen/IJsselmuiden.webp" },
    { naam: "Grafhorst", bord: "/images/regio/gemeenteborden/Kampen/Grafhorst.webp" },
    { naam: "Zalk", bord: "/images/regio/gemeenteborden/Kampen/Zalk.webp" },
    { naam: "Wilsum", bord: "/images/regio/gemeenteborden/Kampen/Wilsum.webp" },
    { naam: "Kamperveen", bord: "/images/regio/gemeenteborden/Kampen/Kamperveen.webp" },
    { naam: "'s-Heerenbroek", bord: "/images/regio/gemeenteborden/Kampen/'s-Heerenbroek.webp" },
    { naam: "Bisschopswetering", bord: "/images/regio/gemeenteborden/Kampen/Bisschopswetering.webp" },
    { naam: "De Heuvels", bord: "/images/regio/gemeenteborden/Kampen/De Heuvels.webp" },
    { naam: "De Zande", bord: "/images/regio/gemeenteborden/Kampen/De Zande.webp" },
    { naam: "Oosterholt", bord: "/images/regio/gemeenteborden/Kampen/Oosterholt.webp" },
    { naam: "Veecaten", bord: "/images/regio/gemeenteborden/Kampen/Veecaten.webp" },
    { naam: "Zuideinde", bord: "/images/regio/gemeenteborden/Kampen/Zuideinde.webp" },
  ] },
  { naam: "Olst-Wijhe", kernen: [
    { naam: "Olst", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Olst.webp" },
    { naam: "Wijhe", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Wijhe.webp" },
    { naam: "Wesepe", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Wesepe.webp" },
    { naam: "Herxen", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Herxen.webp" },
    { naam: "Boerhaar", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Boerhaar.webp" },
    { naam: "Boskamp", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Boskamp.webp" },
    { naam: "Den Nul", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Den Nul.webp" },
    { naam: "Duur", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Duur.webp" },
    { naam: "Eikelhof", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Eikelhof.webp" },
    { naam: "Elshof", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Elshof.webp" },
    { naam: "Fortmond", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Fortmond.webp" },
    { naam: "Hengforden", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Hengforden.webp" },
    { naam: "Marle", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Marle.webp" },
    { naam: "Middel", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Middel.webp" },
    { naam: "Welsum", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Welsum.webp" },
    { naam: "Welsumerveld", bord: "/images/regio/gemeenteborden/Olst-Wijhe/Welsumerveld.webp" },
  ] },
  { naam: "Ommen", kernen: [
    { naam: "Ommen", bord: "/images/regio/gemeenteborden/Ommen/Ommen.webp" },
    { naam: "Vilsteren", bord: "/images/regio/gemeenteborden/Ommen/Vilsteren.webp" },
    { naam: "Beerze", bord: "/images/regio/gemeenteborden/Ommen/Beerze.webp" },
    { naam: "Stegeren", bord: "/images/regio/gemeenteborden/Ommen/Stegeren.webp" },
    { naam: "Varsen", bord: "/images/regio/gemeenteborden/Ommen/Varsen.webp" },
    { naam: "Giethmen", bord: "/images/regio/gemeenteborden/Ommen/Giethmen.webp" },
    { naam: "Archem", bord: "/images/regio/gemeenteborden/Ommen/Archem.webp" },
    { naam: "Junne", bord: "/images/regio/gemeenteborden/Ommen/Junne.webp" },
    { naam: "Lemele", bord: "/images/regio/gemeenteborden/Ommen/Lemele.webp" },
    { naam: "Witharen", bord: "/images/regio/gemeenteborden/Ommen/Witharen.webp" },
    { naam: "Arriën", bord: "/images/regio/gemeenteborden/Ommen/Arriën.webp" },
    { naam: "Arriërveld", bord: "/images/regio/gemeenteborden/Ommen/Arriërveld.webp" },
    { naam: "Beerzerveld", bord: "/images/regio/gemeenteborden/Ommen/Beerzerveld.webp" },
    { naam: "Besthmen", bord: "/images/regio/gemeenteborden/Ommen/Besthmen.webp" },
    { naam: "Dalmsholte", bord: "/images/regio/gemeenteborden/Ommen/Dalmsholte.webp" },
    { naam: "Eerde", bord: "/images/regio/gemeenteborden/Ommen/Eerde.webp" },
    { naam: "Emsland", bord: "/images/regio/gemeenteborden/Ommen/Emsland.webp" },
    { naam: "Hoogengraven", bord: "/images/regio/gemeenteborden/Ommen/Hoogengraven.webp" },
    { naam: "Nieuwebrug", bord: "/images/regio/gemeenteborden/Ommen/Nieuwebrug.webp" },
    { naam: "Ommerbosch", bord: "/images/regio/gemeenteborden/Ommen/Ommerbosch.webp" },
    { naam: "Ommerschans", bord: "/images/regio/gemeenteborden/Ommen/Ommerschans.webp" },
    { naam: "Ommerveld", bord: "/images/regio/gemeenteborden/Ommen/Ommerveld.webp" },
    { naam: "Rotbrink", bord: "/images/regio/gemeenteborden/Ommen/Rotbrink.webp" },
    { naam: "Stegerveld", bord: "/images/regio/gemeenteborden/Ommen/Stegerveld.webp" },
    { naam: "Vinkenbuurt", bord: "/images/regio/gemeenteborden/Ommen/Vinkenbuurt.webp" },
    { naam: "Zeesse", bord: "/images/regio/gemeenteborden/Ommen/Zeesse.webp" },
  ] },
  { naam: "Raalte", kernen: [
    { naam: "Raalte", bord: "/images/regio/gemeenteborden/Raalte/Raalte.webp" },
    { naam: "Heino", bord: "/images/regio/gemeenteborden/Raalte/Heino.webp" },
    { naam: "Heeten", bord: "/images/regio/gemeenteborden/Raalte/Heeten.webp" },
    { naam: "Luttenberg", bord: "/images/regio/gemeenteborden/Raalte/Luttenberg.webp" },
    { naam: "Mariënheem", bord: "/images/regio/gemeenteborden/Raalte/Mariënheem.webp" },
    { naam: "Broekland", bord: "/images/regio/gemeenteborden/Raalte/Broekland.webp" },
    { naam: "De Hooge Wegen", bord: "/images/regio/gemeenteborden/Raalte/De Hooge Wegen.webp" },
    { naam: "Laag Zuthem", bord: "/images/regio/gemeenteborden/Raalte/Laag Zuthem.webp" },
    { naam: "Lierderholthuis", bord: "/images/regio/gemeenteborden/Raalte/Lierderholthuis.webp" },
    { naam: "Nieuw Heeten", bord: "/images/regio/gemeenteborden/Raalte/Nieuw Heeten.webp" },
  ] },
  { naam: "Staphorst", kernen: [
    { naam: "Staphorst", bord: "/images/regio/gemeenteborden/Staphorst/Staphorst.webp" },
    { naam: "Rouveen", bord: "/images/regio/gemeenteborden/Staphorst/Rouveen.webp" },
    { naam: "IJhorst", bord: "/images/regio/gemeenteborden/Staphorst/IJhorst.webp" },
    { naam: "De Lichtmis", bord: "/images/regio/gemeenteborden/Staphorst/De Lichtmis.webp" },
    { naam: "Lankhorst", bord: "/images/regio/gemeenteborden/Staphorst/Lankhorst.webp" },
    { naam: "Punthorst", bord: "/images/regio/gemeenteborden/Staphorst/Punthorst.webp" },
    { naam: "De Leijen", bord: "/images/regio/gemeenteborden/Staphorst/De Leijen.webp" },
    { naam: "Halfweg", bord: "/images/regio/gemeenteborden/Staphorst/Halfweg.webp" },
    { naam: "Hamingen", bord: "/images/regio/gemeenteborden/Staphorst/Hamingen.webp" },
    { naam: "Westerhuizingerveld", bord: "/images/regio/gemeenteborden/Staphorst/Westerhuizingerveld.webp" },
  ] },
  { naam: "Steenwijkerland", kernen: [
    { naam: "Steenwijk", bord: "/images/regio/gemeenteborden/Steenwijkerland/Steenwijk.webp" },
    { naam: "Vollenhove", bord: "/images/regio/gemeenteborden/Steenwijkerland/Vollenhove.webp" },
    { naam: "Oldemarkt", bord: "/images/regio/gemeenteborden/Steenwijkerland/Oldemarkt.webp" },
    { naam: "Giethoorn", bord: "/images/regio/gemeenteborden/Steenwijkerland/Giethoorn.webp" },
    { naam: "Sint Jansklooster", bord: "/images/regio/gemeenteborden/Steenwijkerland/Sint Jansklooster.webp" },
    { naam: "Tuk", bord: "/images/regio/gemeenteborden/Steenwijkerland/Tuk.webp" },
    { naam: "Steenwijkerwold", bord: "/images/regio/gemeenteborden/Steenwijkerland/Steenwijkerwold.webp" },
    { naam: "Wanneperveen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Wanneperveen.webp" },
    { naam: "Blokzijl", bord: "/images/regio/gemeenteborden/Steenwijkerland/Blokzijl.webp" },
    { naam: "Kuinre", bord: "/images/regio/gemeenteborden/Steenwijkerland/Kuinre.webp" },
    { naam: "Belt-Schutsloot", bord: "/images/regio/gemeenteborden/Steenwijkerland/Belt-Schutsloot.webp" },
    { naam: "Blankenham", bord: "/images/regio/gemeenteborden/Steenwijkerland/Blankenham.webp" },
    { naam: "Ossenzijl", bord: "/images/regio/gemeenteborden/Steenwijkerland/Ossenzijl.webp" },
    { naam: "Willemsoord", bord: "/images/regio/gemeenteborden/Steenwijkerland/Willemsoord.webp" },
    { naam: "Paasloo", bord: "/images/regio/gemeenteborden/Steenwijkerland/Paasloo.webp" },
    { naam: "Scheerwolde", bord: "/images/regio/gemeenteborden/Steenwijkerland/Scheerwolde.webp" },
    { naam: "Baarlo", bord: "/images/regio/gemeenteborden/Steenwijkerland/Baarlo.webp" },
    { naam: "Baars", bord: "/images/regio/gemeenteborden/Steenwijkerland/Baars.webp" },
    { naam: "Barsbeek", bord: "/images/regio/gemeenteborden/Steenwijkerland/Barsbeek.webp" },
    { naam: "Basse", bord: "/images/regio/gemeenteborden/Steenwijkerland/Basse.webp" },
    { naam: "Basserveld", bord: "/images/regio/gemeenteborden/Steenwijkerland/Basserveld.webp" },
    { naam: "Blauwe Hand", bord: "/images/regio/gemeenteborden/Steenwijkerland/Blauwe Hand.webp" },
    { naam: "De Bult", bord: "/images/regio/gemeenteborden/Steenwijkerland/De Bult.webp" },
    { naam: "De Klosse", bord: "/images/regio/gemeenteborden/Steenwijkerland/De Klosse.webp" },
    { naam: "De Kolk", bord: "/images/regio/gemeenteborden/Steenwijkerland/De Kolk.webp" },
    { naam: "De Krieger", bord: "/images/regio/gemeenteborden/Steenwijkerland/De Krieger.webp" },
    { naam: "De Pol", bord: "/images/regio/gemeenteborden/Steenwijkerland/De Pol.webp" },
    { naam: "Doosje", bord: "/images/regio/gemeenteborden/Steenwijkerland/Doosje.webp" },
    { naam: "Dwarsgracht", bord: "/images/regio/gemeenteborden/Steenwijkerland/Dwarsgracht.webp" },
    { naam: "Eese", bord: "/images/regio/gemeenteborden/Steenwijkerland/Eese.webp" },
    { naam: "Eesveen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Eesveen.webp" },
    { naam: "Heetveld", bord: "/images/regio/gemeenteborden/Steenwijkerland/Heetveld.webp" },
    { naam: "IJsselham", bord: "/images/regio/gemeenteborden/Steenwijkerland/IJsselham.webp" },
    { naam: "Jonen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Jonen.webp" },
    { naam: "Kadoelen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Kadoelen.webp" },
    { naam: "Kalenberg", bord: "/images/regio/gemeenteborden/Steenwijkerland/Kalenberg.webp" },
    { naam: "Kallenkote", bord: "/images/regio/gemeenteborden/Steenwijkerland/Kallenkote.webp" },
    { naam: "Leeuwte", bord: "/images/regio/gemeenteborden/Steenwijkerland/Leeuwte.webp" },
    { naam: "Marijenkampen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Marijenkampen.webp" },
    { naam: "Moespot", bord: "/images/regio/gemeenteborden/Steenwijkerland/Moespot.webp" },
    { naam: "Molenhoek", bord: "/images/regio/gemeenteborden/Steenwijkerland/Molenhoek.webp" },
    { naam: "Muggenbeet", bord: "/images/regio/gemeenteborden/Steenwijkerland/Muggenbeet.webp" },
    { naam: "Nederland", bord: "/images/regio/gemeenteborden/Steenwijkerland/Nederland.webp" },
    { naam: "Onna", bord: "/images/regio/gemeenteborden/Steenwijkerland/Onna.webp" },
    { naam: "Poepershoek", bord: "/images/regio/gemeenteborden/Steenwijkerland/Poepershoek.webp" },
    { naam: "Roekebosch", bord: "/images/regio/gemeenteborden/Steenwijkerland/Roekebosch.webp" },
    { naam: "Ronduite", bord: "/images/regio/gemeenteborden/Steenwijkerland/Ronduite.webp" },
    { naam: "Thij", bord: "/images/regio/gemeenteborden/Steenwijkerland/Thij.webp" },
    { naam: "Westeinde", bord: "/images/regio/gemeenteborden/Steenwijkerland/Westeinde.webp" },
    { naam: "Wetering", bord: "/images/regio/gemeenteborden/Steenwijkerland/Wetering.webp" },
    { naam: "Witte Paarden", bord: "/images/regio/gemeenteborden/Steenwijkerland/Witte Paarden.webp" },
    { naam: "Zuideinde", bord: "/images/regio/gemeenteborden/Steenwijkerland/Zuideinde.webp" },
    { naam: "Zuidveen", bord: "/images/regio/gemeenteborden/Steenwijkerland/Zuidveen.webp" },
  ] },
  { naam: "Zwartewaterland", kernen: [
    { naam: "Hasselt", bord: "/images/regio/gemeenteborden/Zwartewaterland/Hasselt.webp" },
    { naam: "Genemuiden", bord: "/images/regio/gemeenteborden/Zwartewaterland/Genemuiden.webp" },
    { naam: "Zwartsluis", bord: "/images/regio/gemeenteborden/Zwartewaterland/Zwartsluis.webp" },
    { naam: "Mastenbroek", bord: "/images/regio/gemeenteborden/Zwartewaterland/Mastenbroek.webp" },
    { naam: "Baarlo", bord: "/images/regio/gemeenteborden/Zwartewaterland/Baarlo.webp" },
    { naam: "Cellemuiden", bord: "/images/regio/gemeenteborden/Zwartewaterland/Cellemuiden.webp" },
    { naam: "De Velde", bord: "/images/regio/gemeenteborden/Zwartewaterland/De Velde.webp" },
    { naam: "Genne", bord: "/images/regio/gemeenteborden/Zwartewaterland/Genne.webp" },
    { naam: "Genne-Overwaters", bord: "/images/regio/gemeenteborden/Zwartewaterland/Genne-Overwaters.webp" },
    { naam: "Holten", bord: "/images/regio/gemeenteborden/Zwartewaterland/Holten.webp" },
    { naam: "Kamperzeedijk-Oost", bord: "/images/regio/gemeenteborden/Zwartewaterland/Kamperzeedijk-Oost.webp" },
    { naam: "Kamperzeedijk-West", bord: "/images/regio/gemeenteborden/Zwartewaterland/Kamperzeedijk-West.webp" },
    { naam: "Kievitsnest", bord: "/images/regio/gemeenteborden/Zwartewaterland/Kievitsnest.webp" },
    { naam: "Nieuwe Wetering", bord: "/images/regio/gemeenteborden/Zwartewaterland/Nieuwe Wetering.webp" },
    { naam: "Roebolligehoek", bord: "/images/regio/gemeenteborden/Zwartewaterland/Roebolligehoek.webp" },
    { naam: "Streukel", bord: "/images/regio/gemeenteborden/Zwartewaterland/Streukel.webp" },
    { naam: "Zwartewatersklooster", bord: "/images/regio/gemeenteborden/Zwartewaterland/Zwartewatersklooster.webp" },
  ] },
];
const ALLE_BRONGEMEENTEN: { naam: string; kernen: { naam: string; bord?: string }[] }[] = [...LOKALE_SEO_GEMEENTEN, ...EXTRA_GEMEENTEN];

// Gelderland: alle 50 gemeenten uit de kaart (gelderland49.svg).
// Geen kernen beschikbaar — pagina's staan op gepubliceerd maar indexeerbaar: false
// totdat er unieke, geverifieerde inhoud per gemeente beschikbaar is.
const GELDERLAND_GEMEENTEN_NAMEN = [
  "Aalten", "Apeldoorn", "Arnhem", "Barneveld", "Berg en Dal", "Berkelland",
  "Beuningen", "Bronckhorst", "Brummen", "Buren", "Culemborg", "Doesburg",
  "Doetinchem", "Druten", "Duiven", "Ede", "Elburg", "Epe", "Ermelo",
  "Harderwijk", "Hattem", "Heerde", "Heumen", "Lingewaard", "Lochem",
  "Maasdriel", "Montferland", "Neder-Betuwe", "Nijkerk",
  "Nijmegen", "Nunspeet", "Oldebroek", "Oost Gelre", "Oude IJsselstreek",
  "Overbetuwe", "Putten", "Renkum", "Rheden", "Rozendaal", "Scherpenzeel",
  "Tiel", "Voorst", "Wageningen", "West Betuwe", "West Maas en Waal",
  "Westervoort", "Wijchen", "Winterswijk", "Zaltbommel", "Zevenaar", "Zutphen",
];

// Geverifieerde officiële subsidiepagina's per gemeente (zelf nagekeken,
// geen bedragen of voorwaarden overgenomen — zie RegioGemeente.officieleSubsidieUrl).
const OFFICIELE_SUBSIDIE_URL: Record<string, string> = {
  borne: "https://www.borne.nl/nip-isolatieactie",
  enschede: "https://www.enschede.nl/subsidie-voor-isolatie",
  hengelo: "https://www.hengelo.nl/duurzaam/hulp-bij-verduurzamen/subsidies.html",
  oldenzaal: "https://www.oldenzaal.nl/subsidie-isolatie-eigen-woning",
  "hof-van-twente": "https://www.hofvantwente.nl/direct-regelen/wonen-en-leven/duurzaamheid/subsidies-verduurzaming-woning/",
  "rijssen-holten": "https://www.rijssen-holten.nl/duurzaam/subsidie-laten-isoleren-door-een-bedrijf/",
  hellendoorn: "https://www.hellendoorn.nl/direct-regelen/belastingen-en-subsidies/subsidies-2/subsidie-woningisolatie/",
  twenterand: "https://www.twenterand.nl/isoleren?origin=%2Fduurzaamheidssubsidie",
};

// Alle gemeenten in de Gemeenteborden-set liggen in Twente; Zwolle ligt ook in Overijssel.
export const REGIO_GEMEENTEN: RegioGemeente[] = [
  ...ALLE_BRONGEMEENTEN.map(g => {
    const slug = slugify(g.naam);
    const pub = PUBLICATIE[slug];
    return {
      slug,
      naam: g.naam,
      provincie: "overijssel",
      plaatsen: g.kernen.map(k => slugify(k.naam)),
      officieleSubsidieUrl: OFFICIELE_SUBSIDIE_URL[slug],
      gepubliceerd: !!pub,
      indexeerbaar: !!pub?.indexeerbaar,
    };
  }),
  ...GELDERLAND_GEMEENTEN_NAMEN.map(naam => ({
    slug: slugify(naam),
    naam,
    provincie: "gelderland",
    plaatsen: [] as string[],
    gepubliceerd: false,
    indexeerbaar: false,
  })),
];

export const REGIO_PLAATSEN: RegioPlaats[] = ALLE_BRONGEMEENTEN.flatMap(g => {
  const gemeente = slugify(g.naam);
  return g.kernen.map(k => {
    const slug = slugify(k.naam);
    const pub = PUBLICATIE[gemeente]?.plaatsen[slug];
    return { slug, naam: k.naam, gemeente, provincie: "overijssel", afbeelding: k.bord, gepubliceerd: !!pub, indexeerbaar: !!pub?.indexeerbaar };
  });
});

export const getProvincie = (slug: string) => REGIO_PROVINCIES.find(p => p.slug === slug && p.gepubliceerd);
export const getGemeente = (provincie: string, slug: string) =>
  REGIO_GEMEENTEN.find(g => g.provincie === provincie && g.slug === slug && g.gepubliceerd);
export const getPlaats = (provincie: string, gemeente: string, slug: string) =>
  REGIO_PLAATSEN.find(p => p.provincie === provincie && p.gemeente === gemeente && p.slug === slug && p.gepubliceerd);
export const gemeentenVan = (provincie: string) => REGIO_GEMEENTEN.filter(g => g.provincie === provincie && g.gepubliceerd);
// Ongefilterd (incl. nog niet gepubliceerde gemeenten): voor de kaartnavigatie,
// die ook "binnenkort"-gemeenten toont zodat zichtbaar is dat de regio groter
// is dan wat nu al klikbaar is.
export const alleGemeentenVan = (provincie: string) => REGIO_GEMEENTEN.filter(g => g.provincie === provincie);
export const plaatsenVan = (provincie: string, gemeente: string) =>
  REGIO_PLAATSEN.filter(p => p.provincie === provincie && p.gemeente === gemeente);

export const regioPad = (...delen: string[]) => ["/regio", ...delen].join("/");

export const REGIO_INDEXEERBARE_PADEN = [
  "/regio",
  ...REGIO_PROVINCIES.filter(p => p.gepubliceerd && p.indexeerbaar).map(p => regioPad(p.slug)),
  ...REGIO_GEMEENTEN.filter(g => g.gepubliceerd && g.indexeerbaar).map(g => regioPad(g.provincie, g.slug)),
  ...REGIO_PLAATSEN.filter(p => p.gepubliceerd && p.indexeerbaar).map(p => regioPad(p.provincie, p.gemeente, p.slug)),
];
