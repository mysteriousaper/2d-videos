// ===== v3: every visual beat hangs on a spoken word (BT = word times from the recording) =====
const pop=(t,b,d=.28)=>spring(P(t,b,b+d),.5);
const SCX=[[0,0],[1300,-80],[2600,-160],[3900,2300],[5200,2300],[6500,2300],[7800,2300],[9100,2300]];
// S1 Aram: «Ծանոթացեք» · «Արամն» · «համեղ տորթեր» · «կարծում» · «արել… ամեն ինչ… նկատեն» · «կայք»
scene(0,BT.de-.2,0,0,(t)=>{
 ink(Sh.line(60,560,1020,560),{w:5,id:9000});cake(200,520,.32,1,9010);cake(860,520,.32,1,9050,{tint:YEL});
 tf(540,300,1,-.02,()=>{lifted(.5,()=>solid(-280,-64,560,128,22,PAPER));ink(Sh.rrect(-280,-64,560,128,22),{w:5,id:9080});txt('Արամի տորթերը',0,2,58,{w:900,col:RED});ink(join(Sh.line(-200,-64,-160,-150),Sh.line(200,-64,160,-150)),{w:3,id:9081,dbl:0});});
 const lift=E.heavy(P(t,BT.hamegh-.15,BT.hamegh+.2)),lap=E.heavy(P(t,BT.kayq-.25,BT.kayq+.1)),think=P(t,BT.karcum-.1,BT.karcum+.2)*(1-P(t,BT.kayq-.3,BT.kayq));
 const up=Math.max(lift*(1-lap),lap);const arms=think>0&&lap<=0?[[.3,.2],[2.4,2.2]]:[[L(.2,2.4,up),L(.2,.6,lift)],[L(.2,2.4,up),L(.2,.6,lift)]];
 person(540,1400,1.5,{...ARAM,id:9100,mood:lap>0?'proud':lift>0?'grin':'smile',look:think>0?-1:.4,arms,hold:(h)=>{const cx=(h[0][0]+h[1][0])/2,cy=(h[0][1]+h[1][1])/2;
  if(lift>0&&lap<.5&&think<=0)cake(cx,cy-60,.5,1,9200,{tint:TRED});if(lap>0)laptop(cx,cy-30,.95*lap,9220,(w,h)=>{txt('aram-tort.am',w/2,h/2,24,{w:900,col:BLUE});});
  if(lift>0&&lap<.5&&think<=0)for(let i=0;i<3;i++){const u=((t*.9+i*.33)%1);ink(Sh.bez([cx-30+i*30,cy-180-u*80],[cx-50+i*30,cy-210-u*80],[cx-10+i*30,cy-240-u*80],[cx-30+i*30,cy-270-u*80]),{w:4,col:GREY,id:9240+i,dbl:0,alpha:1-u});}}});
 pill(830,640,'Արամ',60,{bg:RED,p:P(t,BT.aram-.05,BT.aram+.25),id:9250});
 if(t>BT.tkhum&&t<BT.karcum)[[380,700],[700,720],[540,610]].forEach(([x,y],i)=>sparkle(x,y,26,pen(t,BT.tkhum+i*.08,.2),YEL,9255+i));
 // thought cloud with the checklist
 const ck=pop(t,BT.karcum-.05,.35)*(1-P(t,BT.kayq-.3,BT.kayq));if(ck>0)lifted(.8,()=>tf(300,820,ck,-.03,()=>{solid(-230,-190,460,380,40,PAPER);ink(Sh.rrect(-230,-190,460,380,40),{w:5,id:9260});
  [[-60,215,16],[-20,250,10]].forEach(([x,y,r],i)=>ink(Sh.circle(x+120,y,r),{w:4,id:9265+i}));
  ['Ցուցանակ','Instagram','Կայք'].forEach((s,i)=>{const b=[BT.arel,BT.amen,BT.nkaten][i];txt(s,-110,-100+i*100,46,{al:'left',w:900});ink(Sh.rrect(-185,-128+i*100,56,56,10),{w:4,id:9270+i});if(t>b)check(-157,-100+i*100,.7,P(t,b,b+.25),BLUE,9280+i*2);});}));});
