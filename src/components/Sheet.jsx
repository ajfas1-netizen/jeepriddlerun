import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

/* Full-screen bottom sheet with drag-to-dismiss. Used for stop detail
   so a stop never becomes a separate long-scroll page. */
export default function Sheet({ onClose, children, footer, label }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <motion.div
        className="scrim" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
      />
      <motion.section
        className="sheet" role="dialog" aria-modal="true" aria-label={label}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 36, mass: 0.9 }}
        drag="y" dragDirectionLock dragElastic={0.06} dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_e, info) => { if (info.offset.y > 130 || info.velocity.y > 750) onClose() }}
        style={{ height: '94dvh' }}
      >
        <div className="grab" />
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </motion.section>
    </>
  )
}
