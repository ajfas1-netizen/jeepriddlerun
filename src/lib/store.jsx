import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { provider, IS_LIVE } from './providers.js'
import { STOPS } from '../data/stops.js'
import { EVENT } from '../data/event.js'
import { tallyTeam } from './scoring.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [team, setTeam] = useState(null)
  const [checkins, setCheckins] = useState({})
  const [bonus, setBonus] = useState(false)
  const [pins, setPins] = useState({})
  const [board, setBoard] = useState([])
  const [toast, setToast] = useState(null)
  const [pending, setPending] = useState(0)

  const say = useCallback((msg) => {
    setToast(msg)
    if (navigator.vibrate) { try { navigator.vibrate(12) } catch {} }
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200)
  }, [])

  useEffect(() => {
    (async () => {
      const t = await provider.getTeam().catch(() => null)
      setTeam(t)
      if (t) {
        const rows = await provider.getCheckins().catch(() => ({}))
        setCheckins(rows)
        setPending(Object.values(rows).filter((r) => r && r.synced === false).length)
      }
      setBonus(await provider.getBonus().catch(() => false))
      setPins(await provider.getPins().catch(() => ({})))
      setReady(true)
    })()
  }, [])

  const refreshBoard = useCallback(async () => {
    const rows = await provider.getLeaderboard(team, checkins).catch(() => [])
    setBoard(rows)
  }, [team, checkins])

  useEffect(() => { if (ready) refreshBoard() }, [ready, refreshBoard])
  useEffect(() => provider.subscribe?.(() => refreshBoard()), [refreshBoard])

  const join = useCallback(async (payload) => {
    const t = await provider.joinTeam(payload)
    setTeam(t); setCheckins({})
    say(`${t.name} is rolling`)
    return t
  }, [say])

  const leave = useCallback(async () => {
    await provider.leaveTeam(); setTeam(null); setCheckins({}); setBonus(false)
  }, [])

  /* Count the stops the phone has but the leaderboard does not. */
  const countPending = useCallback((rows) =>
    Object.values(rows || {}).filter((r) => r && r.synced === false).length, [])

  const patchCheckin = useCallback(async (stopId, patch) => {
    const next = await provider.saveCheckin(stopId, patch)
    setCheckins({ ...next })
    setPending(countPending(next))
    return next
  }, [countPending])

  /* Four hours around Martin County is not four hours of signal. Anything
     that did not land gets pushed again the moment the phone comes back,
     or the moment someone returns to the app from Instagram. */
  const flush = useCallback(async () => {
    const res = await provider.flush().catch(() => null)
    if (!res) return
    const rows = await provider.getCheckins().catch(() => null)
    if (rows) { setCheckins({ ...rows }); setPending(countPending(rows)) }
    else setPending(res.pending || 0)
  }, [countPending])

  useEffect(() => {
    if (!ready || !team) return
    const wake = () => { if (document.visibilityState === 'visible') flush() }
    window.addEventListener('online', flush)
    document.addEventListener('visibilitychange', wake)
    flush()
    return () => {
      window.removeEventListener('online', flush)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [ready, team, flush])

  const upload = useCallback((stopId, kind, img) => provider.uploadPhoto(stopId, kind, img), [])

  const pledge = useCallback(async (amount) => {
    const next = await provider.setDonation(amount)
    setTeam({ ...next })
    say(Number(amount) > 0 ? `Pledged $${Math.round(Number(amount))} to PAL` : 'Pledge cleared')
    return next
  }, [say])

  const tryBonusCode = useCallback(async (input) => {
    const ok = String(input || '').trim().toUpperCase() === EVENT.bonusCode.toUpperCase()
    if (ok) { await provider.setBonus(true); setBonus(true); say('Bonus clues unlocked') }
    return ok
  }, [say])

  const dropPin = useCallback(async (stopId, lat, lng) => {
    const next = await provider.setPin(stopId, lat, lng)
    setPins({ ...next }); say('Pin saved')
  }, [say])

  const stops = useMemo(
    () => STOPS.map((s) => {
      const p = pins[s.id]
      return { ...s, lat: p?.lat ?? s.lat, lng: p?.lng ?? s.lng, checkin: checkins[s.id] || null }
    }),
    [pins, checkins]
  )

  const totals = useMemo(() => tallyTeam(checkins, team?.donation), [checkins, team])
  const nextStop = useMemo(() => stops.find((s) => !s.checkin?.photo) || null, [stops])

  const value = {
    ready, live: IS_LIVE, team, checkins, bonus, pins, board, stops, totals, nextStop, toast, pending,
    join, leave, patchCheckin, upload, tryBonusCode, dropPin, refreshBoard, say, flush, pledge
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
