import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {eventState} from '../src/lib/event-state.ts';
import {optionalServices,legalReview} from '../src/config/institutional.ts';
import {onRequest} from '../functions/_middleware.ts';
const implicit=await onRequest({request:new Request('https://cafecomletras.com.br/m/'),next:async()=>new Response('static')});assert.equal(implicit.headers.get('set-cookie'),null);
const explicit=await onRequest({request:new Request('https://cafecomletras.com.br/?unity=Liberdade'),next:async()=>new Response('static')});assert.match(explicit.headers.get('set-cookie'),/unity=Liberdade; Path=\/; Max-Age=604800; SameSite=Lax; Secure/);
assert.equal(optionalServices.length,0);assert.equal(legalReview.approved,false);
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-24T21:00:00-03:00')),'Futuro');
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-25T19:00:00-03:00')),'Hoje · ainda não começou');
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-25T21:00:00-03:00')),'Iniciado · término não informado');
assert.equal(eventState('2026-11-25T20:00:00-03:00','2026-11-25T22:00:00-03:00',new Date('2026-11-25T21:00:00-03:00')),'Em andamento');
assert.equal(eventState('2026-11-25T20:00:00-03:00','2026-11-25T22:00:00-03:00',new Date('2026-11-25T22:00:00-03:00')),'Encerrado');
assert.equal(eventState('2026-11-20T20:00:00-03:00',undefined,new Date('2026-11-21T12:00:00-03:00')),'Data passada');
assert.equal(eventState('invalido'),'Data a confirmar');
const production=JSON.parse(await readFile('dist/build-info.json','utf8')).mode==='production';
for(const slug of ['politica-de-privacidade','politica-de-cookies','termos-de-uso']){
 for(const suffix of ['', '/', '.html']){const response=await onRequest({request:new Request('https://cafecomletras.com.br/'+slug+suffix),next:async()=>{throw new Error('Draft accessed');}});assert.equal(response.status,404);assert.match(response.headers.get('x-robots-tag'),/noindex/);}
 const preview=await onRequest({request:new Request('https://preview.cafe-com-letras-pages.pages.dev/'+slug+'/'),next:async()=>new Response('preview')});assert.equal(preview.status,200);
 if(production){assert.ok(!(await readdir('dist')).includes(slug));}else{
 const html=await readFile(`dist/${slug}/index.html`,'utf8');assert.ok(html.includes('Rascunho para revisão jurídica'));assert.ok(html.includes('noindex, nofollow'));assert.ok(html.includes('2026-11-21'));assert.ok(html.includes('cookie-preferences'));
 }
 const sitemap=await readFile('dist/sitemap-0.xml','utf8');assert.ok(!sitemap.includes(slug));
}
const home=await readFile('dist/index.html','utf8');assert.ok(home.includes('Newsletter indisponível'));assert.ok(home.includes('disabled'));assert.ok(home.includes('https://usetag.me/cafecomletras'));
if(production){assert.ok(!/href="\/(?:politica-de-privacidade|politica-de-cookies|termos-de-uso)\//.test(home));const assets=await readdir('dist/_astro');for(const name of assets.filter(n=>n.endsWith('.js')))assert.ok(!(await readFile('dist/_astro/'+name,'utf8')).includes('Identificação jurídica do responsável'));}
const agenda=await readFile('dist/programacao/index.html','utf8');assert.ok(agenda.includes('data-event-start="2026-11-20T20:00:00-03:00"'));assert.ok(agenda.includes('data-event-start="2026-12-'));assert.ok(!agenda.includes('atualizada direto da planilha'));
console.log('Institutional: legal draft isolation, real event states, disabled newsletter, reservations and cookie inventory passed.');
