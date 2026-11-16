# Music + SFX made in code, timed to the voice (video time), then voice ducking and the master.
# Output: voice/mix_pre.wav (before loudnorm). Run: python3 mix_aram.py
import json, numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000
d=json.load(open('voice/timing.json'));LN=d['LINES'];T=[l[0] for l in LN];TE=[l[1] for l in LN]
END=LN[8][1]+2.6;N=int(SR*END)
rng=np.random.default_rng(11)
def z(): return np.zeros(N)
def at(buf,t,x,g=1.0):
    i=int(round(t*SR));
    if i<0: x=x[-i:];i=0
    x=x[:max(0,N-i)];buf[i:i+len(x)]+=x*g
def env(n,a=.004,r=.15):
    t=np.arange(n)/SR;return np.minimum(1,t/max(a,1e-4))*np.exp(-t/r)
def tone(f,dur,parts=((1,1),),a=.004,r=.2):
    n=int(dur*SR);t=np.arange(n)/SR;x=sum(g*np.sin(2*np.pi*f*k*t) for k,g in parts);return x*env(n,a,r)
mid=lambda m:440*2**((m-69)/12)
def bp(x,lo,hi):b,a=ss.butter(2,[lo,hi],'band',fs=SR);return ss.lfilter(b,a,x)
def lp(x,f):b,a=ss.butter(2,f,'low',fs=SR);return ss.lfilter(b,a,x)
def hp(x,f):b,a=ss.butter(2,f,'high',fs=SR);return ss.lfilter(b,a,x)
noise=lambda d:rng.standard_normal(int(d*SR))
# ---- instruments
pizz=lambda m,d=.35:tone(mid(m),d,((1,1),(2,.45),(3,.2),(4,.08)),.002,.09)
marimba=lambda m,d=.5:tone(mid(m),d,((1,1),(4,.25),(10,.05)),.001,.14)
bass=lambda m,d=.45:lp(tone(mid(m),d,((1,1),(2,.5),(3,.25)),.004,.22),900)
def kick():n=int(.3*SR);t=np.arange(n)/SR;f=45+80*np.exp(-t*28);return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.001,.12)
def clap():x=np.zeros(int(.2*SR));
def clap():
    x=np.zeros(int(.22*SR))
    for o in (0,.012,.024):x[int(o*SR):int(o*SR)+int(.18*SR)]+=bp(noise(.18),900,3500)*env(int(.18*SR),.0005,.03 if o<.02 else .06)
    return x*.6
