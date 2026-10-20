import "server-only";

// Koppeling met de Energiesubsidiewijzer-API van Milieu Centraal (Verbeter Je Huis).
//
// Overgenomen uit Digitaal Energieloket (lib/milieu-centraal/index.ts), daar al in productie.
// Nodig: de omgevingsvariabele MILIEU_CENTRAAL_API_KEY (staat in Vercel bij dit project).
// De sleutel wordt alleen op de server gebruikt en komt nooit in de browser.
//
// Afspraken uit de API-gids (versie 21 mei 2025):
// - De sleutel gaat mee in de header "apiKey".
// - Filters (gemeenten, maatregelen, doelgroepen) altijd ophalen via getfilters, nooit vastzetten in code.
// - Alle ID's zijn tekst, ook als ze op een getal lijken.
// - Niet gebruiken: Stackable, Amount, Details, Location en LocationIDs (verouderd).
//   In plaats daarvan: AdditionalIntro, AmountsText, Conditions en Locations.
//
// Alles wordt een dag bewaard (Next.js data cache), zodat we de API niet bij elke bezoeker aanroepen.
// Zonder sleutel of bij een storing geven de functies null terug; de site werkt dan gewoon door.

// MILIEU_CENTRAAL_API_BASIS alleen voor lokaal testen met een nagemaakte API; in productie niet zetten.
const BASIS = process.env.MILIEU_CENTRAAL_API_BASIS || 'https://www.verbeterjehuis.nl/api/v1/regulation'
const EEN_DAG = 60 * 60 * 24

export type RegelingType = 'subsidie' | 'lening' | 'overig'
export type Doelgroep = 'Woningeigenaar' | 'Vereniging van Eigenaren' | 'Huuder'

export type Regeling = {
  id: string
  titel: string
  type: RegelingType
  intro?: string
  /** AdditionalIntro, als platte tekst. */
  aanvullend?: string
  /** AmountsText, als platte tekst. */
  bedragen?: string
  /** Conditions, als platte tekst. */
  voorwaarden?: string
  /** Pagina van de regeling op verbeterjehuis.nl. */
  url?: string
  /** Wie de regeling aanbiedt, bijv. "Rijksdienst voor Ondernemend Nederland (RVO)" of "Gemeente Borne". */
  aanbieder?: string
  aanbiederUrl?: string
  maatregelen: string[]
  doelgroepen: string[]
  locaties: string[]
  einde?: string
}

export type FilterOptie = { id: string; naam: string }
export type Filters = { steden: FilterOptie[]; maatregelen: FilterOptie[]; doelgroepen: FilterOptie[]; overig: Record<string, FilterOptie[]> }

export const milieuCentraalActief = () => Boolean(process.env.MILIEU_CENTRAAL_API_KEY)

/** Ruwe aanroep. Geeft null bij geen sleutel, een fout of een time-out. */
export async function mcRuw(pad: 'getfilters' | 'search' | 'getdetail', params: Record<string, string> = {}): Promise<unknown | null> {
  const key = process.env.MILIEU_CENTRAAL_API_KEY
  if (!key) return null
  const url = `${BASIS}/${pad}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`
  try {
    const res = await fetch(url, {
      headers: { apiKey: key, Accept: 'application/json' },
      next: { revalidate: EEN_DAG, tags: ['milieu-centraal'] },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      console.error(`[milieu-centraal] ${pad} gaf status ${res.status}`)
      return null
    }
    return await res.json()
  } catch (e) {
    console.error(`[milieu-centraal] ${pad} mislukt:`, e instanceof Error ? e.message : e)
    return null
  }
}

// ── Hulpfuncties: de API-velden hoofdletterongevoelig en met terugvalnamen uitlezen ──

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v)

function veld(o: unknown, ...namen: string[]): unknown {
  if (!isObj(o)) return undefined
  const sleutels = new Map(Object.keys(o).map((k) => [k.toLowerCase(), k]))
  for (const naam of namen) {
    const k = sleutels.get(naam.toLowerCase())
    const v = k === undefined ? undefined : o[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
  return undefined
}

const tekst = (v: unknown) => (typeof v === 'string' ? v.trim() || undefined : typeof v === 'number' ? String(v) : undefined)

function naamVan(v: unknown): string | undefined {
  if (typeof v === 'string') return v.trim() || undefined
  return tekst(veld(v, 'Name', 'Title', 'Naam', 'Label', 'Description', 'Value'))
}

function namen(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(naamVan).filter((n): n is string => Boolean(n))
  if (typeof v === 'string') return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
  return []
}

/** Vindt de lijst in een antwoord, of het nu een kale lijst is of een object met een lijst erin. */
function eersteLijst(v: unknown): unknown[] {
  if (Array.isArray(v)) return v
  if (isObj(v)) for (const w of Object.values(v)) if (Array.isArray(w)) return w
  return []
}

const ENTITEITEN: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", euro: '€', hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }

/** Zet de (HTML-)tekst uit de API om naar platte tekst. We tonen nooit HTML van buiten. */
export function platteTekst(v: unknown): string | undefined {
  const html = tekst(v)
  if (!html) return undefined
  const t = html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/(p|div|h[1-6]|ul|ol|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
        return Number.isFinite(n) ? String.fromCodePoint(n) : m
      }
      return ENTITEITEN[e.toLowerCase()] ?? m
    })
    .split('\n')
    .map((r) => r.replace(/\s+/g, ' ').trim())
    .filter((r, i, rijen) => r || (i > 0 && rijen[i - 1]))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return t || undefined
}

