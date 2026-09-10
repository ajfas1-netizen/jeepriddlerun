import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store.jsx'
import { DUCKS } from '../data/event.js'
import { Duck, IconTrail, IconCards, IconCamera, IconTrophy, IconCrew } from './Icons.jsx'

export function TopBar() {
  const { team, totals, stops, nextStop } = useStore()
  const duck = DUCKS.find((d) => d.id === team?.duckId) || DUCKS[0]
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="crew">
          <div className="crew-duck"><Duck body={duck.body} bill={duck.bill} size={26} /></div>
          <div style={{ minWidth: 0 }}>
            <div className="crew-name">{team?.name || 'No rig yet'}</div>
            <div className="crew-sub">{totals.stops} of {stops.length} stops{team?.code ? ` · ${team.code}` : ''}</div>
          </div>
        </div>
        <div className="pts">{totals.total}<small>points</small></div>
      </div>
      <div className="ribbon" role="img" aria-label={`${totals.stops} of ${stops.length} stops logged`}>
        {stops.map((s) => (
          <div key={s.id} className={`notch${s.checkin?.photo ? ' done' : ''}${nextStop?.id === s.id ? ' here' : ''}`}><i /></div>
        ))}
      </div>
    </header>
  )
}

const TABS = [
  { to: '/trail', label: 'Trail', Icon: IconTrail },
  { to: '/stops', label: 'Stops', Icon: IconCards },
  { cta: true },
  { to: '/rank', label: 'Rank', Icon: IconTrophy },
  { to: '/crew', label: 'Crew', Icon: IconCrew }
]

export function TabBar() {
  const nav = useNavigate()
  const { nextStop } = useStore()
  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map((t, i) =>
        t.cta ? (
          <button
            key="cta"
            className="tab tab-cta"
            aria-label={nextStop ? `Log stop ${nextStop.order}` : 'All stops logged'}
            onClick={() => nav(nextStop ? `/stop/${nextStop.id}?log=1` : '/stops')}
          >
            <span className={`cta-ring${nextStop ? ' pulse' : ''}`}><IconCamera size={26} /></span>
          </button>
        ) : (
          <NavLink key={t.to} to={t.to} className="tab">
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="tabdot" className="tab-dot" transition={{ type: 'spring', stiffness: 520, damping: 34 }} />}
                <t.Icon />
                <span>{t.label}</span>
              </>
            )}
          </NavLink>
        )
      )}
    </nav>
  )
}

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <motion.div className="toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {toast}
    </motion.div>
  )
}
