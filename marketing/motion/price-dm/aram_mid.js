// ---------- characters ----------
const SKIN='#F6D7C3',HAIRD='#3A2A20',FLOUR='#FFF8EC',YEL='#FFE08A',ORG='#FFB23F';
function headDraw(r,o,line,id){const mood=o.mood||'smile';const lk=(o.look||0)*r*.12;
 if(o.hair&&o.hair!='bald'&&o.hair!='chef'){const hc=o.hairCol||HAIRD;let Hp;
  if(o.hair=='long')Hp=[[[-r*1.12,r*.9],[-r*1.2,-r*.2],[-r*.8,-r*1.05],[0,-r*1.2],[r*.8,-r*1.05],[r*1.2,-r*.2],[r*1.12,r*.9],[r*.8,r*.9],[r*.85,-r*.3],[0,-r*.7],[-r*.85,-r*.3],[-r*.8,r*.9]]];
  else if(o.hair=='bun')Hp=join(Sh.ellipse(0,-r*.35,r*1.02,r*.72,Math.PI,Math.PI*2,16).map(c=>[...c,[r*1.02,-r*.2],[-r*1.02,-r*.2]]),Sh.circle(0,-r*1.15,r*.38));
  else if(o.hair=='curly'){const p=[];for(let i=0;i<=14;i++){const a=Math.PI+i/14*Math.PI;const k=1.08+.1*Math.sin(i*2.7);p.push([Math.cos(a)*r*k,Math.sin(a)*r*k-r*.15]);}p.push([r*.9,-r*.1],[-r*.9,-r*.1]);Hp=[p];}
  else Hp=[[[-r*.98,-r*.05],[-r*.9,-r*.75],[-r*.3,-r*1.12],[r*.4,-r*1.1],[r*.95,-r*.7],[r*.98,-r*.05],[r*.7,-r*.45],[0,-r*.55],[-r*.7,-r*.45]]];
  if(o.hair=='long')shape(Hp,{fill:hc,line,id:id+1,w:4,off:0});}
 shape(Sh.circle(0,0,r),{fill:o.skin||SKIN,line,id,w:4.5,off:0});
 if(o.hair&&o.hair!='bald'&&o.hair!='long'&&o.hair!='chef'){let Hp;const hc=o.hairCol||HAIRD;
  if(o.hair=='bun')Hp=join(Sh.ellipse(0,-r*.35,r*1.02,r*.72,Math.PI,Math.PI*2,16),Sh.circle(0,-r*1.15,r*.38));
  else if(o.hair=='curly'){const p=[];for(let i=0;i<=14;i++){const a=Math.PI+i/14*Math.PI;const k=1.08+.1*Math.sin(i*2.7);p.push([Math.cos(a)*r*k,Math.sin(a)*r*k-r*.15]);}p.push([r*.9,-r*.2],[-r*.9,-r*.2]);Hp=[p];}
  else Hp=[[[-r*.98,-r*.1],[-r*.9,-r*.75],[-r*.3,-r*1.12],[r*.4,-r*1.1],[r*.95,-r*.7],[r*.98,-r*.1],[r*.7,-r*.5],[0,-r*.6],[-r*.7,-r*.5]]];
  shape(Hp,{fill:hc,line,id:id+1,w:4,off:0});}
 if(o.hat=='chef'){const H=[];for(let i=0;i<=20;i++){const a=Math.PI+i/20*Math.PI;const k=1+.12*Math.abs(Math.sin(i*1.6));H.push([Math.cos(a)*r*1.05*k,-r*1.15+Math.sin(a)*r*.9*k]);}H.push([r*.85,-r*.55],[-r*.85,-r*.55]);shape([H],{fill:PAPER,line,id:id+2,w:4.5,off:4});ink(Sh.line(-r*.85,-r*.62,r*.85,-r*.62),{w:3,col:line,id:id+3,dbl:0});}
 if(o.hat=='cap'){shape(Sh.ellipse(0,-r*.55,r*1.02,r*.6,Math.PI,Math.PI*2,14).map(c=>[...c]),{fill:o.capCol||BLUE,line,id:id+2,w:4,off:0});ink(Sh.line(r*.2,-r*.55,r*1.35,-r*.45),{w:6,col:line,id:id+3,dbl:0});}
 // eyes
 const ey=-r*.05;[-1,1].forEach((sd,k)=>{const ex=sd*r*.36+lk;
  if(o.blink||mood=='happy'||mood=='proud')ink(Sh.ellipse(ex,ey+r*.05,r*.13,r*.1,Math.PI,Math.PI*2,8),{w:3.5,col:line,id:id+5+k,dbl:0});
  else if(mood=='love'){heart(ex,ey,.28*r/60,1,RED,id+5+k);}
  else{X.save();X.fillStyle=line;X.beginPath();X.arc(ex,ey,r*(mood=='wow'?.11:.08),0,7);X.fill();X.restore();}
  if(mood=='angry'||mood=='frown')ink(Sh.line(sd*r*.55,ey-r*.32,sd*r*.15,ey-r*.2+(mood=='angry'?r*.06:-r*.04)),{w:4,col:line,id:id+8+k,dbl:0});});
 if(o.glasses){ink(join(Sh.circle(-r*.36+lk,ey,r*.25),Sh.circle(r*.36+lk,ey,r*.25),Sh.line(-r*.11+lk,ey,r*.11+lk,ey)),{w:3.5,col:line,id:id+12,dbl:0});}
 // mouth
 let m;if(mood=='frown'||mood=='sad'||mood=='angry')m=Sh.ellipse(0,r*.6,r*.26,r*.16,Math.PI*1.15,Math.PI*1.85,10);else if(mood=='wow')m=Sh.circle(0,r*.48,r*.12);else if(mood=='flat'||mood=='bored')m=Sh.line(-r*.18,r*.45,r*.18,r*.45);else if(mood=='grin'||mood=='proud'||mood=='love'){const G=Sh.ellipse(0,r*.32,r*.34,r*.28,0,Math.PI,12);wash(G,'#C6362A',1,0);m=G;}else m=Sh.ellipse(0,r*.3,r*.3,r*.22,.2,Math.PI-.2,12);
 ink(m,{w:4,col:line,id:id+14,dbl:0});
 if(o.mustache){const M=join(Sh.bez([0,r*.2],[-r*.25,r*.08],[-r*.55,r*.12],[-r*.62,r*.34]),Sh.bez([-r*.62,r*.34],[-r*.4,r*.3],[-r*.2,r*.32],[0,r*.26]),Sh.bez([0,r*.2],[r*.25,r*.08],[r*.55,r*.12],[r*.62,r*.34]),Sh.bez([r*.62,r*.34],[r*.4,r*.3],[r*.2,r*.32],[0,r*.26]));ink(M,{w:5,col:HAIRD,id:id+15,dbl:0});}
 if(mood!='angry'&&mood!='sad')[-1,1].forEach((sd,k)=>ink(Sh.line(sd*r*.62-r*.06,r*.22,sd*r*.62+r*.06,r*.16),{w:3,col:RED,id:id+17+k,dbl:0,alpha:.7}));
 if(o.sweat){const d=(Ink.BF*.13)%1;ink(Sh.bez([r*.85,-r*.4],[r*.95,-r*.2+d*20],[r*.75,-r*.1+d*20],[r*.85,-r*.25+d*20]),{w:3.5,col:BLUE,id:id+19,dbl:0});}
 if(o.headphones){ink(Sh.ellipse(0,0,r*1.1,r*1.1,Math.PI*1.05,Math.PI*1.95,14),{w:6,col:line,id:id+20});[-1,1].forEach((sd,k)=>shape(Sh.rrect(sd*r*1.05-r*.18,-r*.25,r*.36,r*.5,8),{fill:RED,line,id:id+21+k,w:3.5,off:0}));}}
