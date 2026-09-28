import { supabase } from "./supabase.ts";

// Kleine, veilige testfunctie om de Supabase-koppeling te controleren.
//
// Doet UITSLUITEND een INSERT van één herkenbare testregel in
// public.woningdossiers — geen SELECT, UPDATE of DELETE. `status` staat
// hier bewust vast op "test", zodat een testregel altijd herkenbaar is en
// nooit per ongeluk als een echte aanvraag wordt gelezen.
//
// Niet gekoppeld aan de woningscan of het contactformulier: dit is alleen
// bedoeld om vanaf de command line of console handmatig te draaien, ter
// controle van de koppeling.
export type TestWoningdossierInvoer = {
  postcode: string;
  huisnummer: string;
  woningtype: string;
  email: string;
};

export async function voegTestWoningdossierToe(invoer: TestWoningdossierInvoer) {
  const { data, error } = await supabase
    .from("woningdossier")
    .insert({
      postcode: invoer.postcode,
      huisnummer: invoer.huisnummer,
      woningtype: invoer.woningtype,
      email: invoer.email,
      status: "test",
    })
    .single();

  if (error) {
    throw new Error(`Testinsert mislukt: ${error.message}`);
  }
  return data;
}
