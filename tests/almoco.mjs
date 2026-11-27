// Almoço executivo: dados válidos e escolha do dia pela hora de Belo Horizonte.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sugestaoVigente,renderSugestaoSecao,renderSugestaoHome,renderV2Sugestao,ORDEM} from '../src/lib/sugestao.ts';
import {agoraBH,pickAlmoco,almocoStatus,renderAlmocoSemana,renderAlmocoHome,renderAlmocoMobile} from '../src/lib/almoco.ts';

const data=JSON.parse(await readFile(new URL('../src/data/almoco-executivo.json',import.meta.url),'utf8'));
const seen=new Set();
for(const d of data.dias){
 assert.match(d.data,/^\d{4}-\d{2}-\d{2}$/,`data inválida: ${d.data}`);
 assert.ok(!seen.has(d.data),`dia repetido: ${d.data}`);
 seen.add(d.data);
 const wd=new Date(`${d.data}T12:00:00Z`).getUTCDay();
 assert.ok(wd>=1&&wd<=5,`${d.data} não é dia útil (o almoço executivo é de segunda a sexta)`);
 if(d.feriado){assert.equal(typeof d.feriado,'string');continue;}
 for(const key of ['menuDoDia','executivo','vegano']) assert.ok(d[key],`${d.data}: falta ${key}`);
 for(const key of ['entrada','principal','sobremesa']) assert.ok(d.menuDoDia[key]?.trim(),`${d.data}: Menu do Dia sem ${key}`);
 for(const p of [d.menuDoDia,d.executivo,d.vegano]) assert.ok(typeof p.preco==='number'&&p.preco>0,`${d.data}: preço inválido`);
 assert.ok(d.executivo.prato.trim()&&d.vegano.prato.trim(),`${d.data}: prato vazio`);
}

const fixture={dias:[
 ...['2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27'].map((data,i)=>({data,menuDoDia:{preco:60+i,entrada:'E'+i,principal:'P'+i,sobremesa:'S'+i},executivo:{prato:'X'+i,preco:44},vegano:{prato:'V'+i,preco:49}})),
 {data:'2026-12-07',menuDoDia:{preco:70,entrada:'e',principal:'p',sobremesa:'s'},executivo:{prato:'x',preco:44},vegano:{prato:'v',preco:49}},
 {data:'2026-12-08',feriado:'Imaculada Conceição'},
 {data:'2026-12-09',menuDoDia:{preco:70,entrada:'e',principal:'p9',sobremesa:'s'},executivo:{prato:'x',preco:44},vegano:{prato:'v',preco:49}},
]};
const at=(day,h,m=0)=>pickAlmoco(fixture,{day,minutes:h*60+m});

assert.equal(at('20261123',12).dia?.data,'2026-11-23');
assert.equal(almocoStatus(at('20261123',0)),'Hoje, a partir das 12h');
assert.equal(almocoStatus(at('20261123',12)),'Servido agora, até as 15h');
assert.equal(at('20261127',14,29).dia?.data,'2026-11-27');
for(const [day,h,m] of [['20261127',14,30],['20261128',12,0],['20261129',12,0],['20261130',12,0]]){
 const state=at(day,h,m);
 assert.equal(state.dia,undefined);
 assert.equal(renderAlmocoHome(state),'');
 assert.equal(renderAlmocoSemana(state),'');
}

const option={executivo:{prato:'Opção do dia',preco:44}};
const calendar={dias:['2026-04-03','2026-04-21','2026-06-04','2026-02-17','2026-11-28','2026-11-29','2026-12-08','2026-12-31','2027-01-01','2027-01-04','2027-03-26'].map(data=>({data,...option}))};
for(const day of ['20260403','20260421','20261128','20261129','20270101','20270326']){
 assert.equal(pickAlmoco(calendar,{day,minutes:720}).dia,undefined,day);
}
for(const day of ['20260217','20260604','20261208','20261231','20270104']){
 assert.ok(pickAlmoco(calendar,{day,minutes:720}).dia,day);
}
assert.equal(pickAlmoco({dias:[{data:'2026-11-23',executivo:{prato:' ',preco:0}}]},{day:'20261123',minutes:720}).dia,undefined);