// S2 «Դե…» the awful site, full screen; pieces pop on «կայք» «ասելը» «չափազանցություն»
function awful2(t,w,h){solid(0,0,w,h,0,'#FFF6D6');
 if(t>BT.kayq2-.05)for(let i=0;i<12;i++)solid(i*44-20,0,24,48,0,i%2?K.ink:YEL);
 const b1=pop(t,BT.asele);if(b1>0)tf(w/2,130,b1,0,()=>{['Բ','ա','ր','ի',' ','գ','ա','լ','ու','ս','տ','!','!','!'].forEach((ch,i)=>txt(ch,-190+i*29,Math.sin(t*7+i)*6,46,{w:400,col:[RED,BLUE,'#2A9D3A','#B23CC9'][i%4],f:'serif'}));});
 tf(w/2,330,1,.08,()=>{shape(Sh.rect(-150,-100,300,200),{fill:'#E9E2C8',id:9310,w:4});txt('ՆԿԱՐ',0,0,36,{w:900,col:GREY});});
 const b2=pop(t,BT.chap-.1);if(b2>0)tf(w/2,560,b2,0,()=>{shape([[[-55,60],[55,60],[14,-80],[-14,-80]]],{fill:ORG,id:9320,w:4});ink(join(Sh.line(-36,0,36,0),Sh.line(-26,-36,26,-36)),{w:6,col:PAPER,id:9321,dbl:0});txt('Կառուցման փուլում',0,110,30,{w:900,col:RED});});
 const b3=pop(t,BT.chap+.15);if(b3>0)tf(w/2,770,b3,0,()=>{solid(-200,-38,400,76,6,'#111');txt('Այցելու՝ 000007',0,2,30,{w:800,col:'#3BFF6B',f:'MO'});});}
scene(BT.de-.2,BT.bacv-.25,1300,-80,(t)=>{phone(540,900,1.0,.03,1,(w,h)=>awful2(t,w,h),{id:9300});
 const fr=P(t,BT.de,BT.de+.25);person(150,1450,.62,{...ARAM,id:9340,mood:fr>0?'flat':'proud',sweat:fr>0,look:1});
 if(fr>0)tf(880,240,1,.12,()=>itxt('հըմ…',0,0,70,{id:9351,col:RED,prog:pen(t,BT.de,.35)}));});
// S3 «Բացվում» spinner · «դանդաղ» bar crawls · «տորթը» pan to the cake · «հնանալ» it wilts
scene(BT.bacv-.25,BT.isk-.15,2600,-160,(t)=>{const crawl=P(t,BT.bacv,BT.hnanal+.4);
 phone(360,900,.95,-.03,1,(w,h)=>{solid(0,0,w,h,0,'#F4F4F4');const spin=t<BT.dandagh?t*5:BT.dandagh*5+(t-BT.dandagh)*.8;tf(w/2,h/2-110,1.3,spin,()=>{for(let i=0;i<10;i++){const a=i/10*Math.PI*2;ink(Sh.line(Math.cos(a)*40,Math.sin(a)*40,Math.cos(a)*70,Math.sin(a)*70),{w:9,col:K.ink,id:9400+i,dbl:0,alpha:.15+.85*((i/10+spin*.3)%1)});}});
  solid(50,h/2+50,w-100,34,17,'#E2E6EE');solid(50,h/2+50,(w-100)*(.01+crawl*.03),34,17,RED);txt(Math.round(1+crawl*3)+'%',w/2,h/2+140,64,{w:900,col:RED});txt('Բեռնվում է…',w/2,h/2+210,32,{w:700,col:GREY});},{id:9410});
 tf(1250,880,1,.05,()=>{const days=['Երկ','Երք','Չրք','Հնգ','Ուրբ'];const d=Math.min(4,Math.floor(crawl*5));lifted(.5,()=>solid(-95,-95,190,190,16,PAPER));solid(-95,-95,190,54,16,RED);txt(days[d],0,24,64,{w:900});});
 const sag=E.heavy(P(t,BT.hnanal-.1,BT.hnanal+.45));
 tf(1250,1250,1.15,0,()=>{X.save();X.scale(1+sag*.25,1-sag*.45);cake(0,0,.75,1,9420,{tint:sag>.4?'#E2D8CC':TRED});X.restore();
  if(sag>0){for(let i=0;i<6;i++){const a=-Math.PI*.9+i*.16;ink(Sh.line(-180,-180,-180+Math.cos(a)*170*sag,-180+Math.sin(a)*170*sag),{w:2.5,col:GREY,id:9440+i,dbl:0});}for(let k=1;k<4;k++)ink(Sh.ellipse(-180,-180,42*k*sag,42*k*sag,-Math.PI*.9,-Math.PI*.1,8),{w:2.5,col:GREY,id:9450+k,dbl:0});moth(Math.sin(t*3)*140,-260+Math.cos(t*4)*40,1.2,t,9460);}});
 if(sag>.5)tf(1250,780+(1-sag)*40,1,0,()=>pill(0,0,'Հնացավ',48,{bg:GREY,p:pop(t,BT.hnanal+.2),id:9470}));});
