// Shared drawing helpers, taken from ink-rewind/final/reel.html (lines 11–79).
function bez(x1,y1,x2,y2){return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;for(let i=0;i<8;i++){const cx=3*x1*t*(1-t)**2+3*x2*t*t*(1-t)+t**3-x;const d=3*x1*(1-t)**2+6*(x2-x1)*t*(1-t)+3*(1-x2)*t*t;if(Math.abs(d)<1e-6)break;t=Math.max(0,Math.min(1,t-cx/d));}return 3*y1*t*(1-t)**2+3*y2*t*t*(1-t)+t**3;}}
const E={land:bez(.1,.75,.15,1),heavy:bez(.75,0,.18,1),whip:bez(.85,0,.15,1),leave:bez(.55,0,.9,.35),drift:bez(.4,0,.6,1),outExpo:bez(.16,1,.3,1),io:bez(.65,0,.35,1)};
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),P=(t,a,b)=>cl((t-a)/(b-a)),L=(a,b,u)=>a+(b-a)*u;
function spring(u,z=.6,f=1.5){if(u<=0)return 0;if(u>=1)return 1;const w=f*2*Math.PI;return 1-Math.exp(-z*w*u*1.7)*Math.cos(w*Math.sqrt(1-z*z)*u*1.7);}
const pen=(lt,a,d)=>P(lt,a,a+d);
const seg=(p,k,n)=>cl(p*n-k);
function tf(x,y,s,r,fn){X.save();X.translate(x,y);X.rotate(r);X.scale(s,s);fn();X.restore();}
// ---------- bounds check (debug: every text must stay inside the safe frame) ----------
const DBG=[];let CHECK=false;let PULSE=0;
function reg(x0,y0,x1,y1,what){if(!CHECK||TRAVEL)return;const m=X.getTransform();const pts=[[x0,y0],[x1,y0],[x0,y1],[x1,y1]].map(([x,y])=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f]);
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const bx0=Math.min(...xs),bx1=Math.max(...xs),by0=Math.min(...ys),by1=Math.max(...ys);
 if(bx1<0||bx0>W||by1<0||by0>H)return; // fully off-screen (neighbour drawing): fine
 if(bx0<50||bx1>W-50||by0<60||by1>H-60)DBG.push([what,Math.round(bx0),Math.round(bx1),Math.round(by0),Math.round(by1)]);}
// clip rect for text inside UI boxes (phone screens etc.): registered separately
let BOX=null,TRAVEL=false;
function boxCheck(x0,x1,what){if(!CHECK||!BOX)return;const m=BOX.multiply(X.getTransform());[x0,x1].forEach(x=>{const lx=m.a*x+m.e;if(lx<-1||lx>461)DBG.push(['BOX:'+what,Math.round(lx)]);});}
// solid hand-lettered text (small UI text); shrinks to maxW
function txt2(s,x,y,size,o){const p=s.split('|');p.forEach((q,i)=>txt(q,x,y+(i-(p.length-1)/2)*size*1.15,size,o));}
function txt(s,x,y,size,{col=INK.ink,al='center',w=700,maxW=0,a=1,f='SA'}={}){X.save();X.globalAlpha*=a;X.font=`${w} ${size}px ${f}`;let m=X.measureText(s).width;if(maxW&&m>maxW){size*=maxW/m;X.font=`${w} ${size}px ${f}`;m=maxW;}
 const wob=Ink.sn(Ink.BF*.9+s.length*1.3)*.7;X.fillStyle=col;X.textAlign=al;X.textBaseline='middle';X.fillText(s,x+wob,y-wob*.5);
 const x0=al=='center'?x-m/2:al=='right'?x-m:x;reg(x0,y-size*.6,x0+m,y+size*.6,s);boxCheck(x0,x0+m,s);X.restore();return m;}
