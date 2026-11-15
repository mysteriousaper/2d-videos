// WiyMood ink engine: hand-drawn ink line art on paper with line boil.
// Every shape is a list of contours (arrays of [x,y]); drawing jitters them per boil frame,
// adds pen pressure, a loose second line and small breaks, and can be revealed by pen progress.
(function(G){
const W=1080,H=1920;
let X=null,BF=0,TIME=0;
const INK={ink:'#0B1B33',red:'#F23C29',blue:'#005DC2',green:'#005DC2',grey:'#5B6B82',gold:'#F23C29',paper:'#F7F9FC'};
// ---------- noise ----------
function h1(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n);}
function vn(x){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return h1(i)*(1-u)+h1(i+1)*u;} // 0..1 smooth
const sn=x=>vn(x)*2-1;
// ---------- shape builders (return contours) ----------
const Sh={
 line:(x1,y1,x2,y2)=>[[[x1,y1],[x2,y2]]],
 poly:(pts,closed=false)=>[closed?[...pts,pts[0]]:pts],
 rect:(x,y,w,h)=>[[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]]],
 rrect:(x,y,w,h,r)=>{r=Math.min(r,w/2,h/2);const p=[];const arc=(cx,cy,a0)=>{for(let i=0;i<=6;i++){const a=a0+i/6*Math.PI/2;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}};
  arc(x+w-r,y+r,-Math.PI/2);arc(x+w-r,y+h-r,0);arc(x+r,y+h-r,Math.PI/2);arc(x+r,y+r,Math.PI);p.push(p[0]);return [p];},
 ellipse:(cx,cy,rx,ry,a0=0,a1=Math.PI*2,n=40)=>{const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return [p];},
 circle:(cx,cy,r)=>Sh.ellipse(cx,cy,r,r,-Math.PI/2,Math.PI*1.5+.25),
 bez:(p0,p1,p2,p3,n=24)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;p.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]);}return [p];},
 quad:(p0,p1,p2,n=20)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;p.push([u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]]);}return [p];},
 cat:(pts,n=10)=>{const p=[];for(let i=0;i<pts.length-1;i++){const a=pts[Math.max(0,i-1)],b=pts[i],c=pts[i+1],d=pts[Math.min(pts.length-1,i+2)];for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;p.push([.5*((2*b[0])+(-a[0]+c[0])*t+(2*a[0]-5*b[0]+4*c[0]-d[0])*t2+(-a[0]+3*b[0]-3*c[0]+d[0])*t3),.5*((2*b[1])+(-a[1]+c[1])*t+(2*a[1]-5*b[1]+4*c[1]-d[1])*t2+(-a[1]+3*b[1]-3*c[1]+d[1])*t3)]);}}p.push(pts[pts.length-1]);return [p];},
};
function join(...cs){return cs.flat();}
// resample contour to ~step px so jitter is even
function resample(c,step=9){const out=[c[0]];for(let i=1;i<c.length;i++){const [x0,y0]=c[i-1],[x1,y1]=c[i];const d=Math.hypot(x1-x0,y1-y0);const n=Math.max(1,Math.ceil(d/step));for(let k=1;k<=n;k++)out.push([x0+(x1-x0)*k/n,y0+(y1-y0)*k/n]);}return out;}
function clen(c){let L=0;for(let i=1;i<c.length;i++)L+=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);return L;}
// ---------- draw ----------
// opt: w (px), col, prog (0..1 pen reveal), id (stable seed), amp (boil px), dbl (double-line chance 0..1), gaps (0..1), alpha, tip (pen blob)
function ink(contours,opt={}){
 const w=opt.w??5,col=opt.col??INK.ink,prog=opt.prog??1,id=opt.id??1,amp=opt.amp??2.4,dbl=opt.dbl??.55,gaps=opt.gaps??.12,alpha=opt.alpha??1,step=opt.step??8;
 if(prog<=0||alpha<=0)return;
 const cs=contours.map(c=>resample(c,step));
 const lens=cs.map(clen);const total=lens.reduce((a,b)=>a+b,0)||1;let budget=prog*total;
 X.save();X.globalAlpha*=alpha;X.strokeStyle=col;X.lineCap='round';X.lineJoin='round';
 const seed=BF*1.37+id*17.31;let tip=null;
 cs.forEach((c,ci)=>{if(budget<=0)return;const L=lens[ci];let use=Math.min(L,budget);budget-=L;
  // points up to 'use' length
  const pts=[];let acc=0;pts.push(c[0]);for(let i=1;i<c.length;i++){const d=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);if(acc+d>use){const f=(use-acc)/d;pts.push([c[i-1][0]+(c[i][0]-c[i-1][0])*f,c[i-1][1]+(c[i][1]-c[i-1][1])*f]);break;}acc+=d;pts.push(c[i]);}
  const s=seed+ci*3.17;
  const J=pts.map((p,k)=>[p[0]+sn(k*.09+s)*amp+sn(k*.5+s*2)*amp*.25,p[1]+sn(k*.09+s+40)*amp+sn(k*.5+s*2+9)*amp*.25]);
  // main line with pressure and small breaks
  const seg=5;for(let k=0;k<J.length-1;k+=seg){const g=vn(k*.045+id*3.3+ci*1.1+BF*.21);if(g<gaps*.9&&k>0&&k<J.length-seg-1)continue;
   const pr=.62+.7*vn(k*.03+id+ci);const taper=Math.min(1,(k+1)/6,(J.length-k)/6+.25);X.lineWidth=w*pr*Math.max(.45,taper);
   X.beginPath();X.moveTo(J[k][0],J[k][1]);for(let m=1;m<=seg&&k+m<J.length;m++)X.lineTo(J[k+m][0],J[k+m][1]);X.stroke();}
  // loose second line on parts of the stroke
  if(dbl>0&&J.length>4){X.save();X.globalAlpha*=.5;X.lineWidth=Math.max(1,w*.42);const o=1.6+amp*.9;X.beginPath();let on=false;
   for(let k=0;k<J.length;k++){const v=vn(k*.035+id*7.7+ci*2.3);const show=v<dbl*.62;const p=[J[k][0]+sn(k*.07+s+70)*o+o*.6,J[k][1]+sn(k*.07+s+90)*o+o*.4];
    if(show){if(!on){X.moveTo(p[0],p[1]);on=true;}else X.lineTo(p[0],p[1]);}else on=false;}X.stroke();X.restore();}
  tip=J[J.length-1];});
 if(opt.tip!==false&&prog<1&&tip){X.fillStyle=col;X.beginPath();X.arc(tip[0],tip[1],w*.75,0,7);X.fill();}
 X.restore();}
