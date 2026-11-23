const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const legacySections:Record<string,string>={'#part1':'/gastronomia/#cardapio','#part2':'/programacao/#agenda','#part3':'/casa/#visite','#part4':'/livraria/','#part5':'/casa/#visite'};
function routeLegacySection(){const target=legacySections[location.hash];if(location.pathname==='/'&&target)location.replace(target);}
routeLegacySection();
for(const nav of document.querySelectorAll('nav')){
 const first=nav.querySelector('[data-section-link]');
 if(first&&!nav.querySelector('[data-section-link][aria-current]'))first.setAttribute('aria-current','location');
}
addEventListener('hashchange',routeLegacySection);
document.addEventListener('keydown',event=>{if(!['Shift','Control','Alt','Meta'].includes(event.key))document.body.dataset.input='keyboard';});
document.addEventListener('pointerdown',()=>{delete document.body.dataset.input;},{passive:true});

const header=document.querySelector<HTMLElement>('[data-site-header]');
const menuButton=document.querySelector<HTMLButtonElement>('[data-mobile-menu]');
const menu=document.querySelector<HTMLDialogElement>('#page-navigation');
const root=document.documentElement;
const scrollPosition=()=>Math.max(0,Math.min(window.scrollY,root.scrollHeight-root.clientHeight));
let lastScroll=scrollPosition();
let direction=0;
let distance=0;

const revealHeader=()=>{
 header?.removeAttribute('data-hidden');
 lastScroll=scrollPosition();
 distance=0;
};

if(header){
 const updateOffset=()=>root.style.setProperty('--site-header-height',`${header.offsetHeight}px`);
 updateOffset();
 new ResizeObserver(updateOffset).observe(header);

 let ticking=false;
 const updateHeader=()=>{
  ticking=false;
  if(menu?.open)return;
  const scroll=scrollPosition();
  const delta=scroll-lastScroll;
  if(scroll<=header.offsetHeight){revealHeader();return;}
  if(!delta)return;
  lastScroll=scroll;
  if(Math.sign(delta)!==direction){direction=Math.sign(delta);distance=0;}
  distance+=Math.abs(delta);
  if(distance>=(direction>0?16:10))header.toggleAttribute('data-hidden',direction>0);
 };
 addEventListener('scroll',()=>{
  if(!ticking){ticking=true;requestAnimationFrame(updateHeader);}
 },{passive:true});
 addEventListener('hashchange',revealHeader);
 addEventListener('pageshow',event=>{if(event.persisted)revealHeader();});
 header.addEventListener('focusin',()=>{
  if(header.querySelector(':focus-visible'))revealHeader();
 });
}

if(menuButton&&menu){
 let scrollTop=0;
 let animation:Animation|undefined;
 let closing=false;
 const closeMenu=(instant=false,restoreFocus=true)=>{
  if(!menu.open||(closing&&!instant))return;
  closing=true;
  const finish=()=>{
   menu.close();
   animation?.cancel();
   animation=undefined;
   closing=false;
   root.classList.remove('mobile-menu-open');
   document.body.style.removeProperty('--menu-scroll-top');
   document.body.style.removeProperty('--menu-locked-width');
   window.scrollTo({top:scrollTop,behavior:'instant'});
   revealHeader();
   menuButton.setAttribute('aria-expanded','false');
   if(restoreFocus&&menuButton.getClientRects().length)menuButton.focus({preventScroll:true});
  };
  if(instant||reducedMotion.matches){finish();return;}
  const opacity=getComputedStyle(menu).opacity;
  animation?.cancel();
  animation=menu.animate([{opacity},{opacity:0}],{duration:150,easing:'ease-in',fill:'forwards'});
  void animation.finished.then(finish,()=>{});
 };
 menuButton.addEventListener('click',()=>{
  if(menu.open)return;
  revealHeader();
  scrollTop=window.scrollY;
  document.body.style.setProperty('--menu-locked-width',`${root.clientWidth}px`);
  document.body.style.setProperty('--menu-scroll-top',`${scrollTop}px`);
  root.classList.add('mobile-menu-open');
  menu.showModal();
  menuButton.setAttribute('aria-expanded','true');
  if(!reducedMotion.matches)animation=menu.animate([{opacity:0},{opacity:1}],{duration:180,easing:'ease-out'});
 });
 menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
 menu.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||event.altKey||event.ctrlKey||event.metaKey)return;
  const controls=Array.from(menu.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
  const current=controls.findIndex(control=>control===document.activeElement);
  const next=event.shiftKey?(current>0?current-1:controls.length-1):(current+1)%controls.length;
  event.preventDefault();
  controls[next]?.focus();
 });
 menu.addEventListener('click',event=>{
  if(event.target===menu||(event.target instanceof Element&&event.target.closest('[data-close-mobile-menu]')))closeMenu();
  else if(event.target instanceof Element&&event.target.closest('a[href]'))closeMenu(true);
 });
 matchMedia('(max-width:900px)').addEventListener('change',()=>closeMenu(true,false));
}

