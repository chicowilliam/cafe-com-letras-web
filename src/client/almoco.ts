// Almoço executivo: recalcula o dia mostrado pela hora de Belo Horizonte (fim do serviço às 15h,
// virada do dia, fim de semana) sem novo deploy, e controla as abas dos dias na Gastronomia.
import data from '../data/almoco-executivo.json';
import sugestaoData from '../data/sugestao-do-chef.json';
import {renderSugestaoHome,renderSugestaoSecao,sugestaoSignature,sugestaoVigente,type Sugestao} from '../lib/sugestao';
import {agoraBH,almocoSignature,pickAlmoco,renderAlmocoHome,renderAlmocoMobile,renderAlmocoSemana,renderV2Almoco,type AlmocoData,type AlmocoState} from '../lib/almoco';

const renderers:Record<string,(state:AlmocoState)=>string>={home:renderAlmocoHome,mobile:renderAlmocoMobile,semana:renderAlmocoSemana,v2home:renderV2Almoco};

const sugestaoRenderers:Record<string,(s?:Sugestao)=>string>={secao:renderSugestaoSecao,home:s=>renderSugestaoHome(s),mobile:s=>renderSugestaoHome(s,true)};

function refresh(){
 const now=agoraBH();
 const sugestao=sugestaoVigente(sugestaoData as Sugestao,now.day);
 const ssig=sugestaoSignature(sugestao);
 for(const element of document.querySelectorAll<HTMLElement>('[data-sugestao]')){
  const render=sugestaoRenderers[element.dataset.sugestao??''];
  if(!render||element.dataset.sugestaoSig===ssig)continue;
  element.innerHTML=render(sugestao);
  element.dataset.sugestaoSig=ssig;
 }
 const state=pickAlmoco(data as AlmocoData,now);
 const sig=almocoSignature(state);
 for(const element of document.querySelectorAll<HTMLElement>('[data-almoco]')){
  const render=renderers[element.dataset.almoco??''];
  if(!render||element.dataset.almocoSig===sig)continue;
  element.innerHTML=render(state);
  element.dataset.almocoSig=sig;
 }
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

export function initAlmoco(){
 refresh();
 setInterval(refresh,60_000);
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
