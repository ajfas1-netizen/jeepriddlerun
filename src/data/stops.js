/* ------------------------------------------------------------------
   STOPS - the 2025 MC PAL Jeep Riddle Run route, used as this year's
   working data until the new locations and riddles land.

   Sponsor names, Instagram handles and Facebook pages were verified
   against each business's published address, not guessed from the
   riddle. Two handles could not be found and three want a human
   check before anything is printed - see `verify` below.

   Coordinates come from published directory listings and were sanity
   checked against the Martin County bounding box and against house
   number order along SE Federal Hwy. Stop 3 has no published
   coordinate; drop it by hand in Organizer tools > Pin drop.
   ------------------------------------------------------------------ */
export const STOPS = [
  {
    id: 's01', order: 1, isRally: true,
    sponsor: 'Broward Motorsports Treasure Coast',
    address: '8401 SE Federal Hwy', city: 'Hobe Sound', state: 'FL', zip: '33455',
    riddle: 'With power comes duty, when danger is near, I guard your thoughts, your vision stays clear. Superhero or villain, I play the same part, protecting your mind, your mission, your heart. What am I?',
    clue: 'clues/clue-01.jpg',
    igHandle: 'broward.motorsports', fbName: 'browardmotorsportstreasurecoast',
    verify: 'Instagram looks like the multi-store group account, not a Treasure Coast one',
    lat: 27.102485, lng: -80.161817
  },
  {
    id: 's02', order: 2,
    sponsor: 'Hobe Sound Farms',
    address: '1425 SE Bridge Rd', city: 'Hobe Sound', state: 'FL', zip: '33455',
    riddle: 'We bounce and bump in Jeeps so cool, on a sunny trail with no time for school. Where fluffy friends go "meh" and play, and maybe try to steal some hay. They are not dogs, they are not cats, they have got four legs and horns, imagine that. Where are we going? Take a peek, you will find a goat kiss on your cheek. What am I?',
    clue: 'clues/clue-02.jpg',
    igHandle: 'hobesoundfarmersmarket', fbName: 'HobeSoundFarmersMarket',
    lat: 27.044373, lng: -80.237381
  },
  {
    id: 's03', order: 3,
    sponsor: "O'Donnell Impact Windows & Storm Protection",
    address: '6400 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34997',
    riddle: 'I let the sunshine in, and keep the weather out. I give you a view, of that there is no doubt. I come in panes, but I do not feel pain. Clean me up and I will sparkle again. My colors are Bronze and White. What am I?',
    clue: 'clues/clue-03.jpg',
    igHandle: 'odonnellstormprotection', fbName: 'odonnellstormprotection',
    verify: 'Every listing shows 6402 SE Federal Hwy, the booklet says 6400. Confirm the suite, then drop the pin.',
    lat: null, lng: null
  },
  {
    id: 's04', order: 4,
    sponsor: 'The Drivers Seat',
    address: '1932 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am round and tough, I help you roll. Off-road or highway, I am always in control. Shiny or black, I come in sets of four. Find me on the wall where drivers want more. What am I?',
    clue: 'clues/clue-04.jpg',
    igHandle: 'thedriversseatstuart', fbName: 'thedriversseat',
    lat: 27.181052, lng: -80.240633
  },
  {
    id: 's05', order: 5,
    sponsor: 'Atlantic Tire',
    address: '705 SE Monterey Rd', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I do not fly in the breeze, yet my stripes still wave. Carved into wood, for the free and the brave. Stars shine bright though I never see night. What am I?',
    clue: 'clues/clue-05.jpg',
    igHandle: 'atlantictire', fbName: 'AtlanticTireCenter',
    lat: 27.180110, lng: -80.236894
  },
  {
    id: 's06', order: 6,
    sponsor: '4EverYoung Anti Aging Solutions',
    address: '2640 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I do not cook food, but I keep things warm, helping beauty routines take form. Inside you will find a youthful prize. Look around carefully and use your eyes. What am I?',
    clue: 'clues/clue-06.jpg',
    igHandle: '4everyoung_stuartfl', fbName: '4everyoungstuartfl',
    lat: 27.172312, lng: -80.232155
  },
  {
    id: 's07', order: 7,
    sponsor: 'Pirate Firearms & Trading Co',
    address: '2201 SE Indian St', city: 'Stuart', state: 'FL', zip: '34997',
    riddle: 'I am a trio of silent souls, dressed in pirate garb with tales untold. With hats and patches, a weapon near, seek me where the arms are sold. What am I?',
    clue: 'clues/clue-07.jpg',
    igHandle: 'piratefirearmsandtradingco', fbName: 'Pirate Firearms',
    lat: 27.167422, lng: -80.224146
  },
  {
    id: 's08', order: 8,
    sponsor: 'The Hutch Market & Cafe',
    address: '585 Jimmy Buffett Memorial Hwy', city: 'Stuart', state: 'FL', zip: '34996',
    riddle: 'I am a tropical treat that will not melt in your hand, with sprinkles like shells from the Hutch’s Island sand. I look like I am ready to chill in the heat, but do not be fooled, I am no island sweet. Find me framed where the cool vibes stay, a frozen delight that is not for a tray. What am I?',
    clue: 'clues/clue-08.jpg',
    igHandle: 'thehutchfl', fbName: 'TheHutchFL',
    verify: 'Two listings disagree by about half a mile. Eyeball this pin on the map.',
    lat: 27.211320, lng: -80.181300
  },
  {
    id: 's09', order: 9,
    sponsor: 'Twinkles Jewelry & Gifts',
    address: '1385 SW Martin Hwy', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'I am small but do not peep like a chick. I sparkle and shine, a golden trick. I love the tub, but I am not soap. A Jeep owner’s friend, full of glitter and hope. What am I?',
    clue: 'clues/clue-09.svg',
    igHandle: '', fbName: 'TwinklesJewelryandGifts',
    verify: 'No Instagram account found. Ask them at sponsor sign-up.',
    lat: 27.162401, lng: -80.270885
  },
  {
    id: 's10', order: 10,
    sponsor: 'Ocean Republic Brewing',
    address: '1630 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am stacked with fun from low to high, where tiny trucks and puzzles lie. If you are a kid, I am your best friend. Start your search where playtime trends. What am I?',
    clue: 'clues/clue-10.svg',
    igHandle: 'oceanrepublicbrewing', fbName: 'oceanrepublicbrewing',
    verify: 'The 2025 booklet paired a toy riddle with this address. Address is right, riddle looks wrong.',
    lat: 27.184043, lng: -80.242571
  },
  {
    id: 's11', order: 11, isHost: true,
    sponsor: 'Martin County PAL',
    address: '1284 SW 34th St', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'I have been in the ring where champions fight, worn with pride under the bright lights. Not gloves, not shoes, but close to the skin. Guess the garment legends wear to win. What am I?',
    clue: 'clues/clue-11.svg',
    igHandle: 'martincountypal', fbName: 'martincountypal',
    lat: 27.163692, lng: -80.270565
  },
  {
    id: 's12', order: 12,
    sponsor: 'Wallace Chrysler Jeep Dodge Ram',
    address: '2755 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Two little dogs, they love to play. Louie left, Ralph to the right each day. Check where their tails both shine so bright, you will find your egg near the taillight.',
    clue: 'clues/clue-12.svg',
    igHandle: '', fbName: 'WallaceCJDR',
    verify: 'No Instagram found. Their site links Facebook only.',
    lat: 27.171389, lng: -80.232575
  },
  {
    id: 's13', order: 13,
    sponsor: 'Sunrise Surf Shop',
    address: '11013 S Ocean Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'Bigger than most, yet light on the hand. I am built for a rally, not play in the sand. Shaped for the court, where the ball meets its match. What am I?',
    clue: 'clues/clue-13.svg',
    igHandle: '', fbName: 'Sunrise Surf Shop',
    verify: 'The obvious handle belongs to the Jacksonville Beach parent store. Get the Jensen Beach one from them.',
    lat: 27.263649, lng: -80.202302
  },
  {
    id: 's14', order: 14,
    sponsor: 'Sip Tequila',
    address: '2210 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I hold more than spirits, I carry surprise. Twenty-four doors hide treasures inside. Born of the agave, kissed by the flame, each day a new story, no two drinks the same. What am I?',
    clue: 'clues/clue-14.svg',
    igHandle: 'sip_tequila_florida', fbName: 'SipTequilaFlorida',
    lat: 27.178050, lng: -80.238773
  },
  {
    id: 's15', order: 15,
    sponsor: 'Frazier Creek Brewing & Distilling Co',
    address: '973 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'I am not a pint, but I am full of flair. Travelers and brewers have left me here. I tell a story without a sound, a wall of color where memories are found. What am I?',
    clue: 'clues/clue-15.svg',
    igHandle: 'fraziercreekbd', fbName: 'FrazierCreekBD',
    lat: 27.189486, lng: -80.249971
  }
]

