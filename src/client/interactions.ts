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
const menuPanel=menu?.querySelector<HTMLElement>('.mobile-panel');
const root=document.documentElement;
const scrollPosition=()=>Math.max(0,Math.min(window.scrollY,root.scrollHeight-root.clientHeight));
let scrollAnchor=scrollPosition();

const revealHeader=(scroll=scrollPosition())=>{
 header?.removeAttribute('data-hidden');
 scrollAnchor=scroll;
};

if(header){
 let headerHeight=0;
 const updateOffset=()=>{
  headerHeight=header.offsetHeight;
  root.style.setProperty('--site-header-height',`${headerHeight}px`);
 };
 updateOffset();
 new ResizeObserver(updateOffset).observe(header);

 let ticking=false;
 const updateHeader=()=>{
  ticking=false;
  if(menu?.open)return;
  const scroll=scrollPosition();
  if(scroll<=headerHeight){revealHeader(scroll);return;}
  if(header.hasAttribute('data-hidden')){
   scrollAnchor=Math.max(scrollAnchor,scroll);
   if(scrollAnchor-scroll>=12)revealHeader(scroll);
  }else{
   scrollAnchor=Math.max(headerHeight,Math.min(scrollAnchor,scroll));
   if(scroll-scrollAnchor>=24&&!header.querySelector(':focus-visible')){
    header.setAttribute('data-hidden','');
    scrollAnchor=scroll;
   }
  }
 };
 addEventListener('scroll',()=>{
  if(!ticking){ticking=true;requestAnimationFrame(updateHeader);}
 },{passive:true});
 addEventListener('hashchange',()=>revealHeader());
 addEventListener('pageshow',event=>{if(event.persisted)revealHeader();});
 header.addEventListener('focusin',()=>{
  if(header.querySelector(':focus-visible'))revealHeader();
 });
}

if(menuButton&&menu&&menuPanel){
 const mobile=matchMedia('(max-width:900px)');
 const controls=Array.from(menu.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
 let scrollTop=0;
 let closing:Animation|undefined;
 let pressedOutside=false;

 const unlock=()=>{
  closing=undefined;
  menu.removeAttribute('data-visible');
  pressedOutside=false;
  root.classList.remove('mobile-menu-open');
  root.style.removeProperty('--menu-scroll-top');
  root.style.removeProperty('--menu-scrollbar-width');
  window.scrollTo({top:scrollTop,behavior:'instant'});
  revealHeader();
  menuButton.setAttribute('aria-expanded','false');
 };

 const closeMenu=(instant=false,restoreFocus=true)=>{
  if(!menu.open||(closing&&!instant))return;
  const finish=()=>{
   menu.close();
   unlock();
   if(restoreFocus&&mobile.matches)menuButton.focus({preventScroll:true});
  };
  if(instant||reducedMotion.matches||document.body.dataset.input==='keyboard'){finish();return;}
  menu.removeAttribute('data-visible');
  const slide=menuPanel.getAnimations().find(animation=>
   animation instanceof CSSTransition&&animation.transitionProperty==='transform',
  );
  if(!slide){finish();return;}
  closing=slide;
  const finishClosing=()=>{if(closing===slide)finish();};
  void slide.finished.then(finishClosing,finishClosing);
 };

 menuButton.addEventListener('click',()=>{
  if(menu.open||!mobile.matches)return;
  revealHeader();
  scrollTop=scrollPosition();
  root.style.setProperty('--menu-scrollbar-width',`${window.innerWidth-root.clientWidth}px`);
  root.style.setProperty('--menu-scroll-top',`${scrollTop}px`);
  root.classList.add('mobile-menu-open');
  const animate=!reducedMotion.matches&&document.body.dataset.input!=='keyboard';
  menu.toggleAttribute('data-instant',!animate);
  menu.showModal();
  menuButton.setAttribute('aria-expanded','true');
  if(animate){
   // Resolve the off-screen position while the dialog is already in the top layer.
   getComputedStyle(menuPanel).transform;
  }
  menu.setAttribute('data-visible','');
 });
 menu.addEventListener('close',()=>{
  if(!menu.open&&root.classList.contains('mobile-menu-open'))unlock();
 });
 menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu(true);});
 menu.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||event.altKey||event.ctrlKey||event.metaKey)return;
  const current=controls.findIndex(control=>control===document.activeElement);
  const next=event.shiftKey?(current>0?current-1:controls.length-1):(current+1)%controls.length;
  event.preventDefault();
  controls[next]?.focus();
 });
 menu.addEventListener('pointerdown',event=>{pressedOutside=event.target===menu;});
 menu.addEventListener('pointerup',event=>{
  pressedOutside=pressedOutside&&document.elementFromPoint(event.clientX,event.clientY)===menu;
 });
 menu.addEventListener('pointercancel',()=>{pressedOutside=false;});
 menu.addEventListener('click',event=>{
  const outside=pressedOutside&&event.target===menu;
  pressedOutside=false;
  const target=event.target instanceof Element?event.target:null;
  if(outside||target?.closest('[data-close-mobile-menu]'))closeMenu();
  else if(target?.closest('a[href]'))closeMenu(true);
 });
 mobile.addEventListener('change',()=>closeMenu(true,false));
 addEventListener('pagehide',()=>closeMenu(true,false));
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

