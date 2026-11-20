// Offline operator tool. It never accesses a database, network, or administrative HTTP route.
import {readFile,writeFile,rename,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {sanitizeRichText} from '../src/lib/sanitize.ts';

const root=fileURLToPath(new URL('../',import.meta.url));
const dataFile=path.join(root,'src/data/public-source.json');
const imagesFile=path.join(root,'src/data/unavailable-artist-images.json');
const positive=value=>Number.isSafeInteger(value)&&value>0;
function requireValue(condition,message){if(!condition)throw new Error(message);}
function keys(value,allowed,label){
 requireValue(value&&typeof value==='object'&&!Array.isArray(value),`${label}: objeto obrigatório.`);
 requireValue(Object.keys(value).every(key=>allowed.includes(key)),`${label}: campo desconhecido.`);
}
function text(value,max,label){requireValue(typeof value==='string'&&value.trim().length>0&&value.length<=max,`${label}: texto obrigatório, máximo ${max} caracteres.`);return value.trim();}
function validDate(value){
 if(typeof value!=='string'||!/^\d{8}$/.test(value))return false;
 const iso=`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
 const date=new Date(iso+'T12:00:00Z');return !Number.isNaN(+date)&&date.toISOString().slice(0,10)===iso;
}
const eventKey=e=>[e.calendar_unity,e.calendar_date,e.calendar_time,e.calendar_artist].join(':');

export function prepareProgramacao(source,unavailable,changes){
 keys(changes,['artists','events','deleteEvents'],'Lote');
 for(const name of ['artists','events','deleteEvents'])requireValue(changes[name]===undefined||Array.isArray(changes[name]),`${name}: lista obrigatória.`);
 requireValue(Object.values(changes).some(value=>value.length), 'O lote está vazio.');
 requireValue(Object.values(changes).every(value=>value.length<=200),'Máximo de 200 itens por operação.');
 const data=structuredClone(source),missing=new Set(unavailable);
 const summary={artistsAdded:[],artistsUpdated:[],eventsAdded:[],eventsUpdated:[],eventsDeleted:[],unchanged:0};
 const artistIds=new Set(),eventIds=new Set();
 for(const item of changes.artists||[]){
  keys(item,['artist_id','artist_name','artist_release'],'Artista');
  requireValue(positive(item.artist_id)&&!artistIds.has(item.artist_id),'Artista: ID inválido ou repetido no lote.');artistIds.add(item.artist_id);
  const artist={artist_id:item.artist_id,artist_name:text(item.artist_name,255,'Nome'),artist_release:sanitizeRichText(text(item.artist_release,20000,'Descrição'))};
  requireValue(artist.artist_release.trim(),'Descrição sem conteúdo público válido.');
  const index=data.artists.findIndex(a=>a.artist_id===artist.artist_id);
  if(index<0){data.artists.push(artist);missing.add(artist.artist_id);summary.artistsAdded.push(artist.artist_id);}
  else if(JSON.stringify(data.artists[index])!==JSON.stringify(artist)){data.artists[index]=artist;summary.artistsUpdated.push(artist.artist_id);}
 }
 for(const id of changes.deleteEvents||[]){
  requireValue(positive(id)&&!eventIds.has(id),'Cancelamento: ID inválido ou repetido.');eventIds.add(id);
  requireValue(data.events.some(e=>e.calendar_id===id),`Evento ${id} não encontrado para cancelamento.`);
  data.events=data.events.filter(e=>e.calendar_id!==id);summary.eventsDeleted.push(id);
 }
 for(const item of changes.events||[]){
  keys(item,['calendar_id','calendar_unity','calendar_date','calendar_time','calendar_artist','calendar_price'],'Evento');
  requireValue(item.calendar_id===undefined||positive(item.calendar_id),'Evento: ID inválido.');
  requireValue(data.units.some(u=>u.unity_id===item.calendar_unity),'Evento: unidade desconhecida.');
  requireValue(validDate(item.calendar_date),'Evento: data real no formato AAAAMMDD obrigatória.');
  requireValue(typeof item.calendar_time==='string'&&/^(?:[01]\d|2[0-3])[0-5]\d$/.test(item.calendar_time),'Evento: horário HHMM inválido.');
  requireValue(data.artists.some(a=>a.artist_id===item.calendar_artist),'Evento: artista não cadastrado.');
  const price=text(item.calendar_price,255,'Couvert/valor (ou confirmação de gratuito)');
  const id=item.calendar_id??Math.max(0,...data.events.map(e=>e.calendar_id),...eventIds)+1;
  requireValue(positive(id),'Não foi possível gerar um ID seguro para o evento.');
  requireValue(!eventIds.has(id),'Evento repetido no lote ou também marcado para cancelamento.');eventIds.add(id);
  const event={calendar_id:id,calendar_unity:item.calendar_unity,calendar_date:item.calendar_date,calendar_time:item.calendar_time,calendar_artist:item.calendar_artist,calendar_price:price};
  const index=data.events.findIndex(e=>e.calendar_id===id);
  const duplicate=data.events.find(e=>e.calendar_id!==id&&eventKey(e)===eventKey(event));
  if(duplicate){
   if(item.calendar_id===undefined&&duplicate.calendar_price===price){summary.unchanged++;continue;}
   throw new Error(`Evento coincide com o ID ${duplicate.calendar_id}; para corrigir, informe esse calendar_id.`);
  }
  if(index<0){data.events.push(event);summary.eventsAdded.push(id);}
  else if(JSON.stringify(data.events[index])!==JSON.stringify(event)){data.events[index]=event;summary.eventsUpdated.push(id);}
  else summary.unchanged++;
 }
 return {data,unavailable:[...missing],summary};
}

async function atomicWrite(file,value){
 const temporary=file+'.programacao-'+process.pid+'.tmp';
 try{await writeFile(temporary,JSON.stringify(value),'utf8');await rename(temporary,file);}finally{await unlink(temporary).catch(()=>{});}
}
async function main(){
 const args=process.argv.slice(2);
 const sourceText=await readFile(dataFile,'utf8'),imageText=await readFile(imagesFile,'utf8');
 const data=JSON.parse(sourceText),images=JSON.parse(imageText);
 if(args[0]==='--artists'){
  const term=(args[1]||'').toLocaleLowerCase('pt-BR');
  console.log(JSON.stringify({matches:data.artists.filter(a=>a.artist_name.toLocaleLowerCase('pt-BR').includes(term)).map(a=>({id:a.artist_id,name:a.artist_name})),nextArtistId:Math.max(0,...data.artists.map(a=>a.artist_id))+1},null,2));return;
 }
 if(args[0]!=='--file'||!args[1]||args.some((arg,index)=>index>1&&arg!=='--apply'))throw new Error('Uso: node scripts/programacao.mjs --artists "nome" OU --file "lote.json" [--apply]');
 const changes=JSON.parse(await readFile(path.resolve(args[1]),'utf8'));
 const result=prepareProgramacao(data,images,changes);
 console.log(JSON.stringify({mode:args.includes('--apply')?'aplicar':'simulação',...result.summary},null,2));
 if(!args.includes('--apply')){console.log('Nenhum arquivo alterado. Revise o lote; use --apply para atualizar apenas os dados locais.');return;}
 requireValue(await readFile(dataFile,'utf8')===sourceText&&await readFile(imagesFile,'utf8')===imageText,'Os dados mudaram durante a operação; execute a simulação novamente.');
 if(JSON.stringify(result.unavailable)!==JSON.stringify(images))await atomicWrite(imagesFile,result.unavailable);
 if(JSON.stringify(result.data)!==JSON.stringify(data))await atomicWrite(dataFile,result.data);
 console.log('Dados locais atualizados. Ainda é necessário testar, revisar o diff, fazer commit e push na main para publicar.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
