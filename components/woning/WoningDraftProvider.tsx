"use client";

import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { WoningDraft } from "@/lib/woning-types";

const DraftContext = createContext<{ draft: WoningDraft; setDraft: Dispatch<SetStateAction<WoningDraft>> } | null>(null);

// The root layout stays mounted during navigation, so every entry point shares the same input.
export function WoningDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<WoningDraft>({ postcode: "", huisnummer: "", houseType: "hoekwoning", akkoordVoorwaarden: false });
  return <DraftContext.Provider value={{ draft, setDraft }}>{children}</DraftContext.Provider>;
}

export function useWoningDraft() {
  const context = useContext(DraftContext);
  if (!context) throw new Error("WoningDraftProvider ontbreekt");
  return context;
}
