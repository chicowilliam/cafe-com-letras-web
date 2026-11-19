// Pages Functions: URL compatibility only. No database, secrets or external requests.
import {contentSecurityPolicy} from '../shared/security-policy.ts';
interface Context { request:Request;env?:{DEPLOY_ENV?:string};next:()=>Promise<Response> }
const CANONICAL='https://cafecomletras.com.br';
const units=['Savassi','Liberdade'];
export async function onRequest(context:Context):Promise<Response>{
 const response=await handle(context);const headers=new Headers(response.headers);
 if(['/','/liberdade/','/index.asp'].includes(new URL(context.request.url).pathname))headers.append('Vary','User-Agent');
 headers.set('Content-Security-Policy',contentSecurityPolicy);headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 if(context.env?.DEPLOY_ENV!=='production')headers.set('X-Robots-Tag','noindex, nofollow');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
async function handle(context:Context):Promise<Response>{
 const {request}=context;const url=new URL(request.url);const p=url.pathname;
 const headers=new Headers({'Cache-Control':'no-store'});
 if(context.env?.DEPLOY_ENV!=='production')headers.set('X-Robots-Tag','noindex, nofollow');
 const response=(text:string,status:number)=>new Response(text,{status,headers:new Headers([...headers,['Content-Type','text/plain; charset=utf-8']])});
 const redirect=(target:string,status=301,unit?:string)=>{const h=new Headers(headers);h.set('Location',target);if(unit)h.append('Set-Cookie',`unity=${unit}; Path=/; Max-Age=604800; SameSite=Lax${url.protocol==='https:'?'; Secure':''}`);return new Response(null,{status,headers:h});};
 if(url.hostname==='www.cafecomletras.com.br')return redirect(CANONICAL+p+url.search);
 if(url.hostname==='m.cafecomletras.com.br')return redirect(CANONICAL+(p.startsWith('/m/')?p:'/m'+p)+url.search);
 if(url.hostname==='linktree.cafecomletras.com.br')return redirect(CANONICAL+(p.startsWith('/linktree/')?p:'/linktree'+p)+url.search);
 let decoded:string;try{decoded=decodeURIComponent(p);}catch{return response('Endereço inválido.',400);}
 if(/[\u0000-\u001f\\]/.test(decoded)||decoded.split('/').some(x=>x==='..'))return response('Endereço inválido.',400);
 if(/^\/(admin|system|novostalentos|concurso-[^/]+)(\/|$)/i.test(decoded)||/\.(sql|ini|config|bak|ps1)$/i.test(decoded)){headers.set('X-Robots-Tag','noindex');return response('Não encontrado.',404);}
 if(!['GET','HEAD'].includes(request.method))return response('Este envio depende de um serviço ainda não habilitado.',503);
 const cookie=/(?:^|;\s*)unity=(Savassi|Liberdade)(?:;|$)/.exec(request.headers.get('cookie')||'')?.[1];
 const requested=url.searchParams.get('unity');if(requested&&!units.includes(requested))return response('Unidade inválida.',400);
 const unit=requested||(p.includes('/liberdade/')?'Liberdade':(p.endsWith('.asp')||url.searchParams.has('section'))?cookie||'Savassi':'Savassi');
 const base=unit==='Liberdade'?'/liberdade/':'/';const mobileBase=unit==='Liberdade'?'/m/liberdade/':'/m/';
 const section=url.searchParams.get('section'),subsection=url.searchParams.get('subsection')||'all';
 if(section&&section!=='menu')return response('Seção inválida.',400);
 if(section==='menu'&&!['all','wine','dessert'].includes(subsection))return response('Cardápio inválido.',400);
 if(/^\/ajax\/(calendar|menu|menu-card)\.asp$/i.test(p)){
  const retained=new URLSearchParams();for(const key of ['date','calendar']){const v=url.searchParams.get(key);if(v&&/^\d{8}$/.test(v))retained.set(key,v);}
  return redirect(base+(retained.size?'?'+retained:'')+(p.includes('calendar')?'#part2':'#part1'),301,unit);
 }
 if(p.startsWith('/ajax/')||p==='/talk-to-us.asp'){headers.set('X-Robots-Tag','noindex');return response('Funcionalidade indisponível neste ambiente estático.',p.startsWith('/ajax/')?404:503);}
 if(p==='/index-cardapios.asp')return redirect(base+'cardapiodigital/',301,unit);
 if(p.endsWith('/cardapiodigital/index.asp'))return redirect(base+'cardapiodigital/',301,unit);
 const legacy=['/','/index.asp','/m','/m/','/m/index.asp','/m/liberdade/','/liberdade/'].includes(p);
 if(legacy){
  if(section==='menu')return redirect((unit==='Liberdade'?'/liberdade':'')+({all:'/cardapio/',wine:'/carta-de-vinhos/',dessert:'/sobremesas/'}[subsection]||'/cardapio/'),301,unit);
  const isMobile=p.startsWith('/m');const target=isMobile?mobileBase:base;
  if(requested||p.endsWith('.asp')||p==='/m'||p!==target)return redirect(target,301,unit);
  if(!isMobile&&/Android|iPhone|iPod|Windows Phone|Mobile/i.test(request.headers.get('user-agent')||''))return redirect(mobileBase,302,unit);
 }
 return context.next();
}
