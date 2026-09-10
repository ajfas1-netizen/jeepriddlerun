import React, { useRef, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { StoreProvider, useStore } from './lib/store.jsx'
import { TopBar, TabBar, Toast } from './components/Chrome.jsx'
import Join from './routes/Join.jsx'
import Stops from './routes/Stops.jsx'
import Rank from './routes/Rank.jsx'
import Crew from './routes/Crew.jsx'
import StopDetail from './routes/StopDetail.jsx'

/* Split the heavy screens out of the first paint. Leaflet only loads
   when the trail map is opened, and the desktop results console never
   ships to a participant's phone at all. */
const Trail = lazy(() => import('./routes/Trail.jsx'))
const Admin = lazy(() => import('./routes/Admin.jsx'))
const Results = lazy(() => import('./routes/Results.jsx'))

const Loading = ({ label = 'Loading…' }) => <div className="empty" style={{ margin: 'auto' }}>{label}</div>
import './styles/app.css'

const ORDER = ['/trail', '/stops', '/rank', '/crew']
const isSheetPath = (p) => p.startsWith('/stop/') || p === '/admin'

function Slide({ children, dir }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, x: dir * 26 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir * -26 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
    >
      {children}
    </motion.div>
  )
}

function Inner() {
  const { ready, team, live } = useStore()
  const location = useLocation()

  if (location.pathname === '/results') {
    return <Suspense fallback={<div className="rc"><div className="rc-inner"><Loading label="Loading results…" /></div></div>}><Results /></Suspense>
  }
  const sheet = isSheetPath(location.pathname)
  const baseRef = useRef(location)
  const prevIdx = useRef(0)
  if (!sheet) baseRef.current = location
  const base = baseRef.current

  const dir = useMemo(() => {
    const i = ORDER.indexOf(base.pathname)
    const d = i > prevIdx.current ? 1 : -1
    if (i >= 0) prevIdx.current = i
    return d
  }, [base.pathname])

  if (!ready) {
    return <div className="shell"><div className="empty" style={{ margin: 'auto' }}>Loading the trail…</div></div>
  }

  if (!team) {
    return (
      <div className="shell">
        {!live && <div className="demo-flag">Demo mode · data stays on this phone</div>}
        <div className="stage"><Join /></div>
      </div>
    )
  }

  return (
    <div className="shell">
      {!live && <div className="demo-flag">Demo mode · data stays on this phone</div>}
      <TopBar />
      <div className="stage">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={base} key={base.pathname}>
            <Route path="/" element={<Navigate to="/trail" replace />} />
            <Route path="/trail" element={<Slide dir={dir}><Suspense fallback={<Loading label="Loading map…" />}><Trail /></Suspense></Slide>} />
            <Route path="/stops" element={<Slide dir={dir}><Stops /></Slide>} />
            <Route path="/rank" element={<Slide dir={dir}><Rank /></Slide>} />
            <Route path="/crew" element={<Slide dir={dir}><Crew /></Slide>} />
            <Route path="*" element={<Navigate to="/trail" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      <TabBar />
      <AnimatePresence>
        {sheet && (
          <Routes location={location} key="sheet">
            <Route path="/stop/:id" element={<StopDetail />} />
            <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          </Routes>
        )}
      </AnimatePresence>
      <AnimatePresence><Toast /></AnimatePresence>
      <div className="desk-hint">Built for phones · results console at /#/results</div>
    </div>
  )
}

export default function App() {
  return <StoreProvider><Inner /></StoreProvider>
}
