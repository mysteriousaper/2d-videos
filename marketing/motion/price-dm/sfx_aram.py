# Temporary SFX bed for the silent preview (all synthesised). Final mix waits for the real voice + chosen music.
import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000;DUR=41.24;out=np.zeros(int(SR*DUR));rng=np.random.default_rng(7)
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
T=[0.1, 2.6, 7.35, 10.01, 12.51, 15.3, 17.51, 19.43, 21.64, 23.49, 26.86, 29.65, 32.15, 35.16];E=[2.42, 6.95, 9.83, 12.33, 15.12, 17.33, 19.25, 21.46, 23.09, 26.68, 29.47, 31.97, 34.76, 38.64]
for i in range(2,14):add(T[i]-.4,whoosh(.5))
add(T[0]+.2,pop(900));add(T[0]+1.1,ding(880),.6)
for i in range(3):add(T[1]+.4+i*.45,pop(1000+i*80))
add(T[2]+.6,thud(),.6)
for k in range(8):add(T[3]+.2+k*.25,click(),.5)
for i in range(3):add(T[4]+.9+i*.25,pop(700+i*100))
add(T[5]+.2,scratch(.8),.6)
for k in range(10):add(T[6]+.4+k*.12,click(),.9)
add(T[6]+.6,thud(),.4)
for k in range(6):add(T[7]+.3+k*.3,ding(1500),.15)
add(T[8]+.1,thud(),.8)
add(T[9]+.1,whoosh(.8));add(T[9]+.2,thud(),.6);add(T[9]+.85,ding(1320),.8)
add(T[10]+.2,ding(1100),.4)
add(T[11],pop(1000));[add(T[11]+(E[11]-T[11])*(.35+i*.12),click(),1.4) for i in range(3)];add(T[11]+(E[11]-T[11])*.8,ding(1180))
for i in range(4):add(T[12]+.1+i*.3,ding(1400),.4)
for k in range(5):add(T[13]+.6+k*.16,click(),.9)
add(T[13]+1.6,pop(900));add(T[13]+1.7,ding(990),.7)
out=np.tanh(out*1.2)*.6
wf.write('sfx_aram.wav',SR,(out*32767).astype(np.int16))
