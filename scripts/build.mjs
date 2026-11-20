import {spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sanitizeHTML from 'sanitize-html';

// This repository targets Pages. Stop a duplicate Workers Builds pipeline before deployment.
if(process.env.WORKERS_CI==='1'||process.env.WORKERS_CI_BUILD_UUID){
 console.error('Pages-only project: Workers Builds is intentionally blocked before deployment.');
 process.exit(1);
}

// Agenda regression tests write fictional records only to the OS temporary directory.
const agendaTests=spawnSync(process.execPath,['tests/programacao.mjs'],{stdio:'inherit'});
if(agendaTests.status!==0)process.exit(agendaTests.status||1);

const production=!process.argv.includes('--preview')&&(process.argv.includes('--production')||process.env.DEPLOY_ENV==='production');
const mode=production?'production':'preview';
const data=JSON.parse(await readFile('src/data/public-source.json','utf8'));
const monthIndex=Object.fromEntries(data.units.map(unit=>[unit.unity_unity.toLowerCase(),[...new Set(data.events.filter(e=>e.calendar_unity===unit.unity_id).map(e=>e.calendar_date.slice(0,6)))].sort()]));
await writeFile('src/data/calendar-months.json',JSON.stringify(monthIndex));
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit',env:{...process.env,DEPLOY_ENV:mode,ASTRO_TELEMETRY_DISABLED:'1'}});
if(result.status!==0)process.exit(result.status||1);
const rich=text=>sanitizeHTML(String(text),{allowedTags:['p','br','strong','b','em','i','u','s','span','ul','ol','li','a','blockquote'],allowedAttributes:{a:['href','title','target','rel']},allowedSchemes:['http','https','mailto','tel'],allowProtocolRelative:false,transformTags:{a:sanitizeHTML.simpleTransform('a',{rel:'noopener noreferrer'})}});
const artists=new Map(data.artists.map(a=>[a.artist_id,{...a,artist_release:rich(a.artist_release)}]));
let chunks=0;
for(const unit of data.units){
 const root=`dist/data/calendar/${unit.unity_unity.toLowerCase()}`;await mkdir(root,{recursive:true});
 const months=new Map();
 for(const event of data.events.filter(e=>e.calendar_unity===unit.unity_id)){const month=event.calendar_date.slice(0,6);if(!months.has(month))months.set(month,[]);months.get(month).push(event);}
 for(const [month,events] of months){const selected=[...new Set(events.map(e=>e.calendar_artist))].map(id=>artists.get(id)).filter(Boolean);await writeFile(`${root}/${month}.json`,JSON.stringify({events,artists:selected}));chunks++;}
}
await mkdir('dist/data',{recursive:true});
await writeFile('dist/data/menu.json',JSON.stringify({suggestions:data.suggestions,plates:data.plates,suggestionRelations:data.suggestionRelations}));
const jsonHashes=new Set();
async function walk(dir){let out=[];for(const item of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())out.push(...await walk(file));else out.push(file);}return out;}
const files=await walk('dist');
for(const file of files.filter(f=>f.endsWith('.html'))){const html=await readFile(file,'utf8');for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))jsonHashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);}
const csp=`default-src 'none'; script-src 'self' ${[...jsonHashes].join(' ')}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self'; object-src 'self'; base-uri 'none'; form-action ${production?'https://25.idmkt8.com':"'none'"}; frame-ancestors 'none'`;
await mkdir('shared',{recursive:true});
await writeFile('shared/security-policy.ts',`// Generated public response policy. No credentials.\nexport const contentSecurityPolicy=${JSON.stringify(csp)};\n`);
await writeFile('dist/_headers',`/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n\nhttps://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n\n/404.html\n  X-Robots-Tag: noindex\n\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
await writeFile('dist/_redirects',`# Query-string and mobile compatibility is handled by functions/_middleware.ts.\nhttps://www.cafecomletras.com.br/* https://cafecomletras.com.br/:splat 301\nhttps://m.cafecomletras.com.br/* https://cafecomletras.com.br/m/:splat 301\nhttps://linktree.cafecomletras.com.br/* https://cafecomletras.com.br/linktree/:splat 301\n/medidas-prevencao /medidas-prevencao/medidas-prevencao.pdf 301\n/medidas-prevencao/ /medidas-prevencao/medidas-prevencao.pdf 301\n/linktree/index.asp /linktree/ 301\n/delivery/index.asp /delivery/ 301\n/index.html / 301\n/gastronomia.html /gastronomia/ 301\n/programacao.html /programacao/ 301\n/evento.html /evento/ 301\n/livraria.html /livraria/ 301\n/casa.html /casa/ 301\n/celular.html /celular/ 301\n`);
await writeFile('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/_astro/*','/css/*','/fonts/*','/img/*','/svg/*','/optimized/*','/brand/*','/data/*','/medidas-prevencao/*']},null,2));
const tooLarge=[];for(const file of files)if((await stat(file)).size>25*1024*1024)tooLarge.push(file);
if(tooLarge.length)throw new Error('Asset excede o limite de 25 MiB do Pages.');
await writeFile('dist/build-info.json',JSON.stringify({mode,builtAt:new Date().toISOString(),sourceExportedAt:data.exportedAt,calendarChunks:chunks,dataSHA256:createHash('sha256').update(await readFile('src/data/public-source.json')).digest('hex')},null,2));
console.log(`Artefatos Pages: ${mode}; ${chunks} meses de agenda; somente conteúdo público.`);
