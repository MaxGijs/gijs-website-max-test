import { SITE_URL } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { SOCIAL_LINKS } from "@/lib/content/social";
export function JsonLd({data}:{data:Record<string,unknown>}) {
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
export default function SeoSchema(){
 return <JsonLd data={{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":SITE_URL+"/#organization",name:"Gijs",url:SITE_URL,logo:SITE_URL+"/logo-white.png",telephone:CONTACT.phoneHref.replace("tel:",""),email:CONTACT.email,address:{"@type":"PostalAddress",streetAddress:CONTACT.street,postalCode:"7556 BN",addressLocality:"Hengelo",addressCountry:"NL"},sameAs:SOCIAL_LINKS.map(link=>link.href)},
 {"@type":"WebSite","@id":SITE_URL+"/#website",name:"Gijs",url:SITE_URL,inLanguage:"nl-NL",publisher:{"@id":SITE_URL+"/#organization"}}
 ]}}/>;
}
