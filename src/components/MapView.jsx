import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { EVENT } from '../data/event.js'

/* Leaflet with custom teardrop pins. Dark basemap so the PAL green and
   the duck yellow read as the brand, not the map. */
export default function MapView({ stops, onPick, onMapTap, activeId }) {
  const el = useRef(null)
  const map = useRef(null)
  const layer = useRef(null)
  const tapRef = useRef(onMapTap)
  tapRef.current = onMapTap

  useEffect(() => {
    if (map.current || !el.current) return
    const m = L.map(el.current, { zoomControl: false, attributionControl: true, tap: true })
      .setView(EVENT.mapCenter, EVENT.mapZoom)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(m)
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

  return <div ref={el} className="mapwrap" role="application" aria-label="Riddle Run trail map" />
}