hat=lambda:hp(noise(.05),7000)*env(int(.05*SR),.0005,.012)*.35
shaker=lambda:bp(noise(.08),5000,11000)*env(int(.08*SR),.01,.02)*.25
CH=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]];ROOT=[48,45,41,43]
# ---- music bus
mus=z()
def groove(t0,t1,bpm,full=True,melody='pizz'):
    b=60/bpm;i=0;t=t0
    MEL=[72,76,79,76,74,72,74,67, 69,72,76,74,72,69,67,69, 65,69,72,69,67,65,67,72, 67,71,74,71,72,74,76,79]
    while t<t1-1e-3:
        bar=(i//4)%4;beat=i%4
        if full:
            if beat in (0,2):at(mus,t,kick(),.9)
            if beat in (1,3):at(mus,t,clap(),.7)
            for h in range(2):at(mus,t+h*b/2,hat(),1 if h else .6)
        else:
            at(mus,t,shaker(),.8);at(mus,t+b/2,shaker(),.5)
            if beat==0:at(mus,t,kick(),.45)
        if beat in (0,2):at(mus,t,bass(ROOT[bar]+(12 if beat==2 else 0)),.8)
        if beat in (1,3):[at(mus,t+b/2,pizz(m,.25),.28) for m in CH[bar]]
        for h in range(2):
            m=MEL[(i*2+h)%len(MEL)]
            if melody=='pizz' and (i*2+h)%3!=2: at(mus,t+h*b/2,pizz(m,.3),.32)
            if melody=='marimba' and (i*2+h)%4!=3: at(mus,t+h*b/2,marimba(m),.42)
        t+=b;i+=1
BPM=104;B=60/BPM
# A: playful intro until «Դե»
groove(0.0,T[2]-.05,BPM,full=False,melody='pizz')
# tape stop into «Դե»
def tapestop(buf,t_end,dur=.5):
    i1=int(t_end*SR);i0=i1-int(dur*SR);seg=buf[i0:i1].copy();n=len(seg)
    rate=np.linspace(1,.05,n);pos=np.cumsum(rate);pos=pos[pos<n-1];out=np.interp(pos,np.arange(n),seg)*np.linspace(1,0,len(pos))**.5
    buf[i0:i1]=0;buf[i0:i0+len(out)]+=out
tapestop(mus,T[2]+.05)
# B: the slow «waiting» music (half speed, muffled, wobbly) during the loading line
sl=z();groove(T[3]-.2,T[4]-.1,BPM/2,full=False,melody='pizz')  # writes into mus
seg_i0,seg_i1=int((T[3]-.2)*SR),int((T[4]-.1)*SR);part=mus[seg_i0:seg_i1].copy();tt=np.arange(len(part))/SR
wob=np.interp(np.arange(len(part))+ (np.sin(2*np.pi*.7*tt)*90),np.arange(len(part)),part)
mus[seg_i0:seg_i1]=lp(wob,1400)*.9
# C: Instagram line, dark drone + heartbeat
n=int((T[5]-T[4]+.1)*SR);tt=np.arange(n)/SR;dr=(np.sin(2*np.pi*55*tt)+.5*np.sin(2*np.pi*82.4*tt)+.3*np.sin(2*np.pi*110.3*tt))*np.minimum(1,tt/.4)*.18
at(mus,T[4]-.1,lp(dr,500))
for k in range(int((T[5]-T[4])/.75)):at(mus,T[4]+.1+k*.75,kick(),.55);at(mus,T[4]+.32+k*.75,kick(),.35)
# riser into Wiy, then full groove (marimba) to the end, final chord
rd=1.3;n=int(rd*SR);tt=np.arange(n)/SR;f=200+1800*(tt/rd)**2;ris=bp(noise(rd),300,6000)*(tt/rd)**2*.5+np.sin(2*np.pi*np.cumsum(f)/SR)*(tt/rd)**3*.15
at(mus,T[5]-rd,ris)
D=T[5];groove(D,END-1.2,BPM,full=True,melody='marimba')
for m in [48,60,64,67,72]:at(mus,END-1.2,tone(mid(m),1.6,((1,1),(2,.3)),.005,.6),.3)
# ---- SFX bus
sfx=z()
def chime(f0=1568):
    return sum(tone(f0*r,1.0,((1,1),(2.76,.3),(5.4,.1)),.001,.35)*g for r,g in ((1,1),(1.26,.7),(1.5,.6),(2,.5)))*.2
def bell(f=1320):return tone(f,1.0,((1,1),(2.76,.4),(5.4,.15)),.001,.3)*.35
def pop(f=900):n=int(.09*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*f*t*(1-t*3))*env(n,.002,.03)*.5
def click():return hp(noise(.025),2500)*env(int(.025*SR),.0005,.006)*.4
def whoosh(d=.5):n=int(d*SR);t=np.linspace(0,1,n);return bp(noise(d),300,3500)*np.sin(np.pi*t)**2*.35
def scratch():
    n=int(.45*SR);t=np.arange(n)/SR;s=np.sin(2*np.pi*(3.5)*t);pos=np.cumsum(1+1.6*s)
    src=bp(noise(1.2),800,5000);return np.interp(pos%len(src),np.arange(len(src)),src)*env(n,.005,.25)*.5
def trombone():
    out=np.zeros(0)
    for k,(m,dd) in enumerate([(55,.32),(54,.32),(53,.32),(52,1.0)]):
        n=int(dd*SR);t=np.arange(n)/SR;vib=1+(.012*np.sin(2*np.pi*6*t) if k==3 else 0);ph=np.cumsum(mid(m)*vib)/SR
        saw=sum(np.sin(2*np.pi*h*ph)/h for h in range(1,12));k_=np.sin(np.pi*np.minimum(1,t/dd));w=(lp(saw,650)*(1-k_)+lp(saw,1700)*k_)*env(n,.03,dd*.9)
        out=np.concatenate([out,w])
    return out*.35
def beep():n=int(.38*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*1000*t)*np.minimum(1,np.minimum(t,(n/SR-t))/.005)*.35
def buzz(d=.6):n=int(d*SR);t=np.arange(n)/SR;return np.sign(np.sin(2*np.pi*150*t))*(np.sin(2*np.pi*12*t)>0)*.08
def dialup():n=int(.7*SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*(1200+900*np.sin(2*np.pi*7*t))*t)*.5+bp(noise(.7),1500,4000)*.4)*env(n,.01,.4)*.18
def boom():n=int(.9*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*(35+60*np.exp(-t*8))*t)*env(n,.002,.35)*.9
def flick():return bp(noise(.06),2000,7000)*env(int(.06*SR),.001,.02)*.4
def register():
    x=bell(2093)*.8;c=click()*1.5;x[:len(c)]+=c;return x
