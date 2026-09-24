import { SOCIAL_LINKS } from "@/lib/content/social";

export default function SocialLinks() {

  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Gijs op ${s.label} (opent in nieuw tabblad)`}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-current hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {s.icon === "linkedin" && <path d="M5.37 24H.39V7.98h4.98zM2.88 5.8a2.89 2.89 0 1 1 .02-5.78 2.89 2.89 0 0 1-.02 5.78zM24 24h-4.97v-7.79c0-1.86-.04-4.25-2.59-4.25-2.59 0-2.98 2.02-2.98 4.12V24H8.49V7.98h4.77v2.19h.07c.66-1.26 2.29-2.59 4.71-2.59 5.04 0 5.96 3.32 5.96 7.63z" />}
            {s.icon === "facebook" && <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.098 24 12.073z" />}
            {s.icon === "instagram" && <g fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></g>}
          </svg>
        </a>
      ))}
    </div>
  );
}