// outlined ink text (big words); shrinks to maxW
function itxt(s,x,y,size,o={}){if(o.maxW)size=Ink.fitSize(s,size,o.maxW,o.fam||'S');const w=Ink.textW(s,size,o.fam||'S');const al=o.al||'center';const x0=al=='center'?x-w/2:al=='right'?x-w:x;reg(x0,y-size*.6,x0+w,y+size*.45,s);boxCheck(x0,x0+w,s);inkText(s,x,y,size,o);return w;}
// ---------- drawing vocabulary ----------
const K=INK;
function check(x,y,s,p,col=K.green,id=1){tf(x,y,s,0,()=>{ink(Sh.circle(0,0,40),{w:5,col,prog:seg(p,0,2),id});ink(Sh.poly([[-18,0],[-5,15],[22,-16]]),{w:7,col,prog:seg(p,1,2),id:id+1});});}
function cross(x,y,s,p,col=K.red,id=1){tf(x,y,s,0,()=>{ink(Sh.line(-20,-20,20,20),{w:7,col,prog:seg(p,0,2),id});ink(Sh.line(20,-20,-20,20),{w:7,col,prog:seg(p,1,2),id:id+1});});}
function heart(x,y,s,p,col=K.red,id=1,dash=false){tf(x,y,s,0,()=>{ink(join(Sh.bez([0,30],[-70,-20],[-40,-72],[0,-36]),Sh.bez([0,-36],[40,-72],[70,-20],[0,30])),{w:5,col,prog:p,id,gaps:dash?.45:.1});});}
function star(x,y,r,p,col=K.ink,id=1){const pts=[];for(let i=0;i<=10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}ink([pts],{w:3.5,col,prog:p,id});}
function arrow(pts,p,col=K.ink,id=1,w=5){const c=Sh.cat(pts,12)[0];ink([c],{w,col,prog:p,id});if(p>.97){const a=c[c.length-1],b=c[c.length-4]||c[0];const ang=Math.atan2(a[1]-b[1],a[0]-b[0]);ink([[[a[0]+Math.cos(ang+2.6)*30,a[1]+Math.sin(ang+2.6)*30],a,[a[0]+Math.cos(ang-2.6)*30,a[1]+Math.sin(ang-2.6)*30]]],{w,col,id:id+2});}}
function chart(x,y,w,h,pts,p,col,id=1,{axes=true}={}){tf(x,y,1,0,()=>{if(axes)ink(join(Sh.line(0,0,0,h),Sh.line(0,h,w,h)),{w:4,prog:seg(p,0,2)*1,id});const q=pts.map(([u,v])=>[u*w,h-v*h]);arrow(q,seg(p,.6,1.6),col,id+3,7);});}
function clock(x,y,r,ang,p,id=1,col=K.ink){tf(x,y,1,0,()=>{ink(Sh.circle(0,0,r),{w:5,prog:seg(p,0,2),id,col});for(let i=0;i<12;i++){const a=i/12*Math.PI*2;if(seg(p,1,2)>i/12)ink(Sh.line(Math.cos(a)*r*.82,Math.sin(a)*r*.82,Math.cos(a)*r*.92,Math.sin(a)*r*.92),{w:3,id:id+i,dbl:0,col});}
 if(p>.5){ink(Sh.line(0,0,Math.cos(ang-Math.PI/2)*r*.7,Math.sin(ang-Math.PI/2)*r*.7),{w:5,id:id+20,col});ink(Sh.line(0,0,Math.cos(ang/12-Math.PI/2)*r*.45,Math.sin(ang/12-Math.PI/2)*r*.45),{w:6,id:id+21,col});}});}
