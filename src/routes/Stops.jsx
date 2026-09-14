import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StopDeck from '../components/StopDeck.jsx'
import { useStore } from '../lib/store.jsx'
import { IconCheck, IconLock, IconNav } from '../components/Icons.jsx'
import { mapsUrl } from '../lib/caption.js'

export default function Stops() {
  const { stops, bonus, nextStop } = useStore()
  const [view, setView] = useState('deck')
  const nav = useNavigate()
  const startAt = useMemo(() => Math.max(0, stops.findIndex((s) => s.id === nextStop?.id)), [stops, nextStop])

  return (
    <div className="page">
      <div className="pad" style={{ paddingTop: 4, paddingBottom: 12, display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
        <div className="seg" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <button data-on={view === 'deck'} onClick={() => setView('deck')}>Deck</button>
          <button data-on={view === 'list'} onClick={() => setView('list')}>List</button>
        </div>
        <button className="seg" style={{ padding: '0 16px', alignItems: 'center' }} onClick={() => nav('/trail')}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 11.5, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Map
          </span>
        </button>
      </div>

      {view === 'deck' ? (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <StopDeck stops={stops} bonus={bonus} initialIndex={startAt} />
        </div>
      ) : (
        <div className="page-body pad" style={{ paddingBottom: 18 }}>
          {stops.map((s) => {
            const done = Boolean(s.checkin?.photo)
            return (
              <div key={s.id} className="lb-row" style={{ gridTemplateColumns: '30px 1fr auto' }}>
                <div className="lb-rank">{s.order}</div>
                <button onClick={() => nav(`/stop/${s.id}`)} style={{ textAlign: 'left', minWidth: 0 }}>
                  <div className="lb-name">{s.sponsor || s.address}</div>
                  <div className="lb-meta">{s.city} · {done ? 'Logged' : s.isRally ? 'Rally point' : s.isFinish ? 'Finish' : bonus ? 'Hint ready' : 'Hint locked'}</div>
                </button>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <a className="chip" href={mapsUrl(s)} target="_blank" rel="noreferrer" aria-label={`Navigate to stop ${s.order}`}><IconNav size={13} /></a>
                  {done ? <span className="chip ok"><IconCheck size={13} /></span> : !bonus && <span className="chip"><IconLock size={13} /></span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