// person: (x,y) = between the feet; o.walk = phase (rad); o.arms = [left,right] each [shoulderAngle, elbowAngle] (0 = hanging down)
function person(x,y,s,o={}){tf(x,y,s,o.rot||0,()=>{const line=o.line||K.ink,id=o.id||8000;const ph=o.walk;const sw=ph!=null?Math.sin(ph):0;const bob=ph!=null?Math.abs(Math.cos(ph))*7:0;X.translate(0,-bob);
 [-1,1].forEach((sd,k)=>{const a=sd*sw*.42;const hx=sd*20,hy=-160;const fx=hx+Math.sin(a)*155,fy=hy+Math.cos(a)*155;ink([[[hx,hy],[fx,fy],[fx+16,fy]]],{w:7,col:line,id:id+30+k,dbl:0});});
 const legW=o.pants||'#2B3A55';X.save();X.globalAlpha*=.9;X.fillStyle=legW;X.beginPath();X.moveTo(-50,-175);X.lineTo(50,-175);X.lineTo(36,-120);X.lineTo(-36,-120);X.fill();X.restore();
 const torso=[[-56,-340],[56,-340],[64,-150],[-64,-150]];shape([torso],{fill:o.shirt||TBLUE,line,id:id+33,w:5,off:6});
 if(o.apron){shape([[[-42,-300],[42,-300],[50,-150],[-50,-150]]],{fill:o.apron,line,id:id+34,w:3.5,off:0});ink(Sh.line(-42,-300,-30,-340),{w:3,col:line,id:id+35,dbl:0});ink(Sh.line(42,-300,30,-340),{w:3,col:line,id:id+36,dbl:0});
  if(o.flour)[[-20,-250],[22,-210],[-8,-180],[30,-270]].forEach(([fx,fy],i)=>{X.save();X.fillStyle=PAPER;X.globalAlpha=.9;X.beginPath();X.arc(fx,fy,6+i%2*3,0,7);X.fill();X.restore();});}
 if(o.tie)shape([[[0,-335],[12,-300],[0,-200],[-12,-300]]],{fill:o.tie,line,id:id+37,w:3,off:0});
 if(o.scarf)shape([[[-50,-345],[50,-345],[46,-318],[-46,-318]],[[18,-330],[40,-330],[46,-250],[24,-252]]],{fill:o.scarf,line,id:id+38,w:3.5,off:0});
 const arms=o.arms||[[.15+sw*.35,.2],[.15-sw*.35,.2]];const hands=[];
 [-1,1].forEach((sd,k)=>{const [a1,a2]=arms[k];const sx=sd*56,sy=-325;const ex=sx+sd*Math.sin(a1)*95,ey=sy+Math.cos(a1)*95;const hx=ex+sd*Math.sin(a1+a2)*90,hy=ey+Math.cos(a1+a2)*90;
  ink([[[sx,sy],[ex,ey],[hx,hy]]],{w:13,col:line,id:id+40+k,dbl:0});ink([[[sx,sy],[ex,ey],[hx,hy]]],{w:6,col:o.shirt||TBLUE,id:id+42+k,dbl:0,amp:.6});shape(Sh.circle(hx,hy,14),{fill:o.skin||SKIN,line,id:id+44+k,w:3.5,off:0});hands.push([hx,hy]);});
 X.save();X.translate(0,-410);headDraw(64,o,line,id);X.restore();
 if(o.hold)o.hold(hands);});}
