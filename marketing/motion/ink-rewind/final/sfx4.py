import numpy as np, wave
SR=48000;DUR=50.6;N=int(SR*DUR);out=np.zeros(N);rng=np.random.default_rng(5)
def bp(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X[(f<lo)|(f>hi)]=0;return np.fft.irfft(X,len(x))
def env(n,a,d):
    t=np.arange(n)/SR;return np.minimum(1,t/a)*np.exp(-t/d)
def add(t,s,g=1):
    i=int(t*SR);j=min(N,i+len(s));
    if i<N: out[i:j]+=s[:j-i]*g
def whoosh(d=.35,g=1,lo=300,hi=3000):
    n=int(d*SR);x=rng.standard_normal(n);y=np.zeros(n);k=10
    for q in range(k):
        a=q*n//k;b=(q+1)*n//k;c=lo*(hi/lo)**(q/k);y[a:b]=bp(x[a:b],c*.6,c*1.6)
    return y*np.sin(np.pi*np.linspace(0,1,n))**1.6*g
def pop(g=1,f=600):
    n=int(.09*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*(f-0.45*f*t/.09)*t)*np.exp(-t*38)*g
def tick(g=1):
    n=int(.025*SR);return bp(rng.standard_normal(n),1800,7000)*env(n,.0005,.005)*g
def thud(g=1,f0=65):
    n=int(.45*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*(f0+60*np.exp(-t*30))*t)*np.exp(-t*8)*g
def ding(g=1,f=1320):
    n=int(.9*SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*1.5*t))*np.exp(-t*4)*np.minimum(1,t/.003)*g
def chime(g=1):
    n=int(1.3*SR);t=np.arange(n)/SR;return sum(np.sin(2*np.pi*f*t)*np.exp(-t*(2.5+i))*np.minimum(1,np.maximum(0,(t-i*.07))/.003) for i,f in enumerate([880,1108,1320,1760]))*g
def buzz(g=1):
    n=int(.35*SR);t=np.arange(n)/SR;s=np.sign(np.sin(2*np.pi*110*t))*.5+np.sign(np.sin(2*np.pi*116*t))*.5;return bp(s,80,2000)*np.minimum(1,t/.005)*np.exp(-t*5)*g
def scratch(g=1):
    n=int(.5*SR);t=np.arange(n)/SR;x=rng.standard_normal(n);f=2000*np.exp(-t*6)+200;y=np.zeros(n);k=12
    for q in range(k):
        a=q*n//k;b=(q+1)*n//k;c=f[a];y[a:b]=bp(x[a:b],c*.7,c*1.5)
    return y*np.exp(-t*3)*g
def click(g=1):
    n=int(.03*SR);return bp(rng.standard_normal(n),900,5000)*env(n,.0005,.008)*g

for tc in [4.90,8.60,11.70,14.20,18.40,22.15,28.90,31.70,35.30,38.70,40.40,45.20]: add(tc,whoosh(.36,.45))
add(0.03,ding(.5,1568));add(0.16,ding(.4,2093));add(0.72,whoosh(.65,.6,200,6000));add(1.30,whoosh(.5,.35,3000,600));add(1.84,pop(.45,500))
for k in range(5): add(2.100+k*.48,tick(.45))
for k in range(3): add([1.9,2.4,2.9][k],pop(.4,330))
add(5.500,pop(.6,520));add(6.600,whoosh(.3,.3,600,4000));add(7.000,pop(.4,900))
for k in range(16): add(8.800+k*.05,tick(.25))
for k in range(3): add(9.500+k*.18,pop(.3,400+k*80))
add(10.400,click(.8))
add(12.350,scratch(.6));add(12.550,thud(.8,70));add(12.900,buzz(.4))
for k in range(9): add(14.300+k*.07,pop(.3,350+((k*137)%500)))
for k in range(3): add(15.500+k*.15,pop(.45,300))
for k in range(14): add(18.600+k*.065,tick(.28))
add(19.600,whoosh(.3,.5,500,4000));add(19.750,pop(.45,880))
for k in range(6): add(20.350+k*.1,tick(.16))
for k in range(12): add(20.900+k*.11,tick(.22))
add(23.020,ding(.35,1046));add(23.220,thud(.45,55))
add(29.500,pop(.45,700));add(29.900,scratch(.35));add(30.200,whoosh(.3,.4,800,5000))
for k in range(9): add(31.900+[0,4,9,15,22,30,37,45,52][k]/60,pop(.3,600+k*30))
add(33.600,pop(.5,900))
for k in range(10): add(35.400+k*.11,tick(.25))
add(36.350,ding(.35,1320))
add(39.050,thud(.8,70));add(39.200,chime(.45))
for k in range(7): add(41.100+k*.5,pop(.3,500+k*40))
for k in range(8): add(45.700+k*.13,tick(.3))
add(46.800,whoosh(.3,.5,500,4000));add(47.100,pop(.45,800));add(48.000,chime(.5))
import wave
o=np.clip(out,-1,1);w=wave.open('sfx4.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((o*32767).astype(np.int16).tobytes());w.close();print('sfx ok')
