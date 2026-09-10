/* ------------------------------------------------------------------
   STOPS - seeded from the 2025 MC PAL Jeep Riddle Run booklet.
   Replace riddles / addresses when AJ delivers the 2026 set.

   HONESTY NOTE: `sponsor`, `igHandle`, `fbName` and `answer` are blank
   on purpose. The 2025 PDF never states which business sits at which
   address, and guessing would send 50 teams to tag the wrong shop.
   Fill these in from the sponsor sign-up sheet.

   `lat`/`lng` are null until they are dropped in Admin > Pin Drop.
   Navigation still works without them: the maps handoff uses the
   address string, which is exact.
   ------------------------------------------------------------------ */
export const STOPS = [
  {
    id: 's01', order: 1, isRally: true,
    address: '8401 SE Federal Hwy', city: 'Hobe Sound', state: 'FL', zip: '33455',
    riddle: 'With power comes duty, when danger is near, I guard your thoughts, your vision stays clear. Superhero or villain, I play the same part, protecting your mind, your mission, your heart. What am I?',
    clue: 'clues/clue-01.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's02', order: 2,
    address: '1425 SE Bridge Rd', city: 'Hobe Sound', state: 'FL', zip: '33455',
    riddle: 'We bounce and bump in Jeeps so cool, on a sunny trail with no time for school. Where fluffy friends go "meh" and play, and maybe try to steal some hay. They are not dogs, they are not cats, they have got four legs and horns, imagine that. Where are we going? Take a peek, you will find a goat kiss on your cheek. What am I?',
    clue: 'clues/clue-02.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's03', order: 3,
    address: '6400 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34997',
    riddle: 'I let the sunshine in, and keep the weather out. I give you a view, of that there is no doubt. I come in panes, but I do not feel pain. Clean me up and I will sparkle again. My colors are Bronze and White. What am I?',
    clue: 'clues/clue-03.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's04', order: 4,
    address: '1932 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am round and tough, I help you roll. Off-road or highway, I am always in control. Shiny or black, I come in sets of four. Find me on the wall where drivers want more. What am I?',
    clue: 'clues/clue-04.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's05', order: 5,
    address: '705 SE Monterey Rd', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I do not fly in the breeze, yet my stripes still wave. Carved into wood, for the free and the brave. Stars shine bright though I never see night. What am I?',
    clue: 'clues/clue-05.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's06', order: 6,
    address: '2640 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I do not cook food, but I keep things warm, helping beauty routines take form. Inside you will find a youthful prize. Look around carefully and use your eyes. What am I?',
    clue: 'clues/clue-06.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's07', order: 7,
    address: '2201 SE Indian St', city: 'Stuart', state: 'FL', zip: '34997',
    riddle: 'I am a trio of silent souls, dressed in pirate garb with tales untold. With hats and patches, a weapon near, seek me where the arms are sold. What am I?',
    clue: 'clues/clue-07.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's08', order: 8,
    address: '585 Jimmy Buffett Memorial Hwy', city: 'Stuart', state: 'FL', zip: '34996',
    riddle: 'I am a tropical treat that will not melt in your hand, with sprinkles like shells from the Hutch’s Island sand. I look like I am ready to chill in the heat, but do not be fooled, I am no island sweet. Find me framed where the cool vibes stay, a frozen delight that is not for a tray. What am I?',
    clue: 'clues/clue-08.jpg',
    sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's09', order: 9,
    address: '1385 SW Martin Hwy', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'I am small but do not peep like a chick. I sparkle and shine, a golden trick. I love the tub, but I am not soap. A Jeep owner’s friend, full of glitter and hope. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's10', order: 10,
    address: '1630 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am stacked with fun from low to high, where tiny trucks and puzzles lie. If you are a kid, I am your best friend. Start your search where playtime trends. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's11', order: 11,
    address: '1284 SW 34th St', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'I have been in the ring where champions fight, worn with pride under the bright lights. Not gloves, not shoes, but close to the skin. Guess the garment legends wear to win. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's12', order: 12,
    address: '2755 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Two little dogs, they love to play. Louie left, Ralph to the right each day. Check where their tails both shine so bright, you will find your egg near the taillight.',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's13', order: 13,
    address: '11013 S Ocean Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'Bigger than most, yet light on the hand. I am built for a rally, not play in the sand. Shaped for the court, where the ball meets its match. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's14', order: 14,
    address: '2210 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I hold more than spirits, I carry surprise. Twenty-four doors hide treasures inside. Born of the agave, kissed by the flame, each day a new story, no two drinks the same. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  },
  {
    id: 's15', order: 15,
    address: '973 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am not a pint, but I am full of flair. Travelers and brewers have left me here. I tell a story without a sound, a wall of color where memories are found. What am I?',
    clue: '', sponsor: '', igHandle: '', fbName: '', answer: '', lat: null, lng: null
  }
]

export const fullAddress = (s) => `${s.address}, ${s.city}, ${s.state} ${s.zip}`

/* Sponsor wall. Names taken verbatim from the 2025 sponsor page.
   No stop mapping here, on purpose - see the note above. */
export const SPONSORS = [
  { name: 'Wallace Chrysler Jeep Dodge Ram', tier: 'Sponsor' },
  { name: 'Ocean Republic Brewing', tier: 'Sponsor' },
  { name: 'Frazier Creek Brewing & Distilling Co', tier: 'Sponsor' },
  { name: 'The Hutch Market & Cafe', tier: 'Sponsor' },
  { name: 'Sunrise Surf Shop', tier: 'Sponsor' },
  { name: '4EverYoung Anti Aging Solutions', tier: 'Sponsor' },
  { name: 'Twinkles Jewelry & Gifts', tier: 'Sponsor' },
  { name: 'Treasure Coast Broward Motorsports', tier: 'Sponsor' },
  { name: 'Sip Tequila', tier: 'Sponsor' },
  { name: 'Pirate Firearms & Trading Co', tier: 'Sponsor' },
  { name: 'Hobe Sound Farms', tier: 'Sponsor' },
  { name: 'The Drivers Seat', tier: 'Sponsor' },
  { name: 'Ironman 4x4', tier: 'Sponsor' },
  { name: "O'Donnell Impact Windows & Storm Protection", tier: 'Sponsor' },
  { name: 'Atlantic Tire', tier: 'Sponsor' }
]
