#!/usr/bin/env node
// Eenvoudige, regex-gebaseerde productiecheck. Geen nieuwe dependency, geen
// parser: scant alleen renderbare broncode (app/, components/, lib/ — .ts/.tsx)
// op drie risico's die wel compileren maar niet in productie thuishoren:
//
//   1. Actieve verwijzingen naar gijs.eco als productie-URL. De echte
//      production-URL is SITE_URL in lib/seo.ts (groeninjestraat.nl).
//   2. Zichtbare, bracket-gemarkeerde placeholder-reviewtekst
//      ("[Echte Google-review toevoegen]", "[Naam klant]") buiten de
//      bestaande SEO_INDEXABLE-gate in components/over-gijs/ReviewKaart.tsx.
//   3. Zichtbare prototype/demo/test-waarschuwingen die niet voor productie
//      bedoeld zijn (bv. de tijdelijke dev-navigatie van het
//      Anime.js-poppenhuis-prototype).
//
// Negeert: comments (// en /* */, grof regelgebaseerd gestript, geen
// stringliteral-bewuste parser), markdown/docs, node_modules, git-
// geschiedenis. Kijkt alleen naar bestanden die daadwerkelijk renderen.
//
// Dit is bewust een simpele tekstscan, geen control-flow-analyse: een
// melding betekent "deze tekst staat ergens in renderbare code", niet
// per se "deze tekst is altijd zichtbaar". Beoordeel elke melding zelf.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

const CHECKS = [
  {
    categorie: "gijs.eco als productie-URL",
    patterns: [/gijs\.eco/],
  },
  {
    categorie: "zichtbare placeholder-review",
    patterns: [
      /\[Echte Google-review toevoegen\]/,
      /\[Echte Google review toevoegen\]/,
      /\[Naam klant\]/,
    ],
    // ReviewKaart.tsx rendert deze placeholder alleen als !toonPlaceholder
    // niet eerder in de ternary tot null leidde (gezet door de aanroepende
    // server-pagina via SEO_INDEXABLE). Die specifieke, bestaande gate
    // herkennen we hier gericht, zonder de scanner verder te verzwaren.
    negeerAls: [/!\s*toonPlaceholder\s*\?\s*null/],
  },
  {
    categorie: "zichtbare prototype\/demo\/test-waarschuwing",
    patterns: [
      /niet voor livegang/i,
      /tijdelijk testmenu/i,
      /DEV\s*·/,
    ],
    // PoppenhuisDevNav.tsx rendert zichzelf niet meer (return null) zodra de
    // aanroepende server-pagina productie=SEO_INDEXABLE doorgeeft. Diezelfde
    // gerichte herkenning als bij de placeholder-review hierboven.
    negeerAls: [/if\s*\(\s*productie\s*\)\s*return\s*null/],
  },
  {
    // Iconen komen uit het lokale lucide-react-pakket (zie Icon.jsx); een
    // runtime-fetch naar unpkg.com hoort niet meer in renderbare code.
    categorie: "externe unpkg.com-afhankelijkheid in renderbare code",
    patterns: [/unpkg\.com/],
  },
];

function stripComments(source) {
  // Grof, regelgebaseerd: blokcomments eerst, dan //-commentaar — met een
  // guard tegen "https://" (geen ":" vlak voor de "//").
  let out = source.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return out;
}

function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files; // map bestaat niet (bv. lib/ zonder submap) — geen probleem
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (EXTENSIONS.has(extname(full))) files.push(full);
  }
  return files;
}

function scanFile(path) {
  const raw = readFileSync(path, "utf8");
  const code = stripComments(raw);
  const bevindingen = [];
  for (const check of CHECKS) {
    if (check.negeerAls?.some(p => p.test(code))) continue;
    if (check.patterns.some(p => p.test(code))) {
      bevindingen.push({ categorie: check.categorie, path: relative(ROOT, path) });
    }
  }
  return bevindingen;
}

function main() {
  const files = SCAN_DIRS.flatMap(dir => walk(join(ROOT, dir)));
  const bevindingen = files.flatMap(scanFile);

  if (bevindingen.length === 0) {
    console.log("check-production-build: geen bevindingen.");
    return;
  }

  console.error(`check-production-build: ${bevindingen.length} bevinding(en):\n`);
  for (const b of bevindingen) {
    console.error(`- [${b.categorie}] ${b.path}`);
  }
  console.error(
    "\nDit is een eenvoudige tekstscan (geen control-flow-analyse). " +
    "Beoordeel per melding of de tekst daadwerkelijk ongefilterd naar productie gaat " +
    "(bv. achter een SEO_INDEXABLE-check of vergelijkbare gate hoort te zitten)."
  );
  process.exitCode = 1;
}

main();
