import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {eventState} from '../src/lib/event-state.ts';
import {optionalServices,legalReview} from '../src/config/institutional.ts';
assert.equal(optionalServices.length,0);assert.equal(legalReview.approved,false);
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-24T21:00:00-03:00')),'Futuro');
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-25T19:00:00-03:00')),'Hoje · ainda não começou');
assert.equal(eventState('2026-11-25T20:00:00-03:00',undefined,new Date('2026-11-25T21:00:00-03:00')),'Iniciado · término não informado');
assert.equal(eventState('2026-11-25T20:00:00-03:00','2026-11-25T22:00:00-03:00',new Date('2026-11-25T21:00:00-03:00')),'Em andamento');
assert.equal(eventState('2026-11-25T20:00:00-03:00','2026-11-25T22:00:00-03:00',new Date('2026-11-25T22:00:00-03:00')),'Encerrado');
assert.equal(eventState('2026-11-20T20:00:00-03:00',undefined,new Date('2026-11-21T12:00:00-03:00')),'Data passada');
assert.equal(eventState('invalido'),'Data a confirmar');
for(const slug of ['politica-de-privacidade','politica-de-cookies','termos-de-uso']){
 const html=await readFile(`dist/${slug}/index.html`,'utf8');assert.ok(html.includes('Rascunho para revisão jurídica'));assert.ok(html.includes('noindex, nofollow'));assert.ok(html.includes('2026-11-21'));assert.ok(html.includes('cookie-preferences'));
 const sitemap=await readFile('dist/sitemap-0.xml','utf8');assert.ok(!sitemap.includes(slug));
}
const home=await readFile('dist/index.html','utf8');assert.ok(home.includes('Newsletter indisponível'));assert.ok(home.includes('disabled'));assert.ok(home.includes('https://usetag.me/cafecomletras'));
const agenda=await readFile('dist/programacao/index.html','utf8');assert.ok(agenda.includes('data-event-start="2026-11-20T20:00:00-03:00"'));assert.ok(agenda.includes('data-event-start="2026-12-'));assert.ok(!agenda.includes('atualizada direto da planilha'));
console.log('Institutional: legal draft isolation, real event states, disabled newsletter, reservations and cookie inventory passed.');
