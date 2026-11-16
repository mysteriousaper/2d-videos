import numpy as np, subprocess, scipy.signal as ss, scipy.io.wavfile as wf, json, sys, os
SR=48000
def load(p):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32).astype(np.float64)
sr,v=wf.read('voice/voice48.wav');v=v.astype(np.float64);v/=np.max(np.abs(v))
END=33.6;N=int(END*SR);vo=np.zeros(N);vo[:min(N,len(v))]=v[:N];DROP=16.88
b,a=ss.butter(2,8,'low',fs=SR);e=ss.lfilter(b,a,np.abs(vo));e=np.clip(e/np.percentile(e,99),0,1)
g=np.zeros(N);cur=0;aa=np.exp(-1/(.03*SR/48));ar=np.exp(-1/(.3*SR/48))
for i in range(0,N,48):x=e[i];cur=aa*cur+(1-aa)*x if x>cur else ar*cur+(1-ar)*x;g[i:i+48]=cur
duck=10**(-12*np.clip(g*1.7,0,1)/20)
def rms(x,w):n=int(w*SR);m=len(x)//n;return np.sqrt((x[:m*n].reshape(m,n)**2).mean(1))
out={}
for name in sys.argv[1:]:
    x=load(f'music/{name}.mp3');r=rms(x,.5);
    # biggest rise in energy (2 s after vs 2 s before), not in the first 3 s
    best,bt=-1,0
    for i in range(6,len(r)-4):
        rise=r[i:i+4].mean()-r[i-4:i].mean()
        if rise>best:best,bt=rise,i*.5
    off=max(0,bt-DROP)
    if off+END>len(x)/SR: off=max(0,len(x)/SR-END)
    seg=x[int(off*SR):int(off*SR)+N];seg=np.pad(seg,(0,N-len(seg)))
    t=np.arange(N)/SR;seg*=np.minimum(1,t/.4)*np.minimum(1,(END-t)/2.0)
    seg/=np.percentile(np.abs(seg),99.5)+1e-9
    mix=vo+seg*.42*duck
    mix=np.tanh(mix*1.05);mix/=np.max(np.abs(mix))*1.05
    fn=f'music/prev_{name}.wav';wf.write(fn,SR,(mix*32767).astype(np.int16))
    out[name]=dict(offset=round(off,1),build=bt,dur=round(len(x)/SR,1))
    print(name,out[name])
json.dump(out,open('music/offsets.json','w'),indent=1)
