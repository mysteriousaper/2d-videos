# Temporary SFX bed for the silent preview (all synthesised). Final mix waits for the real voice + chosen music.
import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000;DUR=44.5;out=np.zeros(int(SR*DUR));rng=np.random.default_rng(7)
def add(t,x,g=1.0):
    i=int(t*SR);x=x[:max(0,len(out)-i)];out[i:i+len(x)]+=x*g
def env(n,a=.005,r=.1):
    t=np.arange(n)/SR;return np.minimum(1,t/a)*np.exp(-t/r)
def whoosh(d):
    n=int(d*SR);x=rng.standard_normal(n);t=np.linspace(0,1,n)
    b,a=ss.butter(2,[300,3500],'band',fs=SR);x=ss.lfilter(b,a,x);return x*np.sin(np.pi*t)**2*.35
def pop(f=900):
    n=int(.09*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*f*t*(1-t*3))*env(n,.002,.03)*.5
def click():
    n=int(.025*SR);x=rng.standard_normal(n);b,a=ss.butter(2,2500,'high',fs=SR);return ss.lfilter(b,a,x)*env(n,.0005,.006)*.35
def scratch(d):
    n=int(d*SR);x=rng.standard_normal(n);b,a=ss.butter(2,[1800,6000],'band',fs=SR);x=ss.lfilter(b,a,x)
    t=np.arange(n)/SR;am=.55+.45*np.sin(2*np.pi*9*t+np.sin(2*np.pi*3*t));return x*am*np.minimum(1,t/.02)*np.minimum(1,(d-t)/.05)*.12
def ding(f=1320):
    n=int(.9*SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2.01*t))*env(n,.002,.25)*.25
def thud():
    n=int(.35*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*(55+60*np.exp(-t*30))*t)*env(n,.002,.12)*.7
for a,b in [(2.9,3.3),(7.0,7.42),(14.1,14.52),(18.45,19.4),(24.5,24.92),(28.0,28.42),(31.3,31.72),(34.1,34.52),(37.7,38.12)]:add(a-.05,whoosh(b-a+.15))
add(22.7,whoosh(.7),.6)
for t0,d in [(.0,.0),(3.9,.6),(5.0,.6),(6.0,.8),(24.0,.75),(42.7,.8)]:
    if d:add(t0,scratch(d))
for t0 in [4.7,5.75]:add(t0,scratch(.25),1.3)
for k in range(11):add(7.8+k*.09+rng.uniform(0,.03),click())
for k in range(11):add(9.05+k*.04,click(),.8)
for t0,f in [(9.2,700),(10.8,800),(12.2,900),(25.0,1000),(28.4,1000),(31.7,1000),(34.5,1000),(32.0,1100),(32.55,1150),(33.1,1200),(35.0,800),(35.9,1000),(42.2,900)]:add(t0,pop(f))
add(15.95,click(),2);add(16.3,ding());add(19.55,thud());add(23.6,pop(600));add(36.9,thud(),.5);add(38.0,ding(990),.8)
out=np.tanh(out*1.2)*.6
wf.write('sfx_preview.wav',SR,(out*32767).astype(np.int16))