// S4 dark «Իսկ Արամը» · «մեղադրում» shakes the phone · «Instagram-ին» the logo slams in
scene(BT.isk-.15,BT.ete-.3,3900,2300,(t)=>{const LN=PAPER;
 ink(Sh.line(40,1330,1040,1340),{w:5,col:LN,id:10420});
 tf(860,450,1,0,()=>{ink(Sh.rrect(-130,-130,260,260,20),{w:5,col:LN,id:10400});ink(join(Sh.ellipse(-20,-10,50,50,Math.PI*.3,Math.PI*1.7,24),Sh.ellipse(0,-10,40,40,Math.PI*1.65,Math.PI*.35,24)),{w:5,col:YEL,id:10401});});
 const sh=t>BT.megh?Math.sin(t*45)*10:0;
 person(500,1330,1.3,{...ARAM,line:LN,id:10430,mood:t>BT.megh?'angry':'sad',look:-1,arms:[[2.0,.9],[t>BT.megh?2.7:.4,t>BT.megh?.4:.2]],hold:(h)=>{tf(h[1][0]+sh,h[1][1]-40,1.1,.2,()=>{X.save();X.shadowColor='rgba(150,200,255,.9)';X.shadowBlur=40;solid(-44,-80,88,160,14,'#9CC3F0');X.restore();ink(Sh.rrect(-44,-80,88,160,14),{w:4,col:LN,id:10480});txt('0',0,0,52,{w:900,col:DEEP});});}});
 const ig=P(t,BT.insta-.1,BT.insta+.2);if(ig>0)tf(250,520,L(2.6,1.35,E.heavy(ig)),L(-.4,-.08,ig),()=>igLogo(0,0,1,10410,PAPER));
 if(t>BT.megh)for(let i=0;i<2;i++){const u=(t*1.4+i*.5)%1;const sd=i?1:-1;ink(Sh.bez([500+sd*105,690-u*80],[500+sd*135,660-u*80],[500+sd*105,630-u*80],[500+sd*135,600-u*80]),{w:6,col:'#8FA3C0',id:10490+i,dbl:0,alpha:1-u});}
 const bb=P(t,BT.insta+.25,BT.insta+.5);if(bb>0){bubble(820,820,330,160,bb,10495,[-.6,1],PAPER);txt('#@!',820,820,72,{w:900,col:RED,a:bb});}});
// S5 «Եթե» Wiy flies in · «WiyMood» blue burst · «կունենար կայք» phone · «ակնթարթում» instant
function goodSite2(t,w,h,{beauty=1}={}){solid(0,0,w,h,0,PAPER);txt('Արամի տորթերը',24,44,34,{al:'left',w:900,col:RED});txt('☰',w-36,44,34,{w:900});
 solid(16,86,w-32,380,26,beauty>0?'#FBE7E3':'#EEE');if(beauty>0){X.save();X.globalAlpha=beauty;for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.2;ink(Sh.line(w/2,86,w/2+Math.cos(a)*520,86+Math.sin(a)*520),{w:12,col:YEL,id:10800+i,dbl:0,alpha:.35});}X.restore();}
 cake(w/2,290,.85,1,10600,{tint:beauty>0?TRED:'#E8E8E8'});if(beauty>0)[[-110,-90],[-36,-100],[46,-98],[118,-90]].forEach(([x,y],i)=>shape(Sh.circle(w/2+x*.85,290+y*.85,16*spring(beauty,.5)),{fill:RED,id:10850+i,w:3,off:0}));
 txt('Ելակով ու մասկարպոնեով',w/2,510,32,{w:900});pill(w/2,600,'Պատվիրել',40,{bg:RED,id:10630});}
