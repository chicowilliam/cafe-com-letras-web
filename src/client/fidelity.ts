import {businessDay,shiftDate,validDate,renderMenu,renderCalendar,renderDays,renderMobileMenu,renderMobileEvents} from '../lib/presentation';
import {unitPath} from '../lib/routes';
import type {UnitName,CalendarChunk,PublicData} from '../lib/types';
import monthIndex from '../data/calendar-months.json';

const body=document.body;
const unit:UnitName=body.dataset.unit==='Liberdade'?'Liberdade':'Savassi';
const unitId=Number(body.dataset.unitId);const kind=body.dataset.kind||'';
const production=body.dataset.production==='true'&&location.hostname==='cafecomletras.com.br';
const mobile=kind==='mobile';const slug=unit.toLowerCase();
const today=businessDay();const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.cookie=`unity=${unit};Path=/;Max-Age=604800;SameSite=Lax${location.protocol==='https:'?';Secure':''}`;
const $=<T extends Element=HTMLElement>(selector:string,scope:ParentNode=document)=>scope.querySelector<T>(selector);
const $$=<T extends Element=HTMLElement>(selector:string,scope:ParentNode=document)=>Array.from(scope.querySelectorAll<T>(selector));
function scrollToNode(node:Element|null,offset=0){if(node)window.scrollTo({top:node.getBoundingClientRect().top+window.scrollY-offset,behavior:reduce?'instant':'smooth'});}
for(const anchor of $$<HTMLAnchorElement>('a[href]')){
 if(!production&&new URL(anchor.href,location.href).origin!==location.origin){anchor.setAttribute('aria-disabled','true');anchor.title='Link externo desativado nesta prévia.';}
}
for(const anchor of $$<HTMLAnchorElement>('.reservations,.restorando')){
 if(production&&unit==='Savassi'&&anchor.href==='https://usetag.me/cafecomletras')continue;
 anchor.setAttribute('aria-disabled','true');anchor.title='Reservas indisponíveis neste canal. Consulte os contatos da unidade.';
}

// Preserve the original destinations; only previews suppress outbound navigation and form submission.
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;const anchor=target?.closest<HTMLAnchorElement>('a');
 if(anchor){
  const url=new URL(anchor.href,location.href);
  if(!production&&url.origin!==location.origin){event.preventDefault();return;}
  if(anchor.target==='_blank')anchor.rel='noopener noreferrer';
 }
 const heading=target?.closest('h1');if(heading){location.href=unitPath(unit,mobile);return;}
 const reservation=target?.closest<HTMLAnchorElement>('.reservations,.restorando');
 if(reservation&&!(production&&unit==='Savassi'&&reservation.href==='https://usetag.me/cafecomletras')){event.preventDefault();alert('Reservas indisponíveis neste canal. Consulte os contatos da unidade.');}
});
document.addEventListener('submit',event=>{
 const form=event.target as HTMLFormElement;
 const existingNewsletter=production&&form.closest('.newsletter')&&form.action.startsWith('https://25.idmkt8.com/');
 if(!existingNewsletter){event.preventDefault();alert('Envio indisponível neste canal. Consulte os contatos da unidade.');}
});

const sectionTargets:Record<string,string>={'nav-restaurant':'part1','nav-calendar':'part2','nav-news':'part3','nav-about':'part4','nav-contact':'part5'};
for(const [name,id] of Object.entries(sectionTargets))for(const link of $$<HTMLAnchorElement>('a.'+name)){
 link.href='#'+id;link.addEventListener('click',event=>{event.preventDefault();scrollToNode(document.getElementById(id));});
}
function fixedNavigation(){if(!['desktop','digital'].includes(kind))return;const fixed=window.scrollY>729;const nav=$('nav');nav?.classList.toggle('fixed',fixed);body.style.paddingTop=fixed?'64px':'0px';for(const arrow of $$('#slider-previous-3,#slider-next-3'))arrow.style.display=fixed?'block':'none';}
window.addEventListener('scroll',fixedNavigation,{passive:true});fixedNavigation();

