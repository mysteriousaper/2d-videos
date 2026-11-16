# v2 sound: driving 120 BPM, mood follows the voice sentence by sentence, small "drive" SFX on every move.
import json, re, numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000
h=open('aram.html').read();BT=json.loads(re.search(r'const BT=(\{[^}]*\});',h).group(1))
d=json.load(open('voice/timing.json'));LN=d['LINES'];END=LN[8][1]+2.6;N=int(SR*END)
rng=np.random.default_rng(5)
z=lambda:np.zeros(N)
def at(buf,t,x,g=1.0):
    i=int(round(t*SR))
    if i<0:x=x[-i:];i=0
    x=x[:max(0,N-i)];buf[i:i+len(x)]+=x*g
def env(n,a=.004,r=.15):t=np.arange(n)/SR;return np.minimum(1,t/max(a,1e-4))*np.exp(-t/r)
def tone(f,dur,parts=((1,1),),a=.004,r=.2):n=int(dur*SR);t=np.arange(n)/SR;return sum(g*np.sin(2*np.pi*f*k*t) for k,g in parts)*env(n,a,r)
mid=lambda m:440*2**((m-69)/12)
def filt(x,f,kind):b,a=ss.butter(2,f,kind,fs=SR);return ss.lfilter(b,a,x)
lp=lambda x,f:filt(x,f,'low');hp=lambda x,f:filt(x,f,'high');bp=lambda x,lo,hi:filt(x,[lo,hi],'band')
noise=lambda d:rng.standard_normal(int(d*SR))
def saw(f,dur,a=.004,r=.2,n_h=14):n=int(dur*SR);t=np.arange(n)/SR;return sum(np.sin(2*np.pi*f*k*t)/k for k in range(1,n_h))*env(n,a,r)
# instruments
def kick(g=1):n=int(.32*SR);t=np.arange(n)/SR;f=42+95*np.exp(-t*30);return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.001,.13)*g
def clap():
    x=np.zeros(int(.25*SR))
    for o in (0,.011,.022):x[int(o*SR):int(o*SR)+int(.2*SR)]+=bp(noise(.2),900,4000)*env(int(.2*SR),.0005,.03 if o<.02 else .07)
    return x*.55
