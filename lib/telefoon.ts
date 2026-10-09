/**
 * Controle of een ingevuld telefoonnummer een bestaand soort nummer kan zijn. Spaties, streepjes,
 * puntjes en haakjes mogen. Geldig:
 * - Nederlands: 10 cijfers die met 0 beginnen (bv. 06 12345678, 053-1234567);
 * - Nederlands internationaal: +31 of 0031 en dan 9 cijfers (zonder de 0), bv. +31 6 12345678;
 * - ander land: + of 00, landcode en in totaal 8 tot 15 cijfers.
 */
export function geldigTelefoonnummer(invoer: string) {
  const kaal = invoer.trim().replace(/[\s\-.()]/g, "");
  if (!kaal) return false;
  if (/^0[1-9]\d{8}$/.test(kaal)) return true;
  if (/^(\+31|0031)[1-9]\d{8}$/.test(kaal)) return true;
  if (/^(\+|00)(?!31)[1-9]\d{7,14}$/.test(kaal)) return true;
  return false;
}
