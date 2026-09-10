/* Client-side downscale + compress. Keeps a 750-photo event inside a
   free storage tier and makes uploads survive weak cell signal. */
export function compress(file, { max = 1400, quality = 0.78 } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      c.toBlob(
        (blob) => (blob ? resolve({ blob, dataUrl: c.toDataURL('image/jpeg', quality), w, h }) : reject(new Error('encode failed'))),
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('could not read image')) }
    img.src = url
  })
}
