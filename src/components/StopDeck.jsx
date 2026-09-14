import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconCheck, IconLock, Grille } from './Icons.jsx'
import { fullAddress } from '../data/stops.js'

/* Horizontal snap deck. The whole route on one screen, thumb driven. */
export default function StopDeck({ stops, bonus, initialIndex = 0 }) {
  const nav = useNavigate()
  const ref = useRef(null)
  const [idx, setIdx] = useState(initialIndex)

  const onScroll = useCallback(() => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector('.deck-card')
    if (!card) return
    const step = card.offsetWidth + 14
    setIdx(Math.max(0, Math.min(stops.length - 1, Math.round(el.scrollLeft / step))))
  }, [stops.length])

  useEffect(() => {
    const el = ref.current
    if (!el || !initialIndex) return
    const card = el.querySelector('.deck-card')
    if (card) el.scrollLeft = initialIndex * (card.offsetWidth + 14)
  }, [initialIndex])

  return (
    <>
      <div className="deck" ref={ref} onScroll={onScroll}>
        {stops.map((s) => {
          const done = Boolean(s.checkin?.photo)
          return (
            <button
              key={s.id}
              className={`deck-card${done ? ' done' : ''}${s.isRally ? ' rally' : ''}`}
              onClick={() => nav(`/stop/${s.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div className="stopnum">{String(s.order).padStart(2, '0')}</div>
                {done
                  ? <span className="chip ok"><IconCheck size={14} /> Logged</span>
                  : s.isRally
                    ? <span className="chip warn">Rally point</span>
                    : s.isFinish
                      ? <span className="chip warn">Finish</span>
                      : <span className="chip">{bonus ? 'Hint ready' : <><IconLock size={13} /> Locked</>}</span>}
              </div>
              <div className="eyebrow" style={{ marginTop: 10 }}>{s.city}, {s.state}</div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 19, letterSpacing: '.02em', marginTop: 2, lineHeight: 1.1 }}>
                {s.sponsor || s.address}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{s.address}</div>
              <div style={{ margin: '14px 0 12px' }}><Grille /></div>
              <p className="riddle" style={{ margin: 0, flex: 1, display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {s.riddle}
              </p>
              <div className="eyebrow" style={{ marginTop: 14 }}>Tap to open ›</div>
              <span className="sr">{fullAddress(s)}</span>
            </button>
          )
        })}
      </div>
      <div className="dots" aria-hidden="true">
        {stops.map((s, i) => <i key={s.id} className={i === idx ? 'on' : ''} />)}
      </div>
    </>
  )
}