// hatched scribble used as tiny accents (not a fill: loose, few lines)
function scribble(x,y,w,h,opt={}){const n=opt.n??5;const cs=[];for(let i=0;i<n;i++){const t=i/(n-1);cs.push([[x,y+h*t],[x+w,y+h*t-h*.25]]);}ink(cs,{w:2.4,amp:1.5,dbl:0,gaps:.05,...opt});}
// ---------- glyph text ----------
let FONTS={};
function loadFonts(map){return Promise.all(Object.entries(map).map(([k,url])=>new Promise((res,rej)=>opentype.load(url,(e,f)=>{if(e)rej(e);else{FONTS[k]=f;res();}}))));}
const isArm=ch=>/[԰-֏ﬓ-ﬗ]/.test(ch);
function pickFont(ch,fam){const A=FONTS[fam+'A'],Lf=FONTS[fam+'L'];if(isArm(ch))return A;if(Lf&&Lf.charToGlyphIndex(ch)>0)return Lf;return A;}
function flat(path,ox=0,oy=0){const cs=[];let cur=null,last=[0,0];
 for(const c of path.commands){if(c.type==='M'){if(cur&&cur.length>1)cs.push(cur);cur=[[c.x+ox,c.y+oy]];last=[c.x,c.y];}
  else if(c.type==='L'){cur.push([c.x+ox,c.y+oy]);last=[c.x,c.y];}
  else if(c.type==='Q'){const n=7;for(let i=1;i<=n;i++){const t=i/n,u=1-t;cur.push([u*u*last[0]+2*u*t*c.x1+t*t*c.x+ox,u*u*last[1]+2*u*t*c.y1+t*t*c.y+oy]);}last=[c.x,c.y];}
  else if(c.type==='C'){const n=8;for(let i=1;i<=n;i++){const t=i/n,u=1-t;cur.push([u*u*u*last[0]+3*u*u*t*c.x1+3*u*t*t*c.x2+t*t*t*c.x+ox,u*u*u*last[1]+3*u*u*t*c.y1+3*u*t*t*c.y2+t*t*t*c.y+oy]);}last=[c.x,c.y];}
  else if(c.type==='Z'){if(cur){cur.push(cur[0]);cs.push(cur);cur=null;}}}
 if(cur&&cur.length>1)cs.push(cur);return cs;}
const _tc=new Map();
// returns {glyphs:[contours per char], width}; laid out from x=0 baseline y=0
function textShape(str,size,fam='S'){const key=str+'|'+size+'|'+fam;if(_tc.has(key))return _tc.get(key);let x=0;const glyphs=[];
 for(const ch of str){const f=pickFont(ch,fam);if(ch===' '){x+=size*.28;continue;}const p=f.getPath(ch,x,0,size);glyphs.push(flat(p));x+=f.getAdvanceWidth(ch,size)+size*.01;}
 const r={glyphs,width:x};_tc.set(key,r);return r;}
function textW(str,size,fam='S'){return textShape(str,size,fam).width;}
// draw outlined text; prog reveals letter by letter (pen); align center|left
function inkText(str,x,y,size,opt={}){const fam=opt.fam??'S';const sh=textShape(str,size,fam);const al=opt.al??'center';const x0=al==='center'?x-sh.width/2:al==='right'?x-sh.width:x;
 const prog=opt.prog??1;if(prog<=0)return sh.width;const n=sh.glyphs.length;X.save();X.translate(x0,y+size*.35);
 sh.glyphs.forEach((g,i)=>{const p=Math.max(0,Math.min(1,prog*n*1.15-i*1.15+0.15));if(p<=0)return;ink(g,{w:opt.w??Math.max(2,size*.045),col:opt.col,prog:p,id:(opt.id??5)+i*.71,amp:opt.amp??Math.max(.8,size*.012),dbl:opt.dbl??.35,gaps:opt.gaps??.05,step:Math.max(4,size*.06),tip:opt.tip,alpha:opt.alpha});});
 X.restore();return sh.width;}
// solid hand-lettered caption text (readable at small size): canvas text with boil wobble per word
function fitSize(str,size,maxW,fam='S'){const w=textW(str,size,fam);return w>maxW?size*maxW/w:size;}
G.Ink={init:(ctx)=>{X=ctx;},frame:(t)=>{TIME=t;BF=Math.floor(t*10);},get BF(){return BF;},INK,Sh,join,ink,scribble,loadFonts,textShape,textW,inkText,fitSize,vn,sn,h1};
})(window);