// simple props
function laptop(x,y,s,id,fn){tf(x,y,s,0,()=>{shape(Sh.rrect(-130,-170,260,170,12),{fill:DEEP,line:K.ink,id,w:4,off:0});solid(-118,-158,236,146,6,PAPER);if(fn){X.save();X.translate(-118,-158);fn(236,146);X.restore();}shape([[[-160,0],[160,0],[140,22],[-140,22]]],{fill:'#C9D3E2',id:id+1,w:4,off:0});});}
function rotary(x,y,s,t,id){tf(x+(Math.floor(t*30)%2?3:-3),y,s,0,()=>{shape([[[-110,40],[110,40],[80,-60],[-80,-60]]],{fill:RED,id,w:5});shape(Sh.circle(0,-5,42),{fill:PAPER,id:id+1,w:4,off:0});for(let i=0;i<8;i++){const a=i/8*Math.PI*1.6+.6;ink(Sh.circle(Math.cos(a)*28,-5+Math.sin(a)*28,6),{w:2.5,id:id+2+i,dbl:0});}
 shape(Sh.cat([[-120,-70],[-100,-110],[0,-95],[100,-110],[120,-70]],6).map(c=>[...c,[90,-80],[0,-75],[-90,-80]]),{fill:RED,id:id+12,w:5,off:4});
 for(let i=0;i<3;i++){const r=130+i*30+(t*120%30);ink(Sh.ellipse(0,-40,r,r*.8,-2.3,-0.8),{w:3,col:RED,id:id+15+i,dbl:0,alpha:.6-i*.15});}});}
function igLogo(x,y,s,id,col=PAPER){tf(x,y,s,0,()=>{ink(Sh.rrect(-70,-70,140,140,40),{w:8,col,id});ink(Sh.circle(0,0,32),{w:8,col,id:id+1});X.save();X.fillStyle=col;X.beginPath();X.arc(42,-42,9,0,7);X.fill();X.restore();});}
function coin(x,y,s,id){tf(x,y,s,0,()=>{shape(Sh.circle(0,0,22),{fill:YEL,line:K.ink,id,w:3.5,off:0});txt('֏',0,1,22,{w:900});});}
function magnifier(x,y,s,id){tf(x,y,s,-.5,()=>{X.save();X.globalAlpha=.25;X.fillStyle='#DDEBFA';X.beginPath();X.arc(0,0,90,0,7);X.fill();X.restore();ink(Sh.circle(0,0,90),{w:10,col:K.ink,id});ink(Sh.line(0,92,0,250),{w:22,col:'#7A4B2A',id:id+1,dbl:0});});}
function pen(x,y,s,r,id){tf(x,y,s,r,()=>{lifted(.6,()=>{solid(-18,-260,36,240,12,BLUE);solid(-18,-260,36,40,12,RED);});shape([[[-18,-20],[18,-20],[0,40]]],{fill:PAPER,id,w:4,off:0});});}
// ---------- regions ----------
const DX0=7150,DX1=8800,BX1=13650;
const DARK=rough(DX0,2080,DX1+60,4600,3),BLUEZ=rough(DX1-60,2080,BX1,4600,9);
let BURST={x:9330,y:2900};
function regions(t){X.save();X.fillStyle=DEEP;path(DARK);X.fill();
 const r=E.heavy(P(t,T(9)+.15,T(9)+.85))*3000;X.fillStyle=BLUE;if(r>0){X.save();path(DARK);X.clip();X.beginPath();X.arc(BURST.x,BURST.y,r,0,7);X.fill();X.restore();}
 path(BLUEZ);X.fill();X.restore();}
