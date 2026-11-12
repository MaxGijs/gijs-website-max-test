// Vijf sterren, precies gevuld tot de echte score (4,9 is dus bijna vijf volle sterren, niet afgerond).
// Puur weergave: de score komt altijd van Google via useGoogleReviews.
export function GoogleSterren({ rating, className = "" }: { rating: number; className?: string }) {
  const procent = Math.max(0, Math.min(100, (rating / 5) * 100));
  const label = `${rating.toLocaleString("nl-NL")} uit 5 sterren`;
  return (
    <span role="img" aria-label={label} className={`relative inline-block leading-none tracking-[0.08em] ${className}`}>
      <span aria-hidden="true" className="text-zinc-300">★★★★★</span>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[#e3a51c]" style={{ width: `${procent}%` }}>★★★★★</span>
    </span>
  );
}
