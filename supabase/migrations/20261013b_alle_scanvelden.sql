-- Woningscan: de laatste scanvelden zonder eigen kolom, en oude dossiers aanvullen.
-- Veilig om nogmaals te draaien. Er wordt niets verwijderd; bestaande waarden worden niet overschreven.

-- 1. De laatste scanvelden als eigen kolom op woningdossier.
alter table public.woningdossier
  add column if not exists woningtype_bron text,          -- "automatisch" (EP-Online) of "handmatig"
  add column if not exists dakkapel_aantal text,          -- toelichting bij dakkapel "Meerdere"
  add column if not exists bag_opgehaald boolean,         -- bouwjaar/oppervlakte automatisch uit het Kadaster
  add column if not exists verwarming_anders text,        -- toelichting bij verwarming "Anders"
  add column if not exists warmteafgifte_anders text,     -- toelichting bij warmteafgifte "Anders"
  add column if not exists bestaande_onbekend boolean,    -- "weet ik niet" bij wat er al in huis is
  add column if not exists wensen_onbekend boolean,       -- "weet ik nog niet" bij de wensen
  add column if not exists wensen text,                   -- kommagescheiden, zelfde inhoud als woning_wensen
  add column if not exists bestaande_maatregelen text,    -- kommagescheiden, zelfde inhoud als bestaande_maatregelen
  add column if not exists gekozen_maatregelen text,      -- kommagescheiden, zelfde inhoud als gekozen_maatregelen
  add column if not exists wil_wijzigen boolean,          -- "Ik wil iets wijzigen aan wat ik al heb"
  add column if not exists wijzig_toelichting text;

-- 2. Oude dossiers aanvullen uit de reservekopie (json-kolom woningkenmerken), alleen waar nog leeg.
--    Getallen alleen als ze er echt als getal staan (komma of punt), anders blijft het leeg.
update public.woningdossier d set
  adres                 = coalesce(d.adres, nullif(d.woningkenmerken->>'addressLabel', '')),
  handmatig_adres       = coalesce(d.handmatig_adres, (d.woningkenmerken->>'manualAddress')::boolean),
  hoek_zijde            = coalesce(d.hoek_zijde, nullif(d.woningkenmerken->>'hoekZijde', '')),
  verwarmde_verdiepingen = coalesce(d.verwarmde_verdiepingen, nullif(d.woningkenmerken->>'verwarmdeVerdiepingen', '')),
  dakkapel_aantal       = coalesce(d.dakkapel_aantal, nullif(d.woningkenmerken->>'dakkapelAantal', '')),
  bag_opgehaald         = coalesce(d.bag_opgehaald, (d.woningkenmerken->>'bagOpgehaald')::boolean),
  verwarming_anders     = coalesce(d.verwarming_anders, nullif(d.woningkenmerken->>'verwarmingAnders', '')),
  warmteafgifte_anders  = coalesce(d.warmteafgifte_anders, nullif(d.woningkenmerken->>'warmteafgifteAnders', '')),
  bestaande_onbekend    = coalesce(d.bestaande_onbekend, (d.woningkenmerken->>'aanwezigOnbekend')::boolean),
  wensen_onbekend       = coalesce(d.wensen_onbekend, (d.woningkenmerken->>'wensenOnbekend')::boolean),
  wil_wijzigen          = coalesce(d.wil_wijzigen, (d.woningkenmerken->>'advice')::boolean),
  vloeroppervlakte  = coalesce(d.vloeroppervlakte,  case when d.woningkenmerken->>'vloeroppervlakte'  ~ '^\d+([.,]\d+)?$' then replace(d.woningkenmerken->>'vloeroppervlakte',  ',', '.')::numeric end),
  dakoppervlakte    = coalesce(d.dakoppervlakte,    case when d.woningkenmerken->>'dakoppervlakte'    ~ '^\d+([.,]\d+)?$' then replace(d.woningkenmerken->>'dakoppervlakte',    ',', '.')::numeric end),
  gevel_oppervlakte = coalesce(d.gevel_oppervlakte, case when d.woningkenmerken->>'gevelOppervlakte'  ~ '^\d+([.,]\d+)?$' then replace(d.woningkenmerken->>'gevelOppervlakte',  ',', '.')::numeric end),
  warmteverbruik    = coalesce(d.warmteverbruik,    case when d.woningkenmerken->>'warmteverbruik'    ~ '^\d+([.,]\d+)?$' then replace(d.woningkenmerken->>'warmteverbruik',    ',', '.')::numeric end),
  warmteprijs       = coalesce(d.warmteprijs,       case when d.woningkenmerken->>'warmteprijs'       ~ '^\d+([.,]\d+)?$' then replace(d.woningkenmerken->>'warmteprijs',       ',', '.')::numeric end)
