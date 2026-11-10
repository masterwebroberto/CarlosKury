const { chromium } = require('C:/Users/Administrador/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page = await browser.newPage();
 const results=[]; const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const root=path.resolve(__dirname,'..');
 for(const width of [1440,768,390,360]) {
  await page.setViewportSize({width,height:1000});
  for(const file of ['index.html','musica-y-videos.html','nosotros.html']) {
   await page.goto('file:///'+path.join(root,file).replaceAll('\\','/'));
   await page.evaluate(async()=>{document.querySelectorAll('img[loading="lazy"]').forEach(x=>x.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   await page.screenshot({path:path.join(root,`docs/qa/fase7-${file.replace('.html','')}-${width}.png`),fullPage:true});
   results.push({file,width,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(x=>x.getAttribute('src')&&(!x.complete||!x.naturalWidth)).map(x=>x.src),hero:document.querySelector('.official-hero').getBoundingClientRect().toJSON()}))});
   if(width<768){await page.locator('.menu-toggle').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu failed');await page.keyboard.press('Escape');}
   if(file==='index.html'){
    const track=page.locator('#fotos'); await track.scrollIntoViewIfNeeded();
    await page.locator('[data-carousel-pause]').click();
    const before=await track.evaluate(x=>x.scrollLeft);await page.locator('.carousel-arrow--next').click();await page.waitForTimeout(650);
    if(await track.evaluate(x=>x.scrollLeft)<=before)throw Error('Photo carousel failed');
    await page.locator('.gallery__open').first().click();await page.waitForTimeout(200);if(!await page.locator('.lightbox').evaluate(x=>x.open))throw Error('Gallery failed');
    await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);if(await page.locator('.lightbox__counter').textContent()!=='2 / 6')throw Error('Gallery next failed');
    await page.keyboard.press('Escape');
   }
  }
 }
 fs.writeFileSync(path.join(root,'docs/qa/fase7-resultados.json'),JSON.stringify({results,errors,menu:true,photoCarousel:true,gallery:true},null,2));
 console.log(JSON.stringify({cases:results.length,overflow:results.filter(x=>x.scrollWidth>x.width),broken:results.filter(x=>x.broken.length),errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
