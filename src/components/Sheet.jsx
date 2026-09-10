import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconBack } from './Icons.jsx'

/* Full-screen bottom sheet with drag-to-dismiss. Used for stop detail
   so a stop never becomes a separate long-scroll page. */
export default function Sheet({ onClose, children, footer, label, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.section
      className="sheet" role="dialog" aria-modal="true" aria-label={label}
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 360, damping: 38, mass: 0.9 }}
      drag="y" dragDirectionLock dragElastic={0.04} dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_e, info) => { if (info.offset.y > 140 || info.velocity.y > 800) onClose() }}
    >
      <header className="sheet-head">
        <button className="sheet-back" onClick={onClose} aria-label="Back">
          <IconBack size={20} />
        </button>
        {title && <span className="sheet-title">{title}</span>}
      </header>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-foot">{footer}</div>}
    </motion.section>
  )
}
