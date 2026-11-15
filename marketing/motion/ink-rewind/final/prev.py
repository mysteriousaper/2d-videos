import numpy as np,wave
from scipy.signal import butter,sosfilt
SR=48000
T=np.fromfile('race48.raw',dtype=np.float32).reshape(-1,2)
V=np.fromfile('voice48.raw',dtype=np.float32).reshape(-1,2)
def seg(a,b):return T[int(a*SR):int(b*SR)].copy()
def lp(x,f):return sosfilt(butter(2,f,'low',fs=SR,output='sos'),x,axis=0)
def hp(x,f):return sosfilt(butter(2,f,'high',fs=SR,output='sos'),x,axis=0)
def bp(x,a,b):return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x,axis=0)
def resamp(x,rate):  # variable playback rate array per output sample
    pos=np.cumsum(rate);pos=pos[pos<len(x)-1];i=pos.astype(int);f=(pos-i)[:,None];return x[i]*(1-f)+x[i+1]*f
VOICE_A,VOICE_B=24.0,26.87   # Մի րոպե՛ … Մի հատ նորից (voice timeline)
RW=1.6
def build(name,rew,entry,muff_from=21.6):
    v=V[int(VOICE_A*SR):int(VOICE_B*SR)]
    # muffled track under the first part, stopped at Մի րոպե
    m=lp(lp(seg(muff_from,muff_from+(24.42-VOICE_A)),380),380)*.8
    pre=np.zeros((len(v),2));pre[:len(m)]+=m
    a=pre*.6+v
    d=seg(entry,entry+5.0)
    out=np.concatenate([a,rew*.9,d*.85]);out=np.concatenate([np.zeros((int(.2*SR),2)),out])
    # voice continues: Ուրեմն… over the entry
    vv=V[int(28.5*SR):int(33.5*SR)];k=len(a)+len(rew)+int(.2*SR);out[k:k+len(vv)]+=vv*1.0
    out=out/np.max(np.abs(out))*.95
    w=wave.open('prev/'+name+'.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes());w.close()
n=int(RW*SR);t=np.arange(n)/SR
src=seg(14,20)
# 1 DJ backspin: music played backwards, fast then slowing, with a whoosh
r1=resamp(src[::-1],np.linspace(3.5,.6,n));r1=r1[:n];r1=np.pad(r1,((0,n-len(r1)),(0,0)));r1*=np.linspace(1,.2,n)[:,None]
# 2 VHS rewind: very fast reversed squeal (pitched up), wobbly, mostly highs
r2=resamp(seg(10,40)[::-1],np.full(n,8.0)+np.sin(2*np.pi*6*t)*1.5);r2=np.pad(r2[:n],((0,max(0,n-len(r2[:n]))),(0,0)));r2=hp(r2,900)*.7
r2+=bp(np.random.default_rng(1).standard_normal((n,2)),3000,9000)*.05
# 3 reverse crash swell: reversed cymbal-like noise rising into the drop
nz=hp(np.random.default_rng(2).standard_normal((n,2)),4000);env=(t/RW)**3;r3=nz*env[:,None]*.6
r3+=resamp(seg(11.3,13)[::-1],np.full(n,1.0))[:n]*(t/RW)[:,None]*.3 if len(resamp(seg(11.3,13)[::-1],np.full(n,1.0)))>=n else 0
# 4 rhythmic DJ scratches on the beat (wicka-wicka), 172 BPM 8ths
B=60/172.25;r4=np.zeros((n,2));sc=seg(11.3,11.8)
for k in range(int(RW/(B/2))):
    a=int(k*B/2*SR);m=int(B/2*SR);tt=np.arange(m)/SR;rate=np.sin(np.pi*tt/(B/2))*2.2*(1 if k%2==0 else -1)
    p=np.clip((np.cumsum(np.abs(rate))*(1)).astype(int),0,len(sc)-1);s=sc[p] if k%2==0 else sc[::-1][p]
    r4[a:a+m]+=bp(s,300,5000)[:max(0,min(m,n-a))]*.9
# 5 beat-repeat stutter accelerating: 1/4 → 1/8 → 1/16 → 1/32 of the entry hit
hit=seg(11.3,11.3+B);r5=[];lens=[B]*2+[B/2]*2+[B/4]*4+[B/8]*4;acc=0
for L in lens:
    m=int(L*SR);r5.append(hit[:m]*np.linspace(1,.6,m)[:,None])
r5=np.concatenate(r5);r5=lp(r5,6000);r5=np.pad(r5,((max(0,n-len(r5)),0),(0,0)))[:n] if len(r5)<n else r5[-n:]
for name,r in [('A1_backspin',r1),('A2_vhs',r2),('A3_reverse_crash',r3),('A4_scratch',r4),('A5_stutter',r5)]:
    build(name,r,11.30)
# entry comparisons with the backspin
build('B_entry_1m18',r1,78.18);build('C_entry_1m15',r1,75.40);build('D_entry_0m05_current',r1,5.73)
print('ok')