def snap():return bp(noise(.06),1800,6000)*env(int(.06*SR),.0005,.012)*.6
def hat(open_=False):d=.18 if open_ else .05;return hp(noise(d),7500)*env(int(d*SR),.0005,.06 if open_ else .012)*(.3 if open_ else .28)
def crash():return hp(noise(1.6),5000)*env(int(1.6*SR),.002,.5)*.35
def pluckbass(m,d=.24):return lp(saw(mid(m),d,.003,.09,8),1100)*.55
def subbass(m,d=.24):return lp(saw(mid(m),d,.003,.16,6),700)*.7
def glock(m,d=.6):return tone(mid(m),d,((1,1),(2.76,.25),(5.4,.08)),.001,.25)*.35
def pluck(m,d=.3):return lp(saw(mid(m),d,.002,.08,10),3200)*.28
def stab(ms,d=.22):return sum(lp(saw(mid(m),d,.003,.1,10),2600) for m in ms)*.16
def brass(ms,d=.5,r=.25):return sum(lp(saw(mid(m)*(1+.003*k),d,.03,r,16),1800) for k,m in enumerate(ms))*.18
def rhodes(ms,d=.9):return sum(tone(mid(m),d,((1,1),(2,.25),(3,.06)),.01,.5) for m in ms)*.16
B=.5;D0=BT['wiy'];grid=lambda k:D0+k*B
mus=z();sfx=z()
CH=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]];RT=[36,33,29,31]
HOOK=[72,0,76,79,0,76,74,0, 72,0,69,72,0,74,76,0]
# 1) proud storytelling (bouncy, light) until «Դե»
k0=int(np.ceil((0.35-D0)/B));k=k0
while grid(k)<BT['de']-.45:
    t=grid(k);beat=(k-k0)%4;bar=((k-k0)//4)%4
    if beat in (0,2):at(mus,t,kick(.6))
    if beat in (1,3):at(mus,t,snap())
    at(mus,t+B/2,hat(),.8)
    at(mus,t,pluckbass(RT[bar]+12+(7 if beat==2 else 0)),.9)
    m=HOOK[((k-k0)*2)%16];m2=HOOK[((k-k0)*2+1)%16]
    if m:at(mus,t,glock(m),.8)
    if m2:at(mus,t+B/2,glock(m2),.6)
    k+=1
# accents on Aram's words
at(sfx,BT['aram']-.02,glock(84)+glock(88)*.7,.9)
at(sfx,BT['hamegh'],glock(91),.7);at(sfx,BT['tkhum'],glock(96),.5)
for i,b in enumerate(['arel','amen','nkaten']):at(sfx,BT[b],tone(mid(84+i*4),.18,((1,1),(2,.3)),.001,.06)*.5)
at(sfx,BT['kayq']-.05,brass([60,64,67,72],.6,.35),1.2)
# 2) «Դե…»: tape stop, scratch, crickets, then a rimshot after «չափազանցություն է…»
def tapestop(buf,t_end,dur=.42):
    i1=int(t_end*SR);i0=i1-int(dur*SR);seg=buf[i0:i1].copy();n=len(seg);rate=np.linspace(1,.04,n);pos=np.cumsum(rate);pos=pos[pos<n-1]
    out=np.interp(pos,np.arange(n),seg)*np.linspace(1,0,len(pos))**.5;buf[i0:i1]=0;buf[i0:i0+len(out)]+=out
k=int(np.ceil((BT['de']-.45-D0)/B))
for kk in range(k,k+2):at(mus,grid(kk),kick(.6));at(mus,grid(kk),pluckbass(36),.9)
tapestop(mus,BT['de']+.02)
def scratch():n=int(.4*SR);t=np.arange(n)/SR;pos=np.cumsum(1+1.7*np.sin(2*np.pi*4*t));src=bp(noise(1.2),700,5000);return np.interp(pos%len(src),np.arange(len(src)),src)*env(n,.004,.22)*.55
at(sfx,BT['de']-.03,scratch())
def cricket():n=int(.12*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*40*t)>0)*env(n,.005,.05)*.12
for i in range(5):at(sfx,BT['de']+.35+i*.22,cricket())
for i,m in enumerate([43,43,46,41]):at(mus,BT['kayq2']+i*.3,lp(np.sign(np.sin(2*np.pi*mid(m)*np.arange(int(.18*SR))/SR))*env(int(.18*SR),.003,.06),900),.22)
rim=lambda:bp(noise(.05),2000,6000)*env(int(.05*SR),.0005,.01)*.6
tbe=BT['chap']+.42;at(sfx,tbe,rim());at(sfx,tbe+.14,rim());at(sfx,tbe+.3,crash()*.6)
at(sfx,tbe+.28,kick(.6))
# 3) the slow loading: lazy half-time lo-fi, tick-tock, slow-mo whoosh on «դանդաղ», womp-womp on «հնանալ»
t=BT['bacv']-.1;i=0;lo=z()
while t<BT['isk']-.15:
    if i%4==0:at(lo,t,kick(.5))
    if i%4==2:at(lo,t,snap()*.7)
    if i%2==0:at(lo,t,rhodes([57,60,64,67] if (i//4)%2==0 else [53,57,60,64],1.1),.9)
    at(sfx,t,tone(2400 if i%2 else 1800,.03,((1,1),),.001,.01)*.3)
    t+=.55;i+=1
seg=lo;tt=np.arange(N)/SR;wob=np.interp(np.arange(N)+np.sin(2*np.pi*.6*tt)*80,np.arange(N),seg);mus+=lp(wob,1300)*.9
def slowwhoosh():n=int(.9*SR);t=np.linspace(0,1,n);return lp(bp(noise(.9),150,1500),600)*np.sin(np.pi*t)**2*.45
at(sfx,BT['dandagh']-.1,slowwhoosh())
def womp(m,d):n=int(d*SR);t=np.arange(n)/SR;ph=np.cumsum(mid(m)*(1-.03*t/d))/SR;s_=sum(np.sin(2*np.pi*k*ph)/k for k in range(1,12));kk=np.sin(np.pi*np.minimum(1,t/d));return (lp(s_,600)*(1-kk)+lp(s_,1600)*kk)*env(n,.02,d*.8)*.3
at(sfx,BT['hnanal']+.05,womp(50,.32));at(sfx,BT['hnanal']+.4,womp(47,.75))
# 4) the blame: dramatic stabs on «Իսկ», «մեղադրում», «Instagram», buzz, censor beep, timpani roll
for b,g in (('isk',.8),('megh',.9),('insta',1.2)):at(mus,BT[b],brass([38,45,50,53],.7,.4),g);at(mus,BT[b],kick(1.0))
n=int((BT['ete']-BT['isk'])*SR);tt=np.arange(n)/SR;at(mus,BT['isk'],lp(np.sin(2*np.pi*55*tt)+.4*np.sin(2*np.pi*58.3*tt),300)*np.minimum(1,tt/.3)*.16)
def buzz(dd=.7):n=int(dd*SR);t=np.arange(n)/SR;return np.sign(np.sin(2*np.pi*150*t))*(np.sin(2*np.pi*12*t)>0)*.07
at(sfx,BT['megh']-.05,buzz(.8))
at(sfx,BT['insta']+.3,np.sin(2*np.pi*1000*np.arange(int(.34*SR))/SR)*.3)
# 5) riser into the drop on «WiyMood», then the full drive
rd=D0-BT['ete']+.2;n=int(rd*SR);tt=np.arange(n)/SR;u=tt/rd;f=180+2200*u**2
ris=bp(noise(rd),300,7000)*u**2*.45+np.sin(2*np.pi*np.cumsum(f)/SR)*u**3*.14
at(mus,D0-rd,ris)
for j in range(16):tt_=D0-1.0+ (1-(1-j/16)**1.6)*1.0;at(mus,tt_,snap()*(.3+.7*j/16))
k=0;HOOK2=[72,74,76,79,76,74,72,67, 69,72,74,76,74,72,69,67]
while grid(k)<END-1.1:
    t=grid(k);beat=k%4;bar=(k//4)%4
    at(mus,t,kick(1.0))
    if beat in (1,3):at(mus,t,clap())
    at(mus,t+B/2,hat(True),.9);at(mus,t+B/4,hat(),.5);at(mus,t+3*B/4,hat(),.5)
    for e in (0,1):at(mus,t+e*B/2,subbass(RT[bar]+(12 if e else 0)),.8)
    at(mus,t+B/2,stab(CH[bar]+[CH[bar][0]+12]),1.0)
    m=HOOK2[(k*2)%16];m2=HOOK2[(k*2+1)%16];at(mus,t,pluck(m),.9);at(mus,t+B/2,pluck(m2),.7)
    k+=1
at(mus,D0,crash());at(sfx,D0,kick(1.4));at(mus,END-1.1,brass([48,55,60,64,67,72],1.6,.8),1.2);at(mus,END-1.1,crash())
# drive SFX: whooshes on camera whips, zaps, sparkles, sends, orders, typing, the final hits
def whoosh(dd=.4):n=int(dd*SR);t=np.linspace(0,1,n);return bp(noise(dd),400,5000)*np.sin(np.pi*t)**2*.4
for tw in [BT['de']-.2,BT['bacv']-.25,BT['isk']-.02,BT['ete']-.3,BT['gegh']-.75,BT['bogh']-.5,BT['ete2']-.3]:at(sfx,tw-.1,whoosh(.42))
at(sfx,BT['tort']-.05,whoosh(.35),.6)
def zap():n=int(.25*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*np.cumsum(3000*np.exp(-t*14)+200)/SR)*env(n,.001,.08)*.35
at(sfx,BT['akn'],zap());at(sfx,BT['akn']+.02,glock(96),.6)
at(sfx,BT['kunenar'],tone(660,.12,((1,1),),.001,.04)*.5)
for i,m in enumerate([84,88,91,96,100]):at(sfx,BT['gegh']-.1+i*.06,glock(m),.55)
at(sfx,BT['mardik'],rim()*1.3)
def ping(f):return tone(f,.4,((1,1),(2.76,.3)),.001,.12)*.35
for i in range(4):s0=BT['mardik']+.25+i*.38;at(sfx,s0,whoosh(.3),.5);at(sfx,s0+.36,ping(1760+i*220))
def bell(f=2093):return tone(f,.9,((1,1),(2.76,.4),(5.4,.15)),.001,.28)*.3
for i in range(5):at(sfx,BT['miayn']+i*.28+.2,bell(2093+i*120),.8)
at(sfx,BT['txel'],crash()*.7)
def click():return hp(noise(.025),2500)*env(int(.025*SR),.0005,.006)*.45
for i in range(5):at(sfx,BT['brand']-.3+i*.08,click(),1.2)
at(sfx,BT['brand']+.27,whoosh(.3),.6);at(sfx,BT['brand']+.3,ping(1568))
at(sfx,BT['anvch'],kick(1.3));at(sfx,BT['anvch'],crash()*.8);at(sfx,BT['anvch'],brass([60,64,67,72],.5,.3),.8)
# voice + side-chain
sr,v=wf.read('voice/voice48.wav');v=v.astype(np.float64);v/=np.max(np.abs(v))+1e-9;vo=z();vo[:min(N,len(v))]=v[:N]
e=lp(np.abs(vo),8);e=np.clip(e/(np.percentile(e,99)+1e-9),0,1);g=np.zeros(N);cur=0;aa=np.exp(-1/(.03*SR/48));ar=np.exp(-1/(.3*SR/48))
for i in range(0,N,48):x=e[i];cur=aa*cur+(1-aa)*x if x>cur else ar*cur+(1-ar)*x;g[i:i+48]=cur
duck=10**(-12*np.clip(g*1.7,0,1)/20)
def peak(x,f,gdb,q=1.2):A=10**(gdb/40);w=2*np.pi*f/SR;al=np.sin(w)/(2*q);return ss.lfilter([1+al*A,-2*np.cos(w),1-al*A],[1+al/A,-2*np.cos(w),1-al/A],x)
musq=peak(peak(mus,1500,-4),3000,-5)
mix=vo*1.0+musq*.36*duck+sfx*.6*10**(-3*np.clip(g,0,1)/20)
mix=np.tanh(mix*1.1)/1.1
wf.write('voice/mix2_pre.wav',SR,(mix/np.max(np.abs(mix))*.95*32767).astype(np.int16))
print('ok',END)
