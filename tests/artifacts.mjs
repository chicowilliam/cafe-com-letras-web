import assert from 'node:assert/strict';
import {readFile,readdir,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {onRequest} from '../functions/_middleware.ts';
await import('./whatsapp.mjs');
const root=path.resolve('dist'),origin='https://cafecomletras.com.br';
const info=JSON.parse(await readFile('dist/build-info.json','utf8'));const production=info.mode==='production';
const report={mode:info.mode,pages:[],missingResources:[],redirects:[],schemaEvents:0,privateFiles:[],passed:false};
async function walk(dir){let out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);out.push(...(entry.isDirectory()?await walk(file):[file]));}return out;}
async function exists(url){let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root))return false;try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');await stat(file);return true;}catch{return false;}}
const files=await walk(root);const headers=await readFile('dist/_headers','utf8');
assert.ok(headers.includes('https://:project.pages.dev/*'));assert.ok(headers.includes('https://:version.:project.pages.dev/*'));
const pages=files.filter(f=>f.endsWith('.html')&&!f.endsWith('404.html'));
for(const file of pages){
 const html=await readFile(file,'utf8');const route='/'+path.relative(root,file).split(path.sep).join('/').replace(/index\.html$/,'');
 const title=/<title>([^<]+)<\/title>/.exec(html)?.[1];assert.ok(title,route+' title');
 assert.match(html,/<meta name="description" content="[^"]+"/);assert.match(html,/<html lang="pt-BR"/);
 assert.equal(/<meta name="robots" content="noindex/.test(html),!(production&&!['/celular/','/evento/','/politica-de-privacidade/','/politica-de-cookies/','/termos-de-uso/'].includes(route)),route+' index policy');
 const canonical=/<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];assert.ok(canonical?.startsWith(origin+'/'));assert.ok(!canonical.includes('?'));
 assert.equal(canonical,origin+(route==='/celular/'?'/':route).replace(/^\/m\/liberdade\//,'/liberdade/').replace(/^\/m\//,'/'));
 assert.ok(!/<%|<!--#include|\son\w+\s*=/i.test(html),'ASP or inline event handler');
 assert.ok(!html.includes('localhost:8080'),'No diagnostic origin in published HTML');
 for(const tag of html.matchAll(/<(?:a|img|script|link|form)\b[^>]*>/g))for(const attribute of tag[0].matchAll(/(?:href|src|action)="([^"]*)"/g)){
  const value=attribute[1].replaceAll('&amp;','&');if(!value||value.startsWith('#'))continue;
  const url=new URL(value,origin+route);if(url.origin!==origin)continue;
  if(url.pathname.endsWith('.asp')||url.searchParams.has('unity')||url.searchParams.has('section'))continue;
  if(url.pathname==='/medidas-prevencao/'||url.pathname==='/linktree')continue;
  if(!await exists(url))report.missingResources.push({route,resource:url.pathname});
 }
 const raw=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1];assert.ok(raw,'JSON-LD');const schema=JSON.parse(raw);
 assert.equal(schema['@context'],'https://schema.org');assert.ok(Array.isArray(schema['@graph']));
 const restaurant=schema['@graph'].find(x=>Array.isArray(x['@type'])&&x['@type'].includes('Restaurant'));assert.ok(restaurant?.address?.streetAddress,'verified street');
 for(const event of schema['@graph'].filter(x=>x['@type']==='Event')){assert.ok(!route.includes('liberdade'));assert.ok(Date.parse(event.startDate));assert.ok(event.name);assert.ok(event.location);assert.ok(html.includes(`id="evento-${event.url.split('evento-')[1]}"`),'Event corresponds to visible content');report.schemaEvents++;}
 report.pages.push({route,title,canonical});
}
report.privateFiles=files.filter(f=>/\.(asp|sql|ps1|ini|bak|config)$/i.test(f)||/[\\/](admin|system|novostalentos|node_modules)[\\/]/i.test(f));
assert.equal(report.privateFiles.length,0);assert.equal(report.missingResources.length,0,JSON.stringify(report.missingResources));
const sitemap=await readFile('dist/sitemap-0.xml','utf8');const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);const expectedLocations=16+JSON.parse(await readFile('src/data/artist-profiles.json','utf8')).length+JSON.parse(await readFile('src/data/festivals.json','utf8')).length+JSON.parse(await readFile('src/data/exhibitions.json','utf8')).length;assert.equal(locations.length,expectedLocations);assert.equal(new Set(locations).size,expectedLocations);
for(const location of locations){assert.ok(location.startsWith(origin));assert.ok(!new URL(location).pathname.startsWith('/m/'));assert.ok(await exists(new URL(location)));}
const robots=await readFile('dist/robots.txt','utf8');assert.equal(robots.includes('Allow: /'),production);assert.equal(robots.includes('Disallow: /\n'),!production);
const deployedRobots = await onRequest({
 request: new Request(production ? origin + '/robots.txt' : 'https://preview.cafe-com-letras-pages.pages.dev/robots.txt'),
 next: async () => new Response(null, {status: 404}),
});
assert.equal(await deployedRobots.text(), robots);
if (production) {
 assert.match(robots, /^Disallow: \/concurso-beatles-sinfonico-pitagoras\/$/m);
 const sitemapIndex = /^Sitemap: (\S+)$/m.exec(robots)?.[1];
 assert.equal(sitemapIndex, origin + '/sitemap-index.xml');
 assert.ok(await exists(new URL(sitemapIndex)));
}

