import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { EVENT } from '../data/event.js'

/* Leaflet with custom teardrop pins. Dark basemap so the PAL green and
   the duck yellow read as the brand, not the map. */
export default function MapView({ stops, onPick, onMapTap, activeId }) {
  const el = useRef(null)
  const [tilesBlocked, setTilesBlocked] = useState(false)
  const map = useRef(null)
  const layer = useRef(null)
  const tapRef = useRef(onMapTap)
  tapRef.current = onMapTap

  useEffect(() => {
    if (map.current || !el.current) return
    const m = L.map(el.current, { zoomControl: false, attributionControl: true, tap: true })
      .setView(EVENT.mapCenter, EVENT.mapZoom)
    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(m)
    // A shared preview link blocks outside images, so streets will not
    // draw there. Say so rather than letting it look broken.
    let misses = 0
    tiles.on('tileerror', () => { if (++misses > 2) setTilesBlocked(true) })
    tiles.on('tileload', () => setTilesBlocked(false))
    m.on('click', (e) => tapRef.current?.(e.latlng.lat, e.latlng.lng))
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    setTimeout(() => m.invalidateSize(), 60)
    return () => { m.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const m = map.current, lg = layer.current
    if (!m || !lg) return
    lg.clearLayers()
    const placed = stops.filter((s) => s.lat != null && s.lng != null)

    // Suggested route drawn in stop order. It also means the map still
    // reads as a trail if the tile server is slow or unreachable.
    if (placed.length > 1) {
      const path = [...placed].sort((a, b) => a.order - b.order).map((s) => [s.lat, s.lng])
      L.polyline(path, { color: '#E2571F', weight: 3, opacity: 0.5, dashArray: '9 9' }).addTo(lg)
    }

    placed.forEach((s) => {
      const state = s.checkin?.photo ? 'done' : s.isRally ? 'rally' : ''
      const icon = L.divIcon({
        className: '',
        html: `<div class="pin ${state}${activeId === s.id ? ' active' : ''}"><span>${s.order}</span></div>`,
        iconSize: [38, 38], iconAnchor: [19, 36]
      })
      L.marker([s.lat, s.lng], { icon, title: `Stop ${s.order}` }).addTo(lg).on('click', () => onPick?.(s))
    })
    if (placed.length) {
      m.fitBounds(L.latLngBounds(placed.map((s) => [s.lat, s.lng])).pad(0.22), { animate: false })
    }
  }, [stops, activeId, onPick])

  return (
    <>
      <div ref={el} className="mapwrap" role="application" aria-label="Riddle Run trail map" />
      {tilesBlocked && <div className="map-note">Street map loads on the live site</div>}
    </>
  )
}
