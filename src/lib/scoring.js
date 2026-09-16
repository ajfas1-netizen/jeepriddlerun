import { EVENT } from '../data/event.js'

export const flagPoints = (flags = {}) =>
  Object.entries(EVENT.scoring).reduce((sum, [k, v]) => sum + (flags[k] ? v : 0), 0)

export const spendPoints = (spend = 0) => Math.round((Number(spend) || 0) * EVENT.spendPointsPerDollar)

export const maxPerStop = () => Object.values(EVENT.scoring).reduce((s, v) => s + v, 0)

/* Two points a dollar, no ceiling. */
export const donatePoints = (donation = 0) =>
  Math.round((Number(donation) || 0) * EVENT.donatePointsPerDollar)

export function tallyTeam(checkins = {}, donation = 0) {
  const rows = Object.values(checkins)
  const tags = rows.reduce((s, c) => s + flagPoints(c.flags), 0)
  const stops = rows.filter((c) => c.photo).length
  const spend = rows.reduce((s, c) => s + (Number(c.spend) || 0), 0)
  const money = spendPoints(spend)
  const given = donatePoints(donation)
  return {
    stops, spend, tags, money,
    donation: Number(donation) || 0, given,
    total: tags + money + given
  }
}
