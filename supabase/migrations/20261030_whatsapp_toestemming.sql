-- WhatsApp over de energiescan-aanvraag.
--
-- Op de aanvraagstap staat "Je mag me ook via WhatsApp benaderen" standaard aan; de
-- bewoner kan het uitzetten. Geldt voor berichten over de aanvraag, niet voor
-- marketing. Leeg (null) = aanvraag van vóór dit veld.
-- Zolang deze kolom nog niet bestaat, slaat de site de aanvraag gewoon op zonder
-- dit veld (zie schrijfMetOntbrekendeKolommen) en staat het antwoord wel in de
-- interne mail. Het moment van toestemming is created_at van dezelfde rij.
alter table public.energiescanaanvraag
  add column if not exists whatsapp_toestemming boolean;

comment on column public.energiescanaanvraag.whatsapp_toestemming is
  'Vinkje "via WhatsApp benaderen" stond aan bij het versturen (standaard aan; alleen voor berichten over de aanvraag, geen marketing). Null = aanvraag van voor dit veld.';
