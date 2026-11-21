# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/paimansilaen/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/paimansilaen/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Trophy Guide** — an offline web app that tracks all 55 official Grand Theft Auto VI trophies on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden) and walks you to the platinum.

Every trophy shows its official name, description and grade, plus a guide written in our own words with its sources named beside it (Exophase and PSNProfiles trophy pages). The app includes a six-stage roadmap to the platinum, missable flags built from the official descriptions (only 3 trophies are missable), filters by grade, kind and missable status, search, a spoiler setting that hides story and hidden trophies until you earn them, saved progress in localStorage, and export/import of your progress as JSON. It runs entirely from its own files with the network off — no trackers, no requests, no Rockstar artwork or logos; the look is an original Vice City sunset design.

GTA VI is not out yet, so where an exact location or step is not public, the guide says so honestly instead of inventing one — and points at the cited source to check at launch.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — `app/index.html` is the guide. No build step, no dependencies.

URL views: `?grade=silver`, `?kind=collectible`, `?missable=1`, `?spoiler=0`, `?trophy=17` (opens one trophy's guide). The checklist, the roadmap, the filters and the spoiler setting are all on the same page, so one glance shows where you are on the road to the platinum.

---

<sub>Entered on [make.fun](https://make.fun/?ref=4gn3z50j&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
