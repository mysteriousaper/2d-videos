const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const [port,step,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(`http://127.0.0.1:${port}/reel.html`);await p.evaluate(()=>boot());const bad={};
for(let t=0;t<50.6;t+=+step){const r=await p.evaluate(t=>checkFrame(t),t);for(const d of r){const k=d[0];if(!bad[k])bad[k]=[t.toFixed(1),...d.slice(1)];}}
console.log(JSON.stringify(bad,null,0));
if(out){fs.mkdirSync(out,{recursive:true});for(const t of [1.2,3.5,6.0,9.5,12.5,15.0,17.0,19.2,21.0,22.6,23.8,25.0,27.3,28.2,30.0,33.0,36.8,39.2,41.0,43.6,46.0,49.5]){const d=await p.evaluate(t=>{renderFrame(t);return document.getElementById('c').toDataURL('image/jpeg',.85)},t);fs.writeFileSync(`${out}/${t.toFixed(1).padStart(4,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'));}}
await b.close();})();