function desktopSlider(selector:string,number:number,autoplay=false){
 const box=$(selector),list=box?.querySelector<HTMLUListElement>('ul');if(!box||!list)return;
 const items=Array.from(list.children).filter((x):x is HTMLLIElement=>x instanceof HTMLLIElement);
 const controls=$$<HTMLAnchorElement>(`#slider-controls-${number} a`);
 const actual=items.filter(li=>!li.style.marginLeft.startsWith('-'));
 const count=controls.length||actual.length;if(!count)return;
 const width=box.clientWidth;let index=0;
 const show=(value:number)=>{index=(value+count)%count;list.style.transition=reduce?'none':'margin-left 250ms';list.style.marginLeft=`-${index*width}px`;controls.forEach((a,i)=>a.parentElement?.classList.toggle('current',i===index));};
 controls.forEach((a,i)=>a.addEventListener('click',event=>{event.preventDefault();show(i);}));
 for(const [suffix,offset] of [['previous',-1],['next',1]] as const)$(`#slider-${suffix}-${number} a`)?.addEventListener('click',event=>{event.preventDefault();show(index+offset);});
 // Initial snapshots start at the first original item; duplicate loop items remain outside the clipping box.
 show(0);
 if(autoplay&&!reduce&&count>1)window.setInterval(()=>{if(!document.hidden)show(index+1);},7000);
}
if(['desktop','digital'].includes(kind)){desktopSlider('.highlight',1,true);desktopSlider('.news',2);}

const chunks=new Map<string,Promise<CalendarChunk>>();
async function monthData(month:string):Promise<CalendarChunk>{
 if(!/^\d{6}$/.test(month)||!validDate(month+'01'))throw new Error('Mês inválido.');
 if(!(monthIndex as Record<string,string[]>)[slug]?.includes(month))return {events:[],artists:[]};
 if(!chunks.has(month))chunks.set(month,fetch(`/data/calendar/${slug}/${month}.json`,{credentials:'same-origin'}).then(async response=>{
  if(response.status===404)return {events:[],artists:[]};if(!response.ok)throw new Error('Não foi possível carregar a agenda.');return response.json() as Promise<CalendarChunk>;
 }));return chunks.get(month)!;
}
async function calendarData(month:string,date:string){
 const months=[...new Set([month,date.slice(0,6),shiftDate(date,7).slice(0,6)])];const data=await Promise.all(months.map(monthData));
 return {events:[...new Map(data.flatMap(d=>d.events).map(e=>[e.calendar_id,e])).values()].sort((a,b)=>a.calendar_date.localeCompare(b.calendar_date)||a.calendar_time.localeCompare(b.calendar_time)||a.calendar_artist-b.calendar_artist),artists:[...new Map(data.flatMap(d=>d.artists).map(a=>[a.artist_id,a])).values()]};
}
let calendarRequest=0;
async function refreshCalendar(month:string,date:string,scroll=false){
 const calendar=$('.calendar');if(!calendar||mobile)return;
 const request=++calendarRequest;calendar.setAttribute('aria-busy','true');
 try{const data=await calendarData(month,date);if(request!==calendarRequest)return;calendar.innerHTML=renderCalendar(data,unitId,month,date,today);if(scroll)scrollToNode($('.venues',calendar),80);}
 catch{calendar.setAttribute('data-load-error','true');}
 finally{if(request===calendarRequest)calendar.removeAttribute('aria-busy');}
}
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;
 const move=target?.closest<HTMLAnchorElement>('.calendar .moveMonths');
 if(move){event.preventDefault();const value=move.getAttribute('calendar')||'';const month=value.slice(4,8)+value.slice(2,4);if(validDate(month+'01'))void refreshCalendar(month,today);}
 const day=target?.closest<HTMLAnchorElement>('.calendar .calendarDay');
 if(day){event.preventDefault();const value=day.getAttribute('date')||'';const cal=day.getAttribute('calendar')||'';if(validDate(value))void refreshCalendar(cal.slice(4,8)+cal.slice(2,4),value,true);}
});
let menuData:Promise<Pick<PublicData,'suggestions'|'plates'|'suggestionRelations'>>|undefined;
async function refreshMenu(date:string){
 if(!validDate(date))return;const box=$('.menu .menu-card');if(!box)return;
 $$('.menu-navigation .day').forEach(day=>day.classList.toggle('active',day.getAttribute('date')===date));box.setAttribute('aria-busy','true');
 menuData??=fetch('/data/menu.json').then(r=>{if(!r.ok)throw new Error('Cardápio indisponível.');return r.json();});
 try{box.innerHTML=renderMenu(await menuData,unitId,date);}catch{box.setAttribute('data-load-error','true');}finally{box.removeAttribute('aria-busy');}
}
const days=$('.menu-navigation ul');
if(days){
 if(body.dataset.contentDay!==today)days.innerHTML=renderDays(today);
 let week=10;const width=$('.menu-navigation')?.clientWidth||760;
 function show(){days!.style.transition=reduce?'none':'margin-left 500ms';days!.style.marginLeft=`-${week*width}px`;}
 $('#slider-previous-3 a')?.addEventListener('click',event=>{event.preventDefault();week=Math.max(0,week-1);show();});
 $('#slider-next-3 a')?.addEventListener('click',event=>{event.preventDefault();week=Math.min(20,week+1);show();});show();
 days.addEventListener('click',event=>{const el=event.target instanceof Element?event.target.closest<HTMLElement>('.day'):null;if(el)void refreshMenu(el.getAttribute('date')||'');});
}

