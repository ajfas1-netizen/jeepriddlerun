import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sheet from '../components/Sheet.jsx'
import { useStore } from '../lib/store.jsx'
import { EVENT } from '../data/event.js'
import { buildCaption, copyText, mapsUrl } from '../lib/caption.js'
import { compress } from '../lib/image.js'
import { flagPoints, spendPoints, maxPerStop } from '../lib/scoring.js'
import { rememberBlob, getBlob, sharePhoto, saveToDisk, isIOS } from '../lib/share.js'
import { IconNav, IconLock, IconCheck, IconCamera, IconReceipt, IconShare, Grille, Duck } from '../components/Icons.jsx'

/* The screen has two moods. Before the find it is a riddle and a clue
   and one big button. After the find it is a short numbered checklist.
   Mixing the two was the problem: it put a camera, a spend box and six
   checkboxes in front of someone who had not found the thing yet. */

const Step = ({ n, title, done, children }) => (
  <div className="step">
    <div className={`step-n${done ? ' on' : ''}`}>{done ? <IconCheck size={16} /> : n}</div>
    <div style={{ minWidth: 0 }}>
      <div className="step-t">{title}</div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  </div>
)

export default function StopDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { stops, team, bonus, tryBonusCode, patchCheckin, upload, say } = useStore()
  const stop = stops.find((s) => s.id === id)

  const photoRef = useRef(null)
  const libraryRef = useRef(null)
  const receiptRef = useRef(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState('hunt')
  const [spend, setSpend] = useState(String(stop?.checkin?.spend ?? ''))
  const [saveHint, setSaveHint] = useState(false)
  const [saved, setSaved] = useState(false)

  const c = stop?.checkin || { flags: {}, spend: 0 }
  useEffect(() => { if (c.photo) setPhase('log') }, [c.photo])

  const caption = useMemo(() => (stop ? buildCaption(stop, team, stops.length) : ''), [stop, team, stops.length])
  if (!stop) return null

  const earned = flagPoints(c.flags) + spendPoints(c.spend)
  const filename = `riddle-run-stop-${String(stop.order).padStart(2, '0')}.jpg`
  const posted = Boolean(c.flags.posted)

  const shoot = async (e, kind) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const img = await compress(file, kind === 'receipt' ? { max: 1100, quality: 0.72 } : {})
      if (kind === 'photo') { rememberBlob(stop.id, img.blob); setSaved(false) }
      const url = await upload(stop.id, kind, img)
      if (kind === 'receipt') await patchCheckin(stop.id, { receipt: url, flags: { ...c.flags, receipt: true } })
      else await patchCheckin(stop.id, { photo: url })
      say(kind === 'receipt' ? 'Receipt saved' : 'Nice find')
    } catch (err) { console.error(err); say('That photo did not save') }
    finally { setBusy(false) }
  }

  const setFlags = (patch) => patchCheckin(stop.id, { flags: { ...c.flags, ...patch } })

  const saveAndPost = async () => {
    const blob = await getBlob(stop.id, c.photo)
    if (!blob) { say('Shoot the find first'); return }
    const ok = await copyText(caption)
    const result = await sharePhoto({ blob, filename, text: caption })
    if (result === 'shared') { setSaved(true); say(ok ? 'Saved. Caption is copied.' : 'Saved.'); return }
    if (result === 'cancelled') return
    if (isIOS()) { setSaveHint(true); say('Press and hold the photo to save it') }
    else { saveToDisk(blob, filename); setSaved(true); say('Photo saved. Caption is copied.') }
  }

  const confirmPosted = () => {
    // One tap covers the four tag points, because they all live in the
    // caption the app wrote and they pasted.
    setFlags({ posted: true, tagLocation: true, tagPal: true, hashtag: true })
    say(`+${EVENT.scoring.posted + EVENT.scoring.tagLocation + EVENT.scoring.tagPal + EVENT.scoring.hashtag} points`)
  }

  const saveSpend = () => {
    const v = Math.max(0, Math.round(Number(spend) || 0))
    patchCheckin(stop.id, { spend: v })
    if (v) say(`$${v} logged, +${spendPoints(v)} points`)
  }

  const openApp = (url) => window.open(url, '_blank', 'noopener')

  return (
    <Sheet
      onClose={() => nav(-1)}
      label={`Stop ${stop.order}`}
      title={stop.isRally ? 'Rally point' : `Stop ${stop.order} of ${stops.length}`}
      footer={
        phase === 'hunt' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 8 }}>
            <a className="btn btn-ghost" href={mapsUrl(stop)} target="_blank" rel="noreferrer"><IconNav size={16} /> Navigate</a>
            <button className="btn btn-duck" onClick={() => { setPhase('log'); if (!c.photo) setTimeout(() => photoRef.current?.click(), 260) }}>
              Found it
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setPhase('hunt')}>Riddle</button>
            <button className="btn btn-primary" onClick={() => nav(-1)}>Done</button>
          </div>
        )
      }
    >
      <input ref={photoRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => shoot(e, 'photo')} />
      <input ref={libraryRef} type="file" accept="image/*" hidden onChange={(e) => shoot(e, 'photo')} />
      <input ref={receiptRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => shoot(e, 'receipt')} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h2 className="h1" style={{ fontSize: (stop.sponsor || stop.address).length > 26 ? 21 : 27, marginTop: 0, lineHeight: 1 }}>
            {stop.sponsor || stop.address}
          </h2>
          <div className="eyebrow" style={{ marginTop: 6 }}>{stop.address}</div>
          <div className="eyebrow">{stop.city}, {stop.state} {stop.zip}</div>
        </div>
        <div className="pts" style={{ textAlign: 'right', flex: 'none' }}>{earned}<small>of {maxPerStop()}</small></div>
      </div>

      <div style={{ margin: '16px 0' }}><Grille /></div>

      <AnimatePresence mode="wait">
        {phase === 'hunt' ? (
          <motion.div key="hunt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            <div className="card" style={{ padding: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Find this inside</div>
              <p className="riddle" style={{ margin: 0 }}>{stop.riddle}</p>
            </div>

            <div className="eyebrow" style={{ margin: '22px 0 8px' }}>Bonus clue</div>
            <div className="vault">
              {!bonus ? (
                <div className="vault-locked">
                  <IconLock size={26} />
                  <div style={{ fontFamily: 'var(--font-cond)', fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase' }}>Locked</div>
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
                <div className="vault-locked"><span className="chip warn">Clue art pending</span></div>
              )}
            </div>

            <button className="found" onClick={() => { setPhase('log'); if (!c.photo) setTimeout(() => photoRef.current?.click(), 260) }}>
              <Duck size={30} body="#221A08" bill="#6B5310" />
              <span>Found it</span>
              <small>Shoot it, save it, post it</small>
            </button>
          </motion.div>
        ) : (
          <motion.div key="log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>

            <Step n="1" title="Shoot it with your duck in frame" done={Boolean(c.photo)}>
              {c.photo ? (
                <>
                  <img src={c.photo} alt="Your find" style={{ width: '100%', borderRadius: 14 }} />
                  {saveHint && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.55, color: 'var(--duck)' }}>
                      Press and hold the photo, then Save Image. It lands in your camera roll.
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                    <button className="btn btn-ghost" disabled={busy} onClick={() => photoRef.current?.click()}>Retake</button>
                    <button className={`btn ${c.flags.duck ? 'btn-ghost' : 'btn-duck'}`} onClick={() => setFlags({ duck: !c.flags.duck })}>
                      {c.flags.duck ? 'Duck confirmed' : 'Duck is in it'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  <button className="btn btn-primary" disabled={busy} onClick={() => photoRef.current?.click()}>
                    <IconCamera size={18} /> Open the camera
                  </button>
                  <button className="btn btn-ghost" disabled={busy} onClick={() => libraryRef.current?.click()}>
                    Already shot it? Pick from your photos
                  </button>
                </div>
              )}
            </Step>

            <Step n="2" title="Save it and grab the caption" done={saved}>
              <p style={{ margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--steel)' }}>
                This saves the photo to your phone and copies the caption, tags and hashtag already written for you.
              </p>
              <button className="btn btn-duck" disabled={!c.photo} onClick={saveAndPost}>
                <IconShare size={16} /> Save photo and copy caption
              </button>
              <details style={{ marginTop: 10 }}>
                <summary className="eyebrow" style={{ cursor: 'pointer' }}>See the caption</summary>
                <pre style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(244,240,228,.9)' }}>{caption}</pre>
              </details>
            </Step>

            <Step n="3" title="Post it and paste the caption" done={posted}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button className="btn btn-ghost" disabled={!c.photo} onClick={() => openApp('https://www.instagram.com/')}>Instagram</button>
                <button className="btn btn-ghost" disabled={!c.photo} onClick={() => openApp('https://www.facebook.com/')}>Facebook</button>
              </div>
              <button className={`btn ${posted ? 'btn-ghost' : 'btn-primary'}`} style={{ marginTop: 8 }}
                onClick={confirmPosted} disabled={posted || !c.photo}>
                {posted ? `Posted, ${EVENT.scoring.posted + EVENT.scoring.tagLocation + EVENT.scoring.tagPal + EVENT.scoring.hashtag} points banked` : 'I posted it'}
              </button>
            </Step>

            <Step n="4" title="What did you spend here?" done={Number(c.spend) > 0}>
              <p style={{ margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--steel)' }}>
                Every dollar is a point. Snap the receipt so the closing ceremony check takes seconds.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input className="field" inputMode="decimal" placeholder="$0" value={spend}
                  onChange={(e) => setSpend(e.target.value.replace(/[^\d.]/g, ''))} onBlur={saveSpend} />
                <button className="btn btn-ghost" style={{ width: 'auto', padding: '0 18px' }} onClick={() => receiptRef.current?.click()}>
                  <IconReceipt size={16} /> Receipt
                </button>
              </div>
              {c.receipt && <img src={c.receipt} alt="Receipt" style={{ width: '100%', borderRadius: 12, marginTop: 10, maxHeight: 170, objectFit: 'cover' }} />}
            </Step>

            <div className="card" style={{ padding: 16, marginTop: 4 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Points at this stop</div>
              {[
                ['Duck in the photo', c.flags.duck, EVENT.scoring.duck],
                ['Posted with the tags', posted, EVENT.scoring.posted + EVENT.scoring.tagLocation + EVENT.scoring.tagPal + EVENT.scoring.hashtag],
                ['Proof of purchase', c.flags.receipt, EVENT.scoring.receipt],
                [`Spent $${Number(c.spend) || 0}`, Number(c.spend) > 0, spendPoints(c.spend)]
              ].map(([label, on, pts]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
                  <span style={{ fontSize: 14, color: on ? 'var(--bone)' : 'var(--steel)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: on ? 'var(--duck)' : 'var(--steel)' }}>
                    {on ? `+${pts}` : '0'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 8 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  )
}
