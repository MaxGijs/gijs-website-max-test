import type { FAQItem } from "@/components/measures/FAQAccordion";

// Unieke, plaatsgerichte inhoud voor regiopagina's. Eén getypeerde bron, los van de presentatie
// (components/regio/LokalePagina.tsx) en van de regiostructuur (lib/content/regio.ts). Een nieuwe
// plaats krijgt een eigen pagina-inhoud door hier een entry toe te voegen onder zijn regiopad;
// zonder entry tonen de templates de generieke opzet.
//
// Bronnen: Berkum alleen op basis van berkumenergieneutraal.nl (home, over-ben, partners) en
// zwolle.nl/op-weg-naar-een-aardgasvrij-berkum. Borne, Hengelo en Enschede alleen op basis van de
// twee aangeleverde Deep Research-rapporten over lokale SEO in Twente. Geen subsidiebedragen,
// percentages, deadlines of voorwaarden: die worden later met Thom en BEN gecontroleerd.

/** Tekstdeel: gewone tekst, of een link (intern of extern) binnen een alinea. */
export type Tekst = string | { tekst: string; href: string; extern?: boolean };
export type Alinea = Tekst[];

export type LokaleSectie = {
  id: string;
  titel: string;
  alineas: Alinea[];
  punten?: { titel: string; tekst: string }[];
};

export type LokaleInhoud = {
  seo: { title: string; description: string };
  kicker: string;
  h1: string;
  intro: Alinea[];
  ctaPrimair: { tekst: string; href: string };
  ctaSecundair: { tekst: string; href: string };
  /** Herkenbaar, uitgelicht blok (bijv. de samenwerking met BEN in Berkum). */
  uitgelicht?: LokaleSectie;
  secties: LokaleSectie[];
  maatregelen?: { titel: string; intro: string; items: { slug: string; naam: string; tekst: string }[] };
  gijs?: LokaleSectie;
  subsidies?: Alinea[];
  faq?: FAQItem[];
  verwant: { titel: string; links: { naam: string; href: string; tekst: string }[] };
  werkgebied: Alinea[];
};

const SUBSIDIE_TIJDLOOS: Alinea = [
  "Welke regelingen beschikbaar zijn, verschilt per woning, plaats en moment. Tijdens het advies bekijken we welke actuele mogelijkheden bij jouw situatie passen. Gijs kan niet garanderen dat je ergens recht op hebt.",
];

const BEN_HOME = "https://www.berkumenergieneutraal.nl/";
const BEN_OVER = "https://www.berkumenergieneutraal.nl/over-ben/";

