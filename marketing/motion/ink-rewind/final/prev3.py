exec(open('prev.py').read().split("n=int(RW*SR)")[0])
B=60/172.25
sc=seg(11.3,11.8)
def scratch4(n_scr=4):
    m=int(B*SR);out=np.zeros((m*n_scr,2))
    for k in range(n_scr):
        tt=np.arange(m)/SR;half=m//2
        # forward push (first half of the beat) then pull back (second half): one "wicka"
        half=int(m*.34);rf=np.sin(np.pi*np.arange(half)/half)*3.0;pf=np.clip(np.cumsum(rf).astype(int),0,len(sc)-1);fw=sc[pf]
        rb=np.sin(np.pi*np.arange(m-half)/(m-half))*1.6;pb=np.clip(pf[-1]-np.cumsum(rb).astype(int),0,len(sc)-1);bw=sc[pb]
        s=np.concatenate([fw,bw]);L=int(m*.68);s=s[:L]
        env=np.minimum(1,np.arange(L)/(.003*SR))[:,None]*np.minimum(1,(L-np.arange(L))/(.015*SR))[:,None]
        y=bp(s,300,5000)*env;y=y/np.max(np.abs(y))*.9
        out[k*m:k*m+L]=y
    return out
r=scratch4()
RW_LEN=len(r)/SR
# rebuild with exact 4-beat rewind so the track enters on beat 5
def build2(name,rew,entry):
    v=V[int(VOICE_A*SR):int(VOICE_B*SR)]
    m=lp(lp(seg(21.6,21.6+(24.42-VOICE_A)),380),380)*.8
    k=int(.25*SR);tail=m[-k:];rate=np.linspace(1,.05,int(k*1.6));pos=np.cumsum(rate);pos=pos[pos<k-1].astype(int);stop=tail[pos]*np.linspace(1,0,len(pos))[:,None]
    m=np.concatenate([m[:-k],stop]);pre=np.zeros((len(v),2));pre[:min(len(m),len(v))]+=m[:len(v)];a=pre*.6+v
    d=seg(entry,entry+5.0)
    out=np.concatenate([np.zeros((int(.2*SR),2)),a,rew*1.0,d*.85])
    vv=V[int(28.5*SR):int(33.5*SR)];k=int(.2*SR)+len(a)+len(rew);out[k:k+len(vv)]+=vv
    out=out/np.max(np.abs(out))*.95
    w=wave.open('prev/'+name+'.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes());w.close()
build2('A4c_scratch_x4',r,11.274)
print('rewind length %.3f s (4 beats at 172.25 BPM)'%RW_LEN)
