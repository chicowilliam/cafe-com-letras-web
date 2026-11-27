import data from '../data/almoco-executivo.json';
import sugestaoData from '../data/sugestao-do-chef.json';
import {renderSugestaoHome,renderSugestaoSecao,renderV2Sugestao,sugestaoSignature,sugestaoVigente,type Sugestao} from '../lib/sugestao';
import {agoraBH,almocoSignature,pickAlmoco,renderAlmocoMobile,renderAlmocoSemana,renderV2Almoco,type AlmocoData} from '../lib/almoco';

let timer: number;
let available: boolean | undefined;
const highlight=document.querySelector<HTMLElement>('[data-mesa-destaque]');
function refresh(){
 const date=new Date();
 const now=agoraBH(date);
 const state=pickAlmoco(data as AlmocoData,now);
 const show=!!state.dia;
 const sugestao=sugestaoVigente(sugestaoData as Sugestao,now.day);
 const focus=document.activeElement;
 const moveFocus=available!==show&&focus?.closest(show?'[data-chef-link]':'[data-executivo]');
 // Mantém a posição dos links e do conteúdo abaixo na troca ao vivo das 14h30.
 if(highlight&&available===true&&!show)highlight.style.minHeight=`${highlight.getBoundingClientRect().height}px`;
 const ssig=sugestaoSignature(sugestao);
 const sig=almocoSignature(state);
 for(const element of document.querySelectorAll<HTMLElement>('[data-almoco],[data-sugestao]')){
  const slot=element.dataset.almoco;
  if(slot){
   const key=slot==='v2home'&&!show?`chef:${ssig}`:sig;
   if(element.dataset.almocoSig===key)continue;
   element.innerHTML=slot==='v2home'?(show?renderV2Almoco(state):renderV2Sugestao(sugestao))
    :slot==='mobile'?renderAlmocoMobile(state):renderAlmocoSemana(state);
   element.dataset.almocoSig=key;
  }else{
   if(element.dataset.sugestaoSig!==ssig){
    element.innerHTML=element.dataset.sugestao==='secao'?renderSugestaoSecao(sugestao):renderSugestaoHome(sugestao,true);
    element.dataset.sugestaoSig=ssig;
   }
   if(element.dataset.sugestao==='mobile')element.hidden=show;
  }
 }
 if(available!==show){
  for(const element of document.querySelectorAll<HTMLElement>('[data-executivo],[data-chef-link]')){
   element.hidden=element.hasAttribute('data-executivo')?!show:show;
  }
  if(moveFocus)document.querySelector<HTMLElement>(show?'[data-executivo][href]':'[data-chef-link],.dining-section-nav a[href="#chef"],.dining-primary')?.focus({preventScroll:true});
  available=show;
  document.dispatchEvent(new Event('almocochange'));
 }
 clearTimeout(timer);
 // Alinha ao próximo minuto de relógio, inclusive 00h00 e 14h30.
 timer=window.setTimeout(refresh,60_000-date.getTime()%60_000);
}

function select(tab:HTMLButtonElement,focus=false){
 const list=tab.closest('[role="tablist"]');
 const root=tab.closest('[data-almoco]');
 if(!list||!root)return;
 for(const other of list.querySelectorAll<HTMLButtonElement>('[role="tab"]')){
  const on=other===tab;
  other.setAttribute('aria-selected',String(on));
  other.tabIndex=on?0:-1;
  const panel=root.querySelector<HTMLElement>('#'+CSS.escape(other.getAttribute('aria-controls')??''));
  if(panel)panel.hidden=!on;
 }
 if(focus)tab.focus();
}

function initAlmoco(){
 refresh();
 window.addEventListener('pageshow',refresh);
 if(highlight)window.addEventListener('resize',()=>highlight.style.removeProperty('min-height'));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
 document.addEventListener('click',event=>{
  const tab=event.target instanceof Element?event.target.closest<HTMLButtonElement>('[data-almoco-tab]'):null;
  if(tab)select(tab);
 });
 document.addEventListener('keydown',event=>{
  const tab=event.target instanceof Element?event.target.closest<HTMLButtonElement>('[data-almoco-tab]'):null;
  if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const tabs=[...(tab.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]')??[])];
  const i=tabs.indexOf(tab);
  const next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];
  if(next){event.preventDefault();select(next,true);}
 });
}

initAlmoco();
