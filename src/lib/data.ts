import rawData from '../data/public-source.json';
import rawPages from '../data/page-snapshots.json';
import imageManifest from '../data/image-manifest.json';
import type { PublicData,PageSnapshot,UnitName } from './types';
import {sanitizeBody,sanitizeRichText} from './sanitize';
import {whatsappUrl} from '../config/whatsapp';
import {businessDay,renderCalendar,renderMenu,renderDays,renderMobileMenu,renderMobileEvents,renderCatalog} from './presentation';

const original=rawData as unknown as PublicData;
const expected=['exportedAt','canonicalOrigin','source','units','configs','about','artists','events','highlights','news','photos','links','social','categories','items','suggestions','plates','suggestionRelations'];
if(Object.keys(original).some(key=>!expected.includes(key))||original.units.some(u=>!['Savassi','Liberdade'].includes(u.unity_unity)))throw new Error('Exportação fora do contrato público.');
export const publicData: PublicData={...original,artists:original.artists.map(a=>({...a,artist_release:sanitizeRichText(a.artist_release)}))};
export const pages=rawPages as PageSnapshot[];
export const contentDay=process.env.CONTENT_DATE||businessDay();
export const production=process.env.DEPLOY_ENV==='production';
export function getUnitId(unit:UnitName){const value=publicData.units.find(u=>u.unity_unity===unit);if(!value)throw new Error('Unidade inválida.');return value.unity_id;}
function replaceSlot(body:string,name:string,value:string){return body.replace(new RegExp(`<!--MIGRATION:${name}:START-->[\\s\\S]*?<!--MIGRATION:${name}:END-->`),value);}
export function bodyFor(page:PageSnapshot){
 let body=page.body;const id=getUnitId(page.unit);
 if(['desktop','digital'].includes(page.kind)){
  body=replaceSlot(body,'calendar',renderCalendar(publicData,id,contentDay.slice(0,6),contentDay,contentDay));
  body=replaceSlot(body,'daily-menu',renderMenu(publicData,id,contentDay));body=replaceSlot(body,'days',renderDays(contentDay));
 }
 if(page.kind==='mobile'){body=replaceSlot(body,'mobile-menu',renderMobileMenu(publicData,id,contentDay));body=replaceSlot(body,'mobile-events',renderMobileEvents(publicData,id,contentDay));}
 if(['all','wine','dessert'].includes(page.kind)){
  const catalog=renderCatalog(publicData,id,page.kind);
  if(page.kind==='wine'&&page.unit==='Savassi'){
   const pdf='/pdf/carta-de-vinhos-cafe-com-letras-novembro-2026.pdf';
   const pdfViewer=`<div class="wine-pdf"><p>Carta de vinhos atualizada em novembro de 2026.</p><p><a href="${pdf}" target="_blank" rel="noopener noreferrer">Abrir ou baixar a carta original (PDF)</a></p><iframe src="${pdf}#toolbar=1" title="Carta de vinhos Café com Letras — novembro de 2026" loading="lazy" style="display:block;width:100%;height:900px;border:0" ></iframe><details style="margin-top:24px"><summary>Consultar vinhos e preços em texto</summary>${catalog}</details></div>`;
   body=replaceSlot(body,'catalogue',pdfViewer);
  }else body=replaceSlot(body,'catalogue',catalog);
 }
 // Existing HTTPS newsletter form is compatible with static hosting; no data is posted during preview/tests.
 if(production&&process.env.NEWSLETTER_ENABLED==='1'){body=body.replace(/<form\b([^>]*data-newsletter-action="([^"]+)"[^>]*)>([\s\S]*?)<\/form>/g,(_all,attrs:string,action:string,inside:string)=>{
  if(!action.startsWith('https://25.idmkt8.com/'))return _all;
  return `<form ${attrs.replace(/\saction="[^"]*"/g,'')} action="${action}" target="_blank">${inside.replace(/\sdisabled(?:="[^"]*")?/g,'')}</form>`;
 });}
 const images=imageManifest as Record<string,{src:string;width:number;height:number}>;
 const firstHighlight=publicData.highlights.find(h=>h.highlight_unity===id)?.highlight_id;
 body=body.replace(/<img\b[^>]*>/g,tag=>{
  const src=/src="([^"]+)"/.exec(tag)?.[1];const meta=src?images[src]:undefined;if(!meta)return tag;
  const priority=src===`/img/highlights/${firstHighlight}.jpg`;
  const eager=priority||src?.startsWith('/img/news/');
  return tag.replace(/\s(?:width|height|loading|decoding|fetchpriority)="[^"]*"/g,'').replace(`src="${src}"`,`src="${meta.src}"`).replace(/\s*\/?>$/,` width="${meta.width}" height="${meta.height}" decoding="async" loading="${eager?'eager':'lazy'}"${priority?' fetchpriority="high"':''} />`);
 });
 body=body.replace(/url\("(\/[^\"]+)"\)/g,(all,src:string)=>images[src]?`url("${images[src].src}")`:all);
 body=body.replace(/(<a\b[^>]*\bhref=)(["'])https:\/\/wa\.me\/\d+(?:\?[^"'<>]*)?\2/gi,(_match,start:string,quote:string)=>`${start}${quote}${whatsappUrl}${quote}`);
 return sanitizeBody(body);
}