where d.woningkenmerken is not null;

-- Straat en woonplaats uit het adres van oude dossiers, alleen als het precies het vaste formaat
-- "Straat 12, 1234AB Plaats" heeft en het huisnummer overeenkomt. Anders blijft het leeg.
update public.woningdossier d set
  straat     = coalesce(d.straat, x.r[1]),
  woonplaats = coalesce(d.woonplaats, x.r[3])
from (
  select id, regexp_match(adres, '^(.+) (\d+\S*), \d{4} ?[A-Z]{2} (.+)$') as r
  from public.woningdossier
) x
where x.id = d.id and x.r is not null and (d.straat is null or d.woonplaats is null)
  and coalesce(d.huisnummer, '') <> '' and lower(x.r[2]) like lower(d.huisnummer) || '%';

-- Wensen en maatregelen ook als tekst op het dossier, uit de bestaande losse tabellen.
update public.woningdossier d set
  wensen                = coalesce(d.wensen,                (select string_agg(w.wens, ', ' order by w.wens) from public.woning_wensen w where w.woningdossier_id = d.id)),
  bestaande_maatregelen = coalesce(d.bestaande_maatregelen, (select string_agg(b.maatregel_id, ', ' order by b.maatregel_id) from public.bestaande_maatregelen b where b.woningdossier_id = d.id)),
  gekozen_maatregelen   = coalesce(d.gekozen_maatregelen,   (select string_agg(g.maatregel_id, ', ' order by g.maatregel_id) from public.gekozen_maatregelen g where g.woningdossier_id = d.id));

-- Wil wijzigen: de toelichting van de laatste aanvraag ook op het dossier.
update public.woningdossier d set
  wijzig_toelichting = coalesce(d.wijzig_toelichting, a.wijzig_toelichting)
from (
  select distinct on (woningdossier_id) woningdossier_id, wijzig_toelichting
  from public.energiescanaanvraag order by woningdossier_id, created_at desc
) a
where a.woningdossier_id = d.id and a.wijzig_toelichting is not null;

-- 3. Overzicht: zelfde kolommen als nu, met de nieuwe achteraan. Blijft afgeschermd.
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
  d.energielabel, d.adres, d.handmatig_adres, d.hoek_zijde, d.verwarmde_verdiepingen,
  d.warmteverbruik, d.warmteprijs, d.vloeroppervlakte, d.dakoppervlakte, d.gevel_oppervlakte,
  a.voornaam, a.achternaam, a.wil_wijzigen, a.wijzig_toelichting,
  -- nieuw
  d.woningtype_bron, d.dakkapel_aantal, d.bag_opgehaald, d.verwarming_anders, d.warmteafgifte_anders,
  d.bestaande_onbekend, d.wensen_onbekend
from public.woningdossier d
left join lateral (
  select * from public.energiescanaanvraag e
  where e.woningdossier_id = d.id
  order by e.created_at desc
  limit 1
) a on true;

revoke all on public.woningdossier_overzicht from anon, authenticated;
