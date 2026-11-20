import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {onRequest} from '../functions/_middleware.ts';

const html='<html><head><meta name="robots" content="noindex, nofollow"></head><body data-production="false">Preserved content</body></html>';
let cases=0;
for(const hostname of ['cafecomletras.com.br','cafe-com-letras-pages.pages.dev','hash.cafe-com-letras-pages.pages.dev','untrusted.example']){
 for(const env of ['preview','production']){
  const official=hostname==='cafecomletras.com.br';
  for(const method of ['GET','HEAD']){
   const r=await onRequest({request:new Request(`https://${hostname}/cardapio/`,{method}),env:{DEPLOY_ENV:env},next:async()=>new Response(html,{headers:{'Content-Type':'text/html','X-Robots-Tag':'noindex','ETag':'old'}})});
   if(hostname==='cafe-com-letras-pages.pages.dev'){assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://cafecomletras.com.br/cardapio/');cases++;continue;}
   assert.equal(r.headers.has('X-Robots-Tag'),!official);
   const text=await r.text();
   if(method==='GET'){assert.ok(text.includes(official?'content="index, follow, max-image-preview:large"':'content="noindex, nofollow"'));assert.ok(text.includes(`data-production="${official}"`));assert.ok(text.includes('Preserved content'));assert.equal(r.headers.has('ETag'),false);}else assert.equal(text,'');
   cases++;
  }
  const robots=await onRequest({request:new Request(`https://${hostname}/robots.txt`),env:{DEPLOY_ENV:env},next:async()=>new Response('unused')});
  assert.equal((await robots.text()).includes('Allow: /'),official);cases++;
 }
}
for(const route of ['/admin/probe.asp','/system/probe.asp','/novostalentos/probe.pdf','/not-found']){
 const r=await onRequest({request:new Request('https://cafecomletras.com.br'+route),next:async()=>new Response(html,{status:404,headers:{'Content-Type':'text/html'}})});
 assert.equal(r.status,404);assert.match(r.headers.get('X-Robots-Tag'),/noindex/);cases++;
}
for(const [from,to] of [['/liberdade/index.asp','/liberdade/'],['/m/liberdade/index.asp','/m/liberdade/'],['/linktree/index.asp','/linktree/'],['/delivery/index.asp','/delivery/']]){
 const r=await onRequest({request:new Request('https://cafe-com-letras-pages.pages.dev'+from),next:async()=>new Response('unused')});assert.equal(r.status,301);assert.equal(r.headers.get('location'),to);cases++;
}
const bad=/raccoonbet|casino-portugal|casinotop|casinosnobrasil|casinoonline777/i;
for(const file of ['src/data/public-source.json','src/data/page-snapshots.json'])assert.ok(!bad.test(await readFile(file,'utf8')),file);
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())await walk(file);else if(/\.(html|json)$/.test(file))assert.ok(!bad.test(await readFile(file,'utf8')),file);}}
await walk('dist');
const missing=JSON.parse(await readFile('src/data/unavailable-artist-images.json','utf8'));
for(const id of missing)assert.equal((await readdir('public/img/artists')).some(f=>f===`${id}.jpg`),false);
console.log(JSON.stringify({passed:true,policyAndRouteCases:cases,spamInPublicData:false,missingImagesExplicit:missing.length}));
