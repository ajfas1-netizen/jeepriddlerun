import { EVENT } from '../data/event.js'
import { fullAddress } from '../data/stops.js'

/* The single highest-leverage feature in the app: teams lose tag points
   because tagging is fiddly. This writes the caption for them. */
export function buildCaption(stop, team, total = 15) {
  const where = stop.igHandle ? `@${stop.igHandle.replace(/^@/, '')}` : (stop.sponsor || fullAddress(stop))
  return [
    `${team?.name || 'Our rig'} found it. 🦆`,
    `Stop ${stop.order} of ${total} on the ${EVENT.year} ${EVENT.org} ${EVENT.name}.`,
    '',
    `📍 ${where}`,
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

/* Hands off to whatever map app the phone prefers. Address string is
   used rather than coordinates so it is exact even before pin drop. */
export function mapsUrl(stop) {
  const q = encodeURIComponent(fullAddress(stop))
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)
  return isApple ? `https://maps.apple.com/?q=${q}` : `https://www.google.com/maps/search/?api=1&query=${q}`
}
