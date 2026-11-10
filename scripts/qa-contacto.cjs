const {chromium}=require('C:/Users/Administrador/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');const path=require('path');const crypto=require('crypto');
(async()=>{
 const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/qa/contacto');
 const baseline=JSON.parse(fs.readFileSync(path.join(out,'alcance.json'),'utf8'));
 for(const [file,hash] of Object.entries(baseline))if(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash)throw Error('Scope changed: '+file);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const page=await browser.newPage();const errors=[],requests=[],results=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 for(const width of [1440,768,390,360]){
  await page.setViewportSize({width,height:1000});await page.goto('file:///'+path.join(root,'contacto.html').replaceAll('\\','/'));
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));});
  const geometry=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).length,heroHeight:document.querySelector('.contact-hero').getBoundingClientRect().height,sendDisabled:document.querySelector('[data-send]').disabled,privacyDisabled:document.querySelector('#privacidad').disabled}));
  if(geometry.scrollWidth>width||geometry.broken||!geometry.sendDisabled||!geometry.privacyDisabled)throw Error(JSON.stringify(geometry));
  await page.screenshot({path:path.join(out,'contacto-'+width+'.png'),fullPage:true});
  if(width<768){await page.locator('.menu-toggle').focus();await page.keyboard.press('Enter');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu');await page.keyboard.press('Escape');if(!await page.locator('.menu-toggle').evaluate(x=>x===document.activeElement))throw Error('Menu focus');}
  await page.locator('a[href="#formulario"]').click();if(!await page.locator('#formulario').evaluate(x=>x===document.activeElement))throw Error('Anchor focus');
  await page.locator('[data-review]').click();if(await page.locator('[data-validate][aria-invalid="true"]').count()!==4)throw Error('Required fields');
  if(await page.locator('#telefono').getAttribute('aria-invalid')!=='false')throw Error('Optional phone');
  await page.locator('#nombre').fill('   ');await page.locator('[data-review]').click();if(await page.locator('#nombre').getAttribute('aria-invalid')!=='true')throw Error('Whitespace');
  await page.locator('#nombre').fill('Prueba local');await page.locator('#correo').fill('correo-invalido');await page.locator('#motivo').selectOption({label:'Prensa'});await page.locator('#mensaje').fill('Mensaje de prueba local sin envio.');await page.locator('[data-review]').click();if(!await page.locator('#correo-error').isVisible())throw Error('Email');
  await page.locator('#correo').fill('prueba@example.invalid');await page.locator('[data-review]').click();if(await page.locator('[data-validate][aria-invalid="true"]').count())throw Error('Valid values');
  if(!(await page.locator('[data-status]').textContent()).includes('Envío aún no disponible'))throw Error('Unavailable state');
  await page.locator('#nombre').focus();await page.keyboard.press('Tab');if(!await page.locator('#correo').evaluate(x=>x===document.activeElement))throw Error('Tab order');
  const focus=await page.locator('#correo').evaluate(x=>({width:getComputedStyle(x).outlineWidth,style:getComputedStyle(x).outlineStyle}));if(focus.width==='0px'||focus.style==='none')throw Error('Focus invisible');
  await page.locator('#mensaje').focus();await page.keyboard.press('Tab');if(!await page.locator('[data-review]').evaluate(x=>x===document.activeElement))throw Error('Disabled controls keyboard');
  await page.locator('#nombre').press('Enter');if(!(await page.locator('[data-send]').isDisabled()))throw Error('Send activated');
  results.push({width,...geometry,validation:true,keyboard:true,focus});
 }
 if(requests.length)throw Error('Unexpected network: '+requests);
 // Exercise future POST handling entirely in memory, with fetch replaced by a local stub.
 const html=fs.readFileSync(path.join(root,'contacto.html'),'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g,'');
 const source=fs.readFileSync(path.join(root,'js/contacto.js'),'utf8');
 async function setup(endpoint,approved,url){await page.setContent(html);await page.evaluate(()=>{window.calls=[];window.fetch=async(...args)=>{window.calls.push({url:args[0],method:args[1].method,body:[...args[1].body.entries()]});return await window.reply();};window.reply=async()=>({ok:true,json:async()=>({ok:true})});});await page.addScriptTag({content:source.replace("endpoint: '', privacyApproved: false, privacyUrl: ''",`endpoint: '${endpoint}', privacyApproved: ${approved}, privacyUrl: '${url}'`)});}
 for(const [endpoint,approved,url] of [['https://formspree.io/f/testing',false,'/privacidad'],['',true,'/privacidad'],['https://formspree.io/f/testing',true,'']]){await setup(endpoint,approved,url);if(!await page.locator('[data-send]').isDisabled())throw Error('Activation gate');}
 await setup('https://formspree.io/f/testing',true,'/privacidad');
 async function fill(){await page.locator('#nombre').fill('Prueba');await page.locator('#correo').fill('prueba@example.invalid');await page.locator('#motivo').selectOption({label:'Prensa'});await page.locator('#mensaje').fill('Prueba local');}
 await fill();await page.locator('[data-send]').click();if(!await page.locator('#privacidad-error').isVisible())throw Error('Privacy validation');if(await page.evaluate(()=>calls.length))throw Error('POST before consent');
 await page.locator('#privacidad').check();await page.evaluate(()=>{window.reply=()=>new Promise(resolve=>{window.resolveReply=resolve})});await page.locator('[data-send]').click();if(!await page.locator('[data-send]').isDisabled()||await page.locator('#contact-form').getAttribute('aria-busy')!=='true')throw Error('Loading');
 await page.evaluate(()=>resolveReply({ok:false,json:async()=>({errors:[{message:'Rejected'}]})}));await page.waitForFunction(()=>document.querySelector('#contact-form').getAttribute('aria-busy')==='false');if(await page.locator('#mensaje').inputValue()!=='Prueba local')throw Error('Error erased data');
 await page.evaluate(()=>{window.reply=async()=>({ok:true,json:async()=>({})})});await page.locator('[data-send]').click();await page.waitForFunction(()=>document.querySelector('#contact-form').getAttribute('aria-busy')==='false');if((await page.locator('[data-status]').textContent()).includes('ha recibido'))throw Error('False success');
 await page.evaluate(()=>{window.reply=async()=>{throw Error('Network offline')}});await page.locator('[data-send]').click();await page.waitForFunction(()=>document.querySelector('#contact-form').getAttribute('aria-busy')==='false');
 await page.evaluate(()=>{window.reply=async()=>({ok:true,json:async()=>({ok:true})})});await page.locator('[data-send]').click();await page.waitForFunction(()=>document.querySelector('#contact-form').getAttribute('aria-busy')==='false');if(!(await page.locator('[data-status]').textContent()).includes('ha recibido'))throw Error('Acceptance state');
 const post=await page.evaluate(()=>calls);if(post.some(r=>r.method!=='POST'||!r.body.some(([k])=>k==='email')))throw Error('Payload');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('file:///'+path.join(root,'contacto.html').replaceAll('\\','/'));if(!await page.locator('[data-send]').isDisabled())throw Error('Production config changed');
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto('file:///'+path.join(root,'contacto.html').replaceAll('\\','/'));if(!await nojs.locator('#nombre').isDisabled()||!await nojs.locator('[data-send]').isDisabled())throw Error('NoJS safety');await nojs.close();
 function luminance(hex){const c=hex.match(/\w\w/g).map(h=>{const n=parseInt(h,16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
 const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
 const ratios={body:contrast('cfc6b8','0b0907'),gold:contrast('c9a45c','0b0907'),whiteOnBronze:contrast('ffffff','5a3e1b'),card:contrast('cfc6b8','241c17')};if(Object.values(ratios).some(x=>x<4.5))throw Error('Contrast');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(out,'resultados.json'),JSON.stringify({results,errors,externalRequests:requests,outsideScopeUnchanged:true,contrast:ratios,inMemoryPostTests:{activationGates:true,privacyRequired:true,loading:true,rejection:true,missingAcknowledgement:true,networkFailure:true,acceptance:true,realSubmissions:0},noJavaScriptSafe:true},null,2));
 console.log(JSON.stringify({cases:results.length,errors,externalRequests:requests.length,contrast:ratios,mockedPostTests:true,realSubmissions:0}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
