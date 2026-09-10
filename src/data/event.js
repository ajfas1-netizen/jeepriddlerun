/* ------------------------------------------------------------------
   EVENT CONFIG - this is the file you edit each year.
   Everything below drives copy, scoring and the post-assist captions.
   ------------------------------------------------------------------ */
export const EVENT = {
  year: 2026,
  name: 'Jeep Riddle Run',
  org: 'Martin County PAL',
  // TODO(AJ): confirm date + start time, then delete this comment.
  dateLabel: 'DATE TBD',
  rallyTimeLabel: 'ROLL OUT TBD',
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
    duck: 3,          // rubber duck visible in the photo
    posted: 3,        // photo posted to Facebook or Instagram
    tagLocation: 3,   // location / business tagged
    tagPal: 3,        // martincountypal tagged
    hashtag: 3,       // event hashtag used
    receipt: 3        // proof of purchase at the stop
  }
}

export const SCORE_ITEMS = [
  { key: 'duck',        label: 'Duck in the photo',   hint: 'No duck, no points. Every single stop.' },
  { key: 'posted',      label: 'Posted to FB or IG',  hint: 'Public post so the judges can find it.' },
  { key: 'tagLocation', label: 'Location tagged',     hint: 'Tag the business that hosted you.' },
  { key: 'tagPal',      label: 'PAL tagged',          hint: EVENT.palHandle },
  { key: 'hashtag',     label: 'Hashtag used',        hint: EVENT.hashtag },
  { key: 'receipt',     label: 'Proof of purchase',   hint: 'Buy something, keep the receipt.' }
]

export const DUCKS = [
  { id: 'classic',  name: 'Classic',   body: '#FFC627', bill: '#E2571F' },
  { id: 'camo',     name: 'Camo',      body: '#7C8B5A', bill: '#3F4A2C' },
  { id: 'rubicon',  name: 'Rubicon',   body: '#E2571F', bill: '#FFC627' },
  { id: 'sarge',    name: 'Sarge',     body: '#5B7553', bill: '#D8C9A6' },
  { id: 'hydro',    name: 'Hydro',     body: '#4FA8C7', bill: '#F4F0E4' },
  { id: 'firecrkr', name: 'Firecracker', body: '#C7303A', bill: '#F4F0E4' },
  { id: 'bikini',   name: 'Bikini',    body: '#5FC9B0', bill: '#FFC627' },
  { id: 'nacho',    name: 'Nacho',     body: '#F4F0E4', bill: '#E2571F' }
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