function setupMobileSlider(container:HTMLElement){
 const wrapper=$<HTMLElement>('.swiper-wrapper',container);if(!wrapper)return;
 const slides=Array.from(wrapper.children).filter((x):x is HTMLElement=>x instanceof HTMLElement&&x.classList.contains('swiper-slide'));
 for(const slide of slides)for(const side of ['left','right'])if(!slide.querySelector('.swiper-slide-shadow-'+side)){const shadow=document.createElement('div');shadow.className='swiper-slide-shadow-'+side;slide.append(shadow);}
 let index=0,startX=0,drag=0;let dragging=false;
 function paint(offset=0,animate=true){
  const width=container.clientWidth;wrapper!.style.display='flex';wrapper!.style.width='100%';wrapper!.style.transitionDuration=animate&&!reduce?'300ms':'0ms';wrapper!.style.transform=`translate3d(${-index*width+offset}px,0,0)`;
  slides.forEach((slide,i)=>{const delta=i-index-offset/width;slide.style.width=width+'px';slide.style.flexShrink='0';slide.style.transform=`translate3d(0,0,${-Math.abs(delta)*100}px) rotateY(${delta*-50}deg)`;slide.style.zIndex=String(1-Math.round(Math.abs(delta)));slide.classList.toggle('swiper-slide-active',i===index);slide.classList.toggle('swiper-slide-next',i===index+1);slide.classList.toggle('swiper-slide-prev',i===index-1);const left=$<HTMLElement>('.swiper-slide-shadow-left',slide),right=$<HTMLElement>('.swiper-slide-shadow-right',slide);if(left)left.style.opacity=String(Math.max(0,-delta));if(right)right.style.opacity=String(Math.max(0,delta));});
  for(const [selector,disabled] of [['.swiper-button-prev',index===0],['.swiper-button-next',index>=slides.length-1]] as const){const button=$(selector,container);button?.classList.remove('swiper-button-disabled');button?.setAttribute('aria-disabled',String(disabled));}
 }
 function go(value:number){index=Math.max(0,Math.min(slides.length-1,value));paint();}
 $('.swiper-button-next',container)?.addEventListener('click',()=>go(index+1));$('.swiper-button-prev',container)?.addEventListener('click',()=>go(index-1));
 container.style.touchAction='pan-y';container.addEventListener('pointerdown',event=>{startX=event.clientX;drag=0;dragging=true;});
 container.addEventListener('pointermove',event=>{if(!dragging)return;drag=event.clientX-startX;if(Math.abs(drag)>12)paint(drag,false);});
 for(const name of ['pointerup','pointercancel','pointerleave'] as const)container.addEventListener(name,()=>{if(!dragging)return;dragging=false;if(Math.abs(drag)>45)go(index+(drag<0?1:-1));else paint();});
 container.addEventListener('click',event=>{if(Math.abs(drag)>12)event.preventDefault();},true);
 window.addEventListener('resize',()=>paint(0,false));paint(0,false);
}
async function initializeMobile(){
 if(body.dataset.contentDay!==today){
  try{
   const [menu,calendar]=await Promise.all([fetch('/data/menu.json').then(r=>r.json() as Promise<Pick<PublicData,'suggestions'|'plates'|'suggestionRelations'>>),Promise.all(((monthIndex as Record<string,string[]>)[slug]||[]).filter(m=>m>=today.slice(0,6)).map(monthData))]);
   const menuWrapper=$('#container-menu .swiper-wrapper'),eventsWrapper=$('#container-calendar .swiper-wrapper');
   if(menuWrapper)menuWrapper.innerHTML=renderMobileMenu(menu,unitId,today);
   if(eventsWrapper)eventsWrapper.innerHTML=renderMobileEvents({events:calendar.flatMap(c=>c.events),artists:[...new Map(calendar.flatMap(c=>c.artists).map(a=>[a.artist_id,a])).values()]},unitId,today);
  }catch{body.setAttribute('data-stale-content','true');}
 }
 for(const element of $$('.swiper-container'))setupMobileSlider(element);
}
if(mobile)void initializeMobile();

