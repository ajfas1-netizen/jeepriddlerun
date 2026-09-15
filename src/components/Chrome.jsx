import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store.jsx'
import { DUCKS } from '../data/event.js'
import { Duck, IconTrail, IconCards, IconTrophy, IconCrew } from './Icons.jsx'

export function TopBar() {
  const { team, totals, stops, nextStop, pending } = useStore()
  const duck = DUCKS.find((d) => d.id === team?.duckId) || DUCKS[0]
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="crew">
          <div className="crew-duck"><Duck body={duck.body} bill={duck.bill} size={26} /></div>
          <div style={{ minWidth: 0 }}>
            <div className="crew-name">{team?.name || 'No rig yet'}</div>
            <div className="crew-sub">
              {totals.stops} of {stops.length} stops{team?.code ? ` · ${team.code}` : ''}
              {pending > 0 ? <span className="offline-dot"> · saved on this phone, sending</span> : null}
            </div>
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

/* Four tabs, nothing raised, nothing pulsing. The camera button that
   used to sit in the middle promised a camera the app no longer has. */
const TABS = [
  { to: '/stops', label: 'Stops', Icon: IconCards },
  { to: '/trail', label: 'Map', Icon: IconTrail },
  { to: '/rank', label: 'Rank', Icon: IconTrophy },
  { to: '/crew', label: 'Crew', Icon: IconCrew }
]

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} className="tab">
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="tabdot" className="tab-dot" transition={{ type: 'spring', stiffness: 520, damping: 34 }} />}
              <t.Icon />
              <span>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="toast-wrap">
      <motion.div className="toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        {toast}
      </motion.div>
    </div>
  )
}
