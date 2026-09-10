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

The app is loaded with the full 2025 route so it demos as a finished
product. Everything below is a swap, not a build.

- **Riddles and stops are the 2025 set.** Replace in `src/data/stops.js`.
- **Sponsor names and handles were researched, not guessed.** Each
  business was matched to its stop by looking up its published street
  address. Open **Crew → Organizer tools → Data check** for the short
  list that still wants a human eye:
  - Twinkles Jewelry and Wallace CJDR: no Instagram account found
  - Sunrise Surf Shop: the obvious handle belongs to the Jacksonville
    Beach parent store, so get the Jensen Beach one from them
  - Broward Motorsports: the handle found looks like the multi-store
    group account rather than a Treasure Coast one
  - O'Donnell: every listing shows 6402 SE Federal Hwy, the booklet says
    6400, and it is the one stop with no pin
  - The Hutch: two listings disagree by about half a mile, so check the
    pin against the map
  - Stop 10: the 2025 booklet paired a toy riddle with Ocean Republic
    Brewing's address. The address is right, the riddle looks wrong.
- **Stop 11 is PAL's own building**, not a sponsor. Ironman 4x4 sponsors
  the event without hosting a stop.
- **Bonus clue art:** stops 1 to 8 are the real 2025 photo clues pulled
  from the booklet. Stops 9 to 15 were blank in that file, so those are
  drawn placeholders in the same style. Replace them with real photos.
- **Event date, roll-out time and bonus code** are unset in
  `src/data/event.js`. With the date blank the join screen shows the
  rally point instead, so nothing reads as unfinished.
- No Jeep trademarks are used. The visual language is built from
  non-trademarked community cues. Anything official needs written
  permission through Wallace CJDR.
