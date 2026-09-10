# MC PAL Jeep Riddle Run

Event web app for the Martin County PAL Jeep Riddle Run fundraiser.
Roughly 50 Jeeps, 15 sponsor stops around Martin County, one Saturday.
Teams find a hidden item at each stop, photograph it with their rubber
duck, and post it with the right tags. Points come from tags and
dollar-for-dollar on money spent at the sponsors. There is no judged
creativity score, so standings are fully automatic.

## Ground rules for this repo

- **Phones first.** Every participant is on a phone in a Jeep with one
  hand free. The only desktop surface is `/#/results`, for the PAL team.
- **Navigation is the feature.** No long scrolling pages. The shell is a
  fixed viewport with a tab bar; stops open as a drag-to-dismiss sheet;
  the stop list is a horizontal snap deck. Do not replace these with a
  scrolling list "for simplicity".
- **This is not a race.** Nothing in the UI may reward finishing early.
  Points are speed-independent and the app says so out loud.
- **Never invent event data.** Sponsor names, social handles, riddle
  answers and coordinates come from AJ or from the sponsor sign-up
  sheet. Blank fields in `src/data/stops.js` are blank on purpose.
- **No Jeep trademarks.** The visual language uses non-trademarked
  community cues: seven-slot grille motif, tire tread, trail badges,
  topo lines, rubber ducks. Do not add the Jeep wordmark or official
  badges without written permission via Wallace CJDR.
- **No em dashes** in any copy, UI strings included.

## Stack

Vite + React 19, React Router (HashRouter), Framer Motion, Leaflet,
Supabase. Deployed to GitHub Pages by `.github/workflows/deploy.yml`
on every push to `main`. Custom domain `www.jeepriddlerun.com` via
`public/CNAME`.

## Layout

```
src/
  data/event.js      EVENT config, scoring table, ducks, rig colors  <- edit yearly
  data/stops.js      the 15 stops, riddles, sponsor wall             <- edit yearly
  lib/providers.js   localProvider (demo) | supaProvider (live)
  lib/store.jsx      React context: team, checkins, pins, leaderboard
  lib/scoring.js     point math, mirrored in supabase/schema.sql
  lib/caption.js     post-assist caption builder + maps handoff
  lib/image.js       client-side compression before upload
  components/        Chrome (top bar, tabs), Sheet, StopDeck, MapView, Icons
  routes/            Join, Trail, Stops, StopDetail, Rank, Crew, Admin, Results
supabase/schema.sql  tables, views, RLS, storage policies, scoring functions
```

## Demo mode vs live

With no `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, the app runs
entirely on the device against `localStorage` with five fake teams on
the leaderboard, and shows a "Demo mode" bar. Add both env values and
the same code path talks to Supabase. Keep both providers working: demo
mode is how the app gets tested without touching live event data.

**Scoring lives in two places on purpose.** `src/lib/scoring.js` is for
instant feedback on the phone; `public.tag_points` in
`supabase/schema.sql` is the number that counts. Change both together.

## Known open items

The repo carries the complete 2025 route so the app demos as finished.

- 2026 riddles and locations are still the 2025 set.
- Sponsors, Instagram handles, Facebook pages and coordinates were
  researched from each business's published address, not inferred from
  the riddles. Per-stop caveats live in the `verify` field and surface
  in the app at Organizer tools > Data check. Do not clear a `verify`
  note without AJ confirming the underlying fact.
- Two stops have no Instagram handle found (Twinkles, Wallace CJDR) and
  one is ambiguous (Sunrise Surf Shop). The caption assist falls back to
  the street address for those. Do not invent handles.
- Stop 3 (O'Donnell) has no coordinate. Drop it at Organizer tools >
  Pin drop. Navigation works without it.
- Bonus clue art for stops 1 to 8 is the real 2025 photography. Stops 9
  to 15 are drawn SVG placeholders because those tiles were blank in the
  source PDF.