# S1 intro
at(sfx,T[0]+.2,pop(950));at(sfx,T[0]+1.1,chime(1318),.7)
for i in range(3):at(sfx,T[1]+.4+i*.45,pop(1000+i*90));at(sfx,T[1]+.55+i*.45,click(),1.2)
at(sfx,TE[1]-1.0,chime(1568),.5)
# S2 «Դե…» record scratch + dial-up
at(sfx,T[2]-.05,scratch());at(sfx,T[2]+.7,dialup())
# S3 loading: ticks, calendar flicks, sad trombone on «հնանալ»
for k in range(int((TE[3]-T[3])/.5)):at(sfx,T[3]+k*.5,click(),.6)
for k in range(4):at(sfx,T[3]+.2+k*(TE[3]-T[3])/4,flick())
at(sfx,TE[3]-.75,trombone())
# S4 dark: phone buzz, censor beep on «#@!»
at(sfx,T[4]+.2,buzz(.9));at(sfx,T[4]+.7,beep())
# S5 Wiy: whoosh, boom on the blue burst, pop when the site appears, stopwatch ding
at(sfx,T[5]-.25,whoosh(.6));at(sfx,T[5]+.15,boom(),.8);at(sfx,T[5]+.2,chime(2093),.5);at(sfx,T[5]+.35,pop(700));at(sfx,T[5]+.9,bell(1760),.6)
# S6 shares: tap, whoosh + ping per chat, heart pops
DD=TE[6]-T[6];at(sfx,T[6]+.2,click(),1.5)
for i in range(4):s0=T[6]+.4+i*DD*.17;at(sfx,s0,whoosh(.4),.6);at(sfx,s0+.45,pop(1100+i*120));at(sfx,s0+.6,bell(2349),.35)
# S7 orders: register for each alert
for i in range(4):at(sfx,T[7]+.1+i*.3,register(),.6)
# S8 typing «ԲՐԵՆԴ», send, logo
for k in range(5):at(sfx,T[8]+.65+k*.16,click(),1.1)
at(sfx,T[8]+1.6,whoosh(.35),.7);at(sfx,T[8]+1.7,pop(900));at(sfx,T[8]+.05,chime(1318),.5)
# ---- voice + ducking
sr,v=wf.read('voice/voice48.wav');v=v.astype(np.float64);v/=np.max(np.abs(v))+1e-9;vo=z();vo[:min(N,len(v))]=v[:N]
e=np.abs(vo);e=lp(e,8);e=e/ (np.percentile(e,99)+1e-9);e=np.clip(e,0,1)
# smooth attack/release
g=np.zeros(N);a_att=np.exp(-1/(.04*SR));a_rel=np.exp(-1/(.35*SR));cur=0
ef=e.copy()
for i in range(0,N,48):
    x=ef[i];cur=a_att*cur+(1-a_att)*x if x>cur else a_rel*cur+(1-a_rel)*x;g[i:i+48]=cur
duck=10**(-14*np.clip(g*1.6,0,1)/20)
# music EQ: dip 1.5k and 3k for speech
def peak(x,f,gain_db,q=1.2):
    A=10**(gain_db/40);w=2*np.pi*f/SR;al=np.sin(w)/(2*q);b=[1+al*A,-2*np.cos(w),1-al*A];a=[1+al/A,-2*np.cos(w),1-al/A];return ss.lfilter(b,a,x)
musq=peak(peak(mus,1500,-4),3000,-4)
mix=vo*1.0+musq*.32*duck+sfx*.55*(10**(-4*np.clip(g,0,1)/20))
mix=np.tanh(mix*1.1)/1.1
wf.write('voice/mix_pre.wav',SR,(mix/np.max(np.abs(mix))*.95*32767).astype(np.int16))
wf.write('voice/music_only.wav',SR,(musq/np.max(np.abs(musq))*.9*32767).astype(np.int16))
print('ok',END)
