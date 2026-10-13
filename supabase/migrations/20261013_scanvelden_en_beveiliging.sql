-- Woningscan: ontbrekende velden als eigen kolom, en het overzicht afschermen.
-- Uitvoeren in Supabase: SQL Editor > New query > dit hele bestand plakken > Run.
-- Veilig om nogmaals te draaien (if not exists / or replace). Er wordt niets verwijderd.

-- 1. Beveiliging (belangrijkst). woningdossier_overzicht was leesbaar met de publieke sleutel,
--    die in de website zelf staat: namen, e-mail, telefoon en adressen van alle aanvragen.
--    De site leest het overzicht alleen server-side met de secret key, dus de publieke rollen
--    hoeven er niet bij.
revoke all on public.woningdossier_overzicht from anon, authenticated;

-- 2. Nieuwe kolommen op het woningdossier. Tot nu toe ging het energielabel verloren (geen kolom)
--    en stonden de andere velden alleen in de json-kolom woningkenmerken.
alter table public.woningdossier
  add column if not exists energielabel text,
  add column if not exists adres text,
  add column if not exists handmatig_adres boolean,
  add column if not exists hoek_zijde text,
  add column if not exists verwarmde_verdiepingen text,
  add column if not exists warmteverbruik numeric,
  add column if not exists warmteprijs numeric,
  add column if not exists vloeroppervlakte numeric,
  add column if not exists dakoppervlakte numeric,
  add column if not exists gevel_oppervlakte numeric;

-- 3. Nieuwe kolommen op de aanvraag: voor- en achternaam los, en "ik wil iets wijzigen".
alter table public.energiescanaanvraag
  add column if not exists voornaam text,
  add column if not exists achternaam text,
  add column if not exists wil_wijzigen boolean,
  add column if not exists wijzig_toelichting text;

-- 4. Overzicht uitbreiden: de bestaande kolommen blijven gelijk, de nieuwe komen achteraan.
--    security_invoker: het overzicht volgt voortaan de rechten van wie het opvraagt (dus de
--    afscherming van de onderliggende tabellen), in plaats van die van de eigenaar.
--    Geeft dit een fout als "cannot change data type of view column", stuur de foutmelding door;
--    dan wijkt de huidige definitie af en pas ik dit stuk aan. Stap 1 t/m 3 zijn dan al gelukt.
create or replace view public.woningdossier_overzicht
with (security_invoker = on) as
select
  d.id, d.created_at, d.postcode, d.huisnummer, d.straat, d.woonplaats, d.woningtype, d.bouwjaar,
  d.woonoppervlakte, d.monument, d.dakkapel, d.garage, d.aanbouw, d.kruipruimte, d.spouwmuur,
  d.verwarming, d.warmteafgifte, d.warm_water, d.aantal_bewoners, d.elektriciteitsverbruik,
  d.gasverbruik, d.elektriciteitsprijs, d.gasprijs, d.zonnepanelen_aantal, d.status, d.scan_afgerond,
  (select string_agg(w.wens, ', ' order by w.wens) from public.woning_wensen w where w.woningdossier_id = d.id) as wensen,
  (select string_agg(b.maatregel_id, ', ' order by b.maatregel_id) from public.bestaande_maatregelen b where b.woningdossier_id = d.id) as bestaande_maatregelen,
  (select string_agg(g.maatregel_id, ', ' order by g.maatregel_id) from public.gekozen_maatregelen g where g.woningdossier_id = d.id) as gekozen_maatregelen,
  a.naam, a.email, a.telefoon, a.voorkeursmoment, a.opmerking,
  -- nieuw
  d.energielabel, d.adres, d.handmatig_adres, d.hoek_zijde, d.verwarmde_verdiepingen,
  d.warmteverbruik, d.warmteprijs, d.vloeroppervlakte, d.dakoppervlakte, d.gevel_oppervlakte,
  a.voornaam, a.achternaam, a.wil_wijzigen, a.wijzig_toelichting
from public.woningdossier d
left join lateral (
  select * from public.energiescanaanvraag e
  where e.woningdossier_id = d.id
  order by e.created_at desc
  limit 1
) a on true;

revoke all on public.woningdossier_overzicht from anon, authenticated;
