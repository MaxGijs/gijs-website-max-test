"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { parseHouseType, type WoningDraft } from "@/lib/woning-types";

const DraftContext = createContext<{ draft: WoningDraft; setDraft: Dispatch<SetStateAction<WoningDraft>> } | null>(null);

// Het gekozen woningtype blijft bewaard (sessionStorage), zodat de keuze op
// de landingspagina ook na herladen of terugnavigeren nog klopt en de
// woningscan het niet opnieuw hoeft te vragen.
const WONINGTYPE_KEY = "gijs-woningtype";

// The root layout stays mounted during navigation, so every entry point shares the same input.
export function WoningDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<WoningDraft>({ postcode: "", huisnummer: "", houseType: "hoekwoning" });
  useEffect(() => {
    let bewaard: string | null = null;
    try { bewaard = sessionStorage.getItem(WONINGTYPE_KEY); } catch { /* opslag kan geblokkeerd zijn */ }
    const type = parseHouseType(bewaard);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- eenmalig herstellen na hydratatie (sessionStorage bestaat pas in de browser)
    if (type) setDraft(current => (current.houseType === type ? current : { ...current, houseType: type }));
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(WONINGTYPE_KEY, draft.houseType); } catch { /* opslag kan geblokkeerd zijn */ }
  }, [draft.houseType]);
  return <DraftContext.Provider value={{ draft, setDraft }}>{children}</DraftContext.Provider>;
}

export function useWoningDraft() {
  const context = useContext(DraftContext);
  if (!context) throw new Error("WoningDraftProvider ontbreekt");
  return context;
}