// ---------- scenes ----------
const SC=[];function scene(t0,t1,x,y,fn){SC.push({t0,t1,x,y,fn});}
let LOGO=new Image();LOGO.src='logo.png';let WIY=new Image();WIY.src='wiy.png';
const ARAM={hat:'chef',mustache:true,hair:'short',shirt:PAPER,apron:BLUE,flour:true,pants:'#2B3A55'};
const B=[{hair:'long',hairCol:'#6B3A22',shirt:TRED,scarf:RED,pants:'#3B4A6B'},{hair:'short',shirt:PAPER,tie:BLUE,pants:'#2B3A55'},{hair:'curly',hairCol:'#2A1E18',shirt:YEL,headphones:true,pants:'#4A5A7A'},{hair:'bun',hairCol:'#B8B8C2',shirt:'#CFE0F5',glasses:true,pants:'#6B5A7A'}];
// S1 «Ծանոթացեք՝ Արամն է…» + «Արամը կարծում է…»
scene(0,T(2)-.35,0,0,(t)=>{
 // bakery: shelf, oven, sign
 ink(Sh.line(60,560,1020,560),{w:5,id:9000});cake(200,520,.32,1,9010);cake(420,520,.32,1,9030,{tint:TBLUE});cake(860,520,.32,1,9050,{tint:YEL});
 tf(860,980,1,0,()=>{shape(Sh.rrect(-150,-150,300,300,20),{fill:'#C9D3E2',id:9070});solid(-110,-90,220,150,14,'#FFB23F',.45+.15*Math.sin(t*5));ink(Sh.rrect(-110,-90,220,150,14),{w:4,id:9071});ink(Sh.line(-80,-120,80,-120),{w:5,id:9072,dbl:0});});
 tf(540,300,1,-.02,()=>{lifted(.5,()=>solid(-260,-60,520,120,20,PAPER));ink(Sh.rrect(-260,-60,520,120,20),{w:5,id:9080});txt('Արամի տորթերը',0,2,54,{w:900,col:RED});ink(join(Sh.line(-200,-60,-160,-150),Sh.line(200,-60,160,-150)),{w:3,id:9081,dbl:0});});
 const lift=E.heavy(P(t,T(0)+1.1,T(0)+1.6)),show=E.heavy(P(t,T(1)+.3,T(1)+.8)),lap=E.heavy(P(t,TE(1)-1.0,TE(1)-.5));
 const arms=[[L(.2,2.4,Math.max(lift*(1-lap),lap)),L(.2,.6,lift)],[L(.2,2.4,Math.max(lift*(1-lap),lap)),L(.2,.6,lift)]];
 person(470,1360,1.45,{...ARAM,id:9100,mood:lap>0?'proud':lift>0?'grin':'smile',look:.5,arms,hold:(h)=>{const cx=(h[0][0]+h[1][0])/2,cy=(h[0][1]+h[1][1])/2;
  if(lift>0&&lap<.5)cake(cx,cy-60,.45,1,9200,{tint:TRED});if(lap>0)laptop(cx,cy-20,.8*lap,9220,(w,h)=>{txt('www.aram-tort.am',w/2,h/2,18,{w:800,col:BLUE});});
  if(lift>0&&lap<.5)for(let i=0;i<3;i++){const u=((t*.8+i*.33)%1);ink(Sh.bez([cx-30+i*30,cy-170-u*80],[cx-50+i*30,cy-200-u*80],[cx-10+i*30,cy-230-u*80],[cx-30+i*30,cy-260-u*80]),{w:4,col:GREY,id:9240+i,dbl:0,alpha:1-u});}}});
 pill(800,640,'Արամ',52,{bg:RED,p:P(t,T(0)+.2,T(0)+.5),id:9250});
 // checklist (L2)
 const ck=E.land(P(t,T(1)-.1,T(1)+.3));if(ck>0)lifted(.8,()=>tilt(L(-200,250,ck),830,1,.04,.08,()=>{solid(-200,-150,400,300,24,PAPER);ink(Sh.rrect(-200,-150,400,300,24),{w:5,id:9260});
  ['Ցուցանակ','Instagram','Կայք'].forEach((s,i)=>{const on=t>T(1)+.4+i*.45;txt(s,-110,-80+i*80,38,{al:'left',w:800});ink(Sh.rrect(-170,-104+i*80,46,46,8),{w:4,id:9270+i});if(on)check(-147,-81+i*80,.55,P(t,T(1)+.4+i*.45,T(1)+.7+i*.45),BLUE,9280+i*2);});}));});
// S2 «Դե, կայք ասելը…» the awful site
function awful(t,w,h){solid(0,0,w,h,0,'#FFF6D6');for(let i=0;i<12;i++)solid(i*44-20,0,24,40,0,i%2?K.ink:YEL);
 ['Բ','ա','ր','ի',' ','գ','ա','լ','ու','ս','տ','!','!','!'].forEach((ch,i)=>txt(ch,30+i*29,110+Math.sin(t*6+i)*6,40,{w:400,col:[RED,BLUE,'#2A9D3A','#B23CC9'][i%4],f:'serif'}));
 tf(w/2,300,1,.08,()=>{shape(Sh.rect(-130,-90,260,180),{fill:'#E9E2C8',id:9310,w:4});txt('ՆԿԱՐ',0,0,30,{w:800,col:GREY});});
 txt('Կայքը կառուցման փուլում է',w/2,470,24,{w:700,col:RED});tf(w/2,560,1,0,()=>{shape([[[-40,40],[40,40],[10,-60],[-10,-60]]],{fill:ORG,id:9320,w:4});ink(join(Sh.line(-28,0,28,0),Sh.line(-20,-25,20,-25)),{w:5,col:PAPER,id:9321,dbl:0});});
 solid(w/2-170,680,340,60,4,'#111');txt('Դուք 000007-րդ այցելուն եք',w/2,710,20,{w:700,col:'#3BFF6B',f:'MO'});
 txt('© 2012 · Լավագույն լուծումներ',w/2,800,18,{w:600,col:GREY});}
scene(T(2)-.35,T(3)-.35,1300,-80,(t)=>{phone(560,880,.95,.04,1,(w,h)=>awful(t,w,h),{id:9300});
 const fr=P(t,T(2)+.6,T(2)+1.0);person(200,1380,.75,{...ARAM,id:9340,mood:fr>0?'flat':'proud',sweat:fr>0,look:1});
 if(fr>0)itxt('…',200,640,120,{id:9350,col:RED,prog:fr});
 if(t>T(2)+.9)tf(880,330,1,.15,()=>itxt('հըմ',0,0,60,{id:9351,col:GREY,prog:pen(t,T(2)+.9,.3)}));});
