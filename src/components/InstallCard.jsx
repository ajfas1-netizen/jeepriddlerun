import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Add to Home Screen. Worth doing before anyone leaves the rally point:
   from the home screen the app opens full screen with no browser bar,
   and nobody has to find a link in a text message six stops later. */

const KEY = 'jrr.installDismissed'

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const IconShareIOS = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 15V3" /><path d="M8 7l4-4 4 4" />
    <path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12" />
  </svg>
)

const IconPlusBox = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M12 8v8M8 12h8" />
  </svg>
)

const IconDots = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="12" cy="19" r="1.9" />
  </svg>
)

export default function InstallCard({ compact = false }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  const [deferred, setDeferred] = useState(null)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setDeferred(e) }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || (dismissed && !compact)) return null

  const hide = () => {
    try { localStorage.setItem(KEY, '1') } catch {}
    setDismissed(true)
  }

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferred(null)
  }

  const steps = isIOS()
    ? [{ Icon: IconShareIOS, text: 'Tap the Share button at the bottom of Safari' },
       { Icon: IconPlusBox, text: 'Scroll down and tap Add to Home Screen' }]
    : [{ Icon: IconDots, text: 'Tap the menu button in your browser' },
       { Icon: IconPlusBox, text: 'Tap Add to Home screen, or Install app' }]

  return (
    <motion.div
      className="install"
      initial={compact ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="install-head">
        <img src="icon-192.png" alt="" width="42" height="42" className="install-icon" />
        <div style={{ minWidth: 0 }}>
          <div className="install-t">Put it on your home screen</div>
          <div className="install-s">Opens full screen, no browser bar, easy to find all day</div>
        </div>
      </div>

      {deferred ? (
        <button className="btn btn-duck" style={{ marginTop: 13 }} onClick={install}>Add to home screen</button>
      ) : (
        <ol className="install-steps">
          {steps.map(({ Icon, text }, i) => (
            <li key={i}><span className="install-chip"><Icon /></span>{text}</li>
          ))}
        </ol>
      )}

      {!compact && (
        <button className="install-skip" onClick={hide}>Not now</button>
      )}
    </motion.div>
  )
}