export const fullAddress = (s) => `${s.address}, ${s.city}, ${s.state} ${s.zip}`

/* Sponsor wall, names exactly as printed on the 2025 sponsor page.
   Ironman 4x4 sponsors the event but does not host a stop. */
export const SPONSORS = [
  { name: 'Wallace Chrysler Jeep Dodge Ram', tier: 'Stop 12' },
  { name: 'Ocean Republic Brewing', tier: 'Stop 10' },
  { name: 'Frazier Creek Brewing & Distilling Co', tier: 'Stop 15' },
  { name: 'The Hutch Market & Cafe', tier: 'Stop 8' },
  { name: 'Sunrise Surf Shop', tier: 'Stop 13' },
  { name: '4EverYoung Anti Aging Solutions', tier: 'Stop 6' },
  { name: 'Twinkles Jewelry & Gifts', tier: 'Stop 9' },
  { name: 'Broward Motorsports Treasure Coast', tier: 'Stop 1' },
  { name: 'Sip Tequila', tier: 'Stop 14' },
  { name: 'Pirate Firearms & Trading Co', tier: 'Stop 7' },
  { name: 'Hobe Sound Farms', tier: 'Stop 2' },
  { name: 'The Drivers Seat', tier: 'Stop 4' },
  { name: "O'Donnell Impact Windows & Storm Protection", tier: 'Stop 3' },
  { name: 'Atlantic Tire', tier: 'Stop 5' },
  { name: 'Ironman 4x4', tier: 'Supporting sponsor' }
]
