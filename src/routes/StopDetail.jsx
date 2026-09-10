import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sheet from '../components/Sheet.jsx'
import { useStore } from '../lib/store.jsx'
import { EVENT, SCORE_ITEMS } from '../data/event.js'
import { fullAddress } from '../data/stops.js'
import { buildCaption, copyText, mapsUrl } from '../lib/caption.js'
import { compress } from '../lib/image.js'
import { flagPoints, spendPoints, maxPerStop } from '../lib/scoring.js'
import { IconNav, IconLock, IconCheck, IconCamera, IconReceipt, IconShare, Grille } from '../components/Icons.jsx'

export default function StopDetail() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const { stops, team, bonus, tryBonusCode, patchCheckin, upload, say } = useStore()
  const stop = stops.find((s) => s.id === id)
  const photoRef = useRef(null)
  const receiptRef = useRef(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [spend, setSpend] = useState(String(stop?.checkin?.spend ?? ''))
  const caption = useMemo(() => (stop ? buildCaption(stop, team, stops.length) : ''), [stop, team, stops.length])

  if (!stop) return null
  const c = stop.checkin || { flags: {}, spend: 0 }
  const earned = flagPoints(c.flags) + spendPoints(c.spend)

  const shoot = async (e, kind) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const img = await compress(file, kind === 'receipt' ? { max: 1100, quality: 0.72 } : {})
      const url = await upload(stop.id, kind, img)
      await patchCheckin(stop.id, kind === 'receipt' ? { receipt: url } : { photo: url })
      say(kind === 'receipt' ? 'Receipt saved' : 'Photo saved')
    } catch (err) { console.error(err); say('Photo did not save') }
    finally { setBusy(false) }
  }

  const toggle = (key) => patchCheckin(stop.id, { flags: { ...c.flags, [key]: !c.flags[key] } })

  const saveSpend = () => {
    const v = Math.max(0, Math.round(Number(spend) || 0))
    patchCheckin(stop.id, { spend: v })
    say(v ? `$${v} logged` : 'Spend cleared')
  }

  const share = async () => {
    const ok = await copyText(caption)
    say(ok ? 'Caption copied. Paste it in your post.' : 'Copy failed, select the text')
    if (!c.flags.posted) setTimeout(() => toggle('posted'), 400)
  }

  return (
    <Sheet onClose={() => nav(-1)} label={`Stop ${stop.order}`} footer={
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <a className="btn btn-ghost" href={mapsUrl(stop)} target="_blank" rel="noreferrer"><IconNav size={16} /> Navigate</a>
          <button className="btn btn-primary" disabled={busy} onClick={() => photoRef.current?.click()}>
            <IconCamera size={18} /> {c.photo ? 'Retake' : 'Photo'}
          </button>
        </div>
        <button className="btn btn-duck" onClick={share}><IconShare size={16} /> Copy caption and post</button>
      </>
    }>
      <input ref={photoRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => shoot(e, 'photo')} />
      <input ref={receiptRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => shoot(e, 'receipt')} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">{stop.isRally ? 'Rally point' : `Stop ${stop.order} of ${stops.length}`}</div>
          <h2 className="h1" style={{ fontSize: (stop.sponsor || stop.address).length > 26 ? 21 : 27, marginTop: 4, lineHeight: 1 }}>
            {stop.sponsor || stop.address}
          </h2>
          <div className="eyebrow" style={{ marginTop: 6 }}>{stop.address}</div>
          <div className="eyebrow">{stop.city}, {stop.state} {stop.zip}</div>
        </div>
        <div className="pts" style={{ textAlign: 'right' }}>{earned}<small>of {maxPerStop()}+</small></div>
      </div>

      <div style={{ margin: '16px 0' }}><Grille /></div>

      <div className="card" style={{ padding: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>The riddle</div>
        <p className="riddle" style={{ margin: 0 }}>{stop.riddle}</p>
      </div>

      {/* ---- bonus clue vault ---- */}
      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Bonus clue</div>
      <div className="vault">
        {!bonus ? (
          <div className="vault-locked">
            <IconLock size={26} />
            <div style={{ fontFamily: 'var(--font-cond)', fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Locked
            </div>
            <p style={{ color: 'var(--steel)', fontSize: 13.5, margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
              Donors at the bonus tier get a code at kickoff. One code unlocks every clue for the whole day.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, width: '100%', maxWidth: 280 }}>
              <input className="field" placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              <button className="btn btn-duck" style={{ width: 'auto', padding: '0 20px' }}
                onClick={async () => { const ok = await tryBonusCode(code); if (!ok) say('That code is not right') }}>
                Unlock
              </button>
            </div>
          </div>
        ) : stop.clue ? (
          <motion.div className="vault-art" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <img src={stop.clue} alt={`Bonus clue for stop ${stop.order}`} loading="lazy" />
          </motion.div>
        ) : (
          <div className="vault-locked">
            <div className="chip warn">Clue art pending</div>
            <p style={{ color: 'var(--steel)', fontSize: 13.5, margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
              This stop has no bonus image loaded yet. Drop it in public/clues and set the clue path on the stop.
            </p>
          </div>
        )}
      </div>

      {/* ---- proof ---- */}
      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Your proof</div>
      <div className="card" style={{ padding: 14 }}>
        {c.photo ? (
          <img src={c.photo} alt="Your find at this stop" style={{ width: '100%', borderRadius: 14 }} />
        ) : (
          <button className="empty" style={{ width: '100%' }} onClick={() => photoRef.current?.click()}>
            <IconCamera size={30} />
            <div style={{ fontFamily: 'var(--font-cond)', letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 13 }}>
              Tap to shoot the find
            </div>
            <div style={{ fontSize: 12.5 }}>Duck in frame or it does not count.</div>
          </button>
        )}
      </div>

      {/* ---- score checklist ---- */}
      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Points checklist</div>
      <div style={{ display: 'grid', gap: 7 }}>
        {SCORE_ITEMS.map((item) => {
          const on = Boolean(c.flags[item.key])
          return (
            <button key={item.key} onClick={() => toggle(item.key)}
              style={{
                display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 12, alignItems: 'center', textAlign: 'left',
                padding: '12px 14px', borderRadius: 14,
                background: on ? 'rgba(74,222,128,.12)' : 'rgba(244,240,228,.045)',
                border: `1px solid ${on ? 'rgba(74,222,128,.36)' : 'var(--line)'}`
              }}>
              <span style={{
                width: 24, height: 24, borderRadius: 8, display: 'grid', placeItems: 'center',
                background: on ? 'var(--ok)' : 'transparent', color: '#07270F',
                border: on ? 'none' : '1px solid var(--line-2)'
              }}>{on && <IconCheck size={14} />}</span>
              <span>
                <span style={{ fontFamily: 'var(--font-cond)', fontWeight: 600, fontSize: 15.5, letterSpacing: '.02em', display: 'block' }}>{item.label}</span>
                <span style={{ fontSize: 12.5, color: 'var(--steel)' }}>{item.hint}</span>
              </span>
              <span className="lb-pts" style={{ fontSize: 16 }}>+{EVENT.scoring[item.key]}</span>
            </button>
          )
        })}
      </div>

      {/* ---- spend ---- */}
      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Money spent here</div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ color: 'var(--steel)', fontSize: 13.5, margin: '0 0 12px', lineHeight: 1.5 }}>
          Every dollar you spend at this stop is a point. Snap the receipt so the closing ceremony check takes seconds.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <input className="field" inputMode="decimal" placeholder="0" value={spend}
            onChange={(e) => setSpend(e.target.value.replace(/[^\d.]/g, ''))} onBlur={saveSpend} />
          <button className="btn btn-ghost" style={{ width: 'auto', padding: '0 18px' }} onClick={() => receiptRef.current?.click()}>
            <IconReceipt size={16} /> Receipt
          </button>
        </div>
        {c.receipt && <img src={c.receipt} alt="Receipt" style={{ width: '100%', borderRadius: 12, marginTop: 12, maxHeight: 190, objectFit: 'cover' }} />}
        {Number(c.spend) > 0 && <div className="chip ok" style={{ marginTop: 12 }}>+{spendPoints(c.spend)} points from ${c.spend}</div>}
      </div>

      {/* ---- caption ---- */}
      <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Your caption, already written</div>
      <div className="card" style={{ padding: 16 }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'rgba(244,240,228,.92)' }}>{caption}</pre>
        {!stop.igHandle && (
          <div className="chip warn" style={{ marginTop: 12 }}>Add this stop’s handle so the tag is exact</div>
        )}
      </div>
      <div style={{ height: 10 }} />
      {sp.get('log') && <span className="sr">Logging mode</span>}
    </Sheet>
  )
}
