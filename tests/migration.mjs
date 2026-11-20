import assert from 'node:assert/strict';
import {onRequest} from '../functions/_middleware.ts';
const origin='https://cafecomletras.com.br';
const next=async()=>new Response('<meta name="robots" content="noindex, nofollow"><body data-production="false">',{headers:{'Content-Type':'text/html'}});
for(const host of ['http://cafecomletras.com.br','https://www.cafecomletras.com.br','https://cafe-com-letras-pages.pages.dev']){
 const response=await onRequest({request:new Request(host+'/cardapio/?date=20261120'),next});
 assert.equal(response.status,301);
 assert.equal(response.headers.get('Location'),origin+'/cardapio/?date=20261120');
}
for(const [host,indexable] of [[origin,true],['https://abcdef.cafe-com-letras-pages.pages.dev',false]]){
 const response=await onRequest({request:new Request(host+'/cardapio/'),next});
 assert.equal(response.headers.has('X-Robots-Tag'),!indexable);
 assert.match(await response.text(),indexable?/content="index, follow/:/content="noindex, nofollow/);
 const robots=await onRequest({request:new Request(host+'/robots.txt'),next});
 assert.equal((await robots.text()).includes('Allow: /'),indexable);
}
console.log('Migration checks passed: HTTPS, www, pages.dev, path/query, robots and host indexing.');
