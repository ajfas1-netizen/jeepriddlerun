import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MapView from '../components/MapView.jsx'
import { useStore } from '../lib/store.jsx'
import { fullAddress } from '../data/stops.js'
import { mapsUrl } from '../lib/caption.js'
import { IconNav, IconTarget, IconCheck } from '../components/Icons.jsx'

export default function Trail() {
  const { stops, nextStop } = useStore()
  const nav = useNavigate()
  const [peek, setPeek] = useState(null)
  const placed = useMemo(() => stops.filter((s) => s.lat != null), [stops])
  const card = peek || nextStop

  return (
    <div className="page">
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <MapView stops={stops} onPick={setPeek} activeId={card?.id} />

        {placed.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 500, padding: 24, paddingBottom: 280 }}>
            <div className="card" style={{ padding: 22, textAlign: 'center', maxWidth: 320 }}>
              <IconTarget size={30} />
              <div className="h2" style={{ margin: '10px 0 6px' }}>No pins dropped yet</div>
              <p style={{ color: 'var(--steel)', fontSize: 14, lineHeight: 1.5, margin: '0 0 14px' }}>
                Open Crew, then Pin Drop, and tap each stop on the map. Navigation already works without pins.
              </p>
              <button className="btn btn-ghost" onClick={() => nav('/admin')}>Open pin drop</button>
            </div>
          </div>
        )}

        <button className="map-fab" style={{ top: 14 }} onClick={() => setPeek(null)} aria-label="Show next stop">
          <IconTarget size={20} />
        </button>

        <div className="map-overlay">
          <AnimatePresence mode="wait">
            {card && (
              <motion.div
                key={card.id} className="card"
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                style={{ padding: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div className="eyebrow">
                    {card.isRally ? 'Rally point' : `Stop ${card.order}`} · {card.city}
                  </div>
                  {card.checkin?.photo
                    ? <span className="chip ok"><IconCheck size={13} /> Logged</span>
                    : <span className="chip warn">{peek ? 'Selected' : 'Up next'}</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: 19, marginTop: 4 }}>{card.address}</div>
                <p className="riddle" style={{ margin: '8px 0 14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {card.riddle}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <a className="btn btn-ghost" href={mapsUrl(card)} target="_blank" rel="noreferrer">
                    <IconNav size={16} /> Navigate
                  </a>
                  <button className="btn btn-primary" onClick={() => nav(`/stop/${card.id}`)}>Open stop</button>
                </div>
                <span className="sr">{fullAddress(card)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
