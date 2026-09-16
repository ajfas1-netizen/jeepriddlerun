import React, { useRef, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { StoreProvider, useStore } from './lib/store.jsx'
import { TopBar, TabBar, Toast } from './components/Chrome.jsx'
import Join from './routes/Join.jsx'
import StartLine from './routes/StartLine.jsx'
import Stops from './routes/Stops.jsx'
import Rank from './routes/Rank.jsx'
import Crew from './routes/Crew.jsx'
import StopDetail from './routes/StopDetail.jsx'

/* A phone that loaded the app before a deploy is holding an index.html
   that names the old chunk files. Those files are gone the moment the
   new build lands, so the next lazy screen it opens dies with "failed
   to fetch dynamically imported module" and shows a black page. One
   reload picks up the current index. The sessionStorage flag means a
   chunk that is genuinely broken surfaces as an error instead of
   looping the phone forever. */
const chunk = (load) => lazy(() => load().then((mod) => {
  sessionStorage.removeItem('jrr.chunkReload')
  return mod
}).catch((err) => {
  if (sessionStorage.getItem('jrr.chunkReload')) throw err
  sessionStorage.setItem('jrr.chunkReload', '1')
  window.location.reload()
  return new Promise(() => {})   // hold the render until the reload takes over
}))

/* Split the heavy screens out of the first paint. Leaflet only loads
   when the trail map is opened, and the desktop results console never
   ships to a participant's phone at all. */
const Trail = chunk(() => import('./routes/Trail.jsx'))
const Admin = chunk(() => import('./routes/Admin.jsx'))
const Results = chunk(() => import('./routes/Results.jsx'))

const Loading = ({ label = 'Loading…' }) => <div className="empty" style={{ margin: 'auto' }}>{label}</div>
import './styles/app.css'

const ORDER = ['/stops', '/trail', '/rank', '/crew']
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

/* Shown once per rig, between naming it and the first stop. Keyed by team
   id so rejoining on a second phone does not nag the same rig twice, and
   wrapped because storage throws in private windows. */
const askedKey = (id) => `jrr.asked.${id}`
const wasAsked = (id) => { try { return Boolean(localStorage.getItem(askedKey(id))) } catch { return true } }
const markAsked = (id) => { try { localStorage.setItem(askedKey(id), '1') } catch {} }

function Inner() {
  const { ready, team, live } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [asked, setAsked] = React.useState(false)

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

  if (!asked && !wasAsked(team.id)) {
    return (
      <div className="shell">
        {!live && <div className="demo-flag">Demo mode · data stays on this phone</div>}
        <div className="stage">
          {/* Always land on the stops. Without the navigate the app drops
              you back on whatever hash was open before the rig existed,
              which is rarely the stops and never what the button said. */}
          <StartLine onDone={() => { markAsked(team.id); setAsked(true); navigate('/stops', { replace: true }) }} />
        </div>
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
            <Route path="/" element={<Navigate to="/stops" replace />} />
            <Route path="/trail" element={<Slide dir={dir}><Suspense fallback={<Loading label="Loading map…" />}><Trail /></Suspense></Slide>} />
            <Route path="/stops" element={<Slide dir={dir}><Stops /></Slide>} />
            <Route path="/rank" element={<Slide dir={dir}><Rank /></Slide>} />
            <Route path="/crew" element={<Slide dir={dir}><Crew /></Slide>} />
            <Route path="*" element={<Navigate to="/stops" replace />} />
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
