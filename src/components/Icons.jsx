import React from 'react'
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
const wrap = (d, size = 22) => (p) => (
  <svg viewBox="0 0 24 24" width={p.size || size} height={p.size || size} {...S} aria-hidden="true">{d}</svg>
)

export const IconTrail = wrap(<><path d="M4 20s3.5-2 3.5-5S4 11 4 8s3-4 3-4" /><circle cx="17" cy="8" r="3" /><path d="M17 13.5c2.5 1 3.5 2.6 3.5 4.2 0 1.4-1.2 2.3-3 2.3" /></>)
export const IconCards = wrap(<><rect x="3" y="6" width="12" height="14" rx="2.5" /><path d="M8 3h9a3 3 0 0 1 3 3v10" /></>)
export const IconCamera = wrap(<><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7a2 2 0 0 0 1.7-1l.5-.8A1.5 1.5 0 0 1 10.7 3h2.6a1.5 1.5 0 0 1 1.3.7l.5.9A2 2 0 0 0 16.8 6h1.7A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" /><circle cx="12" cy="13" r="3.4" /></>, 26)
export const IconTrophy = wrap(<><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4.5A2.5 2.5 0 0 0 7 10.5M17 6h2.5A2.5 2.5 0 0 1 17 10.5" /><path d="M10 14h4M9.5 20h5M12 14v6" /></>)
export const IconCrew = wrap(<><circle cx="12" cy="8.5" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>)
export const IconLock = wrap(<><rect x="4.5" y="10" width="15" height="10" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></>)
export const IconNav = wrap(<><path d="M20.5 3.5 3.5 10.4l7.3 2.8 2.8 7.3z" /></>)
export const IconCheck = wrap(<><path d="M4.5 12.5 9.5 18 20 6.5" /></>)
export const IconTarget = wrap(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.6" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>)
export const IconReceipt = wrap(<><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.4z" /><path d="M9 8h6M9 12h6" /></>)
export const IconBack = wrap(<><path d="M14.5 5 8 12l6.5 7" /></>)
export const IconShare = wrap(<><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 13v6.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V13" /></>)

export function Grille({ n = 7 }) {
  return <span className="grille" aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} />)}</span>
}

export function Duck({ body = '#FFC627', bill = '#E2571F', size = 28 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path d="M20 46c-6 0-11-5-11-11.5S14 23 20.5 23c2 0 4 .5 5.6 1.4C27.5 17.6 33.4 12.5 40.6 12.5c1.6 0 3 .2 4.4.7l-2 6.6c4.6 2.6 7.6 7.4 7.6 13 0 4.9-2.3 9.3-6 12.2z" fill={body} />
      <path d="M45 19.8 57 16l-7.8 9.6z" fill={bill} />
      <circle cx="41.6" cy="22.4" r="2.2" fill="#12190E" />
      <path d="M15 47h30c-2 3.6-6.6 6-12.6 6S17 50.6 15 47z" fill={bill} opacity=".55" />
    </svg>
  )
}
