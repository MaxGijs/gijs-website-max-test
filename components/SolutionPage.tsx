import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { ReactNode } from "react";

export function SolutionCTA() {
  return <section className="mt-16 rounded-3xl bg-[var(--green-800)] p-8 md:p-12 text-white">
    <h2 className="text-3xl font-bold text-white">Wat past bij jouw huis?</h2>
    <p className="mt-4 max-w-2xl text-lg">Verken je mogelijkheden met de digitale woningscan. Liever samen kijken? Bespreek een gratis energiescan aan huis met Gijs.</p>
    <div className="mt-7 flex flex-wrap gap-4"><Link href="/woning" className="rounded-full bg-white text-[var(--green-800)] px-6 py-4 font-bold no-underline">Digitale woningscan</Link><Link href="/contact" className="rounded-full border border-white px-6 py-4 font-bold text-white no-underline">Persoonlijk advies</Link></div>
  </section>;
}
export default function SolutionPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <><Header /><main className="mx-auto max-w-6xl text-[var(--green-900)] px-6 py-12 md:py-20">
    <Link href="/maatregelen" className="text-sm font-semibold">Verduurzamen / Maatregelen</Link>
    <h1 className="mt-5 text-4xl md:text-6xl font-bold">{title}</h1><p className="mt-6 max-w-3xl text-xl leading-relaxed">{intro}</p>
    {children}<SolutionCTA />
  </main><Footer /></>;
}
