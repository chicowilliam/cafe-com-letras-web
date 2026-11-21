"""Playwright real, Chromium e WebKit; sem dependências adicionais no site."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys

base=sys.argv[1]
out=Path('output/playwright/mobile-fix');out.mkdir(parents=True,exist_ok=True)
names=['index','gastronomia','programacao','evento','livraria','casa','celular']
report={'base':base,'pages':[],'interactions':[],'errors':[],'resources':[],'passed':False}
audit=r'''() => {
 const viewport=document.documentElement.clientWidth;
 const visible=e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden';};
 const outside=[...document.body.querySelectorAll('*')].filter(e=>{if(!visible(e)||e.closest('.sr-only'))return false;const r=e.getBoundingClientRect();if(r.left < -1000)return false;return r.right>viewport+1||r.left < -1;}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,60),right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left})).slice(0,12);
 const canvas=document.querySelector('.mobile-canvas');const canvasRect=canvas?.getBoundingClientRect();
 const price=[...document.querySelectorAll('.home-mobile .mono,body[data-page="celular"] .mono')].find(e=>/^R\$\s*70$/.test(e.textContent.trim())&&visible(e));
 const priceRect=price?.getBoundingClientRect();
 let priceLines=null;if(price){const range=document.createRange();range.selectNodeContents(price);priceLines=range.getClientRects().length;}
 const nav=[...document.querySelectorAll('[aria-label="Ações rápidas"]')].find(visible);const navRect=nav?.getBoundingClientRect();
 return {viewport,inner:innerWidth,document:document.documentElement.scrollWidth,body:document.body.getBoundingClientRect().width,visualViewport:visualViewport?.width,canvas:canvasRect&&canvasRect.width?canvasRect.width:null,outside,brokenImages:[...document.images].filter(i=>visible(i)&&(!i.complete||!i.naturalWidth)).map(i=>i.src),price:priceRect?{text:price.textContent.trim(),height:priceRect.height,font:parseFloat(getComputedStyle(price).fontSize),nowrap:getComputedStyle(price).whiteSpace,lines:priceLines}:null,bar:navRect?{left:navRect.left,right:navRect.right,bottom:navRect.bottom,position:getComputedStyle(nav).position}:null,viewportMeta:document.querySelector('meta[name=viewport]')?.content,robots:document.querySelector('meta[name=robots]')?.content};
}'''

with sync_playwright() as pw:
 for engine in ['chromium','webkit']:
  browser=pw.chromium.launch(channel='chrome',headless=True) if engine=='chromium' else pw.webkit.launch(headless=True)
  report[engine+'Version']=browser.version
  context=browser.new_context(viewport={'width':320,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',device_scale_factor=1)
  page=context.new_page();page.set_default_navigation_timeout(60000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('response',lambda r:report['resources'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
  for width in [320,375,390,414,768,1440]:
   if width==1440:
    context.close();context=browser.new_context(viewport={'width':1440,'height':844},reduced_motion='reduce',device_scale_factor=1);page=context.new_page();page.set_default_navigation_timeout(60000)
    page.on('pageerror',lambda e:report['errors'].append(str(e)))
    page.on('response',lambda r:report['resources'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
   else:page.set_viewport_size({'width':width,'height':844})
   for name in names:
    r=page.goto(base+('/' if name=='index' else '/'+name+'/'));page.evaluate('Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,8000))])');page.mouse.move(0,0);page.wait_for_timeout(120)
    item=page.evaluate(audit);item.update({'engine':engine,'name':name,'width':width,'status':r.status});report['pages'].append(item)
    if (engine=='chromium' and width in [320,390,414,1440]) or (engine=='webkit' and width==390):
     page.screenshot(path=str(out/f'after-{engine}-{name}-{width}.png'),full_page=(engine=='chromium' and width==1440) or name=='index',timeout=15000)
    (out/'checkpoint.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(engine,width,name,flush=True)
    if name in ['index','celular'] and width<601:
     page.get_by_role('button',name='Abrir menu',exact=True).click();opened=page.locator('#mobile-navigation').is_visible();page.keyboard.press('Escape');closed=page.get_by_role('button',name='Abrir menu',exact=True).get_attribute('aria-expanded')=='false'
     page.evaluate('scrollTo(0,document.documentElement.scrollHeight)');page.wait_for_timeout(60);bottom=page.evaluate(audit)['bar']
     page.evaluate("document.body.style.setProperty('--mobile-safe-bottom','34px')")
     inset=page.locator('[aria-label="Ações rápidas"]').evaluate('e=>parseFloat(getComputedStyle(e).paddingBottom)')
     links=page.locator('[aria-label="Ações rápidas"] a').evaluate_all('els=>els.map(e=>({href:e.getAttribute("href"),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))')
     report['interactions'].append({'engine':engine,'name':name,'width':width,'menuOpen':opened,'menuClose':closed,'bottom':bottom,'safePadding34':inset,'links':links})
   print(engine,width,'validated',flush=True)
  context.close()
  browser.close()
report['passed']=not report['errors'] and not report['resources'] and all(p['status']==200 and p['viewport']==p['width'] and p['document']==p['width'] and abs(p['body']-p['width'])<1 and not p['outside'] and not p['brokenImages'] and (p['canvas'] is None or p['width']>600 or abs(p['canvas']-p['width'])<1) and (p['price'] is None or p['width']>600 or (p['price']['nowrap']=='nowrap' and p['price']['lines']==1)) for p in report['pages']) and all(i['menuOpen'] and i['menuClose'] and i['safePadding34']==46 and i['bottom']['left']==0 and abs(i['bottom']['right']-i['width'])<1 and abs(i['bottom']['bottom']-844)<1 for i in report['interactions'])
(out/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
failures=[p for p in report['pages'] if p['document']!=p['width'] or p['outside'] or (p['canvas'] and p['width']<601 and p['canvas']!=p['width'])]
print(json.dumps({'passed':report['passed'],'pages':len(report['pages']),'interactions':len(report['interactions']),'failures':failures,'errors':report['errors'],'resources':report['resources']},ensure_ascii=True))
sys.exit(0 if report['passed'] else 1)
