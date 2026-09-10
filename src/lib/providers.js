import { createClient } from '@supabase/supabase-js'
import { tallyTeam } from './scoring.js'

const URL = import.meta.env.VITE_SUPABASE_URL || ''
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const IS_LIVE = Boolean(URL && KEY)

const LS = {
  team: 'jrr.team',
  checkins: 'jrr.checkins',
  bonus: 'jrr.bonus',
  pins: 'jrr.pins',
  demo: 'jrr.demoTeams'
}
const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
const code = () => Math.random().toString(36).slice(2, 7).toUpperCase()

/* ---------------------------------------------------------------- demo */
const DEMO_TEAMS = [
  { id: 'd1', name: 'Palm City Pirates', duckId: 'camo', stops: 9, spend: 142, tags: 156 },
  { id: 'd2', name: 'Duck Duck Boom', duckId: 'rubicon', stops: 11, spend: 96, tags: 189 },
  { id: 'd3', name: 'Trail Mix', duckId: 'sarge', stops: 7, spend: 210, tags: 120 },
  { id: 'd4', name: 'Rubber Ducky Rubicon', duckId: 'classic', stops: 12, spend: 64, tags: 198 },
  { id: 'd5', name: 'Hobe Sound Hooligans', duckId: 'hydro', stops: 6, spend: 175, tags: 102 }
]

const localProvider = {
  live: false,
  async getTeam() { return read(LS.team, null) },
  async joinTeam({ name, duckId, rigId }) {
    const team = { id: 'local-' + code(), name, duckId, rigId, code: code(), createdAt: Date.now() }
    write(LS.team, team)
    return team
  },
  async leaveTeam() { [LS.team, LS.checkins, LS.bonus].forEach((k) => localStorage.removeItem(k)) },
  async getCheckins() { return read(LS.checkins, {}) },
  async saveCheckin(stopId, patch) {
    const all = read(LS.checkins, {})
    all[stopId] = { ...(all[stopId] || { flags: {}, spend: 0 }), ...patch, at: Date.now() }
    write(LS.checkins, all)
    return all
  },
  async uploadPhoto(_stopId, _kind, { dataUrl }) { return dataUrl },
  async getBonus() { return read(LS.bonus, false) },
  async setBonus(v) { write(LS.bonus, v); return v },
  async getPins() { return read(LS.pins, {}) },
  async setPin(stopId, lat, lng) { const p = read(LS.pins, {}); p[stopId] = { lat, lng }; write(LS.pins, p); return p },
  async getAllCheckins() {
    const t = read(LS.team, null)
    const mine = Object.entries(read(LS.checkins, {})).map(([stop_id, c]) => ({
      stop_id, team: t?.name || 'You', duck_id: t?.duckId, flags: c.flags, spend: c.spend,
      photo_url: c.photo, receipt_url: c.receipt, created_at: c.at
    }))
    return mine
  },
  async getLeaderboard(me, checkins) {
    const mine = me ? [{ id: me.id, name: me.name, duckId: me.duckId, ...tallyTeam(checkins) }] : []
    const demo = read(LS.demo, DEMO_TEAMS).map((t) => ({ ...t, money: t.spend, total: t.tags + t.spend }))
    return [...mine, ...demo].sort((a, b) => b.total - a.total)
  },
  subscribe() { return () => {} }
}

/* ------------------------------------------------------------- supabase */
const sb = IS_LIVE ? createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true } }) : null

/* Anonymous auth gives every phone a stable uid with no sign-up screen.
   RLS then scopes writes to the rig that owns the row, which is what
   stops a bored teenager from editing another team's score. Enable it in
   Supabase under Authentication > Sign In / Providers > Anonymous. */
let authReady = null
export function ensureAuth() {
  if (!sb) return Promise.resolve(null)
  if (!authReady) {
    authReady = sb.auth.getSession().then(({ data }) =>
      data?.session ? data.session : sb.auth.signInAnonymously().then(({ data: d, error }) => {
        if (error) console.warn('Anonymous auth is off; falling back to open policies.', error.message)
        return d?.session || null
      })
    )
  }
  return authReady
}

