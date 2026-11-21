import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {pagePath} from '../src/lib/routes.ts';
import {whatsapp,whatsappUrl} from '../src/config/whatsapp.ts';

const officialNumber=whatsapp.number;
const expectedMessage=whatsapp.message;
const contextualMessages=new Set([expectedMessage,'Olá! Gostaria de informações sobre um evento privado no Café com Letras.','Olá! Gostaria de informações sobre privacidade no site do Café com Letras.']);
const eventShare='Matheus Avelar Quarteto · 25/11/2026, 20h — https://cafecomletras.com.br/evento/';
assert.match(officialNumber,/^\d{10,15}$/);
assert.ok(expectedMessage.trim(),'Configured WhatsApp message must not be empty');
function checkPublishedLink(link,label){
 link=link.replaceAll('&amp;','&');
 const url=new URL(link);
 if(url.origin==='https://api.whatsapp.com'&&url.pathname==='/send'&&!url.searchParams.has('phone')){assert.equal(url.searchParams.get('text'),eventShare,label);assert.deepEqual([...url.searchParams.keys()],['text']);return;}
 if(url.origin==='https://wa.me'){assert.equal(url.pathname,'/'+officialNumber,label);assert.ok(contextualMessages.has(url.searchParams.get('text')),label);assert.deepEqual([...url.searchParams.keys()],['text'],label);return;}
 assert.equal(url.origin,'https://api.whatsapp.com',label);
 assert.equal(url.pathname,'/send',label);
 assert.equal(url.searchParams.get('phone'),officialNumber,label);
 assert.equal(url.searchParams.get('text'),expectedMessage,label);
 assert.deepEqual([...url.searchParams.keys()],['phone','text'],label);
 assert.equal(link,whatsappUrl,label+' URL encoding');
}
const links=text=>[...text.matchAll(/(?:https?:\/\/)?(?:www\.)?(?:wa\.me|(?:(?:api|web)\.)?whatsapp\.com)\/[^\s"'<>]*/gi)].map(match=>match[0]);
function checkSource(value,label){
 if(typeof value==='string')for(const link of links(value)){
  const url=new URL(link);
  assert.equal(url.origin,'https://wa.me',label);
  assert.match(url.pathname,/^\/\d+$/,label);
 }
 else if(Array.isArray(value))value.forEach((item,index)=>checkSource(item,`${label}[${index}]`));
 else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))checkSource(item,`${label}.${key}`);
}
const snapshots=JSON.parse(await readFile('src/data/page-snapshots.json','utf8'));
checkSource(snapshots,'page-snapshots');
checkSource(JSON.parse(await readFile('src/data/public-source.json','utf8')),'public-source');
async function files(dir){const result=[];for(const item of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);result.push(...(item.isDirectory()?await files(file):[file]));}return result;}
let count=0,pages=0;
for(const file of (await files('dist')).filter(file=>/\.(html|js|json)$/i.test(file))){
 const text=await readFile(file,'utf8');
 for(const link of links(text))checkPublishedLink(link,`${file}: WhatsApp URL`);
 if(!file.endsWith('.html'))continue;
 const route='/'+path.relative('dist',file).split(path.sep).join('/').replace(/index\.html$/,'');
 const snapshot=snapshots.find(snapshot=>pagePath(snapshot.key)===route);
 const anchors=[...text.matchAll(/<a\b[^>]*>/gi)].map(match=>match[0]).filter(tag=>/wa\.me|whatsapp/i.test(tag));
 if(snapshot&&!text.includes('data-design="claude"'))assert.equal(anchors.length,links(snapshot.body).length,`${route}: existing WhatsApp links preserved`);
 if(anchors.length)pages++;
 for(const tag of anchors){
  const href=/href="([^"]*)"/i.exec(tag)?.[1];
  assert.ok(href,`${route}: WhatsApp href`);
  checkPublishedLink(href,`${route}: official WhatsApp destination and message`);
  if(/target="_blank"/i.test(tag)){
   const rel=/rel="([^"]*)"/i.exec(tag)?.[1].split(/\s+/)||[];
   assert.ok(rel.includes('noopener')&&rel.includes('noreferrer'),`${route}: safe new tab`);
  }
  count++;
 }
}
assert.ok(count>0,'Existing WhatsApp controls must remain in the build');
console.log(JSON.stringify({whatsapp:'passed',pages,existingLinks:count,number:officialNumber,message:expectedMessage}));
