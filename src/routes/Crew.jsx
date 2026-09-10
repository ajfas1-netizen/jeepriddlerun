import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store.jsx'
import { EVENT, DUCKS, RIG_COLORS } from '../data/event.js'
import { SPONSORS } from '../data/stops.js'
import { Duck, Grille, IconTarget, IconCheck } from '../components/Icons.jsx'

export default function Crew() {
  const { team, stops, totals, leave, bonus, live } = useStore()
  const nav = useNavigate()
  const duck = DUCKS.find((d) => d.id === team?.duckId) || DUCKS[0]
  const rig = RIG_COLORS.find((c) => c.id === team?.rigId) || RIG_COLORS[0]

  return (
    <div className="page">
      <div className="page-body pad" style={{ paddingBottom: 22 }}>
        {/* team card */}
        <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(150deg, ${rig.hex}22, transparent 60%)` }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="eyebrow">{EVENT.org} · {EVENT.year}</div>
              <Grille n={7} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
              <div className="crew-duck" style={{ width: 56, height: 56, borderRadius: 16 }}>
                <Duck body={duck.body} bill={duck.bill} size={36} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="crew-name" style={{ fontSize: 25 }}>{team?.name}</div>
                <div className="crew-sub">{rig.name} · {duck.name} duck</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 18 }}>
              {[['Stops', `${totals.stops}/${stops.length}`], ['Spent', `$${totals.spend}`], ['Points', totals.total]].map(([k, val]) => (
                <div key={k} style={{ padding: '12px 10px', borderRadius: 14, background: 'rgba(8,23,11,.45)', border: '1px solid var(--line)' }}>
                  <div className="lb-pts" style={{ fontSize: 22 }}>{val}</div>
                  <div className="eyebrow" style={{ fontSize: 10 }}>{k}</div>
                </div>
              ))}
            </div>
            {team?.code && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="chip warn">Team code {team.code}</span>
                <span style={{ fontSize: 12.5, color: 'var(--steel)' }}>Second phone in the rig? Enter this at kickoff.</span>
              </div>
            )}
          </div>
        </div>

        {/* badges */}
        <div className="eyebrow" style={{ margin: '24px 0 10px' }}>Trail badges</div>
        <div className="badges">
          {stops.map((s) => {
            const on = Boolean(s.checkin?.photo)
            return (
              <div key={s.id} className={`badge${on ? ' on' : ''}`} onClick={() => nav(`/stop/${s.id}`)} role="button" tabIndex={0}>
                <b>{on ? <IconCheck size={22} /> : String(s.order).padStart(2, '0')}</b>
                <span>{s.city}</span>
              </div>
            )
          })}
        </div>

        {/* status */}
        <div className="eyebrow" style={{ margin: '24px 0 10px' }}>Status</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="lb-row" style={{ gridTemplateColumns: '1fr auto', margin: 0 }}>
            <div className="lb-name" style={{ fontSize: 15 }}>Bonus clues</div>
            <span className={`chip ${bonus ? 'ok' : ''}`}>{bonus ? 'Unlocked' : 'Locked'}</span>
          </div>
          <div className="lb-row" style={{ gridTemplateColumns: '1fr auto', margin: 0 }}>
            <div className="lb-name" style={{ fontSize: 15 }}>Data</div>
            <span className={`chip ${live ? 'ok' : 'warn'}`}>{live ? 'Live database' : 'Demo, on this phone'}</span>
          </div>
        </div>

        {/* sponsors */}
        <div className="eyebrow" style={{ margin: '24px 0 10px' }}>The businesses making this possible</div>
        <div className="sponsor-grid">
          {SPONSORS.map((s) => (
            <div key={s.name} className="sponsor"><b>{s.name}</b><span>{s.tier}</span></div>
          ))}
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, lineHeight: 1.55, marginTop: 14 }}>
          Spend a dollar at every one of them. That is the whole point of the day.
        </p>

        <div className="tread" style={{ margin: '24px 0 16px' }} />
        <div style={{ display: 'grid', gap: 9 }}>
          <button className="btn btn-ghost" onClick={() => nav('/admin')}><IconTarget size={16} /> Organizer tools</button>
          <button className="btn btn-ghost" onClick={() => { if (confirm('Leave this rig? Local progress on this phone is cleared.')) leave() }}>
            Leave rig
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 11.5, textAlign: 'center', marginTop: 16 }}>
          {EVENT.org} · {EVENT.hashtag}
        </p>
      </div>
    </div>
  )
}
