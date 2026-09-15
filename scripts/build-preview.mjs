/* ------------------------------------------------------------------
   Builds the single-file shareable preview from dist-artifact.

   Everything gets inlined because the preview host blocks outside
   files. The one exception is Google Fonts, which is allowed and is
   linked rather than @imported: an @import has to be the first thing
   in a stylesheet, and the font URL contains semicolons, which is
   exactly the trap that broke this once already.

   Run: npm run preview:build
   ------------------------------------------------------------------ */
import fs from 'fs'
import path from 'path'

const FONTS = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'
const DIR = 'dist-artifact/assets'
const OUT = process.argv[2] || 'dist-artifact/preview.html'

const jsFile = fs.readdirSync(DIR).find((f) => f.endsWith('.js'))
const cssFile = fs.readdirSync(DIR).find((f) => f.endsWith('.css'))
if (!jsFile || !cssFile) throw new Error('Run `npx vite build --config vite.config.artifact.js` first')

let js = fs.readFileSync(path.join(DIR, jsFile), 'utf8')
let css = fs.readFileSync(path.join(DIR, cssFile), 'utf8')

// Match a whole @import statement, quotes and all. The naive
// /@import [^;]+;/ stops at the first semicolon INSIDE the url.
const IMPORT_RE = /@import\s+(?:url\(\s*)?["'][^"']*["']\s*\)?[^;]*;/g
const removed = (css.match(IMPORT_RE) || []).length
css = css.replace(IMPORT_RE, '')

// Inline any public asset the bundle still points at by filename.
const inlineAsset = (name, mime) => {
  const p = path.join('public', name)
  if (!fs.existsSync(p)) return 0
  const uri = `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`
  let n = 0
  for (const q of ['"', "'", '`']) {
    const from = `${q}${name}${q}`
    n += js.split(from).length - 1
    js = js.split(from).join(`${q}${uri}${q}`)
  }
  return n
}
const inlined = inlineAsset('icon-192.png', 'image/png')

const html = `<title>Jeep Riddle Run</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
html,body{height:100%;margin:0;overflow:hidden}
</style>
<div id="root"></div>
<script type="module">
${js.split('<\/script>').join('<\\/script>')}
<\/script>
`

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, html)

// Guard rails: fail loudly rather than shipping a broken page.
if (/@import/.test(html)) throw new Error('An @import survived into the preview')
if (!/:root\{/.test(css)) throw new Error('The :root token block is missing from the CSS')
console.log(`preview: ${(html.length / 1e6).toFixed(2)} MB | imports stripped ${removed} | icon refs inlined ${inlined}`)
