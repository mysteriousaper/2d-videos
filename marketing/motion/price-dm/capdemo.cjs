const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8772/price.html');await p.evaluate(()=>boot());fs.mkdirSync('capdemo',{recursive:true});
for(const st of ['glass','tape','sketch'])for(const t of [8.9,17.9,23.6]){const d=await p.evaluate(([st,t])=>{window.CAPSTYLE=st;renderFrame(t);return document.getElementById('c').toDataURL('image/jpeg',.9)},[st,t]);fs.writeFileSync(`capdemo/${st}_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));}
await b.close();})();
