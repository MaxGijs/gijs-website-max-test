import type { ProfielFoto } from "./gemeente-verhalen";

// Gemeente-specifieke Pexels-foto's: per slug een ID + alt-tekst.
// Pexels-foto's zijn rechtenvrij (geen verplichte bronvermelding nodig).
const GEMEENTE_PEXELS: Record<string, { id: string; alt: string }> = {
  // ── Gelderland ──
  aalten:               { id: "40491143", alt: "Groene weilanden in de Achterhoek" },
  apeldoorn:            { id: "9736502",  alt: "Het Loo Paleis met groene tuinen" },
  arnhem:               { id: "34295423", alt: "Brug over de Rijn bij Arnhem" },
  barneveld:            { id: "10479347", alt: "Herfstbos in Gelderland" },
  "berg-en-dal":        { id: "17881052", alt: "Uitgestrekte groene akkers ten zuiden van Nijmegen" },
  berkelland:           { id: "40491143", alt: "Schapen in weiland in de Achterhoek" },
  beuningen:            { id: "30519576", alt: "Kanaalpolder met molen in het rivierengebied" },
  bronckhorst:          { id: "40491143", alt: "Groene weilanden in de Achterhoek" },
  brummen:              { id: "14297696", alt: "Heide op de Veluwe bij het IJsseldal" },
  buren:                { id: "8290871",  alt: "Kleurrijke huizen langs een rivieroever in de Betuwe" },
  culemborg:            { id: "8290871",  alt: "Rivieroever met bomen in de Lek-regio" },
  doesburg:             { id: "8290871",  alt: "Huizen langs de IJssel-oever" },
  doetinchem:           { id: "34076840", alt: "Historisch kasteel met gracht in Doetinchem" },
  druten:               { id: "17881052", alt: "Luchtfoto polderland langs de Waal" },
  duiven:               { id: "17881052", alt: "Uitgestrekte groene akkers langs de Waal" },
  ede:                  { id: "14297696", alt: "Heidepaden op de Veluwe bij Ede" },
  elburg:               { id: "20827474", alt: "Molen aan het water langs de IJsselmeerkust" },
  epe:                  { id: "14297696", alt: "Heidepaden op de Veluwe bij Epe" },
  ermelo:               { id: "14297696", alt: "Glooiende heide op de Veluwe" },
  "west-betuwe":        { id: "8290871",  alt: "Rivieroever in de Betuwe" },
  harderwijk:           { id: "14297696", alt: "Glooiende heide op de Veluwe bij Harderwijk" },
  hattem:               { id: "32552149", alt: "Schilderachtige molen in Hattem" },
  heerde:               { id: "14297696", alt: "Heide op de Veluwe bij het IJsseldal" },
  heumen:               { id: "17881052", alt: "Groene polderakkers ten zuiden van Nijmegen" },
  lingewaard:           { id: "17881052", alt: "Luchtfoto polderland langs de Rijn" },
  lochem:               { id: "20831035", alt: "Zonsondergang over weiland in de Achterhoek" },
  maasdriel:            { id: "20827474", alt: "Molen aan de rivier in de Bommelerwaard" },
  montferland:          { id: "16629702", alt: "Bospad in de Achterhoek" },
  "neder-betuwe":       { id: "17881052", alt: "Luchtfoto polderland in de Betuwe" },
  nijkerk:              { id: "40491143", alt: "Weiland met schapen tussen Veluwe en polders" },
  nijmegen:             { id: "37339958", alt: "Brug over de Waal bij Nijmegen" },
  nunspeet:             { id: "14297696", alt: "Heidepaden op de Veluwe bij Nunspeet" },
  oldebroek:            { id: "14297696", alt: "Glooiende heide op de Veluwe" },
  "oost-gelre":         { id: "40491143", alt: "Weilanden met schapen in de Achterhoek" },
  "oude-ijsselstreek":  { id: "40491143", alt: "Weilanden langs de Oude IJssel" },
  overbetuwe:           { id: "17881052", alt: "Luchtfoto polderland in de Overbetuwe" },
  putten:               { id: "14297696", alt: "Glooiende heide op de Veluwe bij Putten" },
  renkum:               { id: "6203038",  alt: "Landhuis aan rustig meer bij Arnhem" },
  rheden:               { id: "33287267", alt: "Edelherten in bos op de Veluwe" },
  rozendaal:            { id: "14297696", alt: "Bos op de Veluwezoom" },
  scherpenzeel:         { id: "40491143", alt: "Weiland met schapen op de Gelderse Vallei" },
  tiel:                 { id: "11661685", alt: "Rivierlandschap bij Tiel in de Betuwe" },
  voorst:               { id: "14297696", alt: "Solitaire boom langs de IJssel bij Voorst" },
  wageningen:           { id: "17881052", alt: "Groene akkers langs de Rijn bij Wageningen" },
  "west-maas-en-waal":  { id: "20827474", alt: "Molen tussen de Maas en Waal" },
  westervoort:          { id: "17881052", alt: "Luchtfoto polderland bij de IJssel" },
  wijchen:              { id: "17881052", alt: "Groene akkers ten zuidwesten van Nijmegen" },
  winterswijk:          { id: "36965918", alt: "Zonsondergang over weiland in de Achterhoek" },
  zaltbommel:           { id: "20827474", alt: "Molen aan de Waal bij Zaltbommel" },
  zevenaar:             { id: "17881052", alt: "Luchtfoto poldervelden bij zonsondergang" },
  zutphen:              { id: "8290871",  alt: "Huizen langs de IJssel-oever bij Zutphen" },
  // ── Utrecht ──
  amersfoort:            { id: "33722625", alt: "Zomers gracht in het centrum van Amersfoort" },
  baarn:                 { id: "38051151", alt: "Heteluchtballonnen bij zonsondergang boven Baarn" },
  bunnik:                { id: "33573087", alt: "Charmante Hollandse gracht met waterreflecties" },
  bunschoten:            { id: "33558939", alt: "Historische houten boten in de haven van Spakenburg" },
  "de-bilt":             { id: "19603130", alt: "Fiets leunend tegen een boom in een park in De Bilt" },
  "de-ronde-venen":      { id: "29602009", alt: "Houten steiger bij poldermeer in De Ronde Venen" },
  eemnes:                { id: "39101914", alt: "Luchtfoto koeien in een Hollands polderveld bij Eemnes" },
  houten:                { id: "39759003", alt: "Kleurrijke rijtjeshuizen bij het meer in Houten" },
  ijsselstein:           { id: "35729634", alt: "Rustige rivierscène met historische toren" },
  leusden:               { id: "15136637", alt: "Bospad met herfstbladeren op de Utrechtse Heuvelrug" },
  lopik:                 { id: "40161097", alt: "Winterzonsondergang met molen langs het water bij Lopik" },
  montfoort:             { id: "5816750",  alt: "Groene bomen langs de Hollandsche IJssel bij Montfoort" },
  nieuwegein:            { id: "28893362", alt: "Charmante Hollandse rijtjeswoningen omgeven door groen" },
  oudewater:             { id: "36600932", alt: "Gracht in het historische stadscentrum van Oudewater" },
  renswoude:             { id: "13166137", alt: "Idyllisch weiland met solitaire boom in de Gelderse Vallei" },
  rhenen:                { id: "34981482", alt: "Herfstlandschap met boomgaarden in Rhenen" },
  soest:                 { id: "34458177", alt: "Uitgestrekt heidelandschap bij Soest" },
  "stichtse-vecht":      { id: "8054877",  alt: "Kapelletje langs de Vecht in Loenen aan de Vecht" },
  utrecht:               { id: "37539522", alt: "Schilderachtige gracht in het centrum van Utrecht" },
  "utrechtse-heuvelrug": { id: "15136637", alt: "Bospad met herfstbladeren op de Utrechtse Heuvelrug" },
  veenendaal:            { id: "34340969", alt: "Schilderachtig landschap met kronkelend pad" },
  vijfheerenlanden:      { id: "35014445", alt: "Brug over het water in Vianen, Vijfheerenlanden" },
  "wijk-bij-duurstede":  { id: "29927587", alt: "Historische kerktoren in Wijk bij Duurstede" },
  woerden:               { id: "39101913", alt: "Luchtfoto historisch Nederlands dorp met klokkentoren" },
  woudenberg:            { id: "34340969", alt: "Schilderachtig bospad op de Utrechtse Heuvelrug bij Woudenberg" },
  zeist:                 { id: "32062427", alt: "Zonnig parklandschap met groene bomen in Zeist" },
  // ── Flevoland ──
  almere:                { id: "40737388", alt: "Herfstgracht met kleurrijke bomen in Almere" },
  dronten:               { id: "2480070",  alt: "Luchtfoto groen akkerland in Flevoland" },
  lelystad:              { id: "33730665", alt: "Hollands polderlandschap met open velden en water bij Lelystad" },
  noordoostpolder:       { id: "38524983", alt: "Zomerse poldergracht met eenden in Noordoostpolder" },
  urk:                   { id: "16423703", alt: "Pier met houten golfbrekers in het historische vissersdorp Urk" },
  zeewolde:              { id: "40161165", alt: "Zonsondergang over poldergracht bij Zeewolde" },
  // ── Overijssel ──
  almelo:               { id: "33574641", alt: "Historisch plein met kerk in Almelo" },
  borne:                { id: "40491143", alt: "Groen weiland in Twente" },
  dalfsen:              { id: "30519576", alt: "Kanaalpolder met verre molen bij Dalfsen" },
  deventer:             { id: "28799666", alt: "Historische binnenstad langs de IJssel in Deventer" },
  dinkelland:           { id: "40491143", alt: "Weiland in het buitengebied van Twente" },
  enschede:             { id: "40491143", alt: "Glooiend weiland in Twente bij Enschede" },
  haaksbergen:          { id: "16629702", alt: "Boslandschap bij Haaksbergen" },
  hardenberg:           { id: "325257",   alt: "Koeien in weidse weilanden bij Hardenberg" },
  hellendoorn:          { id: "14297696", alt: "Glooiend heuvellandschap bij Hellendoorn" },
  hengelo:              { id: "40491143", alt: "Groen weiland in Twente bij Hengelo" },
  "hof-van-twente":     { id: "40491143", alt: "Groene weilanden met houtwallen in Hof van Twente" },
  kampen:               { id: "31065882", alt: "Historische kerk van Kampen aan de IJssel" },
  losser:               { id: "16629702", alt: "Bospad in het buitengebied van Twente" },
  oldenzaal:            { id: "14297696", alt: "Glooiend landschap op de Heuvelrug bij Oldenzaal" },
  "olst-wijhe":         { id: "8290871",  alt: "Huizen langs de IJssel-oever bij Olst" },
  ommen:                { id: "8290871",  alt: "Rivieroever langs de Vecht bij Ommen" },
  raalte:               { id: "40491143", alt: "Weiland in het Sallandse coulisselandschap" },
  "rijssen-holten":     { id: "14297696", alt: "Glooiend landschap bij Rijssen" },
  staphorst:            { id: "17881052", alt: "Luchtfoto polderland langs de IJssel bij Staphorst" },
  steenwijkerland:      { id: "20827474", alt: "Molen in het water in de Kop van Overijssel" },
  tubbergen:            { id: "40491143", alt: "Weiland met houtwallen in Twente bij Tubbergen" },
  twenterand:           { id: "40491143", alt: "Groene weilanden in het coulisselandschap van Twente" },
  wierden:              { id: "40491143", alt: "Weiland met houtwallen in het buitengebied van Twente" },
  zwartewaterland:      { id: "20827474", alt: "Molen aan het water in Zwartewaterland" },
  zwolle:               { id: "11155970", alt: "Station Zwolle bij schemering met waterreflectie" },
};

