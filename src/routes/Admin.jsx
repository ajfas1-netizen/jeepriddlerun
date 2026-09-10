import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sheet from '../components/Sheet.jsx'
import MapView from '../components/MapView.jsx'
import { useStore } from '../lib/store.jsx'
import { EVENT } from '../data/event.js'
import { fullAddress } from '../data/stops.js'
import { IconTarget, IconCheck } from '../components/Icons.jsx'

/* Organizer tools. Pin Drop exists because a street address often lands
   the map marker on the wrong side of a plaza. Tapping the real door
   takes about three minutes for all fifteen stops and needs no
   geocoding service on event day. */
export default function Admin() {
  const nav = useNavigate()
  const { stops, dropPin, board } = useStore()
  const [tab, setTab] = useState('pins')
  const [target, setTarget] = useState(null)

  const exportCsv = () => {
    const head = ['team', 'stops', 'spend_dollars', 'tag_points', 'spend_points', 'total']
    const rows = board.map((r) => [r.name, r.stops, r.spend, r.tags, r.money ?? r.spend, r.total])
    const csv = [head, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `riddle-run-${EVENT.year}-standings.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const placed = stops.filter((s) => s.lat != null).length

  return (
    <Sheet onClose={() => nav(-1)} label="Organizer tools" title="Organizer tools">
      <h2 className="h1" style={{ fontSize: 28, marginTop: 2 }}>Run the day</h2>

      <div className="seg" style={{ gridTemplateColumns: 'repeat(3,1fr)', margin: '18px 0 16px' }}>
        <button data-on={tab === 'pins'} onClick={() => setTab('pins')}>Pin drop</button>
        <button data-on={tab === 'check'} onClick={() => setTab('check')}>Data check</button>
        <button data-on={tab === 'score'} onClick={() => setTab('score')}>Standings</button>
      </div>

      {tab === 'pins' ? (
        <>
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <div className="eyebrow">{placed} of {stops.length} pinned</div>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>
              Pick a stop, then tap its real front door on the map. Navigation already works without pins, so this is
              about the map looking right, not about the route working.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
            {stops.map((s) => (
              <button key={s.id} onClick={() => setTarget(target?.id === s.id ? null : s)}
                style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, alignItems: 'center', textAlign: 'left',
                  padding: '10px 12px', borderRadius: 12,
                  background: target?.id === s.id ? 'rgba(201,162,39,.14)' : 'rgba(236,234,226,.04)',
                  border: `1px solid ${target?.id === s.id ? 'rgba(201,162,39,.45)' : 'var(--line)'}`
                }}>
                <span className="lb-rank" style={{ fontSize: 15 }}>{s.order}</span>
                <span style={{ minWidth: 0 }}>
                  <span className="lb-name" style={{ fontSize: 14.5, display: 'block' }}>{s.address}</span>
                  <span className="lb-meta">{s.city}</span>
                </span>
                {s.lat != null
                  ? <span className="chip ok"><IconCheck size={12} /></span>
                  : <span className="chip">Set</span>}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 0, isolation: 'isolate', height: 320, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line-2)' }}>
            <MapView
              stops={stops}
              activeId={target?.id}
              onMapTap={(lat, lng) => { if (target) { dropPin(target.id, lat, lng); setTarget(null) } }}
            />
            {!target && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 500, background: 'rgba(11,14,10,.55)', pointerEvents: 'none' }}>
                <div className="chip"><IconTarget size={13} /> Pick a stop above, then tap the map</div>
              </div>
            )}
          </div>
          {target && (
            <p style={{ color: 'var(--brass)', fontSize: 13, marginTop: 10 }}>
              Tap the map to pin stop {target.order}. {fullAddress(target)}
            </p>
          )}
        </>
      ) : tab === 'check' ? (
        <>
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>
              Everything that still wants a human eye before anything is printed. Nothing here blocks the event.
            </p>
          </div>
          {stops.filter((s) => s.verify || !s.igHandle || s.lat == null).map((s) => (
            <div key={s.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
              <div className="eyebrow">Stop {s.order} · {s.sponsor}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 0' }}>
                {!s.igHandle && <span className="chip warn">No Instagram handle</span>}
                {s.lat == null && <span className="chip warn">No pin</span>}
              </div>
              {s.verify && (
                <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'rgba(236,234,226,.86)' }}>{s.verify}</p>
              )}
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>
              Standings are fully automatic. Nothing here waits on a judge. Receipts are the only manual step, verified
              at the closing ceremony against the dollar amounts each team logged.
            </p>
          </div>
          {board.map((r, i) => (
            <div key={r.id} className="lb-row">
              <div className="lb-rank">{i + 1}</div>
              <div style={{ minWidth: 0 }}>
                <div className="lb-name">{r.name}</div>
                <div className="lb-meta">{r.stops} stops · ${r.spend} spent · {r.tags} tag points</div>
              </div>
              <div className="lb-pts">{r.total}</div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={exportCsv}>Export standings CSV</button>
        </>
      )}
      <div style={{ height: 20 }} />
    </Sheet>
  )
}
