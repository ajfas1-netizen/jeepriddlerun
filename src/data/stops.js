/* ------------------------------------------------------------------
   STOPS - 2026 Martin County PAL Jeep Riddle Run.

   Twelve stops. PAL hides a duck at each one and the riddle describes
   where it is sitting. Teams also carry their own duck, so both ducks
   have to appear in the photo.

   Wallace is the rally point and Ocean Republic is the finish. The ten
   in between can be run in any order, and rigs spread out by the second
   or third stop anyway. The sequence below is the shortest loop that
   still puts coffee early: 20.4 miles against the 25.6 of the order it
   replaced, solved across the coordinates here with both ends pinned.

   Nothing in the app calls this a recommended route. It is just the
   order the stops are listed in, and people follow it or they do not.

   Straight-line distances, so the causeway runs out to the island are
   approximations. Re-solve if a stop moves.

   `id` is a stable key, `order` is the route position. They stopped
   matching when Old Havana and Crafted were added mid-route. Do not
   renumber the ids to tidy this up: stop_pins rows are keyed by id,
   so renaming an id silently moves somebody's dropped pin to the
   wrong business. The array order is the route order.

   Addresses, hiding places and the Houston detail came from AJ.
   Coordinates and social handles were verified against each business's
   published listings. Anything still unknown is left empty rather than
   guessed - see `verify`.
   ------------------------------------------------------------------ */
