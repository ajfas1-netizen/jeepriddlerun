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

  const say = useCallback((msg) => {
    setToast(msg)
    if (navigator.vibrate) { try { navigator.vibrate(12) } catch {} }
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200)
  }, [])

  useEffect(() => {
    (async () => {
      const t = await provider.getTeam().catch(() => null)
      setTeam(t)
      if (t) setCheckins(await provider.getCheckins().catch(() => ({})))
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

  const patchCheckin = useCallback(async (stopId, patch) => {
    const next = await provider.saveCheckin(stopId, patch)
    setCheckins({ ...next })
    return next
  }, [])

  const upload = useCallback((stopId, kind, img) => provider.uploadPhoto(stopId, kind, img), [])

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

  const totals = useMemo(() => tallyTeam(checkins), [checkins])
  const nextStop = useMemo(() => stops.find((s) => !s.checkin?.photo) || null, [stops])

  const value = {
    ready, live: IS_LIVE, team, checkins, bonus, pins, board, stops, totals, nextStop, toast,
    join, leave, patchCheckin, upload, tryBonusCode, dropPin, refreshBoard, say
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
