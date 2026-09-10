import { EVENT } from '../data/event.js'

export const flagPoints = (flags = {}) =>
  Object.entries(EVENT.scoring).reduce((sum, [k, v]) => sum + (flags[k] ? v : 0), 0)

export const spendPoints = (spend = 0) => Math.round((Number(spend) || 0) * EVENT.spendPointsPerDollar)

export const maxPerStop = () => Object.values(EVENT.scoring).reduce((s, v) => s + v, 0)

export function tallyTeam(checkins = {}) {
  const rows = Object.values(checkins)
  const tags = rows.reduce((s, c) => s + flagPoints(c.flags), 0)
  const money = rows.reduce((s, c) => s + spendPoints(c.spend), 0)
  const stops = rows.filter((c) => c.photo).length
  const spend = rows.reduce((s, c) => s + (Number(c.spend) || 0), 0)
  return { stops, spend, tags, money, total: tags + money }
}
