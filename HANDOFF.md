# Handoff to Claude Code

Read `CLAUDE.md` first. It has the ground rules for this repo.

## Get it on GitHub

```bash
cd jeepriddlerun
git init -b main                    # skip if the folder already has .git
git remote add origin https://github.com/ajfas1-netizen/jeepriddlerun.git
git add -A
git commit -m "Jeep Riddle Run event app"
git push -u origin main
```

Then in GitHub:

1. **Settings → Pages → Source:** GitHub Actions
2. **Settings → Pages → Custom domain:** `www.jeepriddlerun.com`, then tick
   **Enforce HTTPS** once the cert issues (can take 15 minutes).
3. **Settings → Secrets and variables → Actions:** add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` after Supabase is up.

Cloudflare DNS for `jeepriddlerun.com`, all records set to **DNS only**
(grey cloud, not proxied, or the GitHub certificate handshake fails):

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `ajfas1-netizen.github.io` |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

## Supabase

`supabase/schema.sql` is idempotent, so it is safe to re-run.

1. SQL Editor → paste `supabase/schema.sql` → Run
2. Authentication → Sign In / Providers → enable **Anonymous**
3. Storage → create public buckets `photos` and `receipts`
4. Copy the project URL and anon key into `.env.local` and into the two
   GitHub secrets above

Until those keys exist the app runs in demo mode against `localStorage`,
which is the right way to develop.

## What is waiting on AJ

These are blank on purpose. Do not invent values for them.

| Item | Where it goes | Why it matters |
| --- | --- | --- |
| 2026 stops, addresses, riddles | `src/data/stops.js` | The 2025 set is seeded so the app could be built |
| Sponsor name per stop | `src/data/stops.js` → `sponsor` | Shown after arrival |
| Instagram handle per stop | `src/data/stops.js` → `igHandle` | Without it the caption assist falls back to the street address, and the location tag points are the whole reason the feature exists |
| Bonus clue art for stops 9 to 15 | `public/clues/` + `clue` field | Stops 1 to 8 were extracted from the 2025 PDF, 9 to 15 were blank placeholders in that file |
| Event date, roll-out time, bonus code | `src/data/event.js` | Currently placeholder strings |
| Stop coordinates | Crew → Organizer tools → Pin drop | Navigation already works without them |

## First things worth building next

1. **QR sign for kickoff.** A printable PNG or PDF pointing at
   `https://www.jeepriddlerun.com`, big enough to read from a Jeep.
2. **Offline resilience.** A service worker that caches the shell, the
   stop data and the clue images. Federal Highway is fine, but the
   Hutchinson Island and Hobe Sound stops are where a dead upload will
   cost someone their points. Queue failed uploads and retry.
3. **Sponsor logos** on the sponsor wall and the results console footer,
   replacing the text-only cards.
4. **A "return the duck" prompt** at the last stop, if PAL wants the
   ducks back.

## Things not to change without asking

- The fixed-shell navigation. No long scrolling pages.
- The "this is not a race" copy on the Rank screen.
- Absence of Jeep trademarks. Community cues only.
- No em dashes in any user-facing string.