function veiligeUrl(v: unknown): string | undefined {
  const u = tekst(v)
  if (!u) return undefined
  try {
    const url = new URL(u.startsWith('www.') ? `https://${u}` : u)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function datum(v: unknown): string | undefined {
  const t = tekst(v)
  if (!t) return undefined
  const d = new Date(t)
  return Number.isNaN(d.getTime()) || d.getFullYear() < 1990 ? undefined : d.toISOString().slice(0, 10)
}

const TYPEN: Record<string, RegelingType> = { subsidy: 'subsidie', loan: 'lening', other: 'overig' }

/** AdditionalIntro is de inleiding: de eerste alinea als intro, de rest als aanvulling. */
function splitsInleiding(v: unknown): { intro?: string; aanvullend?: string } {
  const t = platteTekst(v)
  if (!t) return {}
  const alineas = t.split('\n').map((a) => a.trim()).filter(Boolean)
  let n = 1
  while (n < alineas.length && alineas.slice(0, n).join(' ').length < 140) n++
  const rest = alineas.slice(n).join('\n')
  return { intro: alineas.slice(0, n).join('\n'), aanvullend: rest || undefined }
}

function normaliseer(r: unknown, standaardType?: RegelingType): Regeling | null {
  const id = tekst(veld(r, 'Id', 'ID', 'RegulationId', 'Guid'))
  const titel = tekst(veld(r, 'Title', 'Name', 'Titel', 'Naam'))
  if (!id || !titel) return null
  const type = TYPEN[String(veld(r, 'Type') ?? '').toLowerCase()] ?? standaardType ?? 'overig'
  return {
    id,
    titel,
    type,
    ...splitsInleiding(veld(r, 'AdditionalIntro')),
    bedragen: platteTekst(veld(r, 'AmountsText')),
    voorwaarden: platteTekst(veld(r, 'Conditions')),
    url: veiligeUrl(veld(r, 'Url')),
    aanbieder: tekst(veld(r, 'ProviderName')),
    aanbiederUrl: veiligeUrl(veld(r, 'ProviderUrl')),
    // De maatregelen waarvoor de regeling geldt, staan in 'Tags' (Label = naam, Value = maatregel-ID uit de filters).
    maatregelen: namen(veld(r, 'Tags', 'Measures')),
    doelgroepen: namen(veld(r, 'TargetGroup', 'TargetGroups')),
    // Bewust niet 'Location' of 'LocationIDs': die zijn verouderd. Landelijk = postcodebereik "0000-9999".
    locaties: namen(veld(r, 'Locations')),
    einde: datum(veld(r, 'DateEnd', 'EndDate')),
  }
}

// ── Publieke functies ──

export async function getFilters(): Promise<Filters | null> {
  const d = await mcRuw('getfilters')
  if (!d) return null
  const bron = isObj(d) && isObj(veld(d, 'Filters')) ? (veld(d, 'Filters') as Obj) : d
  const lijsten: Record<string, FilterOptie[]> = {}
  if (isObj(bron)) {
    for (const [k, v] of Object.entries(bron)) {
      if (!Array.isArray(v)) continue
      lijsten[k.toLowerCase()] = v
        .map((o) => ({ id: tekst(veld(o, 'Id', 'ID', 'Key', 'Value')) ?? naamVan(o) ?? '', naam: naamVan(o) ?? '' }))
        .filter((o) => o.id && o.naam)
    }
  }
  const pak = (deel: string) => Object.entries(lijsten).find(([k]) => k.includes(deel))?.[1] ?? []
  return {
    steden: pak('cit'),
    maatregelen: pak('measure'),
    doelgroepen: pak('target'),
    overig: lijsten,
  }
}

/**
 * Alle regelingen voor een gemeente (cityId: de ID uit getfilters, bijv. "pdok-0147", een naam of een postcode).
 * De zoekresultaten bevatten al alle teksten; alleen als die ontbreken halen we de details op.
 */
export async function zoekRegelingen(cityId: string, targetGroup: Doelgroep = 'Woningeigenaar'): Promise<Regeling[] | null> {
  let items: { item: unknown; type?: RegelingType }[] = []
  const alles = await mcRuw('search', { cityId, targetGroup })
  if (alles === null) return null
  items = eersteLijst(alles).map((item) => ({ item }))
  if (!items.length) {
    // Terugval: per type zoeken, voor het geval de API zonder type niets teruggeeft.
    const delen = await Promise.all(Object.keys(TYPEN).map((t) => mcRuw('search', { cityId, type: t, targetGroup })))
    items = delen.flatMap((d, i) => eersteLijst(d).map((item) => ({ item, type: Object.values(TYPEN)[i] })))
  }

  const gezien = new Set<string>()
  const uniek = items.filter(({ item }) => {
    const id = tekst(veld(item, 'Id', 'ID'))
    if (!id || gezien.has(id)) return false
    gezien.add(id)
    return true
  })

  const heeftTeksten = (o: unknown) => veld(o, 'AmountsText', 'Conditions', 'AdditionalIntro') !== undefined
  const regelingen = await metMaximaal(5, uniek, async ({ item, type }) => {
    if (heeftTeksten(item)) return normaliseer(item, type)
    const detail = await mcRuw('getdetail', { id: tekst(veld(item, 'Id', 'ID'))! })
    return normaliseer(isObj(detail) ? { ...(item as Obj), ...detail } : item, type)
  })
  return regelingen.filter((r): r is Regeling => r !== null)
}

async function metMaximaal<T, U>(n: number, lijst: T[], fn: (t: T) => Promise<U>): Promise<U[]> {
  const uit: U[] = new Array(lijst.length)
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(n, lijst.length) }, async () => {
      while (i < lijst.length) {
        const j = i++
        uit[j] = await fn(lijst[j])
      }
    }),
  )
  return uit
}