// S3 slow loading, the cake goes stale
scene(T(3)-.35,T(4)-.35,2600,-160,(t)=>{const lt=P(t,T(3),TE(3)+.3);
 phone(380,880,.85,-.03,1,(w,h)=>{solid(0,0,w,h,0,'#F4F4F4');tf(w/2,h/2-80,1,t*4,()=>{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ink(Sh.line(Math.cos(a)*40,Math.sin(a)*40,Math.cos(a)*70,Math.sin(a)*70),{w:8,col:K.ink,id:9400+i,dbl:0,alpha:.15+.85*((i/10+t*1.5)%1)});}});
  solid(60,h/2+60,w-120,26,13,'#E2E6EE');solid(60,h/2+60,(w-120)*(.01+lt*.04),26,13,RED);txt(Math.round(1+lt*4)+'%',w/2,h/2+130,40,{w:900,col:RED});txt('Բեռնվում է…',w/2,h/2+190,26,{w:700,col:GREY});},{id:9410});
 // the cake wilts
 tf(830,980,1,0,()=>{const sag=lt;X.save();X.scale(1+sag*.15,1-sag*.35);cake(0,0,.62,1,9420,{tint:sag>.5?'#E8DCCF':TRED});X.restore();
  if(sag>.3){const wp=P(t,T(3)+.6,TE(3));for(let i=0;i<6;i++){const a=-Math.PI*.9+i*.16;ink(Sh.line(-130,-120,-130+Math.cos(a)*120*wp,-120+Math.sin(a)*120*wp),{w:2,col:GREY,id:9440+i,dbl:0});}for(let k=1;k<4;k++)ink(Sh.ellipse(-130,-120,30*k*wp,30*k*wp,-Math.PI*.9,-Math.PI*.1,8),{w:2,col:GREY,id:9450+k,dbl:0});}
  moth(Math.sin(t*3)*120,-200+Math.cos(t*4)*40,.9,t,9460);});
 tf(830,450,1,.05,()=>{const days=['Երկ','Երք','Չրք','Հնգ'];const d=Math.min(3,Math.floor(lt*4));lifted(.5,()=>solid(-80,-80,160,160,14,PAPER));solid(-80,-80,160,44,14,RED);txt(days[d],0,20,52,{w:900});});});
// S4 giant logo, guess what he sells
scene(T(4)-.35,T(5)-.35,3900,-40,(t)=>{
 phone(540,820,.85,.03,1,(w,h)=>{solid(0,0,w,h,0,'#FFFDF5');const gl=1+.03*Math.sin(t*3);tf(w/2,330,gl,0,()=>{itxt('ԱՐԱՄ',0,0,170,{id:9500,col:RED,maxW:430});for(let i=0;i<5;i++){const a=t*2+i*1.3;sparkle(Math.cos(a)*200,Math.sin(a)*120,18,1,YEL,9510+i);}});txt('Բարի գալուստ',w/2,560,40,{w:400,col:GREY,f:'serif'});},{id:9520});
 const qs=['Կոշի՞կ','Բա՞նկ','Ատամնաբույժ՞'];[[170,1330,B[3]],[540,1420,B[1]],[910,1330,B[0]]].forEach(([x,y,o],i)=>{person(x,y,.62,{...o,id:9530+i*60,mood:'wow',look:i==0?1:i==2?-1:0});const p=P(t,T(4)+.9+i*.25,T(4)+1.2+i*.25);if(p>0){bubble(x,y-430,240,110,p,9600+i*3,[0,1]);txt(qs[i],x,y-430,30,{w:900,maxW:210,a:p});}});});
// S5 PDF menu, you need a microscope
scene(T(5)-.35,T(6)-.35,5200,-160,(t)=>{
 phone(560,840,.9,-.02,1,(w,h)=>{solid(0,0,w,h,0,'#5B6B82');solid(0,0,w,60,0,'#2B3A55');txt('menu_final_v3_NEW.pdf',w/2,30,20,{w:700,col:PAPER,f:'MO'});solid(40,90,w-80,h-130,4,PAPER);
  for(let i=0;i<34;i++)solid(70,120+i*20,(w-140)*(.4+.6*((i*37)%10)/10),6,3,'#9AA5B6');txt('ՄԵՆՅՈՒ',w/2,105,12,{w:900});},{id:9700});
 const mx=L(300,760,(Math.sin(t*1.4)+1)/2);magnifier(mx,780,1,9720);
 person(190,1390,.7,{...B[3],id:9740,mood:'flat',look:1,arms:[[.3,.2],[2.2,.8]]});
 tf(880,1260,1,0,()=>{itxt('🔍',0,0,10,{id:9760});});});
