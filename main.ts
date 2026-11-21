// Leonida Trophy Guide entry (Node 22, standard library only): the guide is this directory's app/ folder,
// plain static files a browser opens at app/index.html (ES modules, CSS, no build step), offline: it loads nothing
// over the network, and its trophy list and guides are app/data/trophies.json. The program hands it in: it copies app/
// and screenshots/ from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your
// screenshots, the first load's files and bytes, and your source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Before copying, this program validates the trophy file itself: it must be valid JSON with a "trophies" array of
// exactly 55 items, one per official trophy, each with a non-blank name and guide, and the grade counts must match
// the official list (1 platinum, 2 gold, 6 silver, 46 bronze). If the file fails that check the program refuses
// to hand in a broken guide instead of silently shipping it.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const trophyFile = join(here, 'app', 'data', 'trophies.json');
const trophyDoc = JSON.parse(readFileSync(trophyFile, 'utf-8'));
const list = Array.isArray(trophyDoc) ? trophyDoc : trophyDoc.trophies;
if (!Array.isArray(list) || list.length !== 55) {
  throw new Error(`trophies.json must hold exactly 55 trophies, found ${Array.isArray(list) ? list.length : 'no array'}`);
}
for (const t of list) {
  if (typeof t.name !== 'string' || !t.name.trim()) throw new Error('a trophy is missing its official name');
  if (typeof t.guide !== 'string' || !t.guide.trim()) throw new Error(`trophy "${t.name}" has no guide`);
}
const gradeCounts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
for (const t of list) gradeCounts[t.grade] = (gradeCounts[t.grade] ?? 0) + 1;
if (gradeCounts.platinum !== 1 || gradeCounts.gold !== 2 || gradeCounts.silver !== 6 || gradeCounts.bronze !== 46) {
  throw new Error(`grade counts do not match the official list: ${JSON.stringify(gradeCounts)}`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