export const STOPS = [
  {
    id: 's1', order: 1, isRally: true,
    sponsor: 'Wallace Chrysler Jeep Dodge Ram',
    address: '2755 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Four hundred horses sit waiting in rows, but the one you are after has feathers, not chrome. He is not parked and he is not on a shelf. He is riding along with a man named Houston.',
    hint: 'Houston works the floor. Walk in, ask for him by name, and he is holding the duck.',
    igHandle: '', fbName: 'WallaceCJDR',
    noInstagram: true, // confirmed by AJ: Facebook only
    lat: 27.171389, lng: -80.232575
  },
  {
    id: 's10', order: 2,
    sponsor: 'Old Havana Cafe',
    address: '2225 SE Ocean Blvd', city: 'Stuart', state: 'FL', zip: '34996',
    riddle: 'Cuba plays a game with what the old men call bones. They are slapped down, never set down, and the table takes the punishment. Find where the next hand is waiting and he is sitting right on top of it.',
    hint: 'On the domino board.',
    igHandle: 'theoldhavanacafe', fbName: 'Old Havana Cafe',
    lat: 27.197220, lng: -80.222905
  },
  {
    id: 's11', order: 3,
    sponsor: 'CRAFTED The Store',
    address: '3766 SE Ocean Blvd', city: 'Stuart', state: 'FL', zip: '34996',
    riddle: 'Everything in here was made by somebody\u2019s hands. One sign pays you a compliment before you have done a thing to earn it. Stand where it can see you and look for the tall glass holding a bunch of small things that were never meant to be a bouquet.',
    hint: 'By the sign that says Come in, we are awesome. He is down in the vase of drink stirrers.',
    igHandle: 'craftedthestore', fbName: 'craftedthestore',
    verify: 'City is Stuart per AJ, which is also the postal city for 34996; the storefront itself sits in the Town of Sewall\u2019s Point, and directory listings use that name. OpenStreetMap has no record of 3766, so the pin is the 3700 block rather than the storefront. Drop the exact one in Organizer tools > Pin drop.',
    lat: 27.202095, lng: -80.201452
  },
  {
    id: 's8', order: 4,
    sponsor: 'Sunrise Surf Shop',
    address: '11013 S Ocean Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'A whole wall of them, waxed and standing and waiting for a swell. Only one of them wears the name over the door. He picked that one, and he did not stop at the bottom.',
    hint: 'Find the board with the Sunrise logo on it. He is riding the top of it.',
    igHandle: 'sunrisejb', fbName: 'Sunrise Surf Shop',
    lat: 27.263649, lng: -80.202302
  },
  {
    id: 's7', order: 5,
    sponsor: "Conchy Joe's Seafood",
    address: '3945 NE Indian River Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'Old Florida, the river out back, and something overhead that used to bite. Everybody comes here and looks at the water. Look the other way.',
    hint: 'Up on the ceiling. Look inside the shark’s mouth.',
    igHandle: 'conchyjoesseafood', fbName: 'ConchyJoes',
    lat: 27.252690, lng: -80.228490
  },
  {
    id: 's5', order: 6,
    sponsor: 'Frazier Creek Brewing & Distilling Co',
    address: '973 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Somebody on this wall got caught. Somebody on this wall is green. The two of them have been hanging together a while, and our guy makes three.',
    hint: 'Find the frog on the wall, the one beside the mugshot photo. He is right there.',
    igHandle: 'fraziercreekbd', fbName: 'FrazierCreekBD',
    lat: 27.189486, lng: -80.249971
  },
  {
    id: 's6', order: 7, isHost: true,
    sponsor: 'Martin County PAL',
    address: '1284 SW 34th St', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'You are standing in the reason for all of this. Three letters are painted up on one wall, and every fighter who walks in here learns them first. He is waiting right by them.',
    hint: 'Look for JAB painted on the wall. He is right beside it.',
    igHandle: 'martincountypal', fbName: 'martincountypal',
    verify: 'AJ wrote Stuart. The postal city for 1284 SW 34th St is Palm City 34990, which is what maps will match.',
    lat: 27.163692, lng: -80.270565
  },
  {
    id: 's12', order: 8,
    sponsor: 'Stuart Scuba',
    address: '3317 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34997',
    riddle: 'Somebody in here is dressed for a dive she is never going to take. Tank on, suit on, every piece of kit exactly where it should be. Look at the one thing she wears so she can see down there.',
    hint: 'The mannequin in the wetsuit. He is sitting in her dive mask.',
    igHandle: 'Stuart_Scuba', fbName: 'Stuart Scuba',
    verify: 'Address confirmed against Stuart Scuba\u2019s own site and a second listing; note the zip is 34997, not 34994 like the other Federal Hwy stops. No published coordinates exist anywhere reachable, so the pin is a straight-line fit against the five SE Federal Hwy stops that are verified, accurate to roughly a block. Drop the real one in Organizer tools > Pin drop.',
    lat: 27.165731, lng: -80.226184
  },
  {
    id: 's2', order: 9,
    sponsor: '4EverYoung Anti Aging Solutions',
    address: '2640 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'They sell the years back to you in this building. Ours is not at the front desk and not in the hall. Look for the room where nobody is in a hurry and everybody is sitting down.',
    hint: 'The IV lounge. He is waiting in there with the drip chairs.',
    igHandle: '4everyoung_stuartfl', fbName: '4everyoungstuartfl',
    lat: 27.172312, lng: -80.232155
  },
  {
    id: 's4', order: 10,
    sponsor: 'Atlantic Tire',
    address: '705 SE Monterey Rd', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'This one never asked you in and does not have to now. He has been watching Monterey Road go by all morning. Look before you reach for a door.',
    hint: 'Do not go inside for this one. He is in the front window, in plain view from the sidewalk.',
    igHandle: 'atlantictire', fbName: 'AtlanticTireCenter',
    lat: 27.180110, lng: -80.236894
  },
  {
    id: 's3', order: 11,
    sponsor: 'The Driver’s Seat',
    address: '1932 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Everything in here is for the person behind the wheel. What you want is not up front, so keep walking, all the way to the back. He found something soft to perch on and he is sitting a little above eye level.',
    hint: 'At the register, which is at the back of the store. He is up on the hat shelf.',
    igHandle: 'thedriversseatstuart', fbName: 'thedriversseat',
    lat: 27.181052, lng: -80.240633
  },
  {
    id: 's9', order: 12, isFinish: true,
    sponsor: 'Ocean Republic Brewing',
    address: '1630 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Last one. The bar is not where the work gets done. Find the room where the water gets serious and you will find him standing guard.',
    hint: 'Past the bar, over by the brewing kettles.',
    igHandle: 'oceanrepublicbrewing', fbName: 'oceanrepublicbrewing',
    lat: 27.184043, lng: -80.242571
  }
]

export const fullAddress = (s) => `${s.address}, ${s.city}, ${s.state} ${s.zip}`

/* Sponsor wall, in the order the route runs. */
export const SPONSORS = STOPS.map((s) => ({
  name: s.sponsor,
  tier: s.isRally ? 'Rally point' : s.isFinish ? 'Finish' : `Stop ${s.order}`
}))