scene(BT.ete-.3,BT.gegh-.75,5200,2300,(t)=>{const ap=E.land(P(t,BT.ete-.15,BT.ete+.4));
 if(WIY.complete){X.save();X.translate(L(-250,200,ap),720);X.rotate(-.12);X.drawImage(WIY,-150,-150,300,300*WIY.height/WIY.width);X.restore();}bigPen(L(-120,300,ap),600,1,.7,10700);
 const wm=pop(t,BT.wiy-.05,.35);if(wm>0)tf(540,300,wm,0,()=>{txt('WiyMood',0,0,90,{w:900,col:PAPER,f:'MO'});});
 const st=pop(t,BT.kunenar,.35);if(st>0)phone(650,1000,.82*st,.04,1,(w,h)=>{const ready=t>BT.akn-.05;if(!ready){solid(0,0,w,h,0,PAPER);}else goodSite2(t,w,h);
   if(!ready){const lp=P(t,BT.bacvum2-.1,BT.akn);solid(60,h/2,w-120,26,13,'#E2E6EE');solid(60,h/2,(w-120)*lp,26,13,BLUE);}
   const fl=1-P(t,BT.akn-.05,BT.akn+.25);if(fl>0&&ready){X.save();X.globalAlpha=fl*.9;X.fillStyle='#FFFFFF';X.fillRect(0,0,w,h);X.restore();}},{id:10710});
 if(t>BT.akn-.05){pill(920,700,'0.8 վ',52,{bg:YEL,fg:K.ink,p:pop(t,BT.akn),id:10730});for(let i=0;i<3;i++)ink([[[1000-i*28,760+i*24],[960-i*28,840+i*24],[1000-i*28,840+i*24],[960-i*28,920+i*24]]],{w:7,col:YEL,id:10740+i,dbl:0,prog:pen(t,BT.akn+i*.06,.15)});}});
// S6 «գեղեցիկ» colour sweeps in · «մարդիկ» tap send · chats fly · «ուղարկում»
scene(BT.gegh-.75,BT.bogh-.5,6500,2300,(t)=>{const beauty=E.heavy(P(t,BT.gegh-.15,BT.gegh+.35));
 phone(540,860,.85,-.02,1,(w,h)=>{goodSite2(t,w,h,{beauty});const tap=P(t,BT.mardik,BT.mardik+.2);tf(w/2,720,1+.18*Math.sin(Math.PI*tap),0,()=>pill(0,0,'↗ Ուղարկել',36,{bg:BLUE,id:10860}));},{id:10870});
 if(beauty>0&&beauty<1)for(let i=0;i<8;i++)sparkle(540+Math.cos(i*.8)*360*beauty,860+Math.sin(i*.8)*480*beauty,26,1,YEL,10880+i);
 const chats=[['Աննա',240,330,'Վա՜յ'],['Մամա 💛',830,380,'Պատվիրիր ինձ էլ'],['Լիլիթ',240,1260,'Ծննդյանս համար!'],['Աշխատանքի խումբ',830,1300,'Ո՞րտեղից է']];
 chats.forEach(([n,x,y,m],i)=>{const s0=BT.mardik+.25+i*.38;const f=E.heavy(P(t,s0,s0+.35));if(f<=0)return;
  if(f<1){tf(L(540,x,f),L(860,y,f)-Math.sin(Math.PI*f)*160,L(.5,1,f),f*6.28,()=>{solid(-60,-50,120,100,14,'#FBE7E3');cake(0,8,.18,1,10900+i*20);});return;}
  lifted(.7,()=>tf(x,y,.92,(i%2?.04:-.04),()=>{solid(-180,-120,360,240,26,PAPER);ink(Sh.rrect(-180,-120,360,240,26),{w:4,id:10960+i});txt(n,-150,-88,30,{al:'left',w:900,maxW:300});solid(-150,-55,140,120,14,'#FBE7E3');cake(-80,12,.2,1,10980+i*20);
   const r=P(t,s0+.4,s0+.6);if(r>0){txt(m,15,-10,24,{al:'left',w:800,maxW:150,a:r});heart(80,60,.42*spring(r,.5),1,RED,11040+i);}}));});});