function pin(x,y,s,p,col=K.red,id=1){tf(x,y,s,0,()=>{ink(join(Sh.bez([0,60],[-80,-10],[-60,-90],[0,-90]),Sh.bez([0,-90],[60,-90],[80,-10],[0,60])),{w:6,col,prog:seg(p,0,1.4),id});ink(Sh.circle(0,-40,20),{w:5,col,prog:seg(p,.9,1.4)*1,id:id+1});});}
function moon(x,y,r,p,id=1){tf(x,y,1,0,()=>{ink(join(Sh.ellipse(0,0,r,r,Math.PI*.3,Math.PI*1.7,30),Sh.ellipse(r*.38,0,r*.78,r*.78,Math.PI*1.68,Math.PI*.32,30)),{w:5,prog:p,id});});}
function sparkle(x,y,r,p,col=K.gold,id=1){ink(join(Sh.line(x-r,y,x+r,y),Sh.line(x,y-r,x,y+r),Sh.line(x-r*.5,y-r*.5,x+r*.5,y+r*.5)),{w:3.5,col,prog:p,id,dbl:0});}
// Լիլիթ: line portrait (illustration, not a real person)
function face(x,y,r,o={}){const p=o.prog??1,id=o.id??100,mood=o.mood||'smile',col=o.col||K.ink,blink=o.blink;tf(x,y,1,o.rot||0,()=>{
 const n=6;
 ink(Sh.circle(0,0,r),{w:r*.05+2,prog:seg(p,0,n),id,col});
 ink(Sh.cat([[-r*1.0,r*1.05],[-r*1.18,r*.1],[-r*.95,-r*.75],[-r*.3,-r*1.18],[r*.4,-r*1.15],[r*1.0,-r*.7],[r*1.18,r*.1],[r*1.0,r*1.05]]),{w:r*.05+2,prog:seg(p,1,n),id:id+1,col});
 ink(Sh.bez([-r*.92,-r*.2],[-r*.45,-r*.82],[r*.35,-r*.9],[r*.95,-r*.25]),{w:r*.04+2,prog:seg(p,2,n),id:id+2,col});
 const ep=seg(p,3,n);const lx=(o.look||0)*r*.06;
 if(ep>0){[-1,1].forEach((sd,k)=>{const ex=sd*r*.33+lx,ey=r*.08;if(blink||mood=='sleep')ink(Sh.line(ex-r*.1,ey,ex+r*.1,ey),{w:r*.04+2,id:id+3+k,col,prog:ep});
   else if(mood=='happy'||mood=='love')ink(Sh.ellipse(ex,ey+r*.04,r*.11,r*.1,Math.PI,Math.PI*2,10),{w:r*.04+2,id:id+3+k,col,prog:ep});
   else{ink(Sh.circle(ex,ey,r*.085),{w:r*.035+1.5,id:id+3+k,col,prog:ep});X.save();X.fillStyle=col;X.globalAlpha*=ep;X.beginPath();X.arc(ex+lx*.3,ey+r*.01,r*.04,0,7);X.fill();X.restore();}});}
 const bp=seg(p,4,n);if(bp>0){const bt=mood=='frown'||mood=='sad'?.12:mood=='wow'?-.08:0;[-1,1].forEach((sd,k)=>ink(Sh.line(sd*r*.48,-r*.16+(mood=='frown'?-sd*0:0)-r*bt*(sd>0?-1:1)*0, sd*r*.18, -r*.2-(mood=='frown'?-r*.08:0)+(mood=='wow'?-r*.08:0)),{w:r*.035+1.5,id:id+6+k,col,prog:bp}));}
 const mp=seg(p,5,n);if(mp>0){let m;if(mood=='frown'||mood=='sad')m=Sh.ellipse(0,r*.55,r*.2,r*.12,Math.PI*1.15,Math.PI*1.85,10);else if(mood=='wow')m=Sh.circle(0,r*.46,r*.09);else if(mood=='flat'||mood=='sleep')m=Sh.line(-r*.15,r*.44,r*.15,r*.44);else m=Sh.ellipse(0,r*.3,r*.26,r*.2,.25,Math.PI-.25,12);ink(m,{w:r*.045+2,id:id+8,col,prog:mp});
  if(mood=='smile'||mood=='happy'||mood=='love')[-1,1].forEach((sd,k)=>ink(Sh.line(sd*r*.62-r*.06,r*.3,sd*r*.62+r*.06,r*.24),{w:r*.03+1.5,col:K.red,id:id+10+k,prog:mp,dbl:0}));
  ink(join(Sh.bez([-r*.3,r*.96],[-r*.32,r*1.2],[-r*.9,r*1.25],[-r*1.3,r*1.6]),Sh.bez([r*.3,r*.96],[r*.32,r*1.2],[r*.9,r*1.25],[r*1.3,r*1.6])),{w:r*.045+2,id:id+12,col,prog:mp});
  ink(Sh.bez([-r*.5,r*1.18],[-r*.1,r*1.38],[r*.2,r*1.36],[r*.55,r*1.16]),{w:r*.06+2,col:K.red,id:id+13,prog:mp});}
});}
function phone(x,y,s,r,p,fn,id=300){tf(x,y,s,r,()=>{ink(Sh.rrect(-260,-490,520,980,64),{w:6,prog:seg(p,0,1.3),id});ink(Sh.line(-50,-462,50,-462),{w:6,prog:seg(p,.6,1.3),id:id+1});ink(Sh.line(-70,462,70,462),{w:4,prog:seg(p,.8,1.3),id:id+2});
 if(p>.45){X.save();X.translate(-230,-430);BOX=X.getTransform().inverse();fn(460,860);BOX=null;X.restore();}});}
