import numpy as np, wave
SR=48000;D=50.6;n=int(SR*D);out=np.zeros(n)
rng=np.random.default_rng(3)
def bandnoise(dur,lo,hi):
    m=int(SR*dur);x=rng.standard_normal(m);X=np.fft.rfft(x);f=np.fft.rfftfreq(m,1/SR);X[(f<lo)|(f>hi)]=0;y=np.fft.irfft(X,m);return y/ (np.abs(y).max()+1e-9)
def scratch(t,dur,vol=.12):
    y=bandnoise(dur,1800,7000)
    # pen strokes: bursty amplitude ~9 strokes/sec
    tt=np.arange(len(y))/SR;env=(0.5+0.5*np.sin(2*np.pi*(7+rng.random()*4)*tt+rng.random()*6))**2
    env*=np.minimum(1,tt/0.05)*np.minimum(1,(dur-tt)/0.12)
    i=int(t*SR);j=min(n,i+len(y));out[i:j]+=(y*env*vol)[:j-i]
# scene starts (drawing begins 0.3 s early) and how long the pen keeps writing
for t0,d in [(0.60,1.8),(4.80,1.6),(8.50,1.6),(11.60,1.5),(14.10,1.3),(18.30,1.4),(22.05,1.0),(28.80,1.7),(31.60,1.3),(35.20,1.0),(38.60,0.8),(40.30,1.5),(45.10,1.8),(48.30,1.2)]:
    scratch(t0,d,.09)
w=wave.open('pen4.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes());w.close();print('ok')
