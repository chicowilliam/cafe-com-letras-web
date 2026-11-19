// Loopback-only static preview, including the same Pages URL middleware. No outbound fetch.
import http from 'node:http';import path from 'node:path';import {readFile,stat} from 'node:fs/promises';
import {onRequest} from '../functions/_middleware.ts';
const root=path.resolve('dist');const port=Number(process.env.PORT||4321);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.pdf':'application/pdf'};
const headersText=await readFile('dist/_headers','utf8');const csp=/Content-Security-Policy: (.+)/.exec(headersText)?.[1]?.replace(/form-action [^;]+/,"form-action 'none'");
const server=http.createServer(async(req,res)=>{try{
 if(!['localhost:'+port,'127.0.0.1:'+port].includes(req.headers.host||'')){res.writeHead(403);res.end();return;}
 const url=new URL(req.url,'http://localhost:'+port);
 const request=new Request(url,{method:req.method,headers:req.headers});
 const response=await onRequest({request,env:{DEPLOY_ENV:'preview'},next:async()=>{
  let name=decodeURIComponent(url.pathname);let status=200;
  if(name==='/medidas-prevencao/'||name==='/medidas-prevencao')return new Response(null,{status:301,headers:{Location:'/medidas-prevencao/medidas-prevencao.pdf'}});
  if(name==='/linktree/index.asp'||name==='/delivery/index.asp')return new Response(null,{status:301,headers:{Location:name.replace('index.asp','')}});
  let file=path.resolve(root,'.'+name);if(file!==root&&!file.startsWith(root+path.sep))return new Response(null,{status:400});
  try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');await stat(file);}catch{file=path.join(root,'404.html');status=404;}
  return new Response(await readFile(file),{status,headers:{'Content-Type':path.extname(file).toLowerCase()==='.webp'?'image/webp':mime[path.extname(file).toLowerCase()]||'application/octet-stream'}});
 }});
 const headers=Object.fromEntries(response.headers);headers['x-robots-tag']='noindex, nofollow';headers['x-content-type-options']='nosniff';if(csp)headers['content-security-policy']=csp;
 res.writeHead(response.status,headers);res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'Content-Type':'text/plain','X-Robots-Tag':'noindex'});res.end('Falha na prévia local.');}});
server.listen(port,'127.0.0.1',()=>console.log(`Prévia isolada: http://localhost:${port} — Ctrl+C encerra.`));
