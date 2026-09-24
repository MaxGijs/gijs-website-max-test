import type { MetadataRoute } from "next";
import { SITE_URL, SEO_INDEXABLE, PUBLIC_PATHS } from "@/lib/seo";
export default function sitemap():MetadataRoute.Sitemap {
 return SEO_INDEXABLE?PUBLIC_PATHS.map(path=>({url:SITE_URL+path})):[];
}
