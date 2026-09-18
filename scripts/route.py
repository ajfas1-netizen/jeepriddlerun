import math, re, itertools

src = open('src/data/stops.js').read()
S = {}
for m in re.finditer(r"id: '(s\d+)', order: (\d+).*?sponsor: ['\"](.+?)['\"],.*?lat: ([-\d.]+), lng: ([-\d.]+)", src, re.S):
    S[m.group(1)] = dict(id=m.group(1), name=m.group(3), lat=float(m.group(4)), lng=float(m.group(5)))

SHORT = {'s1':'Wallace','s10':'Old Havana','s11':'CRAFTED','s8':'Sunrise Surf','s7':"Conchy Joe's",
         's5':'Frazier Creek','s6':'PAL','s12':'Stuart Scuba','s2':'4EverYoung','s4':'Atlantic Tire',
         's3':"Driver's Seat",'s9':'Ocean Republic'}

def hav(a,b):
    R=3958.8; p1,p2=math.radians(S[a]['lat']),math.radians(S[b]['lat'])
    dp=p2-p1; dl=math.radians(S[b]['lng']-S[a]['lng'])
    h=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))

ROAD = 1.30     # straight line to real road miles
MPH  = 28.0     # local roads, lights, a convoy of Jeeps
DWELL = 12.0    # minutes parked, photo, riddle, spend
START = 9.5*60  # 9:30 roll out

def drive_min(a,b): return hav(a,b)*ROAD/MPH*60

def schedule(seq):
    """Arrival clock time at each stop, in minutes past midnight."""
    t = START; out = [t]
    for i in range(len(seq)-1):
        t += DWELL + drive_min(seq[i], seq[i+1])
        out.append(t)
    return out

def miles(seq): return sum(hav(seq[i],seq[i+1]) for i in range(len(seq)-1))
def hhmm(m): 
    h=int(m//60); mm=int(round(m%60))
    if mm==60: h,mm=h+1,0
    return f"{h if h<=12 else h-12}:{mm:02d}"

OPENS = {'s5': 10.5*60, 's7': 11.5*60}   # Frazier 10:30, Conchy 11:30

def ok(seq):
    arr = schedule(seq)
    for i,sid in enumerate(seq):
        if sid in OPENS and arr[i] < OPENS[sid] - 1:   # 1 min of slack
            return False
    return True

def solve(pool, head, tail, require_ok=True):
    best=(1e9,None)
    for perm in itertools.permutations(pool):
        seq = head + list(perm) + tail
        if require_ok and not ok(seq): continue
        d = miles(seq)
        if d < best[0]: best=(d,seq)
    return best

HEAD = ['s1']
TAIL = ['s7','s8','s9']            # Conchy, Sunrise, Ocean Republic
POOL = ['s3','s2','s12','s5','s10','s11','s6','s4']   # incl PAL and Atlantic Tire

d_all, seq_all = solve(POOL, HEAD, TAIL)
print(f"BEST WITH ALL 12, timing respected: {d_all:.1f} mi")
arr = schedule(seq_all)
for i,(sid,t) in enumerate(zip(seq_all,arr),1):
    flag = ''
    if sid in OPENS: flag = f"   <- opens {hhmm(OPENS[sid])}"
    print(f"  {i:2}  {hhmm(t):>5}  {SHORT[sid]}{flag}")
print(f"  ..  {hhmm(arr[-1]+DWELL):>5}  done at Ocean Republic")
print()

# Where does PAL land, and what does it cost?
d_no_pal, seq_no_pal = solve([x for x in POOL if x!='s6'], HEAD, TAIL)
print(f"Same route without PAL: {d_no_pal:.1f} mi  (PAL detour costs {d_all-d_no_pal:.1f} mi)")
pos = seq_all.index('s6')+1
print(f"PAL sits at position {pos} in the optimum.")
print()

# What the team proposed, with PAL and Atlantic Tire appended where they fit best
PROPOSED = ['s1','s3','s2','s12','s5','s10','s11','s7','s8','s9']
print(f"Team's proposed 10 (no PAL, no Atlantic Tire): {miles(PROPOSED):.1f} mi")
arr = schedule(PROPOSED)
for i,(sid,t) in enumerate(zip(PROPOSED,arr),1):
    flag = ''
    if sid in OPENS:
        flag = f"   <- opens {hhmm(OPENS[sid])}" + ("  TOO EARLY" if t < OPENS[sid]-1 else "  ok")
    print(f"  {i:2}  {hhmm(t):>5}  {SHORT[sid]}{flag}")

print()
print("=== how sensitive is the 1:00 finish ===")
BEST = seq_all
for dwell in (8, 10, 12, 15, 18, 22):
    globals()['DWELL'] = dwell
    arr = schedule(BEST)
    late = [SHORT[s] for s,t in zip(BEST,arr) if s in OPENS and t < OPENS[s]-1]
    print(f"  {dwell:2} min per stop -> Conchy {hhmm(arr[BEST.index('s7')])}, "
          f"done {hhmm(arr[-1]+dwell)}" + (f"   ARRIVES BEFORE OPEN: {late}" if late else ""))
