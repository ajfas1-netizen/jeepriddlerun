/* ------------------------------------------------------------------
   Opening Instagram and Facebook.

   Note on photos: the app deliberately does NOT capture through the
   camera. On iOS a photo taken inside a web page never reaches the
   camera roll, and the camera roll is the only place Instagram and
   Facebook can post from. So teams shoot with their own Camera app and
   add the photo from their library. One path, no failure mode, no
   volunteer explaining it fifteen times on event day.

   Neither app accepts a caption passed in from outside, which is why
   the caption goes to the clipboard first.
   ------------------------------------------------------------------ */
const APPS = {
  instagram: { app: 'instagram://app', web: 'https://www.instagram.com/' },
  facebook: { app: 'fb://', web: 'https://www.facebook.com/' }
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
