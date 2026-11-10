const {chromium}=require('C:/Users/Administrador/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');const path=require('path');
(async()=>{
 const root=path.resolve(__dirname,'..');const out=path.join(root,'docs/qa/heroes-editoriales');
 for(const [file,before,marker] of [['nosotros.html','nosotros.before.html','    <section class="about-biography"'],['musica-y-videos.html','musica.before.html','    <section class="music-releases"']]){
  const a=fs.readFileSync(path.join(out,before),'utf8'),b=fs.readFileSync(path.join(root,file),'utf8');
  if(a.slice(a.indexOf('<body'),a.indexOf('<main'))!==b.slice(b.indexOf('<body'),b.indexOf('<main'))||a.slice(a.indexOf(marker))!==b.slice(b.indexOf(marker)))throw Error('Out of scope HTML changed');
 }
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const page=await browser.newPage();const errors=[];const results=[];page.on('pageerror',e=>errors.push(String(e)));
 for(const width of [1440,768,390,360])for(const file of ['nosotros.html','musica-y-videos.html']){
  await page.setViewportSize({width,height:1000});await page.goto('file:///'+path.join(root,file).replaceAll('\\','/'));
  await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.editorial-hero img').decode();});
  const metrics=await page.evaluate(()=>{
   const hero=document.querySelector('.editorial-hero'),text=hero.querySelector('.editorial-hero__content'),image=hero.querySelector('img');
   const box=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:box(hero),text:box(text),image:box(image),fit:getComputedStyle(image).objectFit,ratio:image.naturalWidth/image.naturalHeight,background:getComputedStyle(hero).backgroundColor,buttons:[...hero.querySelectorAll('.music-subnav a')].map(x=>({href:x.getAttribute('href'),...box(x)}))};
  });
  if(metrics.scrollWidth>width||metrics.fit!=='contain'||Math.abs(metrics.image.width/metrics.image.height-metrics.ratio)>.01)throw Error('Geometry failure '+JSON.stringify(metrics));
  if(width>=768&&metrics.text.right>metrics.image.x+1)throw Error('Overlap');
  if(width<768&&metrics.image.y<metrics.text.bottom)throw Error('Mobile overlap');
  for(const b of metrics.buttons){if(b.x<0||b.right>width||b.height<44)throw Error('Button bounds');await page.locator('.editorial-hero a[href="'+b.href+'"]').click();await page.waitForFunction(hash=>location.hash===hash,b.href);}
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(out,file.replace('.html','')+'-'+width+'.png')});results.push({file,width,...metrics});
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 const motion=await page.locator('.editorial-hero').evaluate(x=>({animation:getComputedStyle(x).animationName,transition:getComputedStyle(x).transitionDuration}));
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(out,'resultados.json'),JSON.stringify({results,errors,outsideHeroUnchanged:true,reducedMotion:motion},null,2));console.log(JSON.stringify({cases:results.length,errors,outsideHeroUnchanged:true,motion}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
