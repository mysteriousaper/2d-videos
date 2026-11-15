const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const [a,b]=process.argv.slice(2).map(Number);const fps=30;const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8771/reel.html');await p.evaluate(()=>boot());fs.mkdirSync('fr',{recursive:true});
for(let i=a;i<=b;i++){const d=await p.evaluate(([t,fps])=>{renderFrame(t,fps);return document.getElementById('c').toDataURL('image/jpeg',0.93)},[i/fps,fps]);fs.writeFileSync('fr/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(d.split(',')[1],'base64'));}
await br.close();console.log('done',a,b);})();
