# Jeep Riddle Run

Event app for the **Martin County PAL Jeep Riddle Run**. Fifteen stops,
fifteen riddles, one rubber duck in every photo.

Live at **https://www.jeepriddlerun.com** · results console at
**https://www.jeepriddlerun.com/#/results**

---

## What it does

| Screen | What happens there |
| --- | --- |
| **Join** | Name the rig, pick a duck, pick a rig color. No password, no email. A team code lets a second phone in the same Jeep join. |
| **Trail** | Dark map of Martin County with a numbered pin per stop, a card for the next stop, and a one-tap handoff to Apple or Google Maps. |
| **Stops** | Horizontal snap deck of all fifteen stops, or a compact list. Never a long scroll. |
| **Stop detail** | The riddle, the bonus clue vault, camera capture, the points checklist, spend entry with receipt photo, and the caption already written for them. |
| **Rank** | Live standings by overall, tags, spend or stops, with the "this is not a race" rule stated on the screen. Fully automatic, no judging step. |
| **Crew** | Team card, fifteen trail badges, sponsor wall, organizer tools. |
| **Results** | Desktop console for the PAL team: standings, awards, photo wall, receipts still to verify, CSV export. |

The highest-value feature is the caption assist. Teams lose tag points
because tagging is fiddly, so the app writes the caption with the
location, `@martincountypal` and the hashtag already in it, copies it to
the clipboard, and the team pastes it into their post.

---

## Run it locally

```bash
npm install
npm run dev
```

With no Supabase keys it runs in **demo mode**: everything is stored on
the device and the leaderboard is populated with five fake teams. That
is the right way to test without touching live event data.

## Wire up the database

1. Create a Supabase project.
2. **SQL Editor → New query →** paste `supabase/schema.sql` → Run.
3. **Authentication → Sign In / Providers →** enable **Anonymous**.
4. **Storage →** create two **public** buckets: `photos` and `receipts`.
5. Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

6. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret** for both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and
publishes to GitHub Pages.

One-time GitHub setup:

- **Settings → Pages → Source: GitHub Actions**
- **Settings → Pages → Custom domain:** `www.jeepriddlerun.com`, then tick
  **Enforce HTTPS** once the certificate is issued.

One-time Cloudflare DNS setup for `jeepriddlerun.com`:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| CNAME | `www` | `ajfas1-netizen.github.io` | **DNS only** |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |

Set the proxy to **DNS only** (grey cloud), not proxied. GitHub issues
the certificate itself and an orange cloud breaks that handshake.

---

## Running the event

**Before the day**

- Update `src/data/event.js`: date, roll-out time, hashtag, bonus code.
- Update `src/data/stops.js`: addresses, riddles, sponsor names, Instagram
  handles. Handles are what make the caption assist tag correctly.
- Drop bonus clue images in `public/clues/` and point each stop's `clue`
  field at them.
- Open **Crew → Organizer tools → Pin drop** and tap each stop's real
  front door on the map. Three minutes, and the map stops sending people
  to the wrong side of a plaza.

**At kickoff**

- One QR code on a sign pointing at the site. Teams create their rig in
  under a minute.
- Hand the bonus code to donors at the bonus tier. One code unlocks
  every clue for the whole day.

**At the closing ceremony**

- Open `/#/results` on a laptop and put it on the screen.
- **Receipts to verify** lists every dollar claimed without a receipt
  photo attached, so the check is a short list instead of a shoebox.
- **Export CSV** for the records.
- **Photo wall** is there for picking a crowd favorite out loud. It does
  not feed the standings, which are final once receipts clear.

---

## Scoring

Per stop: duck in photo, posted, location tagged, PAL tagged, hashtag
used, proof of purchase. Three points each, eighteen available.
Plus one point per dollar spent at that stop.

There is no judged creativity score, so standings compute themselves and
nothing waits on a volunteer with a clipboard. Nothing in the scoring
rewards speed either. Both are deliberate.

---

## Notes and open items

- Sponsor names and social handles per stop are **blank on purpose**. The
  source booklet never states which business sits at which address, and
  guessing would send fifty teams to tag the wrong shop.
- Bonus clue art is present for stops 1 to 8. Stops 9 to 15 were empty
  placeholders in the 2025 PDF.
- The riddles currently in the repo are the 2025 set, seeded so the app
  could be built and tested. Replace them with the 2026 set.
- No Jeep trademarks are used. The visual language is built from
  non-trademarked community cues. Anything official needs written
  permission through Wallace CJDR.
