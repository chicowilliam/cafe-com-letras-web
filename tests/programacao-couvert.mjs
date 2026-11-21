// Programação: todo show, DJ, Bossa Nova e Piano Bar mostra o couvert (valor da planilha de programação).
// Só lançamentos/eventos da Livraria podem aparecer sem couvert ("—"). Regra do Bruno, 21/11/2026.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const agenda=await readFile(new URL('../src/design/claude/programacao.html',import.meta.url),'utf8');
let checked=0;
for(const m of agenda.matchAll(/<a [^>]*data-event-row[^>]*>[\s\S]*?<\/a>/g)){
 const row=m[0];
 const category=row.match(/data-event-category="([^"]+)"/)?.[1];
 const start=row.match(/data-event-start="([^"]+)"/)?.[1];
 if(category==='books') continue;
 assert.match(row,/>Couvert R\$ \d+(,\d{2})?</,`Evento de ${start} (${category}) está sem couvert na Programação; use o valor da planilha`);
 checked++;
}
console.log(`programacao-couvert: ${checked} evento(s) com couvert`);