// A entrada do título acompanha a chegada à seção de visita durante a rolagem.
const visitTitle=document.querySelector('#visit-title');
if(visitTitle&&'IntersectionObserver' in window&&!reducedMotion.matches&&!location.hash&&visitTitle.getBoundingClientRect().top>innerHeight){
 const observer=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  if(!location.hash&&document.body.dataset.input!=='keyboard'&&!reducedMotion.matches){
   visitTitle.setAttribute('data-visit-enter','');
  }
  observer.disconnect();
 });
 observer.observe(visitTitle);
}
const menuItems=document.querySelector('#menu-items');
const menuFilters=document.querySelector<HTMLElement>('[data-menu-filters]');
if(menuItems&&menuFilters){
 const filters=menuFilters.querySelectorAll<HTMLButtonElement>('[data-menu-filter]');
 const groups=Array.from(menuItems.querySelectorAll<HTMLDetailsElement>('[data-menu-group]'),element=>({
  element,
  count:element.querySelector('[data-menu-count]'),
  rows:Array.from(element.querySelectorAll<HTMLElement>('.row')),
 }));
 const status=document.querySelector('#menu-filter-status');
 let activeFilter='all';
 let expanded=new Set<HTMLDetailsElement>();

 menuFilters.hidden=false;
 for(const button of filters){
  button.addEventListener('click',()=>{
   const filter=button.dataset.menuFilter;
   if(!filter||filter===activeFilter)return;
   if(activeFilter==='all')expanded=new Set(groups.map(group=>group.element).filter(group=>group.open));

   let count=0;
   for(const {element,count:label,rows} of groups){
    let visible=0;
    for(const row of rows){
     row.hidden=filter==='vegan' ? !row.querySelector('[data-vegan]')
      : filter==='share' && element.dataset.menuGroup!=='share';
     if(!row.hidden)visible++;
    }
    element.hidden=visible===0;
    element.open=filter==='all'?expanded.has(element):visible>0;
    if(label)label.textContent=visible===1?'1 item':`${visible} itens`;
    count+=visible;
   }
   for(const control of filters){
    control.classList.toggle('on',control===button);
    control.setAttribute('aria-pressed',String(control===button));
   }
   activeFilter=filter;
   if(status)status.textContent=count===1?'1 item encontrado.':`${count} itens encontrados.`;
  });
 }
}
if(document.querySelector('[data-home]'))void import('./home').then(module=>module.initHome());
if(document.querySelector('[data-almoco],[data-sugestao]'))void import('./almoco').then(module=>module.initAlmoco());
if(document.querySelector('[data-agenda]'))import('./agenda').then(module=>module.initAgenda());