// S7 «կբողոքեր» Aram shrugs · «թխել» frenzy, orders flood
scene(BT.bogh-.5,BT.ete2-.3,7800,2300,(t)=>{const fr=P(t,BT.txel-.6,BT.txel);
 tf(860,1040,1,0,()=>{shape(Sh.rrect(-150,-150,300,300,20),{fill:'#C9D3E2',id:11100});solid(-110,-90,220,150,14,ORG,.6+.25*Math.sin(t*9));ink(Sh.rrect(-110,-90,220,150,14),{w:4,id:11101});});
 const fast=t*16;const arms=fr>0?[[1.6+Math.sin(fast)*.7,.8],[1.6+Math.cos(fast)*.7,.8]]:[[1.2,1.6],[1.2,1.6]];
 person(420,1400,1.4,{...ARAM,id:11110,mood:fr>0?'grin':'flat',sweat:fr>0,look:.5,arms});
 const ah=pop(t,BT.bogh,.3)*(1-fr);if(ah>0){bubble(330,520,280,140,ah,11120,[.2,1]);txt('Ա՜խ…',330,520,56,{w:900,col:RED,a:ah});}
 if(fr>0)for(let i=0;i<16;i++){const u=((t*1.1+i*.37)%1);const x=150+((i*131)%760),y=360+u*820;X.save();X.globalAlpha=(1-u)*.9;X.fillStyle=PAPER;X.beginPath();X.arc(x+Math.sin(t*3+i)*30,y,9+(i%3)*4,0,7);X.fill();X.restore();}
 for(let i=0;i<5;i++){const p=P(t,BT.miayn+i*.28,BT.miayn+.25+i*.28);if(p>0)tf(L(1300,730,E.outExpo(p)),300+i*90,.95,0,()=>{lifted(.5,()=>solid(-210,-38,420,76,22,PAPER));txt('🔔 Նոր պատվեր',0,2,34,{w:900,col:BLUE});});}
 [[150,1120],[260,1180],[150,1210]].forEach(([x,y],i)=>cake(x,y-i*10,.24,1,11300+i*30,{tint:[TRED,YEL,TBLUE][i]}));});
// S8 «Եթե Ձեր…» comment card · «ԲՐԵՆԴ» typed exactly as said · «անվճար» stamp
scene(BT.ete2-.3,END,9100,2300,(t)=>{
 const lg=pop(t,BT.ete2,.45);if(lg>0&&LOGO.complete)tf(540,400,lg,0,()=>{const lw=300,lh=lw*LOGO.height/LOGO.width;X.save();X.globalCompositeOperation='multiply';X.drawImage(LOGO,-lw/2,-lh/2,lw,lh);X.restore();});
 const cd=pop(t,BT.ete2+.1,.4);if(cd>0)lifted(1,()=>tf(540,860,cd,0,()=>tilt(0,0,1,.03,-.04,()=>{solid(-450,-210,900,420,36,PAPER);ink(Sh.rrect(-450,-210,900,420,36),{w:5,id:11400});txt('Մեկնաբանություններ',-390,-150,32,{al:'left',w:800,col:GREY});
  shape(Sh.circle(-360,10,48),{fill:TRED,id:11401,w:4,off:0});solid(-290,-44,600,108,54,'#EEF2F8');ink(Sh.rrect(-290,-44,600,108,54),{w:3,id:11402,dbl:0});
  const word='ԲՐԵՆԴ';const n=Math.floor(cl((t-BT.brand+.3)/.4)*word.length);if(n==0)txt('Ավելացնել մեկնաբանություն…',-260,10,30,{al:'left',w:600,col:GREY});else txt([...word].slice(0,n).join(''),-260,12,62,{al:'left',w:900,col:RED});
  const sent=t>BT.brand+.25;tf(360,10,1+.2*Math.sin(Math.PI*P(t,BT.brand+.25,BT.brand+.5)),0,()=>{solid(-54,-54,108,108,54,sent?BLUE:'#C0C6D0');const A=[[-22,-24],[28,0],[-22,24],[-11,0]];wash([A],PAPER,1,0);});})));
 stamp(540,1230,1,-.06,'ԱՆՎՃԱՐ',P(t,BT.anvch-.05,BT.anvch+.2),{bg:RED,fg:PAPER,id:11450});
 if(WIY.complete){const u=E.land(P(t,BT.ete2+.6,BT.ete2+1.1));X.save();X.translate(L(1220,940,u),1100);X.rotate(-.18);X.drawImage(WIY,-85,-85,170,170*WIY.height/WIY.width);X.restore();}
 itxt('wiymood',540,1400,70,{fam:'S',prog:pen(t,BT.anvch+.4,.7),id:11420,col:BLUE,maxW:500});});
