import type { MetadataRoute } from "next";
import { SITE_URL, SEO_INDEXABLE, PUBLIC_PATHS, LAATST_GEWIJZIGD } from "@/lib/seo";
export default function sitemap():MetadataRoute.Sitemap {
 return SEO_INDEXABLE?PUBLIC_PATHS.map(path=>({url:SITE_URL+path,...(LAATST_GEWIJZIGD[path]&&{lastModified:LAATST_GEWIJZIGD[path]})})):[];
}
