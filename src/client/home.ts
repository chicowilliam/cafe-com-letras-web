// Atualiza "No palco" e "Esta semana" da home pela data de Belo Horizonte,
// para a virada da meia-noite não depender de um novo deploy.
import {addDays,bhNow,homeSignature,pickHome,renderMobileStage,renderMobileWeek,renderStage,renderWeek,type HomeState,type StageArtist,type StageEvent} from '../lib/home-stage';
import monthIndex from '../data/calendar-months.json';

interface Chunk {events:StageEvent[];artists:StageArtist[]}
const cache=new Map<string,Promise<Chunk|null>>();
function month(key:string){
 if(!monthIndex.savassi.includes(key))return Promise.resolve(null);
 let request=cache.get(key);
 if(!request){
  request=fetch(`/data/calendar/savassi/${key}.json`).then(r=>r.ok?r.json() as Promise<Chunk>:null).catch(()=>null);
  cache.set(key,request);
 }
 return request;
}
const renderers:Record<string,(state:HomeState,artists:Map<number,StageArtist>)=>string>={stage:renderStage,week:renderWeek,mstage:renderMobileStage,mweek:renderMobileWeek};

async function refresh(){
 const now=bhNow();
 const keys=[...new Set([now.day.slice(0,6),addDays(now.day,40).slice(0,6)])];
 const chunks=await Promise.all(keys.map(month));
 if(!chunks[0])return; // sem dados do mês atual: mantém o HTML publicado
 const events=chunks.flatMap(c=>c?.events??[]);
 const artists=new Map(chunks.flatMap(c=>c?.artists??[]).map(a=>[a.artist_id,a]));
 const state=pickHome(events,now);
 const sig=homeSignature(state);
 for(const element of document.querySelectorAll<HTMLElement>('[data-home]')){
  const render=renderers[element.dataset.home??''];
  if(!render||element.dataset.homeSig===sig)continue;
  element.innerHTML=render(state,artists);
  element.dataset.homeSig=sig;
 }
}

export function initHome(){
 void refresh();
 setInterval(()=>void refresh(),60_000);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void refresh();});
}