const ZWOLLE: Record<string, LokaleInhoud> = {
  "/regio/overijssel/zwolle": {
    seo: {
      title: "Verduurzamen in Zwolle: Gijs in de wijk Berkum | Gijs",
      description: "In Zwolle helpt Gijs bewoners van de wijk Berkum, samen met het bewonersinitiatief Berkum Energieneutraal. Lees wat dat inhoudt en hoe je contact opneemt.",
    },
    kicker: "Gemeente Zwolle",
    h1: "Gijs in Zwolle",
    intro: [
      ["In Zwolle is Gijs vooral actief in de wijk Berkum. Daar werken we samen met het bewonersinitiatief Berkum Energieneutraal (BEN). Op de pagina over Berkum lees je wat die samenwerking voor bewoners betekent."],
      ["Woon je elders in Zwolle en wil je weten wat je aan je woning kunt doen? Neem gerust contact op. Dan kijken we samen of en hoe we je kunnen helpen."],
    ],
    ctaPrimair: { tekst: "Lees over Gijs in Berkum", href: "/regio/overijssel/zwolle/berkum" },
    ctaSecundair: { tekst: "Neem contact op", href: "/contact" },
    secties: [],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Verduurzamen in Berkum", href: "/regio/overijssel/zwolle/berkum", tekst: "Hoe Gijs en BEN bewoners van Berkum op weg helpen." },
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
      ],
    },
    werkgebied: [["De samenwerking met BEN geldt voor de wijk Berkum, niet voor heel Zwolle."]],
  },

  "/regio/overijssel/zwolle/berkum": {
    seo: {
      title: "Woning verduurzamen in Berkum (Zwolle) met Gijs en BEN | Gijs",
      description: "Woon je in Berkum? Gijs werkt samen met Berkum Energieneutraal en helpt je met een gratis energiescan op weg naar een zuiniger, aardgasvrij-klaar huis.",
    },
    kicker: "Berkum, gemeente Zwolle",
    h1: "Je woning verduurzamen in Berkum",
    intro: [
      ["In Berkum wordt al jaren samen gewerkt aan een wijk die minder energie gebruikt en straks zonder aardgas kan. Dat begint bij je eigen huis: hoe goed is het geïsoleerd, en wat is een logische volgende stap?"],
      ["Gijs helpt bewoners van Berkum om daar rustig en zonder verplichtingen achter te komen. Met een gratis energiescan krijg je inzicht in je woning en een helder beeld van wat er kan."],
    ],
    ctaPrimair: { tekst: "Vraag de gratis energiescan voor Berkum aan", href: "/contact#energiescan" },
    ctaSecundair: { tekst: "Start de woningscan", href: "/woning" },
    uitgelicht: {
      id: "gijs-en-ben",
      titel: "Gijs en BEN helpen Berkum vooruit",
      alineas: [
        [{ tekst: "Berkum Energieneutraal", href: BEN_HOME, extern: true }, ", kortweg BEN, is een initiatief van en voor bewoners van Berkum. Het wordt gedragen door vrijwilligers uit de wijk, verenigd in een stichting en een energiecoöperatie. Zij werken samen met onder meer de gemeente Zwolle en de woningcorporaties."],
        ["BEN wil dat Berkum minder energie gebruikt, zelf duurzame energie opwekt en uiteindelijk van het aardgas af gaat. De eerste stap daarin is het verduurzamen van de woningen zelf."],
        ["Gijs is samenwerkingspartner van BEN. Wij helpen bewoners met inzicht in hun woning en met de mogelijke vervolgstappen. Gijs is geen onderdeel van BEN, de gemeente of een woningcorporatie, en werkt ook niet exclusief namens BEN."],
      ],
      punten: [
        { titel: "Inzicht in je woning", tekst: "Tijdens de gratis energiescan kijkt een adviseur met je mee: waar verliest je huis warmte en wat past erbij?" },
        { titel: "Een praktisch startpunt", tekst: "Je krijgt een overzicht van mogelijke maatregelen en de volgorde die logisch is voor jouw huis." },
        { titel: "Jij beslist", tekst: "Welke maatregelen je neemt en met welke aanbieder, kies je helemaal zelf. Er zit geen verplichting aan vast." },
      ],
    },
    secties: [
      {
        id: "aardgasvrij-ready",
        titel: "Wat betekent aardgasvrij-ready?",
        alineas: [
          ["Berkum is één van de proeftuinen in het landelijke programma voor aardgasvrije wijken. BEN heeft daarbij de ambitie dat in 2028 alle woningen in Berkum aardgasvrij-ready zijn. Dat is een doel van BEN, geen belofte van Gijs."],
          ["Aardgasvrij-ready betekent dat je huis zo goed geïsoleerd is dat het straks met een lagere temperatuur verwarmd kan worden. Je stapt dus nog niet meteen van het gas af, maar je woning is er wel klaar voor. Hoe de wijk later precies verwarmd wordt, wordt vastgelegd in een warmteplan van de gemeente Zwolle. Wil je weten hoe BEN daaraan werkt? ", { tekst: "Lees meer over de plannen van BEN", href: BEN_OVER, extern: true }, "."],
        ],
      },
      {
        id: "waar-begin-je",
        titel: "Waar begin je in je eigen huis?",
        alineas: [
          ["Elke woning is anders, ook binnen één straat. Toch is de volgorde vaak hetzelfde: eerst zorgen dat warmte binnen blijft, daarna kijken naar de manier van verwarmen. Een goed geïsoleerd huis voelt comfortabeler, gebruikt minder energie en maakt een warmtepomp later beter mogelijk."],
          ["Twijfel je wat al gedaan is, bijvoorbeeld door een vorige eigenaar? Dat zoeken we tijdens de energiescan samen uit."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen die vaak aan bod komen",
      intro: "Op weg naar een aardgasvrij-klaar huis gaat het meestal eerst om isoleren. Kies een maatregel om te lezen hoe het werkt.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis een lege spouw, dan is dit vaak een relatief eenvoudige eerste stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Warmte stijgt op. Een goed geïsoleerd dak houdt die warmte binnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte onder je huis kun je de vloer vaak van onderaf isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Beter glas beperkt warmteverlies en maakt het bij het raam minder koud." },
        { slug: "warmtepomp", naam: "Warmtepomp", tekst: "Als je huis goed geïsoleerd is, komt verwarmen met een (hybride) warmtepomp in beeld." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je verder",
      alineas: [
        ["Je kunt beginnen met de digitale woningscan. Daarin vul je in wat je over je huis weet en zie je welke maatregelen bij je woningtype passen. Dat is een goede voorbereiding, maar het hoeft niet."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen bekijk je wat er al is gedaan, wat technisch kan en wat voor jou belangrijk is. Daarna weet je welke stappen logisch zijn. Wat je daarmee doet, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Voor regelingen die specifiek voor Berkum gelden, kun je ook terecht bij BEN."],
    ],
    faq: [
      { question: "Wat is BEN?", answer: "BEN staat voor Berkum Energieneutraal. Het is een initiatief van bewoners uit Berkum, gedragen door vrijwilligers uit de wijk. BEN werkt aan energiebesparing in de wijk, het opwekken van duurzame energie en een toekomst zonder aardgas." },
      { question: "Is Gijs onderdeel van BEN of van de gemeente?", answer: "Nee. Gijs is een zelfstandig bedrijf en samenwerkingspartner van BEN. Gijs is geen onderdeel van BEN, de gemeente Zwolle of een woningcorporatie." },
      { question: "Ben ik verplicht om na de energiescan iets te laten doen?", answer: "Nee. De energiescan is gratis en vrijblijvend. Welke maatregelen je neemt en welke aanbieder je kiest, beslis je zelf." },
      { question: "Moet mijn huis in 2028 van het gas af?", answer: "Nee. Aardgasvrij-ready in 2028 is een ambitie van BEN: woningen zo goed isoleren dat ze later zonder aardgas verwarmd kunnen worden. Het is geen verplichting en geen belofte van Gijs." },
      { question: "Ik woon in Zwolle, maar niet in Berkum. Kan Gijs mij ook helpen?", answer: "De samenwerking met BEN geldt voor Berkum. Woon je elders in Zwolle, neem dan contact op. Dan kijken we of we je kunnen helpen." },
    ],
    verwant: {
      titel: "Verder lezen",
      links: [
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
        { naam: "Gijs in Zwolle", href: "/regio/overijssel/zwolle", tekst: "Waar Gijs in de gemeente Zwolle actief is." },
      ],
    },
    werkgebied: [
      ["Deze pagina gaat over de wijk Berkum in de gemeente Zwolle. Gijs helpt hier bewoners in samenwerking met BEN. Woon je net buiten Berkum? Neem contact op, dan kijken we samen wat mogelijk is."],
    ],
  },
};

const TWENTE: Record<string, LokaleInhoud> = {
  "/regio/overijssel/borne": {
    seo: {
      title: "Woning isoleren in Borne, Zenderen en Hertme | Gijs",
      description: "Je woning isoleren in Borne? Lees wat het bouwjaar zegt over je isolatie, waarom natuurvriendelijk isoleren hier telt en hoe Gijs je helpt kiezen.",
    },
    kicker: "Gemeente Borne",
    h1: "Je woning isoleren in Borne",
    intro: [
      ["Borne is een compacte gemeente: de kern Borne, de dorpen Zenderen en Hertme en het buitengebied eromheen. Een groot deel van de woningen is gebouwd vóór de jaren negentig. Juist bij die huizen valt vaak nog winst te halen met isolatie."],
      ["Gijs helpt je uitzoeken waar jouw huis warmte verliest en welke stap logisch is. Rustig, en zonder dat je ergens aan vastzit."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "bouwjaar",
        titel: "Wat zegt het bouwjaar van je huis?",
        alineas: [
          ["Volgens het warmteprogramma van de gemeente telde Borne in 2023 ruim 10.300 woningen. Ongeveer 3.700 daarvan zijn na 1992 gebouwd. Zo'n twee op de drie woningen is dus ouder."],
          ["Dat betekent niet dat al die huizen slecht geïsoleerd zijn. Veel woningen zijn in de loop der jaren al verbeterd. Maar bij een huis uit de jaren zestig of zeventig is de kans groter dat er nog iets te winnen valt dan bij recente nieuwbouw. Daarom kijken we eerst wat er al is gedaan, voordat we iets voorstellen."],
        ],
      },
      {
        id: "borne-zenderen-hertme",
        titel: "Borne, Zenderen, Hertme en het buitengebied",
        alineas: [
          ["Of je nu in een rijwoning in de kern woont of in een vrijstaand huis aan de rand van het dorp: de vraag is steeds waar de meeste warmte weglekt. Een vrijstaande woning heeft meer buitenmuur en dak dan een tussenwoning van dezelfde grootte. Daar weegt goede isolatie dus extra zwaar."],
          ["Woon je in een van de dorpen? Lees dan ook over isoleren in ", { tekst: "Zenderen", href: "/regio/overijssel/borne/zenderen" }, " of ", { tekst: "Hertme", href: "/regio/overijssel/borne/hertme" }, "."],
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Borne",
        alineas: [
          ["De gemeente Borne vraagt woningeigenaren om natuurvriendelijk te isoleren. In spouwmuren en onder daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Een natuurvriendelijke werkwijze houdt daar rekening mee, bijvoorbeeld met het moment van uitvoeren en de melding die erbij hoort."],
          ["Spreek dit vooraf af met het bedrijf dat de isolatie uitvoert. Zo voorkom je dat een goede maatregel botst met de natuurregels."],
        ],
      },
      {
        id: "warmteprogramma",
        titel: "Waar werkt Borne naartoe?",
        alineas: [
          ["In het warmteprogramma beschrijft de gemeente hoe Borne stap voor stap minder aardgas gaat gebruiken. Als tussendoel noemt de gemeente dat rond 2030 ongeveer 2.100 woningen van het gas af zijn of een grote isolatiestap hebben gemaakt."],
          ["Hoe jouw straat later verwarmd wordt, hoef je nu nog niet te weten. Isoleren is hoe dan ook een logische eerste stap: een huis dat warmte goed vasthoudt, heeft minder energie nodig."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie die bij oudere woningen vaak aan bod komt",
      intro: "Welke maatregel bij jouw huis past, hangt af van wat er al is gedaan. Dit zijn de onderdelen waar we meestal als eerste naar kijken.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij huizen van vóór de jaren tachtig is de spouw vaak nog leeg of beperkt gevuld. Let hier op natuurvriendelijk werken." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een koude zolder of een warme bovenverdieping in de zomer? Dan is het dak vaak een goede plek om te beginnen." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Koude voeten op de begane grond? Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder dubbel glas of enkel glas laat veel warmte door. Beter glas maakt het bij het raam merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Borne",
      alineas: [
        ["In de digitale woningscan vul je in een paar minuten in wat je over je huis weet. Je ziet dan welke maatregelen bij je woningtype passen en wat je zelf belangrijk vindt."],
        ["Wil je zekerheid over jouw eigen huis? Dan komt een adviseur van Gijs langs voor de gratis energiescan. Samen kijk je wat er al is gedaan en wat een logische volgende stap is. Wat je daarmee doet, en met wie, bepaal je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Borne heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente zelf."],
    ],
    faq: [
      { question: "Moet ik in Borne natuurvriendelijk isoleren?", answer: "Ja, de gemeente Borne vraagt woningeigenaren daarom. In spouwmuren en daken kunnen beschermde dieren leven, zoals vleermuizen, huismussen en gierzwaluwen. Het bedrijf dat de isolatie uitvoert, moet daar rekening mee houden. Vraag er vooraf naar." },
      { question: "Mijn huis is gebouwd vóór 1992. Is isoleren dan zinvol?", answer: "Vaak wel, maar het hangt af van wat er al is gedaan. Veel oudere woningen zijn al deels verbeterd. Tijdens de energiescan kijken we wat er nog te winnen valt." },
      { question: "Helpt Gijs ook in Zenderen, Hertme en het buitengebied?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Borne, dus ook in de dorpen en daarbuiten." },
      { question: "Moet ik wachten tot duidelijk is hoe mijn wijk verwarmd gaat worden?", answer: "Nee. Isoleren helpt bij elke manier van verwarmen. Een goed geïsoleerd huis gebruikt nu minder energie en is straks klaar voor een duurzame warmtebron." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Veel woningen uit 1961 tot 2000: wat betekent dat voor isolatie?" },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen, oudere woningen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Borne: in de kern Borne, in Zenderen, in Hertme en in het buitengebied. Woon je net over de gemeentegrens? Neem gerust contact op."],
    ],
  },

  "/regio/overijssel/hengelo": {
    seo: {
      title: "Woning isoleren in Hengelo: wat past bij jouw bouwjaar? | Gijs",
      description: "Veel woningen in Hengelo zijn gebouwd tussen 1961 en 2000. Lees welke isolatie bij die bouwjaren vaak aan bod komt en hoe Gijs je helpt de juiste stap te kiezen.",
    },
    kicker: "Gemeente Hengelo",
    h1: "Je woning isoleren in Hengelo",
    intro: [
      ["Hengelo telt ruim 40.000 woningen. Een groot deel daarvan is gebouwd in de tweede helft van de vorige eeuw, toen er heel anders werd gebouwd dan nu. Het bouwjaar van je huis zegt daarom veel over waar het warmte verliest."],
      ["Gijs helpt je dat voor jouw woning uit te zoeken en laat zien welke stap daarna logisch is."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "bouwperioden",
        titel: "Twee bouwperioden springen eruit",
        alineas: [
          ["In het warmteprogramma van de gemeente Hengelo zijn twee groepen woningen het grootst: bijna 11.000 woningen uit de periode 1961 tot en met 1980, en bijna 9.900 woningen uit 1981 tot en met 2000. Samen gaat het om ruim 20.000 huizen."],
          ["Die twee periodes vragen vaak om een andere aanpak. Natuurlijk is elk huis anders, zeker als er al eerder is verbouwd."],
        ],
        punten: [
          { titel: "Gebouwd 1961 tot 1980", tekst: "In deze periode werd nog weinig geïsoleerd. De spouw is vaak leeg of beperkt gevuld, en dak en vloer zijn vaak niet of matig geïsoleerd." },
          { titel: "Gebouwd 1981 tot 2000", tekst: "Deze huizen kregen meestal al wat isolatie mee, maar minder dan nu gebruikelijk is. Extra isolatie of beter glas kan nog helpen; de winst verschilt sterk per huis." },
          { titel: "Al eerder verbouwd?", tekst: "Wat er sinds de bouw is verbeterd, zie je niet altijd aan de buitenkant. Daarom begint het bij Gijs met kijken wat er al is." },
        ],
      },
      {
        id: "isoleren-en-warmte",
        titel: "Van isoleren naar duurzame warmte",
        alineas: [
          ["De gemeente Hengelo werkt aan een warmteprogramma. Daarin staat hoe bestaande woningen de komende jaren minder aardgas gaan gebruiken, met isoleren en duurzame warmte als belangrijke onderdelen."],
          ["Hoe jouw wijk later verwarmd wordt, ligt misschien nog niet vast. Met isoleren kun je wel alvast beginnen. Een huis dat warmte goed vasthoudt, is zuiniger met elke vorm van verwarming, ook met een ", { tekst: "warmtepomp", href: "/maatregelen/warmtepomp" }, "."],
        ],
      },
      {
        id: "beschermde-dieren",
        titel: "Let op beschermde dieren",
        alineas: [
          ["In Overijssel kunnen vleermuizen en vogels die in gebouwen nestelen in spouwmuren en onder daken zitten. Bij spouw- en dakisolatie moet daar rekening mee worden gehouden. Gemeenten en provincie werken daarvoor met eigen afspraken. Vraag het bedrijf dat de isolatie uitvoert hoe het dit regelt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isolatie voor huizen uit 1961 tot 2000",
      intro: "Bij woningen uit deze periode komen we deze maatregelen het vaakst tegen. Kies er een om te lezen hoe het werkt.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Vooral bij huizen uit de jaren zestig en zeventig is de spouw vaak nog leeg. Dan is dit vaak een logische eerste stap." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een zolder die je wilt gebruiken, of een dak dat bij de bouw weinig isolatie kreeg? Dan loont het dak vaak." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Veel huizen uit deze periode hebben een kruipruimte. Daarmee is de vloer vaak van onderaf te isoleren." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ook in huizen uit de jaren tachtig en negentig zit vaak nog ouder dubbel glas. Vervangen maakt het merkbaar comfortabeler." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hengelo",
      alineas: [
        ["Begin met de digitale woningscan: daarin kies je je woningtype, vul je in wat je al weet en zie je welke maatregelen erbij passen. Dat is een handige voorbereiding, maar geen verplichting."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Hij of zij kijkt naar het bouwjaar, naar wat er al is gedaan en naar wat jij belangrijk vindt. Daarna weet je welke stappen logisch zijn. Jij beslist wat je ermee doet."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Ook de gemeente Hengelo heeft regelingen voor het verduurzamen van een woning. De actuele voorwaarden vind je bij de gemeente."],
    ],
    faq: [
      { question: "Mijn huis in Hengelo is van na 1980. Heeft isoleren dan nog zin?", answer: "Dat kan zeker. Huizen uit de jaren tachtig en negentig kregen wel isolatie mee, maar minder dan nu gangbaar is. Of extra isolatie of beter glas loont, hangt af van je huis. Dat bekijken we tijdens de energiescan." },
      { question: "Moet ik wachten op het warmteprogramma van de gemeente?", answer: "Nee. Hoe jouw wijk later ook verwarmd wordt, een goed geïsoleerd huis heeft minder warmte nodig. Isoleren is daarom altijd een zinvolle eerste stap." },
      { question: "Wat doe ik eerst: isoleren of een warmtepomp?", answer: "Meestal eerst isoleren. Een warmtepomp werkt het best in een huis dat warmte goed vasthoudt. Tijdens de energiescan bespreken we wat voor jouw woning een logische volgorde is." },
      { question: "Komt Gijs bij mij thuis in Hengelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Over oudere woningen, de dorpen en natuurvriendelijk isoleren." },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in de hele gemeente Hengelo. Woon je in een buurgemeente zoals Borne of Enschede? Ook daar kun je bij ons terecht."],
    ],
  },

  "/regio/overijssel/enschede": {
    seo: {
      title: "Woning isoleren in Enschede: advies per huis en wijk | Gijs",
      description: "Isoleren in Enschede? Lees waar je op let bij een eengezinswoning of appartement, hoe natuurvriendelijk isoleren werkt en hoe Gijs je op weg helpt.",
    },
    kicker: "Gemeente Enschede",
    h1: "Je huis isoleren in Enschede",
    intro: [
      ["Enschede is de grootste gemeente van Twente, met bijna 78.000 woningen. Die lopen sterk uiteen: van vooroorlogse huizen tot appartementen. Er is dus ook niet één isolatieadvies dat voor iedereen klopt."],
      ["Gijs helpt je kijken naar jouw eigen woning: wat is er al gedaan, waar lekt warmte weg en wat is een haalbare volgende stap?"],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "eengezinswoning-of-appartement",
        titel: "Een eengezinswoning of een appartement?",
        alineas: [
          ["In Enschede zijn appartementen het meest voorkomende woningtype. Woon je in een appartement, dan beslis je vaak niet alleen: dak, gevel en vloer deel je meestal met andere eigenaren, bijvoorbeeld in een VvE. Beter glas of het aanpakken van tocht ligt soms wel binnen je eigen bereik."],
          ["Bij een eengezinswoning heb je meer zelf in de hand. Dan kun je per onderdeel kijken: dak, spouwmuur, vloer en glas. In beide gevallen helpt het om eerst te weten wat er al is gedaan."],
        ],
      },
      {
        id: "wijken-warmtetransitie",
        titel: "Wijken in de warmtetransitie",
        alineas: [
          ["De gemeente Enschede werkt per wijk aan de overstap naar duurzame warmte. Wijken als Twekkelerveld, Stroinkslanden Zuid en 't Lang komen daarin terug. Wat er in jouw buurt speelt, lees je op de website van de gemeente."],
          ["Isoleren is in elke wijk een goede eerste stap. Een goed geïsoleerd huis heeft minder warmte nodig, hoe je straks ook verwarmt."],
        ],
      },
      {
        id: "natuurvriendelijk-isoleren",
        titel: "Natuurvriendelijk isoleren in Enschede",
        alineas: [
          ["De gemeente Enschede wijst op beschermde dieren die in en aan woningen leven, zoals huismussen, gierzwaluwen en vleermuizen. Bij het isoleren van spouwmuren en daken moet daar rekening mee worden gehouden."],
          ["Een isolatiebedrijf dat natuurvriendelijk werkt, regelt de melding die daarvoor nodig is. Vraag daar vooraf naar, dan weet je zeker dat het goed geregeld is."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen voor woningen in Enschede",
      intro: "Wat bij jouw huis past, verschilt per woningtype en bouwjaar. Deze maatregelen komen in Enschede vaak ter sprake.",
      items: [
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Een stap die je ook in een appartement vaak zelf kunt zetten. Beter glas houdt warmte binnen en voelt minder koud aan." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Bij een eengezinswoning verdwijnt veel warmte via het dak. Een geïsoleerde zolder is bovendien beter bruikbaar." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief eenvoudige stap. Let op natuurvriendelijk werken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Met een kruipruimte onder het huis is de vloer vaak van onderaf te isoleren, zonder breekwerk binnen." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Enschede",
      alineas: [
        ["Twijfel je waar je moet beginnen? In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning passen."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs langs voor de gratis energiescan. Je krijgt een helder beeld van wat er kan en in welke volgorde. Je zit nergens aan vast en kiest zelf met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Enschede heeft een eigen regeling voor isolatie. Of die op dit moment open staat en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een appartement in Enschede. Kan ik dan iets doen?", answer: "Dat hangt af van je situatie. Dak en gevel regel je vaak samen met de VvE. Beter glas of het aanpakken van tocht ligt soms meer binnen je eigen bereik." },
      { question: "Wat betekent natuurvriendelijk isoleren voor mij?", answer: "Dat bij spouw- en dakisolatie rekening wordt gehouden met beschermde dieren zoals huismussen, gierzwaluwen en vleermuizen. Een natuurvriendelijk werkend isolatiebedrijf regelt de melding die daarbij hoort." },
      { question: "Mijn wijk zit in de warmtetransitie. Moet ik nu al iets doen?", answer: "Je bent niet verplicht om nu iets te doen. Wel is isoleren een verstandige eerste stap: je huis heeft dan minder warmte nodig, welke warmtebron er straks ook komt." },
      { question: "Wat kost de energiescan van Gijs?", answer: "Niets. De energiescan aan huis is gratis en vrijblijvend." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Veel woningen uit 1961 tot 2000: wat betekent dat voor isolatie?" },
        { naam: "Zo werkt Gijs", href: "/zo-werkt-gijs", tekst: "Van woningscan naar persoonlijk advies, stap voor stap." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Enschede, in alle wijken. Woon je net buiten de gemeente, bijvoorbeeld in Hengelo? Daar vind je een ", { tekst: "eigen pagina over isoleren in Hengelo", href: "/regio/overijssel/hengelo" }, "."],
    ],
  },
};

// Tweede ronde (Hof van Twente, Almelo, Oldenzaal), ook alleen op basis van de twee rapporten.
// Tijdgebonden punten om periodiek na te lopen: de wijkfocus van Almelo voor 2026 en de planning
// van het soortenmanagementplan in Oldenzaal.
const TWENTE_RONDE_2: Record<string, LokaleInhoud> = {
  "/regio/overijssel/hof-van-twente": {
    seo: {
      title: "Woning isoleren in Goor, Delden, Markelo en Hof van Twente | Gijs",
      description: "Isoleren in Hof van Twente? Veel vrijstaande en twee-onder-een-kapwoningen vragen om een eigen aanpak. Lees waar je op let en hoe Gijs je helpt.",
    },
    kicker: "Gemeente Hof van Twente",
    h1: "Je woning isoleren in Hof van Twente",
    intro: [
      ["Hof van Twente is een gemeente van dorpen en buitengebied: Goor, Delden, Markelo, Diepenheim, Hengevelde en Bentelo. Veel mensen wonen hier in een eigen huis met een tuin eromheen. Dat merk je ook aan de isolatievraag."],
      ["Gijs helpt je uitzoeken wat er bij jouw huis te winnen valt, en in welke volgorde je het beste kunt beginnen."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "vrijstaand-en-twee-onder-een-kap",
        titel: "Veel vrijstaande huizen en twee-onder-een-kappers",
        alineas: [
          ["Volgens het warmteprogramma van de gemeente zijn de woningen in Hof van Twente grotendeels grondgebonden. Er staan relatief veel vrijstaande woningen en twee-onder-een-kapwoningen, en ongeveer zeven op de tien woningen zijn koopwoningen. De woningvoorraad is bovendien relatief oud."],
          ["Een vrijstaand huis heeft aan alle kanten buitenmuur en vaak een groot dak. Het verliest daardoor meer warmte dan een rijwoning van dezelfde grootte, dus goed isoleren levert relatief veel op. En omdat het je eigen huis is, bepaal je zelf wat je aanpakt en wanneer."],
        ],
        punten: [
          { titel: "Vrijstaand", tekst: "Vier gevels, een dak en een vloer die allemaal warmte kunnen verliezen. Kijk naar het geheel, niet naar één onderdeel." },
          { titel: "Twee-onder-een-kap", tekst: "Eén muur deel je met de buren. De andere gevels, het dak en de vloer bepalen hier het meeste warmteverlies." },
          { titel: "Oudere woning", tekst: "Bij een ouder huis is vaak nog veel te winnen. Wat er al is verbeterd, bekijken we eerst." },
        ],
      },
      {
        id: "dorpen",
        titel: "Van Goor tot Bentelo",
        alineas: [
          ["Of je nu in het centrum van Goor woont, in een van de dorpen of in het buitengebied: voor isolatie gaat het vooral om je eigen huis, het bouwjaar en wat er al is gedaan."],
          ["Lees ook over isoleren in ", { tekst: "Goor", href: "/regio/overijssel/hof-van-twente/goor" }, ", ", { tekst: "Delden", href: "/regio/overijssel/hof-van-twente/delden" }, ", ", { tekst: "Markelo", href: "/regio/overijssel/hof-van-twente/markelo" }, ", ", { tekst: "Diepenheim", href: "/regio/overijssel/hof-van-twente/diepenheim" }, ", ", { tekst: "Hengevelde", href: "/regio/overijssel/hof-van-twente/hengevelde" }, " of ", { tekst: "Bentelo", href: "/regio/overijssel/hof-van-twente/bentelo" }, "."],
        ],
      },
      {
        id: "warmteprogramma",
        titel: "Het warmteprogramma tot 2035",
        alineas: [
          ["De gemeente werkt aan een warmteprogramma voor de periode 2026 tot 2035. Daaruit blijkt dat er in Hof van Twente een flinke verduurzamingsopgave ligt, juist omdat veel woningen wat ouder zijn."],
          ["Voor jou als bewoner is de eerste stap meestal dezelfde: zorg dat je huis warmte goed vasthoudt. Dat scheelt nu al op je energierekening en maakt een overstap naar duurzame warmte later makkelijker."],
        ],
      },
    ],
    maatregelen: {
      titel: "Isoleren bij een grondgebonden woning",
      intro: "Bij vrijstaande en twee-onder-een-kapwoningen komen deze onderdelen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Een groot dak betekent ook veel oppervlak waarlangs warmte kan ontsnappen. Vaak de plek waar het meeste te winnen valt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Heeft je huis veel buitenmuur met een lege spouw? Dan is dit vaak een logische stap. Let op beschermde dieren in de spouw." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Een koude begane grond voel je in een vrijstaand huis snel. Met een kruipruimte is de vloer vaak van onderaf te isoleren." },
        { slug: "warmtepomp", naam: "Warmtepomp", tekst: "Is je huis goed geïsoleerd, dan komt verwarmen met een (hybride) warmtepomp in beeld." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Hof van Twente",
      alineas: [
        ["Met de digitale woningscan zie je snel welke maatregelen bij een vrijstaande woning, een twee-onder-een-kapper of een ander type passen. Handig als voorbereiding, maar niet nodig."],
        ["Voor advies over je eigen huis komt een adviseur van Gijs bij je langs, ook in de dorpen en het buitengebied. Samen kijk je wat er al is gedaan en wat een verstandige volgende stap is. Wat je daarna doet en met wie, kies je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Hof van Twente heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een vrijstaande woning. Waar begin ik?", answer: "Meestal bij het onderdeel waar de meeste warmte verloren gaat. Bij een vrijstaand huis is dat vaak het dak, maar het hangt af van wat er al is geïsoleerd. Tijdens de energiescan zetten we dat op een rij." },
      { question: "Is een twee-onder-een-kapwoning anders dan een vrijstaand huis?", answer: "Een beetje. Je deelt één muur met de buren, dus daar verlies je weinig warmte. De andere gevels, het dak en de vloer blijven belangrijk." },
      { question: "Helpt Gijs ook in de kleinere dorpen en het buitengebied?", answer: "Ja. Gijs helpt bewoners in de hele gemeente Hof van Twente, van Goor en Delden tot Hengevelde en Bentelo." },
      { question: "Wat betekent het warmteprogramma voor mijn huis?", answer: "Het programma beschrijft de koers voor de hele gemeente. Wat het precies voor jouw straat betekent, maakt de gemeente later bekend. Isoleren kun je nu al doen, en dat is nooit weggegooid." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Ook een gemeente met dorpen en buitengebied, en aandacht voor natuurvriendelijk isoleren." },
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Wat het bouwjaar van je huis zegt over isolatie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Hof van Twente: in Goor, Delden, Markelo, Diepenheim, Hengevelde, Bentelo en het buitengebied."],
    ],
  },

  "/regio/overijssel/almelo": {
    seo: {
      title: "Woning isoleren in Almelo: de eerste stap, wijk voor wijk | Gijs",
      description: "Almelo pakt de warmtetransitie wijk voor wijk aan, met isoleren als eerste stap. Lees wat dat voor jouw woning betekent en hoe Gijs je op weg helpt.",
    },
    kicker: "Gemeente Almelo",
    h1: "Je woning isoleren in Almelo",
    intro: [
      ["Almelo telt bijna 35.000 woningen. De gemeente werkt wijk voor wijk aan de overstap naar duurzame warmte, en noemt isoleren daarbij nadrukkelijk als eerste stap. Dat geldt voor elke wijk, ook als jouw buurt nog niet aan de beurt is."],
      ["Gijs helpt je om die eerste stap concreet te maken: wat kan er bij jouw huis, en waar begin je?"],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "wijk-voor-wijk",
        titel: "Wijk voor wijk van het aardgas af",
        alineas: [
          ["Voor 2026 noemt de gemeente de Binnenstad Noord, de Binnenstad Zuid en Ulk en omgeving als focus van de warmtetransitie. Daarna volgen onder meer Kerkelanden en Wester Sluitersveldlanden. Welke planning voor jouw buurt geldt, lees je bij de gemeente Almelo."],
          ["Woon je in een wijk die later aan de beurt is? Dan hoef je niet te wachten. Isoleren helpt in elke wijk en bij elke manier van verwarmen."],
        ],
      },
      {
        id: "isoleren-eerst",
        titel: "Waarom isoleren eerst?",
        alineas: [
          ["Een huis dat warmte goed vasthoudt, heeft minder energie nodig. Dat merk je nu al op je energierekening en aan het comfort in huis. Later kun je met een kleinere of zuinigere installatie toe, welke warmtebron er in jouw wijk ook komt."],
          ["Andersom werkt minder goed: een nieuwe verwarming in een slecht geïsoleerd huis moet harder werken, en dat kost geld."],
        ],
      },
      {
        id: "appartement-vve",
        titel: "Woon je in een appartement?",
        alineas: [
          ["Bij een appartement loopt verduurzamen vaak via de Vereniging van Eigenaren, omdat dak, gevel en vloer van iedereen samen zijn. De gemeente Almelo heeft daar aparte aandacht voor, met een eigen regeling voor VvE's. De voorwaarden lees je bij de gemeente."],
        ],
      },
      {
        id: "natuurvriendelijk",
        titel: "Natuurvriendelijk isoleren en verbouwen",
        alineas: [
          ["Ook Almelo besteedt aandacht aan natuurvriendelijk isoleren en verbouwen. In spouwmuren en onder daken kunnen beschermde dieren zitten, zoals vleermuizen en vogels die in gebouwen nestelen. Vraag het isolatiebedrijf vooraf hoe het daar rekening mee houdt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Waar begin je met isoleren?",
      intro: "Dit zijn de maatregelen die bij een eengezinswoning het vaakst als eerste stap aan bod komen.",
      items: [
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Bij oudere woningen met een lege spouw vaak een relatief kleine ingreep met een merkbaar resultaat." },
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Via het dak verdwijnt veel warmte. Een geïsoleerde zolder is bovendien prettiger om te gebruiken." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Warmere voeten op de begane grond. Met een kruipruimte meestal van onderaf te doen." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Ouder glas vervangen beperkt warmteverlies en koude plekken bij het raam." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Almelo",
      alineas: [
        ["In de digitale woningscan zie je in een paar minuten welke maatregelen bij jouw type woning horen. Zo weet je al wat meer voordat je met iemand praat."],
        ["Bij de gratis energiescan bekijkt een adviseur van Gijs je huis ter plekke. Je krijgt een duidelijk beeld van wat er kan en in welke volgorde. Er zit geen verplichting aan vast: je kiest zelf of en met wie je verdergaat."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["Welke regelingen de gemeente Almelo op dit moment heeft, lees je op de website van de gemeente."],
    ],
    faq: [
      { question: "Mijn wijk is nog niet aan de beurt. Moet ik wachten met isoleren?", answer: "Nee. Isoleren helpt bij elke manier van verwarmen. Een goed geïsoleerd huis is nu zuiniger en straks klaar voor duurzame warmte, wanneer jouw wijk ook aan de beurt is." },
      { question: "Waarom noemt de gemeente isoleren de eerste stap?", answer: "Omdat een huis dat weinig warmte verliest, minder energie nodig heeft. Dat maakt elke volgende stap, zoals een warmtepomp of een warmtenet, makkelijker en goedkoper in gebruik." },
      { question: "Ik woon in een appartement. Wat kan ik doen?", answer: "Veel loopt via de VvE, omdat dak en gevel gedeeld zijn. De gemeente Almelo heeft daar een eigen regeling voor. Beter glas of het aanpakken van tocht kun je soms ook zelf regelen." },
      { question: "Komt Gijs bij mij thuis in Almelo?", answer: "Ja. De gratis energiescan vindt bij je thuis plaats, zodat de adviseur je woning echt kan bekijken." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Borne", href: "/regio/overijssel/borne", tekst: "Over oudere woningen, de dorpen en natuurvriendelijk isoleren." },
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Over appartementen en wijken in de warmtetransitie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Almelo, van de binnenstad tot de wijken eromheen. Twijfel je of we bij jou langskomen? Neem gerust contact op."],
    ],
  },

  "/regio/overijssel/oldenzaal": {
    seo: {
      title: "Woning isoleren in Oldenzaal: van tussenwoning tot dak | Gijs",
      description: "In Oldenzaal zijn tussenwoningen de grootste groep. Lees hoe je zo'n huis slim isoleert, wat het lopende natuuronderzoek betekent en hoe Gijs helpt.",
    },
    kicker: "Gemeente Oldenzaal",
    h1: "Je woning isoleren in Oldenzaal",
    intro: [
      ["Oldenzaal telt bijna 15.000 woningen. De grootste groep daarvan zijn tussenwoningen: huizen met aan twee kanten buren. Dat bepaalt voor een deel waar je huis warmte verliest, en dus waar je het beste kunt beginnen."],
      ["Gijs helpt je dat voor jouw eigen huis uit te zoeken, zodat je weet welke stap het meeste oplevert."],
    ],
    ctaPrimair: { tekst: "Start de woningscan", href: "/woning" },
    ctaSecundair: { tekst: "Vraag een gratis energiescan aan", href: "/contact#energiescan" },
    secties: [
      {
        id: "tussenwoning",
        titel: "Een tussenwoning isoleren",
        alineas: [
          ["Met ruim 5.100 adressen zijn tussenwoningen in Oldenzaal de grootste woninggroep. Bij zo'n huis verlies je weinig warmte via de zijmuren, want daar wonen de buren. De warmte gaat vooral weg via het dak, de voor- en achtergevel, de vloer en de ramen."],
          ["Dat maakt de keuze overzichtelijk. Vaak begin je bij het dak of de zolder en kijk je daarna naar de gevels en het glas."],
        ],
        punten: [
          { titel: "Dak en zolder", tekst: "Warmte stijgt op. Bij een tussenwoning is het dak vaak de grootste lekpost en dus een logische eerste stap." },
          { titel: "Voor- en achtergevel", tekst: "Twee gevels met ramen en deuren. Een lege spouw en ouder glas maken hier veel verschil." },
          { titel: "Vloer", tekst: "Heb je een kruipruimte? Dan is de begane grondvloer vaak van onderaf te isoleren." },
        ],
      },
      {
        id: "natuuronderzoek",
        titel: "Natuuronderzoek in Oldenzaal",
        alineas: [
          ["De gemeente Oldenzaal heeft in de bebouwde kom uitgebreid onderzoek laten doen naar beschermde dieren die in en aan gebouwen leven, zoals huismussen, gierzwaluwen, zwaluwen, spreeuwen en vleermuizen. Dat onderzoek is de basis voor een soortenmanagementplan, dat de gemeente eind 2027 verwacht."],
          ["Met zo'n plan kan natuurvriendelijk isoleren straks voor een heel gebied geregeld worden, in plaats van per huis. Tot dat zover is, moet bij elke woning rekening worden gehouden met deze dieren, zeker bij spouw- en dakisolatie. Vraag het isolatiebedrijf hoe het dit aanpakt."],
        ],
      },
    ],
    maatregelen: {
      titel: "Maatregelen voor een tussenwoning",
      intro: "Bij rij- en tussenwoningen in Oldenzaal komen deze maatregelen het vaakst aan bod.",
      items: [
        { slug: "dakisolatie", naam: "Dakisolatie", tekst: "Vaak de eerste stap: het dak is bij een tussenwoning het grootste oppervlak waarlangs warmte ontsnapt." },
        { slug: "spouwmuurisolatie", naam: "Spouwmuurisolatie", tekst: "Voor- en achtergevel met een lege spouw? Dan is isoleren vaak goed te doen. Let op natuurvriendelijk werken." },
        { slug: "isolatieglas", naam: "Isolatieglas", tekst: "Met ramen aan voor- en achterkant telt goed glas extra mee voor warmte en comfort." },
        { slug: "vloerisolatie", naam: "Vloerisolatie", tekst: "Minder koude voeten en minder warmteverlies naar de kruipruimte." },
      ],
    },
    gijs: {
      id: "zo-helpt-gijs",
      titel: "Zo helpt Gijs je in Oldenzaal",
      alineas: [
        ["Kies in de digitale woningscan voor een tussenwoning of een ander type, en zie welke maatregelen erbij passen. Zo ben je goed voorbereid."],
        ["Bij de gratis energiescan komt een adviseur van Gijs bij je thuis. Samen kijk je naar het dak, de gevels, de vloer en het glas, en naar wat er al is gedaan. Daarna weet je wat een logische volgende stap is. Wat je ermee doet, beslis je zelf."],
      ],
    },
    subsidies: [
      SUBSIDIE_TIJDLOOS,
      ["De gemeente Oldenzaal heeft ook een eigen isolatieregeling. Of die op dit moment loopt en of jouw woning in aanmerking komt, lees je bij de gemeente."],
    ],
    faq: [
      { question: "Ik woon in een tussenwoning in Oldenzaal. Waar begin ik?", answer: "Vaak bij het dak of de zolder, omdat daar bij een tussenwoning veel warmte verdwijnt. Daarna komen de voor- en achtergevel en het glas. Wat bij jouw huis de beste volgorde is, bekijken we tijdens de energiescan." },
      { question: "Wat betekent het soortenmanagementplan voor mij?", answer: "Met zo'n plan kan de gemeente natuurvriendelijk isoleren voor een heel gebied regelen. Tot het plan er is, moet bij elke woning rekening worden gehouden met beschermde dieren. Het isolatiebedrijf hoort dat te regelen." },
      { question: "Moet ik wachten tot het plan klaar is?", answer: "Nee. Je kunt nu al isoleren, zolang het natuurvriendelijk gebeurt. Vraag het isolatiebedrijf vooraf hoe het daarmee omgaat." },
      { question: "Helpt Gijs in heel Oldenzaal?", answer: "Ja. Gijs helpt bewoners in alle wijken van Oldenzaal." },
    ],
    verwant: {
      titel: "Ook interessant",
      links: [
        { naam: "Isoleren in Enschede", href: "/regio/overijssel/enschede", tekst: "Ook daar staat natuurvriendelijk isoleren centraal." },
        { naam: "Isoleren in Hengelo", href: "/regio/overijssel/hengelo", tekst: "Wat het bouwjaar van je huis zegt over isolatie." },
      ],
    },
    werkgebied: [
      ["Gijs helpt bewoners in heel Oldenzaal, van De Thij tot Graven Es. Woon je net buiten de gemeente? Neem gerust contact op."],
    ],
  },
};

/** Sleutel = regiopad (zie regioPad in lib/content/regio.ts). */
export const REGIO_LOKAAL: Record<string, LokaleInhoud> = { ...ZWOLLE, ...TWENTE, ...TWENTE_RONDE_2 };

export const getLokaleInhoud = (pad: string): LokaleInhoud | undefined => REGIO_LOKAAL[pad];
