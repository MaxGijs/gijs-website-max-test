import type { Metadata } from "next";
import { MEASURE_PAGES } from "./content/measure-pages";
import { REGIO_INDEXEERBARE_PADEN } from "./content/regio";
export const SITE_URL = "https://gijs.eco";
// Enable only in the public production build; previews stay out of search.
export const SEO_INDEXABLE = process.env.SEO_INDEXABLE === "true";
export const PAGE_SEO: Record<string,{title:string;description:string;index?:boolean}> = {
 "/":{title:"Woning verduurzamen | Ontdek wat bij jouw woning past | Gijs",description:"Ontdek stap voor stap welke mogelijkheden er zijn om jouw woning te verduurzamen en start met jouw digitale woning bij Gijs."},
 "/maatregelen":{title:"Isolatie en installaties voor je woning | Gijs",description:"Lees over dak-, spouw- en vloerisolatie, glas, zonnepanelen, warmtepompen, vloerverwarming en thuisbatterijen. Ontdek wat Gijs voor jouw huis bekijkt."},
 "/contact":{title:"Contact met Gijs | Advies over je woning",description:"Vragen over verduurzamen? Neem contact op met Gijs via 074 - 234 0 777 of info@groeninjestraat.nl. Telefonisch bereikbaar van 08:30 tot 17:30."},
 "/zo-werkt-gijs":{title:"Zo werkt Gijs | Van woningplan naar persoonlijk advies",description:"Kies je woning, verken je wensen en bereid je adviesgesprek voor. Lees hoe de digitale woningscan en gratis energiescan aan huis bij Gijs werken."},
 "/kennis":{title:"Huis verduurzamen: uitleg en veelgestelde vragen | Gijs",description:"Antwoorden over isolatie, warmtepompen, zonnepanelen en je woningplan. Lees wat je kunt verwachten van de gratis energiescan aan huis."},
 "/over-gijs":{title:"Over Gijs | Samen je woning verduurzamen",description:"Gijs helpt je mogelijkheden voor isolatie en installaties te verkennen. Lees over onze aanpak en bespreek je woning met een adviseur."},
 "/regio":{title:"Isoleren en verduurzamen per regio | Gijs",description:"Kies je provincie en gemeente. Lees over isolatiemaatregelen, landelijke subsidies en hoe Gijs uitzoekt welke gemeentelijke regelingen mogelijk gelden."},
 "/woning":{title:"Jouw digitale woningscan | Gijs",description:"Verken je wensen en maatregelen op een voorbeeldwoning en bereid een adviesgesprek met Gijs voor.",index:false},
 "/cases":{title:"Projecten en ervaringen | Gijs",description:"De projectpagina van Gijs wordt voorbereid. Neem contact op voor vragen over onze werkzaamheden.",index:false},
 "/algemene-voorwaarden":{title:"Algemene voorwaarden | Gijs",description:"Informatie over de algemene voorwaarden van Gijs.",index:false},
 "/avg-verklaring":{title:"AVG-verklaring | Gijs",description:"Informatie over de AVG-verklaring van Gijs.",index:false},
 "/cookies":{title:"Cookiebeleid | Gijs",description:"Informatie over het cookiebeleid van Gijs.",index:false},
 "/disclaimer":{title:"Disclaimer | Gijs",description:"Informatie over de disclaimer van Gijs.",index:false},
 "/toegankelijkheid":{title:"Toegankelijkheid | Gijs",description:"Informatie over de toegankelijkheid van de website van Gijs.",index:false},
};
export function createMetadata(path:string,title:string,description:string,index=true,ogImage?:{path:string;alt:string}):Metadata {
 const url=SITE_URL+path;
 const image=ogImage?{url:SITE_URL+ogImage.path,alt:ogImage.alt}:{url:SITE_URL+"/maatregelen-overzicht.png",alt:"Verduurzamingsmaatregelen voor je woning"};
 return {title,description,alternates:{canonical:url},robots:{index:SEO_INDEXABLE&&index,follow:true},openGraph:{type:"website",locale:"nl_NL",siteName:"Gijs",url,title,description,images:[image]},twitter:{card:"summary_large_image",title,description,images:[image.url]}};
}
export function pageMetadata(path:string):Metadata {const p=PAGE_SEO[path];return createMetadata(path,p.title,p.description,p.index!==false);}
export const PUBLIC_PATHS=[...Object.keys(PAGE_SEO).filter(path=>PAGE_SEO[path].index!==false),...MEASURE_PAGES.map(m=>"/maatregelen/"+m.slug),...REGIO_INDEXEERBARE_PADEN.filter(path=>path!=="/regio")];
