import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store.jsx'
import { DUCKS } from '../data/event.js'
import { Duck } from '../components/Icons.jsx'

const VIEWS = [
  { key: 'total', label: 'Overall', get: (r) => r.total, unit: 'pts' },
  { key: 'tags',  label: 'Tags',    get: (r) => r.tags,  unit: 'pts' },
  { key: 'money', label: 'Spend',   get: (r) => r.spend, unit: '$' },
  { key: 'stops', label: 'Stops',   get: (r) => r.stops, unit: '' }
]

export default function Rank() {
  const { board, team } = useStore()
  const [v, setV] = useState('total')
  const view = VIEWS.find((x) => x.key === v)
  const rows = useMemo(() => [...board].sort((a, b) => view.get(b) - view.get(a)), [board, view])

  return (
    <div className="page">
      <div className="pad" style={{ paddingBottom: 12 }}>
        <div className="seg" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {VIEWS.map((x) => <button key={x.key} data-on={v === x.key} onClick={() => setV(x.key)}>{x.label}</button>)}
        </div>
      </div>

      <div className="page-body pad" style={{ paddingBottom: 18 }}>
        <div className="card" style={{ padding: 14, marginBottom: 14, borderColor: 'rgba(255,198,39,.3)', background: 'rgba(255,198,39,.07)' }}>
          <div className="eyebrow" style={{ color: 'var(--duck)' }}>This is not a race</div>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(244,240,228,.86)' }}>
            Nothing on this board rewards finishing early. Points come from your tags and the dollars you spend at our
            sponsors. Driving faster earns you exactly zero.
          </p>
        </div>

        {rows.map((r, i) => {
          const duck = DUCKS.find((d) => d.id === r.duckId) || DUCKS[0]
          const mine = team && r.id === team.id
          return (
            <motion.div key={r.id} layout className={`lb-row${mine ? ' me' : ''}`}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}>
              <div className="lb-rank">{i + 1}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Duck body={duck.body} bill={duck.bill} size={26} />
                <div style={{ minWidth: 0 }}>
                  <div className="lb-name">{r.name}{mine ? ' · you' : ''}</div>
                  <div className="lb-meta">{r.stops} stops · ${r.spend} spent · {r.tags} tag points</div>
                </div>
              </div>
              <div className="lb-pts">{view.unit === '$' ? '$' : ''}{view.get(r)}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
