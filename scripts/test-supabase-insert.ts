// Handmatig te draaien script om de Supabase-koppeling te testen: voegt
// één herkenbare testregel (status = "test") toe aan public.woningdossiers.
// Voer uit vanuit de projectroot met:
//   node --env-file=.env.local scripts/test-supabase-insert.ts
import { voegTestWoningdossierToe } from "../lib/supabase-test.ts";

const resultaat = await voegTestWoningdossierToe({
  postcode: "1234AB",
  huisnummer: "1",
  woningtype: "hoekwoning",
  email: "test@example.com",
});

console.log("Testregel toegevoegd:", resultaat);
