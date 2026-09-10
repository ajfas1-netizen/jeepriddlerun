import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MapView from '../components/MapView.jsx'
import { useStore } from '../lib/store.jsx'
import { fullAddress } from '../data/stops.js'
import { mapsUrl } from '../lib/caption.js'
import { IconNav, IconTarget, IconCheck, Grille } from '../components/Icons.jsx'

/* The map used to fill the screen with the stop card floating on top of
   it. Two things fighting for the same space. Now the map is a panel
   with a defined edge and the stop sits below it in normal flow. */
export default function Trail() {
  const { stops, nextStop } = useStore()
  const nav = useNavigate()
  const [picked, setPicked] = useState(null)
  const placed = useMemo(() => stops.filter((s) => s.lat != null), [stops])
  const stop = picked || nextStop || stops[0]

  return (
    <div className="page">
      <div className="map-pane">
        <MapView stops={stops} onPick={setPicked} activeId={stop?.id} />
        {placed.length > 0 && (
          <button className="map-fab" onClick={() => setPicked(null)} aria-label="Back to your next stop">
            <IconTarget size={19} />
          </button>
        )}
        {placed.length === 0 && (
          <div className="map-empty">
            <IconTarget size={26} />
            <p>No pins dropped yet. Crew, then Organizer tools, then Pin drop.</p>
          </div>
        )}
      </div>

      <div className="map-panel">
        <div className="map-panel-scroll">
        <div className="map-hint">
          <span>{placed.length} stops on the map</span>
          <span>Tap a pin</span>
        </div>

        <AnimatePresence mode="wait">
          {stop && (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div className="eyebrow">
                  {stop.isRally ? 'Rally point' : `Stop ${stop.order}`} · {stop.city}
                </div>
                {stop.checkin?.photo
                  ? <span className="chip ok"><IconCheck size={13} /> Logged</span>
                  : <span className="chip warn">{picked ? 'Selected' : 'Up next'}</span>}
              </div>

              <h2 className="h1" style={{ fontSize: (stop.sponsor || stop.address).length > 26 ? 20 : 25, marginTop: 8, lineHeight: 1 }}>
                {stop.sponsor || stop.address}
              </h2>
              <div className="eyebrow" style={{ marginTop: 7 }}>{stop.address}</div>

              <div style={{ margin: '12px 0' }}><Grille n={6} /></div>

              <p className="riddle" style={{ margin: '0 0 4px', fontSize: 14.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {stop.riddle}
              </p>

              <span className="sr">{fullAddress(stop)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {stop && (
          <div className="map-actions">
            <a className="btn btn-ghost" href={mapsUrl(stop)} target="_blank" rel="noreferrer">
              <IconNav size={16} /> Navigate
            </a>
            <button className="btn btn-primary" onClick={() => nav(`/stop/${stop.id}`)}>Open stop</button>
          </div>
        )}
      </div>
    </div>
  )
}
