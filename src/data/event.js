/* ------------------------------------------------------------------
   EVENT CONFIG - this is the file you edit each year.
   Everything below drives copy, scoring and the post-assist captions.
   ------------------------------------------------------------------ */
export const EVENT = {
  year: 2026,
  name: 'Jeep Riddle Run',
  org: 'Martin County PAL',
  dateLabel: 'Saturday, September 19',
  rallyTimeLabel: 'Gather 9:00, roll out 9:30',
  hashtag: '#jeepriddlerun2026',
  palHandle: '@martincountypal',
  palUrl: 'https://www.martincountypal.com',
  // Code you hand to donors at the tier that unlocks bonus clues.
  bonusCode: 'DUCKDROP',
  // Dollar-for-dollar points on money spent at sponsor locations.
  spendPointsPerDollar: 1,
  // Map default view. Pins come from stop lat/lng once you drop them
  // in Admin > Pin Drop. Nothing here is a claim about a business address.
  mapCenter: [27.1965, -80.2533],
  mapZoom: 11,
  scoring: {
    duck: 3,          // both ducks visible: the one they found and the one they carry
    posted: 3,        // photo posted to Facebook or Instagram
    tagLocation: 3,   // location / business tagged
    tagPal: 3,        // martincountypal tagged
    hashtag: 3        // event hashtag used
  }
}

export const SCORE_ITEMS = [
  { key: 'duck',        label: 'Both ducks in the photo', hint: 'Yours and the one you found. A selfie counts.' },
  { key: 'posted',      label: 'Posted to FB or IG',      hint: 'Public post so the judges can find it.' },
  { key: 'tagLocation', label: 'Location tagged',         hint: 'Tag the business that hosted you.' },
  { key: 'tagPal',      label: 'PAL tagged',              hint: EVENT.palHandle },
  { key: 'hashtag',     label: 'Hashtag used',            hint: EVENT.hashtag }
]

export const DUCKS = [
  { id: 'classic',  name: 'Classic',     body: '#C9A227', bill: '#8A6F1B' },
  { id: 'camo',     name: 'Camo',        body: '#6E7A55', bill: '#3D452C' },
  { id: 'rubicon',  name: 'Rubicon',     body: '#B4501E', bill: '#7A3413' },
  { id: 'sarge',    name: 'Sarge',       body: '#54684E', bill: '#9A9384' },
  { id: 'hydro',    name: 'Hydro',       body: '#3E7F98', bill: '#255264' },
  { id: 'firecrkr', name: 'Firecracker', body: '#A03038', bill: '#6B1D22' },
  { id: 'bikini',   name: 'Bikini',      body: '#4E9E8B', bill: '#2E6356' },
  { id: 'nacho',    name: 'Bone',        body: '#D9D5C8', bill: '#9A9384' }
]

export const RIG_COLORS = [
  { id: 'granite', name: 'Granite',  hex: '#6B7280' },
  { id: 'firecracker', name: 'Firecracker', hex: '#C7303A' },
  { id: 'hydro', name: 'Hydro Blue', hex: '#2E7FA8' },
  { id: 'sarge', name: 'Sarge Green', hex: '#5B7553' },
  { id: 'punkn', name: "Punk'n",   hex: '#E2571F' },
  { id: 'bright', name: 'Bright White', hex: '#F4F0E4' },
  { id: 'black', name: 'Black',    hex: '#1B1F1C' },
  { id: 'tuscadero', name: 'Tuscadero', hex: '#D63B8E' }
]
