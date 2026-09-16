import { EVENT } from '../data/event.js'
import { fullAddress, STOPS } from '../data/stops.js'

/* ------------------------------------------------------------------
   The caption the app writes for them.

   Two jobs. The tag points are the obvious one: the location, the PAL
   handle and the hashtag have to be in there or the post scores zero.
   The quieter one matters more to the sponsors, who paid to be here and
   get nothing out of a caption that only says "stop 4 of 15". So every
   caption thanks the business by name and tells the reader why these
   businesses are worth their money.

   Lines rotate by stop number so a team's feed does not read like
   fifteen copies of the same post.
   ------------------------------------------------------------------ */

export const teamLabel = (name) => {
  const n = (name || 'our rig').trim()
  return /^team\b/i.test(n) ? n : `Team ${n}`
}

const OPENERS = [
  (t) => `${t} found the duck. 🦆`,
  (t) => `${t} tracked this one down. 🦆`,
  (t) => `Another duck down for ${t}. 🦆`,
  (t) => `${t} is back on the board. 🦆`,
  (t) => `Found him. ${t} keeps rolling. 🦆`
]

const THANKS = [
  (w) => `Huge thanks to ${w} for hosting us and backing Martin County PAL.`,
  (w) => `Thank you ${w} for opening your doors and supporting Martin County PAL.`,
  (w) => `Grateful to ${w} for hosting a stop and standing behind Martin County PAL.`,
  (w) => `${w} showed up for our kids today. Thank you for hosting us.`
]

const CAUSE = (total) => [
  'Every stop on this run is a local business that shows up for our kids.',
  'Go spend a dollar with them. They supported Martin County PAL first.',
  'These are the businesses that back our kids. Worth your business.',
  `${STOPS.length} local businesses put this day together for Martin County PAL.`,
  'Support the people who support our community.'
]

export function buildCaption(stop, team, total = 15) {
  const t = teamLabel(team?.name)
  const i = Math.max(0, (stop.order || 1) - 1)
  const where = stop.igHandle ? `@${stop.igHandle.replace(/^@/, '')}` : (stop.sponsor || fullAddress(stop))

  const isHost = Boolean(stop.isHost)

  const opener =
    stop.order === 1 ? `${t} is rolling out. 🦆`
    : stop.isFinish || stop.order === total ? `${t} just finished all ${total}. 🦆`
    : OPENERS[i % OPENERS.length](t)

  const progress =
    stop.order === total
      ? `That is every stop on the ${EVENT.year} ${EVENT.org} ${EVENT.name}.`
      : `Stop ${stop.order} of ${total} on the ${EVENT.year} ${EVENT.org} ${EVENT.name}.`

  return [
    opener,
    '',
    progress,
    '',
    isHost
      ? `📍 This one is at ${where}, the house this whole day is for.`
      : `📍 ${THANKS[i % THANKS.length](where)}`,
    '',
    isHost
      ? 'Every dollar raised today goes to the kids who walk through these doors.'
      : CAUSE(total)[i % CAUSE(total).length],
    '',
    `${EVENT.palHandle} ${EVENT.hashtag}`,
    '#duckduckjeep #jeeplife #martincounty'
  ].join('\n')
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta); ta.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { ok = false }
    ta.remove()
    return ok
  }
}

/* Hands off to whatever map app the phone prefers. The address string is
   used rather than coordinates so it is exact even before pin drop. */
export function mapsUrl(stop) {
  const q = encodeURIComponent(fullAddress(stop))
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)
  return isApple ? `https://maps.apple.com/?q=${q}` : `https://www.google.com/maps/search/?api=1&query=${q}`
}
