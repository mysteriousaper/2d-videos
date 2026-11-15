const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const ts=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8771/reel.html');await p.evaluate(()=>boot());
for(const t of ts){const d=await p.evaluate(t=>{renderFrame(+t);return document.getElementById('c').toDataURL('image/jpeg',.85)},t);fs.writeFileSync(`z_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));}await b.close();})();