const local=(instant)=>pickAlmoco(fixture,agoraBH(new Date(instant)));
assert.equal(local('2026-11-23T11:59:59+09:00').dia,undefined);
assert.equal(local('2026-11-23T12:00:00+09:00').dia?.data,'2026-11-23');
assert.equal(local('2026-11-28T02:29:00+09:00').dia?.data,'2026-11-27');
assert.equal(local('2026-11-28T02:30:00+09:00').dia,undefined);

// Abas: só o dia de serviço visível.
const html=renderAlmocoSemana(at('20261125',9));
assert.equal((html.match(/role="tabpanel"/g)??[]).length,5);
assert.equal((html.match(/role="tabpanel"[^>]*hidden/g)??[]).length,4);
assert.match(html,/aria-selected="true"[^>]*data-almoco-tab="2026-11-25"/);
// Destaque da home traz as três opções com preço.
const mobile=renderAlmocoMobile(at('20261123',12));
for(const text of ['Menu do Dia','P0','R$ 60','X0','R$ 44','V0','R$ 49']) assert.ok(mobile.includes(text),`home no celular sem "${text}"`);

console.log(`almoco: ${data.dias.length} dia(s) de cardápio válidos; regras de horário, fim de semana e feriado ok`);

// Sugestão do chef: dados válidos, etapas na ordem e validade por período.
const sug=JSON.parse(await readFile(new URL('../src/data/sugestao-do-chef.json',import.meta.url),'utf8'));
assert.ok(sug.nome?.trim(),'sugestão sem nome');
assert.match(sug.inicio,/^\d{4}-\d{2}-\d{2}$/); assert.match(sug.fim,/^\d{4}-\d{2}-\d{2}$/); assert.ok(sug.inicio<=sug.fim);
for(const key of Object.keys(sug.etapas)) assert.ok(ORDEM.some(([k])=>k===key),`etapa desconhecida: ${key}`);
const day=d=>d.replaceAll('-','');
assert.equal(sugestaoVigente(sug,day(sug.inicio))?.nome,sug.nome);
assert.equal(sugestaoVigente(sug,day(sug.fim))?.nome,sug.nome);
const after=new Date(`${sug.fim}T12:00:00Z`); after.setUTCDate(after.getUTCDate()+1);
const expired=sugestaoVigente(sug,day(after.toISOString().slice(0,10)));
assert.equal(expired,undefined,'sugestão vencida continua no ar');
assert.match(renderV2Sugestao(expired),/em breve/);
assert.match(renderV2Sugestao(sug),/Sugestão do chef/);
assert.match(renderSugestaoSecao(expired),/em breve/); assert.equal(renderSugestaoHome(expired),'');
const secao=renderSugestaoSecao(sugestaoVigente({nome:'T',inicio:'2026-01-01',fim:'2026-12-31',etapas:{sobremesa:'S',compartilhar:'C',principal:'P',entrada:'E'}},'20260601'));
assert.ok(secao.indexOf('Para compartilhar')<secao.indexOf('>Entrada<')&&secao.indexOf('>Entrada<')<secao.indexOf('Prato principal')&&secao.indexOf('Prato principal')<secao.indexOf('>Sobremesa<'),'etapas fora de ordem');
assert.match(secao,/class="grid4"/);
for(const [key,f] of Object.entries(sug.fotos??{})){
 assert.ok(key==='menu'||ORDEM.some(([k])=>k===key),`foto de etapa desconhecida: ${key}`);
 assert.ok(f.alt?.trim(),`foto ${key} sem texto alternativo`);
 await readFile(new URL(`../public${f.src}`,import.meta.url));
}
const comFotos=renderSugestaoSecao(sugestaoVigente({nome:'T',inicio:'2026-01-01',fim:'2026-12-31',etapas:{entrada:'E',principal:'P',sobremesa:'S'},fotos:{menu:{src:'/m.jpg',alt:'M'},entrada:{src:'/e.jpg',alt:'E'}},creditoFotos:'Fotos: X'},'20260601'));
assert.ok(comFotos.indexOf('O menu completo')<comFotos.indexOf('>Entrada<'),'foto do menu deve vir antes das etapas');
assert.match(comFotos,/class="grid4"/); assert.match(comFotos,/src="\/e\.jpg" alt="E"/); assert.match(comFotos,/Fotos: X/);
console.log(`sugestao: "${sug.nome}" de ${sug.inicio} a ${sug.fim}; validade e ordem das etapas ok`);