const supaProvider = {
  live: true,
  async getTeam() {
    await ensureAuth()
    const t = read(LS.team, null)
    if (!t) return null
    const { data } = await sb.from('teams').select('*').eq('id', t.id).maybeSingle()
    if (!data) { localStorage.removeItem(LS.team); return null }
    const merged = { ...t, ...data, duckId: data.duck_id, rigId: data.rig_id }
    write(LS.team, merged)
    return merged
  },
  async joinTeam({ name, duckId, rigId }) {
    const session = await ensureAuth()
    const join = code()
    const { data, error } = await sb.from('teams')
      .insert({ name, duck_id: duckId, rig_id: rigId, join_code: join, owner_id: session?.user?.id ?? null })
      .select().single()
    if (error) throw error
    const team = { id: data.id, name: data.name, duckId, rigId, code: data.join_code, createdAt: Date.now() }
    write(LS.team, team)
    return team
  },
  async joinByCode(joinCode) {
    const { data, error } = await sb.from('teams').select('*').eq('join_code', joinCode.toUpperCase()).maybeSingle()
    if (error || !data) throw new Error('That team code did not match anything.')
    const team = { id: data.id, name: data.name, duckId: data.duck_id, rigId: data.rig_id, code: data.join_code }
    write(LS.team, team)
    return team
  },
  async leaveTeam() { [LS.team, LS.checkins, LS.bonus].forEach((k) => localStorage.removeItem(k)) },
  async getCheckins() {
    const t = read(LS.team, null); if (!t) return {}
    const { data } = await sb.from('checkins').select('*').eq('team_id', t.id)
    const out = {}
    ;(data || []).forEach((r) => {
      out[r.stop_id] = { flags: r.flags || {}, spend: r.spend || 0, photo: r.photo_url, receipt: r.receipt_url, at: r.created_at }
    })
    write(LS.checkins, out)
    return out
  },
  async saveCheckin(stopId, patch) {
    const t = read(LS.team, null); if (!t) throw new Error('No team')
    const all = read(LS.checkins, {})
    all[stopId] = { ...(all[stopId] || { flags: {}, spend: 0 }), ...patch, at: Date.now() }
    write(LS.checkins, all)
    const row = all[stopId]
    await sb.from('checkins').upsert(
      { team_id: t.id, stop_id: stopId, flags: row.flags, spend: row.spend, photo_url: row.photo || null, receipt_url: row.receipt || null },
      { onConflict: 'team_id,stop_id' }
    )
    return all
  },
  async uploadPhoto(stopId, kind, { blob }) {
    const t = read(LS.team, null); if (!t) throw new Error('No team')
    const path = `${t.id}/${stopId}-${kind}-${Date.now()}.jpg`
    const bucket = kind === 'receipt' ? 'receipts' : 'photos'
    const { error } = await sb.storage.from(bucket).upload(path, blob, { contentType: 'image/jpeg', upsert: true })
    if (error) throw error
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl
  },
  async getBonus() { return read(LS.bonus, false) },
  async setBonus(v) { write(LS.bonus, v); return v },
  async getPins() {
    const { data } = await sb.from('stop_pins').select('*')
    const out = {}
    ;(data || []).forEach((r) => { out[r.stop_id] = { lat: r.lat, lng: r.lng } })
    write(LS.pins, out)
    return out
  },
  async setPin(stopId, lat, lng) {
    await sb.from('stop_pins').upsert({ stop_id: stopId, lat, lng }, { onConflict: 'stop_id' })
    return this.getPins()
  },
  async getAllCheckins() {
    const { data } = await sb.from('submissions').select('*').order('created_at', { ascending: false })
    return data || []
  },
  async getLeaderboard() {
    const { data } = await sb.from('leaderboard').select('*')
    return (data || []).map((r) => ({
      id: r.team_id, name: r.name, duckId: r.duck_id, stops: r.stops,
      spend: r.spend, tags: r.tag_points, money: r.spend_points, total: r.total_points
    })).sort((a, b) => b.total - a.total)
  },
  subscribe(cb) {
    const ch = sb.channel('rr')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, cb)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, cb)
      .subscribe()
    return () => sb.removeChannel(ch)
  }
}

export const provider = IS_LIVE ? supaProvider : localProvider
export const supabase = sb