// S6 no price, no button, only «call us»
scene(T(6)-.35,T(7)-.35,6500,-40,(t)=>{
 phone(420,840,.85,.03,1,(w,h)=>{solid(0,0,w,h,0,'#FFFDF5');[0,1].forEach(i=>{const y=110+i*260;cake(110,y+80,.3,1,9800+i*30);txt(['Ծննդյան տորթ','Միրգ ու կրեմ'][i],210,y+40,24,{al:'left',w:800});tag(330,y+70,.42,Math.sin(t*3+i)*.1,20,()=>itxt('?',0,185,140,{col:RED,id:9860+i}));});
  ink(Sh.rrect(60,650,w-120,80,40),{w:4,col:GREY,id:9870,gaps:.6,dbl:0});txt('Պատվիրել',w/2,690,30,{w:800,col:'#C0C6D0'});cross(w/2,690,1.6,P(t,T(6)+.6,T(6)+.9),RED,9871);
  solid(0,h-90,w,90,0,RED);txt('ԶԱՆԳԱՀԱՐԵՔ',w/2,h-45,40,{w:900,col:PAPER});},{id:9880});
 rotary(850,900,1,t,9900);if(t>T(6)+1.0)tf(850,700,1,.1,()=>itxt('դզզզ…',0,0,52,{id:9930,col:RED,prog:pen(t,T(6)+1.0,.3)}));
 if(t>T(6)+1.2)tf(850,1180,1,0,()=>txt('պատասխան չկա',0,0,30,{w:800,col:GREY}));});
// S7 buyers come in and go to the competitor
scene(T(7)-.35,T(8)-.35,7800,-150,(t)=>{
 tf(250,760,1,0,()=>{shape(Sh.rrect(-200,-300,400,560,24),{fill:'#E6E9EF',id:10000});solid(-140,-60,280,320,12,DEEP);txt('Արամի կայքը',0,-220,34,{w:900,col:GREY});});
 shop(820,700,1.1,{name:'',mood:'happy',awn:PAPER,prog:1,id:10020});wash([[[611,491],[1029,491],[1058,601],[582,601]]],BLUE,1,0);lifted(.5,()=>solid(640,420,360,60,14,PAPER));txt('Կողքի տորթեր',820,450,32,{w:900,col:BLUE});
 tf(820,1010,.8,0,()=>{lifted(.5,()=>solid(-140,-50,280,100,16,PAPER));txt('Տորթ՝ 12 000 ֏',0,0,34,{w:900,col:BLUE});});
 B.forEach((o,i)=>{const s0=T(7)-.1+i*.3;const u=P(t,s0,s0+2.2);if(u<=0)return;let x,y=1330,sc=.55;if(u<.35){x=L(-80,230,u/.35);}else if(u<.5){x=230;sc=L(.55,.4,(u-.35)/.15);y=1280;}else{x=L(230,800,(u-.5)/.5);}const vis=!(u>.38&&u<.47);
  if(vis)person(x,y,sc,{...o,id:10100+i*60,walk:t*9+i,mood:u>.5?'smile':'flat',look:1});if(u>.5&&u<1){coin(x-60,1150-((t*3+i)%1)*60,1,10350+i);}});});
// S8 dark: Aram blames Instagram
scene(T(8)-.35,T(9)-.35,7800,2300,(t)=>{const LN=PAPER;
 tf(820,520,1,0,()=>{ink(Sh.rrect(-150,-150,300,300,20),{w:5,col:LN,id:10400});moon(-40,-20,40,1,10401);});
 igLogo(300,560,1.1,10410,PAPER);if(t>T(8)+.3)tf(420,440,1,.2,()=>itxt('!',0,0,90,{id:10415,col:RED}));
 ink(Sh.line(40,1300,1040,1310),{w:5,col:LN,id:10420});
 const shake=Math.sin(t*40)*8*(t>T(8)+.2?1:0);person(540,1300,1.2,{...ARAM,line:LN,id:10430,mood:'angry',look:-1,arms:[[2.0,.9],[2.6,.4]],hold:(h)=>{tf(h[1][0]+shake,h[1][1]-40,1,.2,()=>{solid(-40,-75,80,150,14,'#9CC3F0');ink(Sh.rrect(-40,-75,80,150,14),{w:4,col:LN,id:10480});txt('0',0,0,40,{w:900,col:DEEP});});}});
 for(let i=0;i<2;i++){const u=(t*1.2+i*.5)%1;const sd=i?1:-1;ink(Sh.bez([540+sd*95,620-u*80],[540+sd*125,590-u*80],[540+sd*95,560-u*80],[540+sd*125,530-u*80]),{w:5,col:'#8FA3C0',id:10490+i,dbl:0,alpha:1-u});}
 if(t>T(8)+.5)bubble(820,820,300,140,P(t,T(8)+.5,T(8)+.8),10495,[-.6,1],PAPER);if(t>T(8)+.7)txt('#@!',820,820,56,{w:900,col:RED});});
// S9 «Եթե Արամը գար WiyMood…» instant site
function goodSite(t,w,h,{prices=0,steps=0,paid=0}={}){solid(0,0,w,h,0,PAPER);txt('Արամի տորթերը',24,40,30,{al:'left',w:900,col:RED});txt('☰',w-36,40,30,{w:900});
 solid(16,80,w-32,330,24,'#FBE7E3');cake(w/2,250,.7,1,10600);txt('Ձեռքի աշխատանք՝ ամեն օր թարմ',w/2,450,24,{w:800});
 if(prices>0)pill(w/2,510,'12 000 ֏-ից',32,{bg:BLUE,p:prices,id:10620});
 pill(w/2,620,'Պատվիրել',36,{bg:RED,id:10630});
 if(steps>0){[1,2,3].forEach((n,i)=>{const on=steps>i;tf(w/2-120+i*120,730,1,0,()=>{solid(-32,-32,64,64,32,on?BLUE:'#E2E6EE');txt(String(n),0,2,30,{w:900,col:on?PAPER:GREY});});});}
 if(paid>0)stamp(w/2,800,.7,-.05,'Վճարված ✓',paid,{bg:BLUE,id:10640});}
