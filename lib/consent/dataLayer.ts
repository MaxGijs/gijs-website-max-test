// Eén gedeelde, veilige manier om iets in window.dataLayer te zetten. Gebruikt door zowel
// consentMode.ts (de Consent Mode-signalen, die altijd mogen) als lib/analytics.ts (de echte
// business-events, die alléén mogen als er al statistieken-toestemming is — zie daar).
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushToDataLayer(data: unknown): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}
