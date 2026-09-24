import Link from "next/link";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";
import { CONTACT } from "@/lib/content/contact";

const PRIVACY_URL =
  "https://mijn.avg-programma.nl/privacy_statement/638caa10-fe1e-4960-8937-9ed6f18c8d4d";

export default function Footer() {
  return (
    <footer className="gijs-footer text-white" style={{ backgroundColor: "var(--gijs-donkergroen)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Image src="/logo-white.png" alt="Gijs" width={912} height={520} style={{ height: "auto" }} className="mb-4 h-auto w-[108px]" />
          <p className="text-sm text-white/70 max-w-[30ch]">
            Samen maken we je huis fijner.
          </p>
          <div className="mt-4"><SocialLinks /></div>
          <h4 className="font-semibold mt-6 mb-3 text-white">Contact</h4>
          <address className="not-italic text-sm leading-7 text-white/90">
            {CONTACT.street}<br />{CONTACT.city}<br />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br />
            <a href={CONTACT.phoneHref}>Tel: {CONTACT.phone}</a>
          </address>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Maatregelen</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li><Link href="/maatregelen#isolatie" className="no-underline hover:text-white">Isolatie</Link></li>
            <li><Link href="/maatregelen#installaties" className="no-underline hover:text-white">Installaties</Link></li>
            <li><Link href="/maatregelen" className="no-underline hover:text-white">Alle maatregelen</Link></li>
            <li><Link href="/regio" className="no-underline hover:text-white">Isoleren in jouw regio</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Kennis</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li><Link href="/kennis#keuzehulpen" className="no-underline hover:text-white">Waar begin je?</Link></li>
            <li><Link href="/kennis#subsidies" className="no-underline hover:text-white">Subsidies & financiering</Link></li>
            <li><Link href="/kennis#veelgestelde-vragen" className="no-underline hover:text-white">Veelgestelde vragen</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Vertrouwen</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            <li>
              <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-white">
                Privacy
              </a>
            </li>
            <li><Link href="/algemene-voorwaarden" className="no-underline hover:text-white">Algemene voorwaarden</Link></li>
            <li><Link href="/avg-verklaring" className="no-underline hover:text-white">AVG-verklaring</Link></li>
            <li><Link href="/cookies" className="no-underline hover:text-white">Cookies</Link></li>
            <li><Link href="/disclaimer" className="no-underline hover:text-white">Disclaimer</Link></li>
            <li><Link href="/toegankelijkheid" className="no-underline hover:text-white">Toegankelijkheid</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>Gijs | Groen in je straat</span>
          <span className="tracking-[var(--ls-eyebrow,0.16em)] uppercase">groeninjestraat.nl</span>
        </div>
      </div>
    </footer>
  );
}
