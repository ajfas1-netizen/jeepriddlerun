import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store.jsx'
import { EVENT } from '../data/event.js'
import { STOPS } from '../data/stops.js'
import { Grille } from '../components/Icons.jsx'

/* The one moment between naming your rig and driving the first stop.
   The rig already exists, so this is not a form standing between someone
   and the thing they came for. It is the only place all day where we get
   to say what the money is actually for, and it has exactly one ask.

   No QR here. This is already a phone; there is nothing to scan it with.
   The link opens Givebutter in their browser. */
export default function StartLine({ onDone }) {
  const { team, pledge, say } = useStore()
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const typed = Math.max(0, Math.round(Number(amount) || 0))

  const commit = async (then) => {
    setBusy(true)
    try {
      if (typed > 0) await pledge(typed)
      if (then === 'give') window.open(EVENT.donateUrl, '_blank', 'noopener')
      onDone()
    } catch (e) {
      say('Could not save the pledge')
      console.error(e)
      setBusy(false)
    }
  }

  return (
    <motion.div
      className="page sl"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
    >
      <div className="page-body pad sl-body">
        <div className="sl-top">
          <div className="eyebrow">{team?.name} is in</div>
          <Grille />
        </div>

        <div className="sl-num">{EVENT.youthServedHero}</div>
        <h1 className="sl-head">kids in Martin County this year</h1>

        <p className="sl-lede">
          It costs {EVENT.org} about <b>{EVENT.costPerChild} a year</b> to serve one of them.
        </p>
        {/* These two are not the same pot of money and it matters that
            nobody thinks they are. */}
        <p className="sl-lede sl-split">
          What you spend at the {STOPS.length} stops today supports the local businesses that
          backed this run. <b>What you pledge here comes straight to PAL.</b>
        </p>
        <p className="sl-lede sl-mission">
          This is the community backing us in developing healthy, productive leaders of the
          future in Martin County.
        </p>

        <div className="tread" />

        <div className="eyebrow sl-ask">Before you roll</div>
        <h2 className="sl-sub">Pledge to PAL and take 2 points for every dollar</h2>
        <p className="sl-fine">No ceiling on it. A pledge of $100 is 200 points on the board.</p>

        <div className="pledge-chips">
          {[25, 50, 100, 250].map((v) => (
            <button key={v} className="chip pledge-chip" data-on={typed === v}
              onClick={() => setAmount(String(v))}>${v}</button>
          ))}
        </div>
        <div className="pledge-row">
          <span className="pledge-dollar">$</span>
          <input className="field pledge-field" inputMode="decimal" placeholder="0"
            value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
        </div>
        {typed > 0 && (
          <div className="chip ok pledge-points">
            +{typed * EVENT.donatePointsPerDollar} points for {team?.name}
          </div>
        )}

        <div className="sl-actions">
          {typed <= 0 && <p className="sl-hint">Pick an amount above to continue.</p>}
          <button className="btn btn-primary" disabled={busy || typed <= 0}
            onClick={() => commit('give')}>
            {typed > 0 ? `Give $${typed} now` : 'Give now'}
            <small>Opens the PAL giving page</small>
          </button>
          <button className="btn btn-outline" disabled={busy || typed <= 0}
            onClick={() => commit('later')}>
            {typed > 0 ? `Pledge $${typed}, pay at the finish` : 'Pledge, pay at the finish'}
            <small>Points count now, cash or check later</small>
          </button>
          <button className="pledge-skip" disabled={busy} onClick={onDone}>
            Straight to the {STOPS.length} stops
          </button>
        </div>

        <p className="sl-foot">
          Cash and checks are welcome at the finish, and you can pledge or raise it any time
          from the Crew tab.
        </p>
        <p className="sl-foot sl-when">{EVENT.finishTimeLabel}</p>
        <p className="sl-foot">{EVENT.paceNote}</p>
      </div>
    </motion.div>
  )
}