// ---------- camera: word-anchored keys, quick whips, zoom punches ----------
const KEYS=[];function key(t,si,px,py,z=1,r=0,dip=.08){const [ox,oy]=SCX[si];KEYS.push([t,ox+px-540,oy+py-960,z,r,dip]);}
key(0,0,540,980,.96);key(BT.aram-.1,0,560,900,1.08,-.01);key(BT.hamegh,0,540,960,1.0);key(BT.karcum,0,460,930,1.04,.01);key(BT.nkaten,0,430,900,1.1,.01);key(BT.kayq,0,540,960,1.02);key(BT.de-.32,0,540,960,1.04);
key(BT.de-.04,1,540,900,1.16,0,.18);key(BT.chap,1,540,880,1.22,.01);key(BT.bacv-.5,1,540,900,1.26);
key(BT.bacv-.2,2,420,940,1.08,0,.15);key(BT.dandagh,2,420,940,1.18,-.01);key(BT.tort-.05,2,1180,1060,1.12,0,.06);key(BT.hnanal+.1,2,1220,1080,1.3,.02);key(BT.isk-.4,2,1220,1080,1.34);
key(BT.isk-.08,3,520,960,1.0,0,.25);key(BT.megh,3,520,960,1.1,.01);key(BT.insta,3,420,880,1.12,-.02);key(BT.ete-.55,3,500,960,1.06);
key(BT.ete-.25,4,520,960,1.0,0,.12);key(BT.wiy,4,560,960,.94);key(BT.akn,4,640,960,1.08);key(BT.gegh-1.0,4,640,960,1.12);
key(BT.gegh-.7,5,540,960,1.0,0,.12);key(BT.gegh,5,540,900,1.1);key(BT.mardik+.2,5,540,960,1.0);key(BT.bogh-.75,5,540,960,1.04);
key(BT.bogh-.45,6,540,960,1.0,0,.12);key(BT.txel,6,520,900,1.12,.01);key(BT.ete2-.55,6,520,940,1.08);
key(BT.ete2-.25,7,540,960,1.0,0,.12);key(BT.brand,7,540,900,1.12);key(BT.anvch,7,540,980,1.04);key(END,7,540,960,1.0);
KEYS.sort((a,b)=>a[0]-b[0]);
// zoom punches and shakes on the hits
const PUNCH=[[BT.aram,.05],[BT.hamegh,.04],[BT.kayq,.05],[BT.de,.09,1],[BT.chap,.05],[BT.dandagh,.03],[BT.hnanal,.08,1],[BT.megh,.05,1],[BT.insta,.1,1],[BT.wiy,.1,1],[BT.akn,.08],[BT.gegh,.06],[BT.txel,.07,1],[BT.brand,.06],[BT.anvch,.1,1]];
function camBase(t){let i=KEYS.findIndex(k=>k[0]>t);if(i==-1)return KEYS[KEYS.length-1].slice();if(i==0)return KEYS[0].slice();const a=KEYS[i-1],b=KEYS[i];const travel=Math.hypot(b[1]-a[1],b[2]-a[2])>300;let u=(t-a[0])/(b[0]-a[0]);
 TRAVEL=travel&&u>0&&u<1;const e=travel?E.heavy(u):E.io(u);return [0,L(a[1],b[1],e),L(a[2],b[2],e),L(a[3],b[3],e)*(travel?1-b[5]*Math.sin(Math.PI*u):1),L(a[4],b[4],e)+(travel?Math.sin(Math.PI*u)*.04*(b[1]>a[1]?1:-1):0)];}
function cam(t){const k=camBase(t);let zp=0,sx=0,sy=0;PUNCH.forEach(([b,a,s])=>{const u=t-b;if(u>=0&&u<.6){const e=Math.exp(-u*9);zp+=a*e;if(s){sx+=Math.sin(u*70)*14*e;sy+=Math.cos(u*63)*10*e;}}});k[3]*=1+zp;k[1]+=sx;k[2]+=sy;return k;}
function speedLines2(t){let s=Math.floor(t*30)+3;const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};X.save();X.setTransform(1,0,0,1,0,0);X.strokeStyle='rgba(11,27,51,.28)';for(let i=0;i<16;i++){const y=R()*H,x=R()*W,l=120+R()*380;X.lineWidth=2+R()*3;X.beginPath();X.moveTo(x,y);X.lineTo(x+l,y+(R()-.5)*10);X.stroke();}X.restore();}