scene(T(9)-.35,T(10)-.35,9100,2300,(t)=>{const ap=E.land(P(t,T(9)-.2,T(9)+.3));
 if(WIY.complete){X.save();X.translate(L(-200,190,ap),760);X.rotate(-.12);X.drawImage(WIY,-110,-110,220,220*WIY.height/WIY.width);X.restore();}pen(L(-80,260,ap),640,1,.7,10700);
 const st=P(t,T(9)+.6,T(9)+.9);if(st>0)phone(650,950,.85*E.heavy(st),.04,1,(w,h)=>goodSite(t,w,h),{id:10710});
 if(t>T(9)+.8){stopwatch(870,420,.9,0,1,10720,PAPER);txt('0.8 վ',870,560,0.1,{});tf(870,560,1,0,()=>pill(0,0,'0.8 վ',40,{bg:YEL,fg:K.ink,p:P(t,T(9)+.9,T(9)+1.1),id:10730}));}
 if(t>T(9)+.7)for(let i=0;i<3;i++)ink([[[960-i*30,700+i*20],[920-i*30,780+i*20],[960-i*30,780+i*20],[920-i*30,860+i*20]]],{w:6,col:YEL,id:10740+i,dbl:0,prog:pen(t,T(9)+.7+i*.1,.2)});});
// S10 mouth-watering cakes
scene(T(10)-.35,T(11)-.35,10400,2300,(t)=>{
 lifted(1.2,()=>tilt(540,760,1,.03,-.05,()=>{solid(-380,-360,760,720,40,PAPER);solid(-350,-330,700,500,30,'#FBE7E3');
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.18;ink(Sh.line(0,-330,Math.cos(a)*520,-330+Math.sin(a)*520),{w:10,col:YEL,id:10800+i,dbl:0,alpha:.35});}
  cake(0,-60,1.05,1,10820,{tint:TRED});[[-120,-140],[-40,-150],[50,-148],[130,-140]].forEach(([x,y],i)=>shape(Sh.circle(x,y,18),{fill:RED,id:10850+i,w:3,off:0}));
  txt('Ելակով ու մասկարպոնեով',0,240,36,{w:900});txt('Թխում ենք պատվերի օրը',0,295,26,{w:600,col:GREY});}));
 person(170,1430,.62,{...B[0],id:10870,mood:'love',look:1});const dr=(t*1.1)%1;ink(Sh.bez([195,1395-0],[200,1400+dr*40],[188,1410+dr*40],[195,1400+dr*40]),{w:4,col:BLUE,id:10930,dbl:0,alpha:1-dr});
 if(t>T(10)+.4)tf(900,1250,1,.1,()=>itxt('մմմ…',0,0,60,{id:10940,col:RED,prog:pen(t,T(10)+.4,.4)}));});
// S11 price shows, 3 steps, paid online
scene(T(11)-.35,T(12)-.35,11700,2300,(t)=>{const L12=TE(11)-T(11);
 const pr=P(t,T(11),T(11)+.3),st=Math.floor(cl((t-T(11)-L12*.35)/(L12*.35))*3.99),pd=P(t,T(11)+L12*.78,T(11)+L12*.78+.3);
 phone(540,900,.95,-.02,1,(w,h)=>goodSite(t,w,h,{prices:pr,steps:t>T(11)+L12*.3?st:0,paid:pd}),{id:11000});
 const tap=t>T(11)+L12*.3&&t<T(11)+L12*.75;if(tap){const k=st;finger(540-120*.95+k*120*.95,1420-Math.abs(Math.sin(t*9))*20,.9,-.15,11050);}
 const cd=E.land(P(t,T(11)+L12*.62,T(11)+L12*.8));if(cd>0)lifted(1,()=>tilt(L(1300,860,cd),1240,.7,.05,-.1,()=>{solid(-230,-140,460,280,28,'#123A73');solid(-180,-70,80,60,10,YEL);txt('•••• 4242',-180,40,34,{al:'left',w:800,col:PAPER,f:'MO'});}));
 [[150,380,'Գինը երևում է',P(t,T(11),T(11)+.3)],[150,500,'Պատվերը՝ 3 քայլ',P(t,T(11)+L12*.3,T(11)+L12*.3+.3)],[150,620,'Վճարումը՝ առցանց',P(t,T(11)+L12*.7,T(11)+L12*.7+.3)]].forEach(([x,y,s,p],i)=>{if(p>0){X.save();X.globalAlpha=p;X.translate(L(-60,0,E.outExpo(p)),0);lifted(.4,()=>solid(x-30,y-34,0,0,0,PAPER));X.restore();}});});
