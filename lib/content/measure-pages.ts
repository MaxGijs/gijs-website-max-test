import { MAATREGELEN } from "./maatregelen";
import { MEASURE_DETAILS } from "./measure-details";
import { MEASURE_INTRO } from "./measure-intro";

const definitions = [
  { name: "Zonnepanelen", slug: "zonnepanelen", category: "installaties", id: "zonnepanelen", intro: "Zonnepanelen zetten zonlicht om in elektriciteit die je in huis kunt gebruiken.", question: "Kunnen zonnepanelen op ieder dak?", answer: "Het legplan hangt af van de beschikbare dakruimte, de dakbedekking en eventuele bestaande panelen. Gijs bekijkt ook de bevestiging en elektrische aansluiting." },
  { name: "Warmtepomp", slug: "warmtepomp", category: "installaties", id: "warmtepomp", intro: "Een warmtepomp gebruikt elektriciteit om warmte van buiten bruikbaar te maken voor je woning.", question: "Moet mijn cv-ketel weg?", answer: "Bij een hybride oplossing werkt de warmtepomp samen met een cv-ketel. Bij volledig elektrisch verwarmen wordt ook warm water zonder cv-ketel bekeken. Wat past, hangt af van je woning en installatie." },
  { name: "Dakisolatie", slug: "dakisolatie", category: "isolatie", id: "dakisolatie", intro: "Een isolatielaag bij het dak helpt warmte binnen te houden. De dakopbouw en afwerking bepalen de aanpak.", question: "Wordt de dakkapel ook bekeken?", answer: "Ja. Gijs bekijkt naast de dakopbouw ook de dakramen, dakkapel, bestaande isolatie en bereikbaarheid. De werkzaamheden en afwerking worden vooraf besproken." },
  { name: "Spouwisolatie", slug: "spouwmuurisolatie", category: "isolatie", id: "gevelisolatie", intro: "De ruimte tussen de binnen- en buitenmuur heet de spouw. Als die geschikt is, kan daar isolatiemateriaal worden aangebracht.", question: "Welk materiaal is het beste voor mijn spouw?", answer: "Dat hangt af van de staat van de gevel, de beschikbare ruimte en aanwezige isolatie. Een inspectie bepaalt of glaswol, EPS-parels of schuimisolatie passend is." },
  { name: "Vloerisolatie", slug: "vloerisolatie", category: "isolatie", id: "vloerisolatie", intro: "Isolatie onder de beganegrondvloer helpt warmteverlies te beperken. Bodemisolatie is een andere aanpak: daarbij komt het materiaal op de bodem van de kruipruimte.", question: "Zijn vloer- en bodemisolatie hetzelfde?", answer: "Nee. Vloerisolatie zit direct onder de vloer; bodemisolatie ligt op de bodem van de kruipruimte. De constructie, bereikbaarheid en vochtomstandigheden bepalen welke aanpak mogelijk is." },
  // De voormalige gecombineerde "Glas en kozijnen"-pagina is opgesplitst
  // in twee eigen pagina's — zie app/maatregelen/[slug]/page.tsx,
  // components/measures/IsolatieglasPage.tsx en
  // components/measures/KozijnenPage.tsx.
  { name: "Isolatieglas", slug: "isolatieglas", category: "isolatie", id: "isolatieglas", intro: "Isolatieglas beperkt warmteverlies via het raam. Welke soort past, hangt af van je huidige glas.", question: "Hoe lang duurt het plaatsen van isolatieglas?", answer: "Gijs plaatst isolatieglas in één dag." },
  { name: "Kozijnen", slug: "kozijnen", category: "isolatie", id: "kozijnen", intro: "Het kozijn is de omlijsting rond glas en deur. Kunststof en aluminium kozijnen hebben elk hun eigen voor- en nadelen.", question: "Moet ik altijd het hele kozijn vervangen?", answer: "Niet per se. Wil je alleen het glas verbeteren zonder het kozijn te vervangen? Bekijk dan de isolatieglaspagina." },
  { name: "Vloerverwarming", slug: "vloerverwarming", category: "installaties", id: "vloerverwarming", intro: "Vloerverwarming verdeelt warmte vanuit je vloer. De bestaande vloer en je verbouwplannen bepalen welke uitvoering mogelijk is.", question: "Hoort een nieuwe afwerkvloer er automatisch bij?", answer: "Nee. Levering en plaatsing van de uiteindelijke afwerkvloer worden apart afgesproken. Bij een nieuwe vloeropbouw kan zandcement of Eco2floor boven de vloerverwarming een egale ondergrond vormen." },
  { name: "Thuisbatterij", slug: "thuisbatterij", category: "installaties", id: "thuisbatterij", intro: "Een thuisbatterij slaat elektriciteit op. Je energiegebruik en wat je wilt bereiken vormen het vertrekpunt voor het advies.", question: "Heb ik met een thuisbatterij altijd stroom bij een storing?", answer: "Nee. Een back-upfunctie vraagt om een systeem en aansluiting die dit ondersteunen. Niet iedere thuisbatterij kan bij stroomuitval je woning van stroom voorzien." },
  // Ketel: bewust een minimale pagina. Er is geen ketel-brochure,
  // -merk of -productblad in het project aangetroffen (zie het
  // eindverslag), dus deze intro/FAQ bevat uitsluitend wat al elders
  // (Warmtepomp) is goedgekeurd over de rol van de cv-ketel, zonder
  // producten, merken of een eigen uitvoeringsproces te verzinnen.
  { name: "Ketel", slug: "ketel", category: "installaties", id: "ketel", intro: "Een cv-ketel verwarmt je woning en levert warm water. Bij een hybride warmtepomp of een nieuwe vloerverwarming bekijkt Gijs of de bestaande ketel kan blijven of vervanging nodig is.", question: "Moet mijn cv-ketel weg als ik een warmtepomp neem?", answer: "Bij een hybride oplossing werkt de warmtepomp samen met een cv-ketel. Bij volledig elektrisch verwarmen wordt ook warm water zonder cv-ketel bekeken. Wat past, hangt af van je woning en installatie." },
];
export const MEASURE_PAGES = definitions.map(item => ({
  ...item,
  image: MAATREGELEN.find(m => m.titel === item.name)?.afbeelding,
  ...MEASURE_DETAILS[item.name],
  ...MEASURE_INTRO[item.name],
}));
