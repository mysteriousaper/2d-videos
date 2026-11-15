// node tool.cjs shots <t...> | node tool.cjs check <step> | node tool.cjs render <firstFrame> <lastFrame>
const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const [mode,...a]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()=='error')console.log('CONSOLE',m.text());});
await p.goto('http://127.0.0.1:8772/price.html');await p.evaluate(()=>boot());
const grab=async(t,q)=>{const d=await p.evaluate(([t,q])=>{renderFrame(t);return document.getElementById('c').toDataURL('image/jpeg',q)},[t,q]);return Buffer.from(d.split(',')[1],'base64');};
if(mode=='shots'){fs.mkdirSync('shots',{recursive:true});for(const t of a)fs.writeFileSync(`shots/${(+t).toFixed(2).padStart(5,'0')}.jpg`,await grab(+t,.85));}
if(mode=='check'){const dur=await p.evaluate(()=>DUR);const bad={};for(let t=0;t<dur;t+=+a[0]){const r=await p.evaluate(t=>checkFrame(t),t);for(const d of r){if(!bad[d[0]])bad[d[0]]=[t.toFixed(1),...d.slice(1)];}}console.log(JSON.stringify(bad,null,1));}
if(mode=='render'){fs.mkdirSync('fr',{recursive:true});for(let i=+a[0];i<=+a[1];i++)fs.writeFileSync('fr/'+String(i).padStart(4,'0')+'.jpg',await grab(i/30,.92));console.log('done',a[0],a[1]);}
await b.close();})();
