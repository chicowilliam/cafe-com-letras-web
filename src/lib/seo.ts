import type { PageSnapshot } from './types';
import {publicData,getUnitId,contentDay} from './data';
import {origin,pagePath,unitPath} from './routes';
import {shiftDate,validDate} from './presentation';
import {sanitizeRichText} from './sanitize';

export function plain(text:string){return sanitizeRichText(text).replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
export function seoFor(page:PageSnapshot){
 const unitId=getUnitId(page.unit),config=publicData.configs.find(c=>c.config_unity===unitId);
 const kindTitle:Record<string,string>={all:'Cardápio Completo',wine:'Carta de Vinhos',dessert:'Sobremesas',linktree:'Links',delivery:'Delivery',digital:'Cardápios digitais'};
 const title=page.kind==='linktree'?'Café com Letras — Links':page.kind==='delivery'?'Café com Letras — Delivery':`${kindTitle[page.kind]?kindTitle[page.kind]+' — ':''}Café com Letras ${page.unit}`;
 const canonical=origin+(page.kind==='mobile'?unitPath(page.unit):pagePath(page.key));
 const description=page.unit==='Liberdade'?'Informações do Café com Letras Liberdade, em Belo Horizonte. O cadastro recuperado informa que esta unidade não está funcionando.':page.kind==='all'?`Cardápio completo do Café com Letras ${page.unit}, em Belo Horizonte, conforme conteúdo público recuperado.`:page.kind==='wine'?`Carta de vinhos do Café com Letras ${page.unit}, em Belo Horizonte.`:page.kind==='dessert'?`Sobremesas do Café com Letras ${page.unit}, em Belo Horizonte.`:`Café com Letras ${page.unit}, em Belo Horizonte. Restaurante, café, jazz club e livraria. Cardápio, programação e informações da unidade.`;
 const graph:Record<string,unknown>[]=[{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Café com Letras',inLanguage:'pt-BR'},{'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,isPartOf:{'@id':origin+'/#website'},inLanguage:'pt-BR'}];
 if(config){
  const addresses=[config.config_address_1,config.config_address_2,config.config_address_3].map(plain);
  const street=addresses.find(a=>/^(rua|praça|avenida|av\.)/i.test(a));
  const phones=addresses.join(' ').match(/\(\d{2}\)\s*\d{4,5}-\d{4}/g)||[];
  const restaurant:Record<string,unknown>={'@type':['Restaurant','LocalBusiness'],'@id':origin+unitPath(page.unit)+'#restaurant',name:'Café com Letras '+page.unit,url:origin+unitPath(page.unit),image:origin+'/img/share/cafe-com-letras.jpg',address:{'@type':'PostalAddress',streetAddress:street,addressLocality:'Belo Horizonte',addressRegion:'MG',addressCountry:'BR'}};
  if(phones[0])restaurant.telephone='+55'+phones[0].replace(/\D/g,'');
  const closed=/n[aã]o.*funcionando/i.test(config.config_time_1);
  if(closed)restaurant.additionalProperty={'@type':'PropertyValue',name:'Situação informada no cadastro recuperado',value:plain(config.config_time_1)};
  const time=config.config_time_1.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(!closed&&/domingo.*quinta.*12h.*22h.*sexta.*sabado.*12h.*23h/i.test(time))restaurant.openingHoursSpecification=[{'@type':'OpeningHoursSpecification',dayOfWeek:['Sunday','Monday','Tuesday','Wednesday','Thursday'],opens:'12:00',closes:'22:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Friday','Saturday'],opens:'12:00',closes:'23:00'}];
  graph.push(restaurant);
  if(!closed&&['desktop','mobile','digital'].includes(page.kind)){
   const max=page.kind==='mobile'?'99991231':shiftDate(contentDay,7);
   for(const event of publicData.events.filter(e=>e.calendar_unity===unitId&&validDate(e.calendar_date)&&e.calendar_date>=contentDay&&e.calendar_date<=max&&/^([01]\d|2[0-3])[0-5]\d$/.test(e.calendar_time))){
    const artist=publicData.artists.find(a=>a.artist_id===event.calendar_artist);if(!artist)continue;
    const date=event.calendar_date;
    graph.push({'@type':'Event','@id':canonical+'#evento-'+event.calendar_id,name:plain(artist.artist_name),startDate:`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}T${event.calendar_time.slice(0,2)}:${event.calendar_time.slice(2,4)}:00-03:00`,url:canonical+'#evento-'+event.calendar_id,description:plain(artist.artist_release),image:origin+'/img/artists/'+artist.artist_id+'.jpg',location:{'@type':'Place','@id':restaurant['@id'],name:restaurant.name,address:restaurant.address}});
   }
  }
 }
 return {title,description,canonical,schema:{'@context':'https://schema.org','@graph':graph}};
}
