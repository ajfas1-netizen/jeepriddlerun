import React, { useEffect, useMemo, useState } from 'react'
import { provider, IS_LIVE } from '../lib/providers.js'
import { EVENT, DUCKS, SCORE_ITEMS } from '../data/event.js'
import { STOPS, SPONSORS } from '../data/stops.js'
import { Duck, Grille } from '../components/Icons.jsx'

/* Desktop results console for the PAL team. Lives at #/results so it is
   a link you can paste into a laptop at the closing ceremony and put on
   a projector. Nothing here is phone-shaped. */
const order = (stopId) => (STOPS.find((s) => s.id === stopId)?.order ?? 99)
const stopName = (stopId) => {
  const s = STOPS.find((x) => x.id === stopId)
  return s ? `${s.order} · ${s.sponsor}` : stopId
}

export default function Results() {
  const [board, setBoard] = useState([])
  const [rows, setRows] = useState([])
  const [tab, setTab] = useState('standings')
  const [q, setQ] = useState('')
  const [openRig, setOpenRig] = useState(null)
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
    const given = board.reduce((s, r) => s + (Number(r.donation) || 0), 0)
    return [
      ['Rigs running', board.length],
      ['Stops logged', stops],
      ['Spent at sponsors', `$${spend.toLocaleString()}`],
      ['Pledged to PAL', `$${given.toLocaleString()}`]
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
      best((r) => Number(r.donation) || 0, 'Biggest gift to PAL'),
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

  /* One entry per rig, with every stop it logged. This is what the person
     checking receipts at Ocean Republic actually needs: the rig in front of
     them, what it claimed, and nothing else on screen. */
  const rigs = useMemo(() => {
    const by = new Map()
    rows.forEach((r) => {
      const key = r.team
      if (!by.has(key)) by.set(key, { team: r.team, code: r.join_code, duckId: r.duck_id, donation: Number(r.donation) || 0, stops: [], spend: 0, receipts: 0 })
      const rig = by.get(key)
      rig.stops.push(r)
      rig.spend += Number(r.spend) || 0
      if (r.receipt_url) rig.receipts += 1
    })
    return [...by.values()]
      .map((rig) => ({ ...rig, stops: rig.stops.slice().sort((a, b) => order(a.stop_id) - order(b.stop_id)) }))
      .sort((a, b) => a.team.localeCompare(b.team))
  }, [rows])

  const found = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rigs
    return rigs.filter((r) =>
      r.team.toLowerCase().includes(needle) || String(r.code || '').toLowerCase().includes(needle))
  }, [rigs, q])

  const download = (name, text) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    a.download = name
    a.click(); URL.revokeObjectURL(a.href)
  }

  const toCsv = (head, data) =>
    [head, ...data].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')

  /* The offline copy of this screen. Hit it once when the rigs are in and
     the finish table can keep working through a dead patch of wifi. */
  const csvDesk = () => {
    // Headers read as English, because a spreadsheet nobody can parse at a
    // noisy finish line is not a backup.
    const slug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    const head = ['rig', 'code', 'total_claimed', 'pledged_to_pal', 'stop', 'sponsor', 'spent_here',
      ...SCORE_ITEMS.map((i) => slug(i.label)), 'photo', 'receipt']
    const data = []
    rigs.forEach((rig) => {
      rig.stops.forEach((r) => {
        const stop = STOPS.find((x) => x.id === r.stop_id)
        data.push([
          rig.team, rig.code || '', rig.spend, rig.donation || 0,
          stop?.order ?? '', stop?.sponsor ?? r.stop_id, Number(r.spend) || 0,
          ...SCORE_ITEMS.map((i) => (r.flags && r.flags[i.key] ? 'yes' : 'no')),
          r.photo_url ? 'yes' : 'no', r.receipt_url ? 'yes' : 'no'
        ])
      })
    })
    download(`riddle-run-${EVENT.year}-rig-check.csv`, toCsv(head, data))
  }

  const csv = () => {
    const head = ['rank', 'team', 'stops', 'spend_dollars', 'pledged_to_pal', 'tag_points', 'spend_points', 'pledge_points', 'total_points']
    const data = board.map((r, i) => [i + 1, r.name, r.stops, r.spend, r.donation ?? 0, r.tags, r.money ?? r.spend, r.given ?? 0, r.total])
    download(`riddle-run-${EVENT.year}-results.csv`, toCsv(head, data))
  }

  return (
    <div className="rc">
      <div className="rc-inner">
        <header className="rc-head">
          <div>
            <div className="eyebrow">{EVENT.org} · {EVENT.year} · Results console</div>
            <h1 className="rc-title">{EVENT.name}</h1>
            <div style={{ marginTop: 12 }}><Grille n={STOPS.length} /></div>
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
          {[['standings', 'Standings'], ['awards', 'Awards'], ['wall', 'Photo wall'], ['stops', 'By stop'], ['desk', 'Rig check']]
            .map(([k, l]) => <button key={k} data-on={tab === k} onClick={() => setTab(k)}>{l}</button>)}
        </div>

        {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

        {!loading && tab === 'standings' && (
          <table className="rc-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th><th>Rig</th>
                <th className="num">Stops</th><th className="num">Spent</th><th className="num">To PAL</th>
                <th className="num">Tag points</th><th className="num">Pledge points</th><th className="num">Total</th>
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
                    <td className="num">{Number(r.donation) ? <span style={{ color: 'var(--brass)' }}>${r.donation}</span> : '—'}</td>
                    <td className="num">{r.tags}</td>
                    <td className="num">{r.given ?? 0}</td>
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

        {!loading && tab === 'desk' && (
          <div className="desk">
            <p className="desk-lede">
              For the table at the finish. Find the rig, check what it claimed against the
              receipts in their hand, and spot check a couple of posts on their phone.
            </p>

            <div className="desk-tools">
              <input
                className="field desk-search"
                placeholder="Rig name or code"
                value={q}
                onChange={(e) => { setQ(e.target.value); setOpenRig(null) }}
              />
              <button className="btn btn-ghost desk-export" onClick={csvDesk} disabled={!rigs.length}>
                Download this list
              </button>
            </div>
            <p className="desk-backup">
              Hit that once the rigs are in. It saves every rig and everything they
              claimed as a spreadsheet, so the table keeps working if the wifi does not.
            </p>

            {!found.length && <p style={{ color: 'var(--muted)' }}>{rigs.length ? 'No rig by that name or code.' : 'No rigs have logged a stop yet.'}</p>}

            {found.map((rig) => {
              const duck = DUCKS.find((d) => d.id === rig.duckId) || DUCKS[0]
              const open = openRig === rig.team
              return (
                <div className="desk-rig" key={rig.team}>
                  <button className="desk-row" onClick={() => setOpenRig(open ? null : rig.team)}>
                    <Duck body={duck.body} bill={duck.bill} size={24} />
                    <span className="desk-name">
                      <span className="rc-team">{rig.team}</span>
                      <small>
                      {rig.code ? rig.code + ' · ' : ''}{rig.stops.length} stops · {rig.receipts} receipts
                      {rig.donation > 0 ? <> · <b style={{ color: 'var(--brass)' }}>${rig.donation} pledged to PAL</b></> : null}
                    </small>
                    </span>
                    <span className="desk-spend">${rig.spend}<small>claimed</small></span>
                  </button>

                  {open && (
                    <div className="desk-body">
                      {rig.stops.map((r) => (
                        <div className="desk-stop" key={r.stop_id}>
                          <div className="desk-stop-head">
                            <span className="rc-team" style={{ fontSize: 14 }}>{stopName(r.stop_id)}</span>
                            <span className="rc-big">${Number(r.spend) || 0}</span>
                          </div>
                          <div className="desk-flags">
                            {SCORE_ITEMS.map((item) => (
                              <span key={item.key} className={`chip ${r.flags && r.flags[item.key] ? 'ok' : ''}`}
                                    data-off={!(r.flags && r.flags[item.key])}>
                                {item.label}
                              </span>
                            ))}
                          </div>
                          <div className="desk-shots">
                            {r.photo_url
                              ? <a href={r.photo_url} target="_blank" rel="noreferrer"><img src={r.photo_url} alt="Their find" /><small>Find</small></a>
                              : <span className="desk-missing">No photo</span>}
                            {r.receipt_url
                              ? <a href={r.receipt_url} target="_blank" rel="noreferrer"><img src={r.receipt_url} alt="Their receipt" /><small>Receipt</small></a>
                              : <span className="desk-missing">No receipt uploaded</span>}
                          </div>
                        </div>
                      ))}
                      <p className="desk-note">
                        Tags above are what the rig ticked itself. The app never checked Instagram,
                        so a post is only confirmed by looking at their phone.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
