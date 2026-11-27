// Destaques "Em cartaz" da home: cada card leva a uma página sobre o próprio conteúdo do destaque,
// nunca à Programação geral. Show único → página do artista (mesmo link da agenda); festival → /festivais/<slug>/.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {presentationCopy} from '../src/lib/event-presentation.ts';

const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const home=await readFile(new URL('../src/design/claude/index.html',import.meta.url),'utf8');
const agenda=await readFile(new URL('../src/design/claude/programacao.html',import.meta.url),'utf8');

const events=new Map();
for(const m of agenda.matchAll(/<a href="([^"]+)"[^>]*data-event-row[^>]*>([\s\S]*?)<\/a>/g)){
 const title=m[2].match(/font-weight:700;font-size:19px;line-height:1\.3">([\s\S]*?)<\/span><span style="font-size:14px/);
 if(title) events.set(strip(title[1]).replace(/ · \d{2}\/\d{2}\/\d{4}$/,''),m[1]);
}
const festivals=JSON.parse(await readFile(new URL('../src/data/festivals.json',import.meta.url),'utf8'));
const section=home.match(/<section id="em-cartaz"[\s\S]*?<\/section>/)?.[0];
assert.ok(section,'seção Em cartaz não encontrada');
let checked=0;
for(const m of section.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)){
 const title=m[2].match(/<div class="h3"[^>]*>([\s\S]*?)<\/div>/);
 if(!title) continue;
 assert.notEqual(m[1].split('#')[0],'/programacao/',`Destaque "${strip(title[1])}" aponta para a Programação geral; deve levar à página do próprio conteúdo`);
 const festival=festivals.find(f=>f.title===strip(title[1]));
 if(festival){assert.equal(m[1],`/festivais/${festival.slug}/`);checked++;continue;}
 const target=events.get(strip(title[1]));
 if(!target||target==='/programacao/#agenda') continue;
 assert.equal(m[1],target,`Destaque "${strip(title[1])}" deve levar a ${target}, não a ${m[1]}`);
 checked++;
}
console.log(`home-destaques: ${checked} destaque(s) ligados à página do evento`);

// Tipo do evento prevalece sobre categoria do artista e indícios no texto.
for(const [type,cta] of [['DJ Set','Sobre o DJ Set'],['Show','Sobre o show'],['Piano Bar','Sobre o Piano Bar']]){
 assert.deepEqual(presentationCopy(type,'Jazz','DJ convidado'),{category:type,cta});
}
assert.equal(presentationCopy(undefined,'DJ','Rafa Jazz').category,'DJ Set');
assert.equal(presentationCopy(undefined,'Jazz','DJ convidado').category,'Show');
assert.equal(presentationCopy(undefined,'Piano Bar','Jazz ao vivo').category,'Piano Bar');
assert.equal(presentationCopy(undefined,'Livro','DJ convidado').cta,'Sobre o evento');
assert.equal(presentationCopy(undefined,undefined,'Happy Fitz Big Band').category,'Show');
assert.equal(presentationCopy(undefined,undefined,'Quarteto','bossa nova').category,'Show');
assert.equal(presentationCopy(undefined,undefined,'Artista convidado','','Especial de discotecagem').category,'DJ Set');
assert.equal(presentationCopy(undefined,undefined,'Piano Bar com Gabruga').category,'Piano Bar');
