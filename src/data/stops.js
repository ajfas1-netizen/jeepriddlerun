/* ------------------------------------------------------------------
   STOPS - 2026 Martin County PAL Jeep Riddle Run.

   Nine stops. PAL hides a duck at each one and the riddle describes
   where it is sitting. Teams also carry their own duck, so both ducks
   have to appear in the photo.

   Wallace is the rally point and Ocean Republic is the finish. The
   seven in between can be run in any order; the sequence below is a
   sensible loop, not a rule.

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
    riddle: 'Every rig on this lot is polished and squared, but the duck that you want is not sitting out there. A man on this floor has him held in his hand. Ask for Houston by name and your run can begin.',
    hint: 'Houston works the floor. Walk in, ask for him by name, and he is holding the duck.',
    igHandle: '', fbName: 'WallaceCJDR',
    verify: 'No Instagram account found. Their site links Facebook only.',
    lat: 27.171389, lng: -80.232575
  },
  {
    id: 's2', order: 2,
    sponsor: '4EverYoung Anti Aging Solutions',
    address: '2640 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Follow the hush past the front of the house, to the room where the chairs are lined up in a row. A bag on a hook does its work nice and slow. Our duck pulled up a seat. Now you know.',
    hint: 'The IV lounge. He is waiting in there with the drip chairs.',
    igHandle: '4everyoung_stuartfl', fbName: '4everyoungstuartfl',
    lat: 27.172312, lng: -80.232155
  },
  {
    id: 's3', order: 3,
    sponsor: 'The Driver’s Seat',
    address: '1932 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Gauges and gloves and good gear for the drive, but head for the counter where you settle the bill. Beside it a tower of brims stacked up high. Our duck took the summit, so lift up your eyes.',
    hint: 'At the register. He is sitting on top of the stack of hats.',
    igHandle: 'thedriversseatstuart', fbName: 'thedriversseat',
    lat: 27.181052, lng: -80.240633
  },
  {
    id: 's4', order: 4,
    sponsor: 'Atlantic Tire',
    address: '705 SE Monterey Rd', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Save your shoes, there is no need for the door. This one is out on display, nothing more. Between the glass and the street he sits pretty. Look in from the sidewalk. He is watching the city.',
    hint: 'Do not go inside for this one. He is in the front window, in plain view from the sidewalk.',
    igHandle: 'atlantictire', fbName: 'AtlanticTireCenter',
    lat: 27.180110, lng: -80.236894
  },
  {
    id: 's5', order: 5,
    sponsor: 'Frazier Creek Brewing & Distilling Co',
    address: '973 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'A green fellow hangs where the good stuff is poured, right by a face that looks like it got caught and got bored. He does not hop and he never says a word. Find the frog and the mugshot, and there sits our bird.',
    hint: 'Find the frog on the wall, the one beside the mugshot photo. He is right there.',
    igHandle: 'fraziercreekbd', fbName: 'FrazierCreekBD',
    lat: 27.189486, lng: -80.249971
  },
  {
    id: 's6', order: 6, isHost: true,
    sponsor: 'Martin County PAL',
    address: '1284 SW 34th St', city: 'Palm City', state: 'FL', zip: '34990',
    riddle: 'This house is ours, where our kids come to train, where gloves get laced up and confidence is gained. Three letters are painted up bold on the wall, the first punch you learn. Our duck is near that.',
    hint: 'Look for JAB painted on the wall. He is right beside it.',
    igHandle: 'martincountypal', fbName: 'martincountypal',
    verify: 'AJ wrote Stuart. The postal city for 1284 SW 34th St is Palm City 34990, which is what maps will match.',
    lat: 27.163692, lng: -80.270565
  },
  {
    id: 's7', order: 7,
    sponsor: "Conchy Joe's Seafood",
    address: '3945 NE Indian River Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'Old Florida walls with the river out back. Keep your eyes off the floor, aim them up at the top. Something hangs overhead with its jaws open wide. Our duck swam right in and he is sitting inside.',
    hint: 'Up on the ceiling. Look inside the shark’s mouth.',
    igHandle: 'conchyjoesseafood', fbName: 'ConchyJoes',
    lat: 27.252690, lng: -80.228490
  },
  {
    id: 's8', order: 8,
    sponsor: 'Sunrise Surf Shop',
    address: '11013 S Ocean Dr', city: 'Jensen Beach', state: 'FL', zip: '34957',
    riddle: 'Waxed and lined up, a whole wall built of boards, and one of them carries the name on the door. Run your eyes to the nose, all the way to the top. Our duck caught that wave and he is not going to drop.',
    hint: 'Find the board with the Sunrise logo on it. He is riding the top of it.',
    igHandle: '', fbName: 'Sunrise Surf Shop',
    verify: 'The obvious handle belongs to the Jacksonville Beach parent store. Get the Jensen Beach one from them.',
    lat: 27.263649, lng: -80.202302
  },
  {
    id: 's9', order: 9, isFinish: true,
    sponsor: 'Ocean Republic Brewing',
    address: '1630 SE Federal Hwy', city: 'Stuart', state: 'FL', zip: '34994',
    riddle: 'Last one. Steam and steel where the grain first goes in, where patience and time do the work for the win. Walk past the taps to the room where it is made. Our duck is on guard by the kettles. Well played.',
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