function setupGallery(){
 const gallery=$('.photos');if(!gallery)return;const ids=JSON.parse(body.dataset.gallery||'[]') as number[];if(!ids.length)return;
 let index=0;const visible=$$<HTMLElement>('.galleria-images > .galleria-image',gallery).find(box=>Number(box.style.opacity)>0);const current=visible?.querySelector('img')||$<HTMLImageElement>('.galleria-images .galleria-image img',gallery);const found=ids.findIndex(id=>current?.getAttribute('src')?.includes('/'+id+'.'));if(found>=0)index=found;
 const show=(value:number)=>{
  index=(value+ids.length)%ids.length;const src='/img/photos/'+ids[index]+'.jpg';
  const imageBoxes=$$<HTMLElement>('.galleria-images > .galleria-image',gallery);
  imageBoxes.forEach((box,i)=>{box.style.opacity=i===imageBoxes.length-1?'1':'0';box.style.width='100%';box.style.height='100%';box.style.zIndex=i===imageBoxes.length-1?'1':'0';let img=box.querySelector('img');if(!img){img=document.createElement('img');box.append(img);}img.src=src;img.alt='Galeria do Café com Letras '+unit;Object.assign(img.style,{width:'100%',height:'100%',objectFit:'contain',top:'0px',left:'0px',display:'block',opacity:'1'});});
  $$('.galleria-thumbnails .galleria-image',gallery).forEach((thumb,i)=>thumb.classList.toggle('active',i===index));const counter=$('.galleria-current',gallery);if(counter)counter.textContent=String(index+1);
 };
 $('.galleria-image-nav-left',gallery)?.addEventListener('click',()=>show(index-1));$('.galleria-image-nav-right',gallery)?.addEventListener('click',()=>show(index+1));
 $$('.galleria-thumbnails .galleria-image',gallery).forEach((thumb,i)=>thumb.addEventListener('click',()=>show(i)));
 gallery.tabIndex=0;gallery.setAttribute('aria-label','Galeria do Café com Letras '+unit);
 document.addEventListener('keydown',event=>{const r=gallery.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
}
setupGallery();
const query=new URLSearchParams(location.search);const date=query.get('date'),cal=query.get('calendar');
if(date&&validDate(date)){void refreshMenu(date);void refreshCalendar(cal&&/^\d{8}$/.test(cal)?cal.slice(4,8)+cal.slice(2,4):date.slice(0,6),date);}
else if(!mobile&&body.dataset.contentDay!==today)void refreshCalendar(today.slice(0,6),today);