const [home, dining, agenda, casa] = await Promise.all(
 ['index.html', 'gastronomia/index.html', 'programacao/index.html', 'casa/index.html']
  .map(file => readFile(path.join(root, file), 'utf8')),
);
assert.match(home, /<details class="menu-m">\s*<summary>/);
assert.ok(home.includes('href="/gastronomia/#cardapio"'));
assert.ok(home.includes('href="/programacao/"'));
assert.ok(home.includes('href="https://reservation.getin.app/36qBovkN?'));
assert.ok(home.includes('href="https://www.ifood.com.br/delivery/belo-horizonte-mg/cafe-com-letras-savassi/b53324c0-32a8-4278-b229-4b362b7847cc"'));
for (const id of ['executivo', 'chef', 'cardapio', 'bar', 'vinhos']) {
 assert.ok(dining.includes(`id="${id}"`), `Âncora de Gastronomia ausente: ${id}`);
 assert.ok(dining.includes(`href="#${id}"`), `Link de seção ausente: ${id}`);
}
for (const category of ['all', 'dj', 'books']) {
 assert.ok(agenda.includes(`data-agenda-filter="${category}"`));
}
assert.ok(agenda.includes('id="agenda"'));
assert.ok(casa.includes('id="visite"'));
assert.match(casa, /<template>\s*<iframe src="https:\/\/www\.google\.com\/maps\?/);
assert.ok(casa.includes('href="https://clubedejazzdocafe.com"'));
assert.ok(casa.includes('href="https://www.instagram.com/ototoibardediscos/"'));
assert.ok(casa.includes('href="https://www.savassifestival.com.br/"'));
assert.ok(!casa.includes('data-demo="Este recurso faz parte da proposta visual'));
const {savassi: months} = JSON.parse(await readFile('src/data/calendar-months.json', 'utf8'));
assert.deepEqual((await readdir(path.join(root, 'data/calendar/savassi'))).sort(),
 months.map(month => `${month}.json`));
const cases=[
 ['/index.asp',301,'/'],['/?unity=Liberdade',301,'/liberdade/'],['/?unity=Savassi',301,'/'],['/?section=menu&subsection=all',301,'/cardapio/'],['/?section=menu&subsection=wine&unity=Liberdade',301,'/liberdade/carta-de-vinhos/'],['/?section=menu&subsection=dessert',301,'/sobremesas/'],['/m/index.asp?unity=Liberdade',301,'/m/liberdade/'],['/index-cardapios.asp',301,'/cardapiodigital/'],['/ajax/menu-card.asp?date=20261119',301,'/?date=20261119#part1'],['/admin/login/',404,null],['/system/connection.asp',404,null],['/novostalentos/files/probe.pdf',404,null],['/?unity=%27%20OR%201%3D1',400,null],['/?section=menu&subsection=invalid',400,null],['/talk-to-us.asp',503,null]
];
for(const [route,status,location] of cases){const r=await onRequest({request:new Request(origin+route),env:{DEPLOY_ENV:'production'},next:async()=>new Response('static')});assert.equal(r.status,status,route);assert.equal(r.headers.get('location'),location,route);report.redirects.push({route,status,location});}
const mobile=await onRequest({request:new Request(origin+'/',{headers:{'User-Agent':'iPhone Mobile'}}),next:async()=>new Response('static')});assert.equal(mobile.status,200);assert.equal(mobile.headers.get('location'),null);
assert.equal(mobile.headers.get('vary'),'User-Agent');
const document = await onRequest({
 request: new Request(origin, {method: 'HEAD'}),
 next: async () => new Response(null, {headers: {'Content-Type': 'text/html; charset=utf-8'}}),
});
const securityHeaders = {
 'X-Content-Type-Options': 'nosniff',
 'X-Frame-Options': 'DENY',
 'Referrer-Policy': 'strict-origin-when-cross-origin',
 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
for (const [name, value] of Object.entries(securityHeaders)) {
 assert.equal(document.headers.get(name), value);
 assert.ok(headers.includes(`  ${name}: ${value}\n`));
}
const enforcedPolicy = document.headers.get('Content-Security-Policy');
assert.ok(enforcedPolicy.includes("object-src 'self'"));
assert.equal(document.headers.get('Content-Security-Policy-Report-Only'),
 enforcedPolicy.replace("object-src 'self'", "object-src 'none'"));
assert.equal(mobile.headers.get('Content-Security-Policy-Report-Only'), null);
assert.equal((await onRequest({request:new Request(origin+'/talk-to-us.asp',{method:'POST'}),next:async()=>new Response('static')})).status,503);
assert.ok(headers.includes("connect-src 'self'"));assert.ok(!headers.includes("script-src 'self' 'unsafe-inline'"));
for(const file of files)assert.ok((await stat(file)).size<=25*1024*1024,'Pages asset limit');
report.passed=true;report.sitemapUrls=locations.length;report.files=files.length;await mkdir('evidencias/fiel',{recursive:true});await writeFile(`evidencias/fiel/artifacts-${info.mode}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,mode:info.mode,pages:pages.length,sitemap:locations.length,redirectTests:cases.length+2,files:files.length,schemaEvents:report.schemaEvents}));