function shop(x,y,s,o={}){const p=o.prog??1,id=o.id??400,col=o.grey?K.grey:(o.col||K.ink),mood=o.mood||'flat';tf(x,y,s,0,()=>{X.globalAlpha*=o.a??1;
 ink(Sh.rect(-170,-110,340,250),{w:6,col,prog:seg(p,0,5),id});
 const aw=[];for(let i=0;i<5;i++){aw.push(Sh.ellipse(-136+i*68,-110,34,30,0,Math.PI,8)[0]);}ink(join(Sh.line(-190,-110,-170,-190),Sh.line(-170,-190,170,-190),Sh.line(170,-190,190,-110),aw),{w:5,col:o.awn&&!o.grey?o.awn:col,prog:seg(p,1,5),id:id+1});
 const ep=seg(p,2,5);[-1,1].forEach((sd,k)=>{const ex=sd*85,ey=-20;ink(Sh.rrect(ex-48,ey-38,96,76,12),{w:4,col,prog:ep,id:id+3+k});
  if(ep>.5){if(mood=='sleep'||mood=='sad')ink(Sh.ellipse(ex,ey+(mood=='sad'?6:0),20,10,0,Math.PI,8),{w:4,col,id:id+5+k});else if(mood=='happy')ink(Sh.ellipse(ex,ey+8,20,16,Math.PI,Math.PI*2,8),{w:4,col,id:id+5+k});else{X.save();X.fillStyle=col;X.beginPath();X.arc(ex+(o.look||0)*10,ey+6,8,0,7);X.fill();X.restore();}}});
 ink(Sh.rrect(-45,40,90,100,8),{w:5,col,prog:seg(p,3,5),id:id+7});
 const mp=seg(p,4,5);if(mp>0){if(mood=='happy')ink(Sh.ellipse(0,55,40,26,.2,Math.PI-.2,10),{w:4,col:K.red,prog:mp,id:id+8});if(mood=='sad')ink(Sh.ellipse(0,85,32,18,Math.PI*1.15,Math.PI*1.85,8),{w:4,col,prog:mp,id:id+8});}
 if(o.name)txt(o.name,0,-150,30,{col,maxW:300,w:800});if(o.sub){ink(Sh.rrect(-150,-262,300,50,12),{w:3,col:o.subCol||col,id:id+30,dbl:0});txt(o.sub,0,-237,24,{col:o.subCol||col,maxW:280,w:800});}});}
// ---------- paper, far doodles, specks ----------
const pap=document.createElement('canvas');pap.width=1080;pap.height=1080;{const p=pap.getContext('2d');p.fillStyle=K.paper;p.fillRect(0,0,1080,1080);const id=p.getImageData(0,0,1080,1080);let s=7;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=0;i<id.data.length;i+=4){const n=(R()-.5)*7;id.data[i]+=n;id.data[i+1]+=n;id.data[i+2]+=n;}p.putImageData(id,0,0);
 p.globalAlpha=.05;p.strokeStyle='#5B6B82';for(let i=0;i<420;i++){p.lineWidth=R()*1.3;p.beginPath();const x=R()*1080,y=R()*1080,a=R()*6.28,l=10+R()*40;p.moveTo(x,y);p.quadraticCurveTo(x+Math.cos(a)*l*.5+4,y+Math.sin(a)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);p.stroke();}}
const PAT=X.createPattern(pap,'repeat');
const vig=document.createElement('canvas');vig.width=W;vig.height=H;{const v=vig.getContext('2d');const g=v.createRadialGradient(540,900,420,540,960,1300);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(11,27,51,.10)');v.fillStyle=g;v.fillRect(0,0,W,H);}
const FAR=[];{let s=11;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=0;i<70;i++)FAR.push([R()*9000-600,R()*5200-900,R()*4|0,30+R()*50,R()*6]);}
function farLayer(cx,cy){X.save();X.translate(-cx*.55,-cy*.55);FAR.forEach(([x,y,k,r,a],i)=>{const sx=x-cx*.0,sy=y;tf(sx,sy,1,a,()=>{const o={w:2.5,col:'#5B6B82',alpha:.2,id:900+i,dbl:0,amp:1.5};if(k==0)ink(Sh.circle(0,0,r*.6),o);else if(k==1){const pts=[];for(let j=0;j<=10;j++){const aa=-Math.PI/2+j*Math.PI/5,rr=j%2?r*.25:r*.6;pts.push([Math.cos(aa)*rr,Math.sin(aa)*rr]);}ink([pts],o);}else if(k==2)ink(Sh.cat([[-r,0],[-r*.3,-r*.5],[r*.3,r*.4],[r,0]]),o);else ink(Sh.rrect(-r*.5,-r*.35,r,r*.7,8),o);});});X.restore();}
