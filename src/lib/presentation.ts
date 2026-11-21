import type { CalendarChunk, PublicData } from './types';
import unavailableImages from '../data/unavailable-artist-images.json';
import cartaDeVinhos from '../data/carta-de-vinhos.json';

export function artistImage(id:number){return unavailableImages.includes(id)?null:`/img/artists/${id}.jpg`;}
function artistPhoto(id:number,name:string){const src=artistImage(id);return src?`<img src="${src}" alt="${escapeHTML(name)}" title="${escapeHTML(name)}" loading="lazy" />`:'';}

export const escapeHTML = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
export function businessDay(value = new Date()) { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(value).replaceAll('-', ''); }
export function validDate(value: string) {
  if (!/^\d{8}$/.test(value)) return false;
  const date = new Date(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T12:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0,10).replaceAll('-','') === value && +value.slice(0,4)>=1000 && +value.slice(0,4)<=9998;
}
export function shiftDate(value: string, days: number) { const date = new Date(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T12:00:00Z`); date.setUTCDate(date.getUTCDate()+days); return date.toISOString().slice(0,10).replaceAll('-',''); }
export const displayDate = (value: string) => `${value.slice(6,8)}/${value.slice(4,6)}/${value.slice(0,4)}`;
export const displayTime = (value: string) => /^\d{4}$/.test(value) ? `${value.slice(0,2)}:${value.slice(2,4)}` : value;
export const monthNames = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export function weekday(value:string) {return ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][new Date(`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T12:00:00Z`).getUTCDay()]!;}
export function renderDays(today=businessDay()) {
  let html='';for(let week=-10;week<=10;week++){html+='<li style="width:760px;float:left">';for(let i=0;i<7;i++){const d=shiftDate(today,week*7+i);html+=`<div class="day${d===today?' today active':''}" date="${d}"><span>${weekday(d).slice(0,3)}</span> ${displayDate(d).slice(0,5)}</div> `;}html+='</li>';}return html;
}
export function renderMobileMenu(data:Pick<PublicData,'suggestions'|'plates'|'suggestionRelations'>,unit:number,today=businessDay()) {return Array.from({length:8},(_,i)=>{const day=shiftDate(today,i);return `<div class="swiper-slide"><div class="menu-card"><h2>${weekday(day)}, ${displayDate(day)}</h2>${renderMenu(data,unit,day)}</div></div>`;}).join('');}
export function renderMobileEvents(data:CalendarChunk,unit:number,today=businessDay()) {return data.events.filter(e=>e.calendar_unity===unit&&e.calendar_date>=today).map(e=>{const a=data.artists.find(a=>a.artist_id===e.calendar_artist);if(!a)return '';return `<div class="swiper-slide"><div class="calendar"><div class="venues" id="evento-${e.calendar_id}"><div class="when">${weekday(e.calendar_date)}, ${displayDate(e.calendar_date)} | ${escapeHTML(displayTime(e.calendar_time))}</div><div class="img">${artistPhoto(a.artist_id,a.artist_name)}</div><div class="artist">${escapeHTML(a.artist_name)}</div><div class="release">${a.artist_release}</div><div class="price">${escapeHTML(e.calendar_price)}</div></div></div></div>`;}).join('');}

export function renderMenu(data: Pick<PublicData,'suggestions'|'plates'|'suggestionRelations'>, unit: number, date: string) {
  if (!validDate(date)) throw new Error('Data inválida.');
  const suggestions = data.suggestions.filter(s => s.suggestion_unity===unit && s.suggestion_date_start<=date && s.suggestion_date_end>=date);
  if (!suggestions.length) return '<p>Ainda não temos nada cadastrado para este dia.</p>';
  return suggestions.map(s=>`<h3>${escapeHTML(s.suggestion_suggestion)}</h3>${s.suggestion_obs ? `<h4>${escapeHTML(s.suggestion_obs)}</h4>` : ''}<table>${data.suggestionRelations.filter(r=>r.suggestionrel_suggestion===s.suggestion_id).sort((a,b)=>a.suggestionrel_order-b.suggestionrel_order).map(r=>{const p=data.plates.find(p=>p.plate_id===r.suggestionrel_plate); return p ? `<tr><td class="item">${escapeHTML(p.plate_plate)}</td><td class="price">${escapeHTML(r.suggestionrel_price)}</td></tr>` : '';}).join('')}</table>`).join('');
}

export function renderCatalog(data:Pick<PublicData,'categories'|'items'>,unit:number,kind:string){
 // Carta de vinhos da Savassi (unidade 1) vem da carta atual (src/data/carta-de-vinhos.json), não do cadastro antigo exportado do MySQL.
 if(kind==='wine'&&unit===1)return renderWineList(cartaDeVinhos.secoes);
 const categories=data.categories.filter(c=>kind==='all'||c.category_category.toLocaleLowerCase('pt-BR').includes(kind==='wine'?'vinho':'sobremesa'));
 return categories.map(c=>`<h3>${escapeHTML(c.category_category.trim())}</h3><table>${data.items.filter(i=>i.item_unity===unit&&i.item_category===c.category_id).map(i=>`<tr><td class="item"><div>${escapeHTML(i.item_item.trim())}</div><div class="description">${escapeHTML(i.item_description.trim())}</div></td><td class="price">${escapeHTML(i.item_price.trim())}</td></tr>`).join('')}</table>`).join('');
}

export function renderWineList(secoes:{titulo:string;itens:{nome:string;descricao:string;preco:string}[]}[]){
 return secoes.map(sec=>`<h3>${escapeHTML(sec.titulo)}</h3><table>${sec.itens.map(i=>`<tr><td class="item"><div>${escapeHTML(i.nome)}</div><div class="description">${escapeHTML(i.descricao)}</div></td><td class="price">${escapeHTML(i.preco)}</td></tr>`).join('')}</table>`).join('');
}

/** release is sanitized during the public-data build, before entering any browser chunk. */
export function renderVenues(data: CalendarChunk, unit: number, date: string) {
  const end = shiftDate(date,7);
  return `<div class="venues"><h2>Eventos a partir de ${displayDate(date)}</h2><ul>${data.events.filter(e=>e.calendar_unity===unit&&e.calendar_date>=date&&e.calendar_date<=end).map(e=>{
    const artist=data.artists.find(a=>a.artist_id===e.calendar_artist);if(!artist)return '';
    return `<li id="evento-${e.calendar_id}"><div class="img">${artistPhoto(artist.artist_id,artist.artist_name)}</div><div class="infos"><div class="when"><date>${displayDate(e.calendar_date)}</date><time>${escapeHTML(displayTime(e.calendar_time))}</time></div><div class="artist">${escapeHTML(artist.artist_name)}</div><div class="release">${artist.artist_release}</div><div class="price">${escapeHTML(e.calendar_price)}</div></div></li>`;
  }).join('')}</ul></div>`;
}

export function renderCalendar(data: CalendarChunk, unit: number, month: string, date: string, today=businessDay()) {
  if (!/^\d{6}$/.test(month)||!validDate(month+'01')||!validDate(date)) throw new Error('Calendário inválido.');
  const year=+month.slice(0,4), m=+month.slice(4,6);
  const first=new Date(Date.UTC(year,m-1,1,12)).getUTCDay();
  const days=new Date(Date.UTC(year,m,0,12)).getUTCDate(), prevDays=new Date(Date.UTC(year,m-1,0,12)).getUTCDate();
  const calendarValue='01'+month.slice(4,6)+month.slice(0,4);
  const move=(offset:number)=>{const d=new Date(Date.UTC(year,m-1+offset,1,12));return '01'+String(d.getUTCMonth()+1).padStart(2,'0')+d.getUTCFullYear();};
  let result=`<table><tbody><tr><td class="previous" colspan="2"><a class="moveMonths" calendar="${move(-1)}" href="#part2" aria-label="Mês anterior">&lt;</a></td><td class="month" colspan="3">${monthNames[m-1]} / ${year}</td><td class="next" colspan="2"><a class="moveMonths" calendar="${move(1)}" href="#part2" aria-label="Próximo mês">&gt;</a></td></tr><tr>${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(w=>`<td class="weekday">${w}</td>`).join('')}</tr>`;
  for(let cell=0;cell<42;cell++){
    if(cell%7===0)result+='<tr>';
    const day=cell-first+1;
    if(day<1)result+=`<td class="previous-month">${prevDays+day}</td>`;
    else if(day>days)result+=`<td class="next-month">${day-days}</td>`;
    else{
      const value=month+String(day).padStart(2,'0');
      const entries=data.events.filter(e=>e.calendar_unity===unit&&e.calendar_date===value).map(e=>{const a=data.artists.find(a=>a.artist_id===e.calendar_artist);return a?`<div class="venue"><div class="time">${escapeHTML(displayTime(e.calendar_time))}</div><div class="artist">${escapeHTML(a.artist_name)}</div></div>`:'';}).join('');
      result+=`<td class="${value===today?'today':'date'}"><a class="calendarDay" calendar="${calendarValue}" date="${value}" href="#part2"><div class="day">${day}</div>${entries}</a></td>`;
    }
    if(cell%7===6)result+='</tr>';
  }
  return result+'<tr></tr></tbody></table>'+renderVenues(data,unit,date);
}
