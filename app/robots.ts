import type { MetadataRoute } from "next";
import { SITE_URL, SEO_INDEXABLE } from "@/lib/seo";
export default function robots():MetadataRoute.Robots {
 return {rules:{userAgent:"*",allow:"/",disallow:["/api/"]},...(SEO_INDEXABLE?{sitemap:SITE_URL+"/sitemap.xml"}:{})};
}
