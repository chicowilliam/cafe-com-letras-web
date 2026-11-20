type Category='all'|'music'|'jazz'|'bossa'|'dj'|'piano'|'books';
const categories=new Set<Category>(['all','music','jazz','bossa','dj','piano','books']);
export function initAgenda(){
 const agenda=document.querySelector<HTMLElement>('[data-agenda]');
 if(!agenda)return;
 const rows=Array.from(agenda.querySelectorAll<HTMLElement>('[data-event-row]'));
 const controls=Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-agenda-filter]'));
 const status=agenda.querySelector<HTMLElement>('[data-filter-status]');
 const empty=agenda.querySelector<HTMLElement>('[data-filter-empty]');
 let animation:Animation|undefined;
 function apply(category:Category,animate=false){
  let count=0;
  for(const row of rows){
   const kind=row.dataset.eventCategory;
   row.hidden=!(category==='all'||kind===category||(category==='music'&&kind!=='books'));
   if(!row.hidden)count++;
  }
  for(const month of agenda!.querySelectorAll<HTMLElement>('[data-agenda-month]'))month.hidden=!month.querySelector('[data-event-row]:not([hidden])');
  for(const control of controls){const active=control.dataset.agendaFilter===category;control.classList.toggle('on',active);control.setAttribute('aria-pressed',String(active));}
  if(status)status.textContent=`${count} ${count===1?'evento exibido':'eventos exibidos'}.`;
  if(empty)empty.hidden=count!==0;
  agenda!.dataset.activeFilter=category;
  animation?.cancel();
  if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=agenda!.animate([{opacity:.75},{opacity:1}],{duration:140,easing:'ease-out'});
 }
 for(const control of controls){
  const activate=(event:MouseEvent|KeyboardEvent)=>{
   const category=control.dataset.agendaFilter as Category;
   if(!categories.has(category))return;
   event.preventDefault();apply(category,event instanceof MouseEvent&&event.detail!==0);
  };
  control.addEventListener('click',activate);
  control.addEventListener('keydown',event=>{if(event.key===' '){activate(event);}});
 }
 let selected:Category='all';
 try{const intent=sessionStorage.getItem('cafe-agenda-filter') as Category;sessionStorage.removeItem('cafe-agenda-filter');if(categories.has(intent))selected=intent;}catch{/* All rows remain visible. */}
 apply(selected);
}
