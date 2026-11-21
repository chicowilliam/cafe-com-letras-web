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

// Navegação de divulgação não é um menu ARIA de aplicação: Tab segue a ordem nativa.
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-mobile-menu]')){
 const sibling=button.closest('header')?.nextElementSibling;
 if(!(sibling instanceof HTMLElement))continue;
 const nav:HTMLElement=sibling;
 let animation:Animation|undefined;
 let open=false;
 function setOpen(next:boolean,instant=false,restoreFocus=false){
  animation?.cancel();
  open=next;
  button.setAttribute('aria-expanded',String(next));
  button.setAttribute('aria-label',next?'Fechar menu':'Abrir menu');
  button.querySelector('path')?.setAttribute('d',next?'M4 4l12 12M4 16L16 4':'M3 6h14M3 14h14');
  nav.inert=!next;
  if(restoreFocus)button.focus({preventScroll:true});
  if(next)nav!.hidden=false;
  if(instant||reducedMotion.matches){nav!.hidden=!next;return;}
  animation=nav!.animate(next?
   [{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}]:
   [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],
   {duration:next?220:140,easing:'cubic-bezier(.22,1,.36,1)'});
  animation.finished.then(()=>{if(!open)nav!.hidden=true;}).catch(()=>{/* Retoggles cancel the previous animation. */});
 }
 button.addEventListener('click',event=>setOpen(!open,event.detail===0));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&open){event.preventDefault();setOpen(false,true,true);}});
 document.addEventListener('pointerdown',event=>{
  if(open&&event.target instanceof Node&&!nav.contains(event.target)&&!button.contains(event.target))setOpen(false);
 },{passive:true});
 nav.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('a'))setOpen(false,true);});
 nav.addEventListener('focusout',()=>queueMicrotask(()=>{
  if(open&&!nav.contains(document.activeElement)&&document.activeElement!==button)setOpen(false,true);
 }));
 matchMedia('(max-width:900px)').addEventListener('change',()=>setOpen(false,true));
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)setOpen(open,true);});
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
 if(target?.closest('[data-skip-content]')){
  const content=[...document.querySelectorAll<HTMLElement>('main, .home-mobile section, body[data-page="celular"] section')].find(element=>element.getClientRects().length>0);
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
if(document.querySelector('[data-agenda]'))import('./agenda').then(module=>module.initAgenda());