// Um feedback local e não modal substitui alerts bloqueantes para recursos indisponíveis.
let feedback:HTMLDivElement|undefined;
function showFeedback(trigger:HTMLElement,message:string){
 if(!feedback){
  feedback=document.createElement('div');
  feedback.dataset.interactionFeedback='';
  feedback.setAttribute('role','status');
  feedback.setAttribute('aria-live','polite');
  feedback.setAttribute('popover','auto');
  feedback.hidden=true;
  document.body.append(feedback);
 }
 feedback.textContent=message;
 feedback.hidden=false;
 const rect=trigger.getBoundingClientRect();
 feedback.style.left=Math.max(16,Math.min(rect.left,innerWidth-392))+'px';
 feedback.style.top=Math.max(16,Math.min(rect.bottom+8,innerHeight-160))+'px';
 if('showPopover' in feedback){if(!feedback.matches(':popover-open'))feedback.showPopover();}
 else{
  const close=(event:Event)=>{if(event.target instanceof Node&&!feedback?.contains(event.target)){feedback!.hidden=true;document.removeEventListener('pointerdown',close);}};
  document.addEventListener('pointerdown',close,{passive:true});
 }
}
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;
 const skip=target?.closest<HTMLAnchorElement>('[data-skip-content]');
 if(skip){
  const content=document.getElementById(skip.hash.slice(1));
  if(content){event.preventDefault();content.tabIndex=-1;content.focus({preventScroll:true});content.scrollIntoView({block:'start',behavior:'instant'});}
 }
 const sectionLink=target?.closest<HTMLElement>('[data-section-link]');
 if(sectionLink)for(const link of sectionLink.parentElement?.querySelectorAll('[data-section-link]')||[]){
  link.classList.toggle('on',link===sectionLink);
  if(link===sectionLink)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 }
 const intent=target?.closest<HTMLElement>('[data-agenda-intent]')?.dataset.agendaIntent;
 if(intent){try{sessionStorage.setItem('cafe-agenda-filter',intent);}catch{/* Navigation remains available. */}}
 const demo=target?.closest<HTMLElement>('[data-demo]');
 if(demo){event.preventDefault();const status=demo.closest('form')?.querySelector<HTMLElement>('.form-status');if(status){status.textContent='Inscrições por e-mail indisponíveis no momento. Nenhum dado é enviado.';}else showFeedback(demo,demo.dataset.demo||'Recurso indisponível nesta prévia.');}
});
document.querySelectorAll<HTMLFormElement>('form[data-demo-form]').forEach(form=>form.addEventListener('submit',event=>{
 if(form.method==='dialog')return;
 event.preventDefault();const status=form.querySelector<HTMLElement>('.form-status');if(status)status.textContent='Inscrições por e-mail indisponíveis no momento. Nenhum dado é enviado.';else showFeedback(form.querySelector<HTMLElement>('button')||form,'Formulário demonstrativo: nenhum dado é enviado.');
}));

// Apenas elementos abaixo da dobra: nunca adiar o hero ou o candidato a LCP.
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const pending=new Set<HTMLElement>();
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   const element=entry.target as HTMLElement;element.classList.remove('reveal-pending');pending.delete(element);observer.unobserve(element);
  }
 },{rootMargin:'0px 0px 24px 0px',threshold:0});
 for(const element of document.querySelectorAll<HTMLElement>('main > section, .home-desktop main > section, .home-mobile > div > section, body[data-page="celular"] > div > section')){
  const rect=element.getBoundingClientRect();
  if(rect.width&&rect.top>innerHeight+48){element.dataset.scrollReveal='';element.classList.add('reveal-pending');pending.add(element);observer.observe(element);}
 }
 const revealAll=()=>{for(const element of pending)element.classList.remove('reveal-pending');pending.clear();observer.disconnect();};
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)revealAll();});
 // Focus, fragments and print must never land on visually hidden content.
 document.addEventListener('focusin',event=>{if(event.target instanceof Element)event.target.closest('[data-scroll-reveal]')?.classList.remove('reveal-pending');});
 addEventListener('beforeprint',revealAll);
}
const menuItems=document.querySelector<HTMLElement>('#menu-items');
if(menuItems){
 const filters=document.querySelectorAll<HTMLButtonElement>('[data-menu-filter]');
 const status=document.querySelector('#menu-filter-status');
 for(const button of filters){
  button.addEventListener('click',()=>{
   const filter=button.dataset.menuFilter;
   let count=0;
   for(const group of menuItems.querySelectorAll<HTMLElement>('[data-menu-group]')){
    let visible=0;
    for(const row of group.querySelectorAll<HTMLElement>('.row')){
     row.hidden=filter==='vegan' ? !row.querySelector('[aria-label="vegano"]')
      : filter==='share' && group.dataset.menuGroup!=='share';
     if(!row.hidden)visible++;
    }
    group.hidden=visible===0;
    count+=visible;
   }
   for(const control of filters){
    control.classList.toggle('on',control===button);
    control.setAttribute('aria-pressed',String(control===button));
   }
   if(status)status.textContent=`${count} itens exibidos.`;
  });
 }
}
if(document.querySelector('[data-home]'))void import('./home').then(module=>module.initHome());
if(document.querySelector('[data-almoco],[data-sugestao]'))void import('./almoco').then(module=>module.initAlmoco());
if(document.querySelector('[data-agenda]'))import('./agenda').then(module=>module.initAgenda());
