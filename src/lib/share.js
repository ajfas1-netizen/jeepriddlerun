/* ------------------------------------------------------------------
   Getting the photo out of the app and into a post.

   The trap: on iOS, a photo captured through <input capture> never
   touches the camera roll. It goes straight into the page. So a team
   would shoot the find, then open Instagram and have nothing to post.

   The fix is the native share sheet. navigator.share() with a file
   gives the phone's own sheet, which carries "Save Image" plus direct
   targets for Instagram and Facebook. Where that is unsupported we
   fall back to a save link on Android and a press-and-hold hint on
   iOS, both of which do work.
   ------------------------------------------------------------------ */

const blobs = new Map()

export const rememberBlob = (key, blob) => blobs.set(key, blob)

export async function getBlob(key, url) {
  if (blobs.has(key)) return blobs.get(key)
  if (!url) return null
  try {
    const r = await fetch(url)
    const b = await r.blob()
    blobs.set(key, b)
    return b
  } catch {
    return null
  }
}

export const canShareFiles = () => {
  try {
    return Boolean(navigator.canShare && navigator.canShare({
      files: [new File([new Blob(['x'], { type: 'image/jpeg' })], 'x.jpg', { type: 'image/jpeg' })]
    }))
  } catch {
    return false
  }
}

/* Returns 'shared' | 'cancelled' | 'unsupported' | 'failed' */
export async function sharePhoto({ blob, filename, text }) {
  if (!blob) return 'failed'
  const file = new File([blob], filename, { type: 'image/jpeg' })
  if (!canShareFiles()) return 'unsupported'
  try {
    await navigator.share({ files: [file], text })
    return 'shared'
  } catch (e) {
    return e && e.name === 'AbortError' ? 'cancelled' : 'failed'
  }
}

/* Android and desktop can save straight to disk. iOS Safari ignores
   the download attribute, which is why the hint exists. */
export function saveToDisk(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/* Opening the apps. Neither accepts a caption through a URL, which is
   why the caption goes to the clipboard first. */
export const APPS = {
  instagram: { label: 'Instagram', app: 'instagram://app', web: 'https://www.instagram.com/' },
  facebook: { label: 'Facebook', app: 'fb://', web: 'https://www.facebook.com/' }
}

export function openApp(which) {
  const t = APPS[which]
  if (!t) return
  const started = Date.now()
  const timer = setTimeout(() => {
    if (Date.now() - started < 1600) window.location.href = t.web
  }, 700)
  window.location.href = t.app
  window.addEventListener('pagehide', () => clearTimeout(timer), { once: true })
}