// S12 Aram can't bake fast enough
scene(T(12)-.35,T(13)-.35,13000,2300,(t)=>{
 tf(860,1000,1,0,()=>{shape(Sh.rrect(-150,-150,300,300,20),{fill:'#C9D3E2',id:11100});solid(-110,-90,220,150,14,ORG,.6+.2*Math.sin(t*9));ink(Sh.rrect(-110,-90,220,150,14),{w:4,id:11101});});
 const fast=t*14;person(420,1380,1.35,{...ARAM,id:11110,mood:'grin',sweat:true,look:.5,arms:[[1.6+Math.sin(fast)*.6,.8],[1.6+Math.cos(fast)*.6,.8]]});
 for(let i=0;i<14;i++){const u=((t*.9+i*.37)%1);const x=200+((i*131)%700),y=320+u*800;X.save();X.globalAlpha=(1-u)*.9;X.fillStyle=PAPER;X.beginPath();X.arc(x+Math.sin(t*3+i)*30,y,8+(i%3)*4,0,7);X.fill();X.restore();}
 for(let i=0;i<4;i++){const p=P(t,T(12)+.1+i*.3,T(12)+.35+i*.3);if(p>0)tf(L(1300,800,E.outExpo(p)),300+i*95,1,0,()=>{lifted(.5,()=>solid(-200,-36,400,72,20,PAPER));txt('🔔 Նոր պատվեր',0,2,32,{w:900,col:BLUE});});}
 [[150,1100],[250,1160],[150,1180]].forEach(([x,y],i)=>cake(x,y-i*10,.22,1,11300+i*30,{tint:[TRED,YEL,TBLUE][i]}));});
// S13 comment «ԲՐԵՆԴ» + logo
scene(T(13)-.35,END,14300,2300,(t)=>{const lt=t-T(13);
 const lg=spring(P(t,T(13),T(13)+.5),.65);if(lg>0&&LOGO.complete)tf(540,430,lg,0,()=>{const lw=300,lh=lw*LOGO.height/LOGO.width;X.save();X.globalCompositeOperation='multiply';X.drawImage(LOGO,-lw/2,-lh/2,lw,lh);X.restore();});
 lifted(1,()=>tilt(540,880,1,.03,-.04,()=>{solid(-440,-200,880,400,36,PAPER);ink(Sh.rrect(-440,-200,880,400,36),{w:5,id:11400});txt('Մեկնաբանություններ',-380,-140,30,{al:'left',w:800,col:GREY});
  shape(Sh.circle(-350,10,46),{fill:TRED,id:11401,w:4,off:0});solid(-280,-40,580,100,50,'#EEF2F8');ink(Sh.rrect(-280,-40,580,100,50),{w:3,id:11402,dbl:0});
  const word='ԲՐԵՆԴ';const n=Math.floor(cl((t-T(13)-.6)/.8)*word.length);if(n==0)txt('Ավելացնել մեկնաբանություն…',-250,10,28,{al:'left',w:600,col:GREY});else txt([...word].slice(0,n).join(''),-250,12,52,{al:'left',w:900,col:RED});
  const sent=t>T(13)+1.6;tf(360,10,1+.2*Math.sin(Math.PI*P(t,T(13)+1.6,T(13)+1.9)),0,()=>{solid(-50,-50,100,100,50,sent?BLUE:'#C0C6D0');const A=[[-20,-22],[26,0],[-20,22],[-10,0]];wash([A],PAPER,1,0);});
  if(sent)tf(-20,L(10,-260,E.outExpo(P(t,T(13)+1.7,T(13)+2.2))),1,0,()=>pill(0,0,'Ուղարկված ✓',30,{bg:BLUE,p:P(t,T(13)+1.7,T(13)+1.9),id:11410}));}));
 if(WIY.complete){const u=E.land(P(t,T(13)+.8,T(13)+1.3));X.save();X.translate(L(1200,930,u),1180);X.rotate(-.18);X.drawImage(WIY,-80,-80,160,160*WIY.height/WIY.width);X.restore();}
 itxt('wiymood',540,1320,66,{fam:'S',prog:pen(t,T(13)+1.0,.7),id:11420,col:BLUE,maxW:500});});
// ---------- camera ----------
const KEYS=[];const TR=.38;function key(t,x,y,z=1,r=0,dip=.1){KEYS.push([t,x,y,z,r,dip]);}
SC.forEach((s,i)=>{const d=i==7?.28:.1;key(s.t0+(i?.02:0),s.x,s.y,1,0,d);key(s.t1-(i==6?.7:TR),s.x+(i%2?-40:40),s.y+(i%2?30:-30),1.05,i%2?.012:-.012);});
// S2: push in on the «website»
KEYS.push([T(2)+.6,1300+10,-80-60,1.18,0,.1]);
KEYS.sort((a,b)=>a[0]-b[0]);
function cam(t){let i=KEYS.findIndex(k=>k[0]>t);if(i==-1)return KEYS[KEYS.length-1];if(i==0)return KEYS[0];const a=KEYS[i-1],b=KEYS[i];const travel=Math.hypot(b[1]-a[1],b[2]-a[2])>300;let u=(t-a[0])/(b[0]-a[0]);
 TRAVEL=travel&&u>0&&u<1;const e=travel?E.heavy(u):E.drift(u);return [0,L(a[1],b[1],e),L(a[2],b[2],e),L(a[3],b[3],e)*(travel?1-b[5]*Math.sin(Math.PI*u):1),L(a[4],b[4],e)+(travel?Math.sin(Math.PI*u)*.03*(b[1]>a[1]?1:-1):0)];}
