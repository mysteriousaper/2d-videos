const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8771/reel.html');await p.evaluate(()=>boot());
const d=await p.evaluate(()=>{window.NOCAP=true;window.NOFAR=true;renderFrame(4.0+TOFF);window.NOCAP=false;
 Ink.frame(4.0);itxt('9 ժամ',540,1448,150,{id:3001,col:K.red,maxW:700});itxt('առանց պատասխանի',540,1580,84,{id:3002,maxW:860});
 return document.getElementById('c').toDataURL('image/jpeg',.93)});
fs.writeFileSync('cover_v2.jpg',Buffer.from(d.split(',')[1],'base64'));await b.close();})();
