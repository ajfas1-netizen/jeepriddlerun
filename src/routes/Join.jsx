import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../lib/store.jsx'
import { EVENT, DUCKS, RIG_COLORS } from '../data/event.js'
import { STOPS } from '../data/stops.js'
import { provider } from '../lib/providers.js'
import { Duck, Grille, IconBack } from '../components/Icons.jsx'

const step = { initial: { opacity: 0, x: 26 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -26 } }

export default function Join() {
  const { join, say } = useStore()
  const [i, setI] = useState(0)
  const [name, setName] = useState('')
  const [duckId, setDuck] = useState(DUCKS[0].id)
  const [rigId, setRig] = useState(RIG_COLORS[0].id)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async () => {
    setBusy(true)
    try { await join({ name: name.trim(), duckId, rigId }) }
    catch (e) { say('Could not start the rig'); console.error(e) }
    finally { setBusy(false) }
  }

  const joinExisting = async () => {
    setBusy(true)
    try {
      if (!provider.joinByCode) throw new Error('Team codes need the live database')
      await provider.joinByCode(code); window.location.reload()
    } catch (e) { say(e.message || 'Code did not match') }
    finally { setBusy(false) }
  }

  return (
    <div className="page">
      <div className="page-body pad" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 26px)', paddingBottom: 26, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="eyebrow">{EVENT.org} · {EVENT.year}</div>
          <Grille />
        </div>
        <h1 className="h1" style={{ marginTop: 8 }}>Jeep<br />Riddle Run</h1>
        <p style={{ color: 'var(--steel)', margin: '10px 0 22px', fontSize: 15, lineHeight: 1.5 }}>
          Fifteen stops. Fifteen riddles. One duck in every photo. This is not a race, so take the whole day.
        </p>

        <AnimatePresence mode="wait">
          {i === 0 && (
            <motion.div key="a" {...step} transition={{ duration: 0.26 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Step 1 · Name your rig</div>
              <input
                className="field" value={name} maxLength={28} autoComplete="off"
                placeholder="Sandy Slots" onChange={(e) => setName(e.target.value)}
              />
              <p style={{ color: 'var(--steel)', fontSize: 13, margin: '10px 0 18px' }}>
                This is what shows on the leaderboard and in your posts. Make it good.
              </p>
              <button className="btn btn-primary" disabled={name.trim().length < 2} onClick={() => setI(1)}>Next</button>
              <div style={{ height: 26 }} />
              <div className="tread" />
              <div className="eyebrow" style={{ margin: '18px 0 8px' }}>Riding with a rig that already checked in?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input className="field" placeholder="TEAM CODE" value={code} maxLength={5}
                  onChange={(e) => setCode(e.target.value.toUpperCase())} />
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '0 20px' }}
                  disabled={code.length < 4 || busy} onClick={joinExisting}>Join</button>
              </div>
            </motion.div>
          )}

          {i === 1 && (
            <motion.div key="b" {...step} transition={{ duration: 0.26 }}>
              <button className="chip" onClick={() => setI(0)}><IconBack size={13} /> Back</button>
              <div className="eyebrow" style={{ margin: '16px 0 10px' }}>Step 2 · Pick your duck</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                {DUCKS.map((d) => (
                  <button key={d.id} onClick={() => setDuck(d.id)}
                    style={{
                      aspectRatio: '1', borderRadius: 16, display: 'grid', placeItems: 'center',
                      background: duckId === d.id ? 'rgba(255,198,39,.18)' : 'rgba(244,240,228,.05)',
                      border: `1px solid ${duckId === d.id ? 'rgba(255,198,39,.55)' : 'var(--line)'}`
                    }}>
                    <Duck body={d.body} bill={d.bill} size={34} />
                  </button>
                ))}
              </div>
              <p style={{ color: 'var(--steel)', fontSize: 13, margin: '12px 0 18px' }}>
                Your real duck rides in the Jeep. This one rides on the leaderboard.
              </p>
              <button className="btn btn-primary" onClick={() => setI(2)}>Next</button>
            </motion.div>
          )}

          {i === 2 && (
            <motion.div key="c" {...step} transition={{ duration: 0.26 }}>
              <button className="chip" onClick={() => setI(1)}><IconBack size={13} /> Back</button>
              <div className="eyebrow" style={{ margin: '16px 0 10px' }}>Step 3 · Your rig color</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                {RIG_COLORS.map((c) => (
                  <button key={c.id} onClick={() => setRig(c.id)} title={c.name}
                    style={{
                      aspectRatio: '1', borderRadius: 16, background: c.hex,
                      border: `2px solid ${rigId === c.id ? 'var(--duck)' : 'rgba(0,0,0,.35)'}`,
                      boxShadow: rigId === c.id ? '0 0 0 3px rgba(255,198,39,.22)' : 'none'
                    }}><span className="sr">{c.name}</span></button>
                ))}
              </div>
              <div className="card" style={{ padding: 18, margin: '20px 0 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="crew-duck" style={{ width: 46, height: 46 }}>
                  <Duck {...DUCKS.find((d) => d.id === duckId)} size={30} />
                </div>
                <div>
                  <div className="crew-name" style={{ fontSize: 21 }}>{name || 'Your rig'}</div>
                  <div className="crew-sub">{RIG_COLORS.find((c) => c.id === rigId)?.name} · 0 of 15 stops</div>
                </div>
              </div>
              <div className="card" style={{ padding: 15, marginBottom: 14, borderColor: 'rgba(255,198,39,.32)' }}>
                <div className="eyebrow" style={{ color: 'var(--duck)', marginBottom: 7 }}>One rule about photos</div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'rgba(244,240,228,.88)' }}>
                  Take every photo with your normal Camera app so it saves to your phone. Then add it here and post it.
                  Your duck has to be in every shot.
                </p>
              </div>
              <button className="btn btn-duck" disabled={busy} onClick={go}>{busy ? 'Starting…' : 'Roll out'}</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 'auto', paddingTop: 34 }}>
          <div className="tread" style={{ opacity: .5 }} />
          <p style={{ color: 'var(--steel)', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            {EVENT.dateLabel && EVENT.rallyTimeLabel
              ? <>{EVENT.dateLabel} · {EVENT.rallyTimeLabel}<br /></>
              : <>Roll out from {STOPS[0].sponsor}, {STOPS[0].city}<br /></>}
            Every dollar raised stays with {EVENT.org}.
          </p>
        </div>
      </div>
    </div>
  )
}