function pexelsUrl(id: string): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
}

// Lokale fallback voor plaatsen wier gemeente niet in de map staat.
// Boerderij-foto's zijn weggelaten omdat ze verouderd of verwaarloosd kunnen ogen.
const FOTOS_LOKAAL: ProfielFoto[] = [
  { src: "/images/regio/sfeer/sfeer-01.jpg", alt: "Bakstenen woning met pannendak onder een blauwe lucht" },
  { src: "/images/regio/sfeer/sfeer-03.jpg", alt: "Bloeiende bomen langs een straat met woningen" },
  { src: "/images/regio/sfeer/sfeer-06.jpg", alt: "Bakstenen woningen aan een straat" },
  { src: "/images/regio/sfeer/sfeer-07.jpg", alt: "Smal klinkerpad met woning en tuin" },
  { src: "/images/regio/sfeer/sfeer-08.jpg", alt: "Bakstenen puntgevels tegen een blauwe lucht" },
  { src: "/images/regio/sfeer/sfeer-09.jpg", alt: "Rijen woningen met pannendaken van boven gezien" },
  { src: "/images/regio/sfeer/sfeer-10.jpg", alt: "Bakstenen rijwoningen met heg" },
  { src: "/images/regio/sfeer/sfeer-11.jpg", alt: "Zandpad langs een veld in ochtendlicht" },
  { src: "/images/regio/sfeer/sfeer-12.jpg", alt: "Beukenbos in herfstkleuren" },
  { src: "/images/regio/sfeer/sfeer-13.jpg", alt: "Open weiland onder een wolkenlucht" },
  { src: "/images/regio/sfeer/sfeer-14.jpg", alt: "Dorp aan de horizon achter groene weilanden" },
  { src: "/images/regio/sfeer/sfeer-15.jpg", alt: "Dijk langs het water onder een blauwe lucht" },
  { src: "/images/regio/sfeer/sfeer-16.jpg", alt: "Fietspad langs een weiland met bos" },
  { src: "/images/regio/sfeer/sfeer-18.jpg", alt: "Bakstenen rijwoningen met sierwerk in de gevel" },
  { src: "/images/regio/sfeer/sfeer-19.jpg", alt: "Groen grasveld met oude bomen" },
  { src: "/images/regio/sfeer/sfeer-20.jpg", alt: "Straatje met woningen en pannendaken" },
].map(f => ({ ...f, bron: "pexels" as const }));

/** Geeft een Pexels-foto voor de gemeente als er een mapping is; anders een lokale sfeerfoto.
 *  De sleutel is de gemeenteslug (bijv. "borne") of gemeente/plaatsslug ("borne/zenderen"). */
export function sfeerFoto(sleutel: string): ProfielFoto {
  const gemeenteSlug = sleutel.split("/")[0];
  const pexels = GEMEENTE_PEXELS[gemeenteSlug];
  if (pexels) {
    return { src: pexelsUrl(pexels.id), alt: pexels.alt, bron: "pexels" };
  }
  // Stabiele hash voor plaatsen zonder gemeentemapping.
  let h = 0;
  for (const c of sleutel) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return FOTOS_LOKAAL[h % FOTOS_LOKAAL.length];
}
