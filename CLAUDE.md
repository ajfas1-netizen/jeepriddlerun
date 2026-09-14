# MC PAL Jeep Riddle Run

Event web app for the Martin County PAL Jeep Riddle Run fundraiser.
Roughly 50 Jeeps, 9 sponsor stops around Martin County, one Saturday.
PAL hides a duck at each stop and a riddle says where it is. Teams also
carry their own duck, and both have to appear in the photo they post
with the right tags. Points come from tags and dollar-for-dollar on
money spent at the sponsors. Nothing is judged, so standings are fully
automatic.

Wallace Chrysler Jeep Dodge Ram is the rally point and Ocean Republic
Brewing is the finish. The seven stops between them run in any order.

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

- Event date, roll-out time and the bonus code are unset in
  `src/data/event.js`.
- No Instagram handle found for Wallace CJDR; Sunrise Surf Shop's is
  ambiguous. Do not invent either. The caption falls back to the
  business name.
- Per-stop caveats live in the `verify` field and surface in the app at
  Organizer tools > Data check. Do not clear a `verify` note without AJ
  confirming the underlying fact.
- Bonus clues are written hints this year, in the `hint` field, not
  photographs. There is no `public/clues` directory any more.
