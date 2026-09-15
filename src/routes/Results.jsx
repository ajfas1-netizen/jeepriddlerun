import React, { useEffect, useMemo, useState } from 'react'
import { provider, IS_LIVE } from '../lib/providers.js'
import { EVENT, DUCKS } from '../data/event.js'
import { STOPS, SPONSORS } from '../data/stops.js'
import { Duck, Grille } from '../components/Icons.jsx'

/* Desktop results console for the PAL team. Lives at #/results so it is
   a link you can paste into a laptop at the closing ceremony and put on
   a projector. Nothing here is phone-shaped. */
export default function Results() {
  const [board, setBoard] = useState([])
  const [rows, setRows] = useState([])
  const [tab, setTab] = useState('standings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [b, c] = await Promise.all([
        provider.getLeaderboard(null, {}).catch(() => []),
        provider.getAllCheckins?.().catch(() => []) ?? []
      ])
      setBoard(b); setRows(c); setLoading(false)
    })()
    return provider.subscribe?.(async () => {
      setBoard(await provider.getLeaderboard(null, {}).catch(() => []))
    })
  }, [])

  const kpis = useMemo(() => {
    const spend = board.reduce((s, r) => s + (Number(r.spend) || 0), 0)
    const stops = board.reduce((s, r) => s + (Number(r.stops) || 0), 0)
    return [
      ['Rigs running', board.length],
      ['Stops logged', stops],
      ['Spent at sponsors', `$${spend.toLocaleString()}`],
      ['Photos captured', rows.filter((r) => r.photo_url).length]
    ]
  }, [board, rows])

  const awards = useMemo(() => {
    const best = (fn, label) => {
      const w = [...board].sort((a, b) => fn(b) - fn(a))[0]
      return { label, team: w?.name || '—', value: w ? fn(w) : 0 }
    }
    return [
      best((r) => r.total, 'Overall'),
      best((r) => r.spend, 'Biggest supporter'),
      best((r) => r.tags, 'Best tagger'),
      best((r) => r.stops, 'Most stops')
    ]
  }, [board])

  /* Per-stop rollup. Receipts were dropped from the app, so the useful
     closing number is what each sponsor actually saw come through the door. */
  const byStop = useMemo(() => STOPS.map((stop) => {
    const mine = rows.filter((r) => r.stop_id === stop.id)
    return {
      stop,
      rigs: new Set(mine.map((r) => r.team)).size,
      photos: mine.filter((r) => r.photo_url).length,
      spend: mine.reduce((s, r) => s + (Number(r.spend) || 0), 0)
    }
  }), [rows])

  const csv = () => {
    const head = ['rank', 'team', 'stops', 'spend_dollars', 'tag_points', 'spend_points', 'total_points']
    const data = board.map((r, i) => [i + 1, r.name, r.stops, r.spend, r.tags, r.money ?? r.spend, r.total])
    const text = [head, ...data].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    a.download = `riddle-run-${EVENT.year}-results.csv`
    a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div className="rc">
      <div className="rc-inner">
        <header className="rc-head">
          <div>
            <div className="eyebrow">{EVENT.org} · {EVENT.year} · Results console</div>
            <h1 className="rc-title">{EVENT.name}</h1>
            <div style={{ marginTop: 12 }}><Grille n={9} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className={`chip ${IS_LIVE ? 'ok' : 'warn'}`}>{IS_LIVE ? 'Live database' : 'Demo data'}</span>
            <button className="btn btn-ghost" style={{ width: 'auto', padding: '12px 20px' }} onClick={csv}>Export CSV</button>
          </div>
        </header>

        <div className="rc-kpis">
          {kpis.map(([label, val]) => <div className="kpi" key={label}><b>{val}</b><span>{label}</span></div>)}
        </div>

        <div className="rc-tabs">
          {[['standings', 'Standings'], ['awards', 'Awards'], ['wall', 'Photo wall'], ['stops', 'By stop']]
            .map(([k, l]) => <button key={k} data-on={tab === k} onClick={() => setTab(k)}>{l}</button>)}
        </div>

        {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

        {!loading && tab === 'standings' && (
          <table className="rc-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th><th>Rig</th>
                <th className="num">Stops</th><th className="num">Spent</th>
                <th className="num">Tag points</th><th className="num">Spend points</th><th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {board.map((r, i) => {
                const duck = DUCKS.find((d) => d.id === r.duckId) || DUCKS[0]
                return (
                  <tr key={r.id} className={i === 0 ? 'top' : ''}>
                    <td><span className="rc-big" style={{ color: i === 0 ? 'var(--brass)' : 'var(--muted)' }}>{i + 1}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Duck body={duck.body} bill={duck.bill} size={22} />
                        <span className="rc-team">{r.name}</span>
                      </div>
                    </td>
                    <td className="num">{r.stops}</td>
                    <td className="num">${r.spend}</td>
                    <td className="num">{r.tags}</td>
                    <td className="num">{r.money ?? r.spend}</td>
                    <td className="num"><span className="rc-big">{r.total}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {!loading && tab === 'awards' && (
          <div className="rc-award">
            {awards.map((a) => (
              <div className="card" key={a.label}>
                <div className="eyebrow">{a.label}</div>
                <div className="rc-team" style={{ fontSize: 26, margin: '8px 0 6px' }}>{a.team}</div>
                <div className="rc-big">{a.value}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'wall' && (
          rows.filter((r) => r.photo_url).length ? (
            <div className="rc-wall">
              {rows.filter((r) => r.photo_url).map((r, i) => {
                const stop = STOPS.find((s) => s.id === r.stop_id)
                return (
                  <figure className="rc-tile" key={i} style={{ margin: 0 }}>
                    <img src={r.photo_url} alt={`${r.team} at stop ${stop?.order}`} loading="lazy" />
                    <div>
                      <div className="lb-name" style={{ fontSize: 15 }}>{r.team}</div>
                      <div className="lb-meta">Stop {stop?.order} · {stop?.city}</div>
                    </div>
                  </figure>
                )
              })}
            </div>
          ) : <p style={{ color: 'var(--muted)' }}>No photos submitted yet.</p>
        )}

        {!loading && tab === 'stops' && (
          <table className="rc-table">
            <thead><tr><th>Stop</th><th className="num">Rigs</th><th className="num">Photos</th><th className="num">Spent</th></tr></thead>
            <tbody>
              {byStop.map(({ stop, rigs, photos, spend }) => (
                <tr key={stop.id}>
                  <td><span className="rc-team">{stop.order} · {stop.sponsor}</span></td>
                  <td className="num">{rigs}</td>
                  <td className="num">{photos}</td>
                  <td className="num"><span className="rc-big">${spend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <footer style={{ marginTop: 46, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{SPONSORS.length} sponsors made this possible</div>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
            {SPONSORS.map((s) => s.name).join(' · ')}
          </p>
        </footer>
      </div>
    </div>
  )
}
