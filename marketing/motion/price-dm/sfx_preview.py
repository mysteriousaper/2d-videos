# Temporary SFX bed for the silent preview (all synthesised). Final mix waits for the real voice + chosen music.
import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000;DUR=35.6;out=np.zeros(int(SR*DUR));rng=np.random.default_rng(7)
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
T=[0.05,1.4,2.7,4.4,5.9,7.0,8.3,9.8,11.9,12.9,16.0,19.5,20.8,22.4,25.0,27.4,29.1,30.8]
for t0 in [2.33,5.53,12.53,15.25,19.13,20.43,22.03,24.63,27.03,30.43,33.28]:add(t0-.05,whoosh(.55))
add(T[1]+.1,whoosh(.9),.7)
for k in range(14):add(T[2]+.2+k*k*.008,click(),1.2)
add(T[3],thud());add(T[3]+.05,ding(660),.6)
for k in range(11):add(T[4]+.15+k*.075,click())
add(T[5],pop(700));add(T[5]+.4,pop(500),.6);add(T[6],pop(800));add(T[6]+.5,pop(1200),.5);add(T[6]+.8,pop(1300),.5)
for i in range(4):add(T[7]+.1+i*.35,pop(950+i*80))
for k in range(11):add(T[8]+k*.04,click(),.8)
for k in range(6):add(T[9]+.2+k*.22,click(),.6)
add(T[9]+1.9,ding());add(T[10],thud(),.8)
for k in range(10):add(T[10]+.2+k*.12,click(),.35)
add(T[11]+.1,scratch(.65));add(T[11]+.75,whoosh(.8),1.0);add(T[11]+.75,thud(),.6)
for i in range(9):add(T[12]+.05+i*.11,pop(900+i*40),.7)
add(T[13]+.2,pop(800));add(T[13]+.45,whoosh(.4),.6);add(T[13]+1.1,click(),1.5);add(T[13]+1.3,whoosh(.4),.6)
add(T[14],pop(1000));add(T[14]+.5,whoosh(.5),.6);add(T[14]+1.3,ding(1180))
add(T[15],pop(800));add(T[15]+.1,whoosh(.5),.5)
for k in range(9):add(T[16]+k*.1,click(),.6)
add(T[16]+.9,ding(1320),.8)
add(T[17]+.1,whoosh(.35),.6);add(T[17]+1.0,thud(),.6);add(T[17]+1.0,pop(500))
add(33.3,ding(990),.8);add(33.7,pop(900))
out=np.tanh(out*1.2)*.6
wf.write('sfx_preview.wav',SR,(out*32767).astype(np.int16))
