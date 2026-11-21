// Pages Functions: URL compatibility only. No database, secrets or external requests.
import {legalReview} from '../src/config/institutional.ts';
import {contentSecurityPolicy} from '../shared/security-policy.ts';
interface Context { request:Request;env?:{DEPLOY_ENV?:string};next:()=>Promise<Response> }
const CANONICAL='https://cafecomletras.com.br';
const units=['Savassi','Liberdade'];
export async function onRequest(context:Context):Promise<Response>{
 const url=new URL(context.request.url);
 const official=url.hostname==='cafecomletras.com.br'&&url.protocol==='https:';
 const response=url.pathname==='/robots.txt'&&['GET','HEAD'].includes(context.request.method)
  ? new Response(official?'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /system/\nDisallow: /ajax/\nDisallow: /novostalentos/\nSitemap: https://cafecomletras.com.br/sitemap-index.xml\n':'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}})
  : await handle(context);const headers=new Headers(response.headers);
 if(['/','/liberdade/','/index.asp'].includes(new URL(context.request.url).pathname))headers.append('Vary','User-Agent');
 headers.set('Content-Security-Policy',contentSecurityPolicy);headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 const indexable=official&&response.status===200&&!['/404.html','/celular/','/evento/','/politica-de-privacidade/','/politica-de-cookies/','/termos-de-uso/'].includes(url.pathname);
 if(indexable)headers.delete('X-Robots-Tag');else headers.set('X-Robots-Tag','noindex, nofollow');
 let body:BodyInit|null=response.body;
 if(headers.get('Content-Type')?.includes('text/html')&&context.request.method!=='HEAD'){
  body=(await response.text()).replace(/(<meta\s+name="robots"\s+content=")[^"]*(")/i,`$1${indexable?'index, follow, max-image-preview:large':'noindex, nofollow'}$2`)
   .replace(/data-production="(?:true|false)"/,`data-production="${official?'true':'false'}"`);
  headers.delete('Content-Length');headers.delete('ETag');
 }
 return new Response(context.request.method==='HEAD'?null:body,{status:response.status,statusText:response.statusText,headers});
}
async function handle(context:Context):Promise<Response>{
 const {request}=context;const url=new URL(request.url);const p=url.pathname;
 const headers=new Headers({'Cache-Control':'no-store'});
 if(url.hostname!=='cafecomletras.com.br')headers.set('X-Robots-Tag','noindex, nofollow');
 const response=(text:string,status:number)=>new Response(text,{status,headers:new Headers([...headers,['Content-Type','text/plain; charset=utf-8']])});
 const redirect=(target:string,status=301,unit?:string)=>{const h=new Headers(headers);h.set('Location',target);if(unit&&url.searchParams.has('unity'))h.append('Set-Cookie',`unity=${unit}; Path=/; Max-Age=604800; SameSite=Lax${url.protocol==='https:'?'; Secure':''}`);return new Response(null,{status,headers:h});};
 if(url.hostname==='cafecomletras.com.br'&&url.protocol==='http:')return redirect(CANONICAL+p+url.search);
 if(url.hostname==='cafe-com-letras-pages.pages.dev')return redirect(CANONICAL+p+url.search);
 if(url.hostname==='www.cafecomletras.com.br')return redirect(CANONICAL+p+url.search);
 if(url.hostname==='m.cafecomletras.com.br')return redirect(CANONICAL+(p.startsWith('/m/')?p:'/m'+p)+url.search);
 if(url.hostname==='linktree.cafecomletras.com.br')return redirect(CANONICAL+(p.startsWith('/linktree/')?p:'/linktree'+p)+url.search);
 let decoded:string;try{decoded=decodeURIComponent(p);}catch{return response('Endereço inválido.',400);}
 if(/[\u0000-\u001f\\]/.test(decoded)||decoded.split('/').some(x=>x==='..'))return response('Endereço inválido.',400);
 if(/^\/(admin|system|novostalentos|concurso-[^/]+)(\/|$)/i.test(decoded)||/\.(sql|ini|config|bak|ps1)$/i.test(decoded)){headers.set('X-Robots-Tag','noindex');return response('Não encontrado.',404);}
 if(url.hostname==='cafecomletras.com.br'&&!legalReview.approved&&/^\/(politica-de-privacidade|politica-de-cookies|termos-de-uso)(?:\/|\.html|$)/i.test(decoded))return response('Documento em revisão; publicação ainda não autorizada.',404);
 if(!['GET','HEAD'].includes(request.method))return response('Este envio depende de um serviço ainda não habilitado.',503);
 const cookie=/(?:^|;\s*)unity=(Savassi|Liberdade)(?:;|$)/.exec(request.headers.get('cookie')||'')?.[1];
 const requested=url.searchParams.get('unity');if(requested&&!units.includes(requested))return response('Unidade inválida.',400);
 const unit=requested||(p.includes('/liberdade/')?'Liberdade':(p.endsWith('.asp')||url.searchParams.has('section'))?cookie||'Savassi':'Savassi');
 const base=unit==='Liberdade'?'/liberdade/':'/';const mobileBase=unit==='Liberdade'?'/m/liberdade/':'/m/';
 const designAlias=/^\/(index|gastronomia|programacao|evento|livraria|casa|celular)\.html$/.exec(p);
 if(designAlias)return redirect(designAlias[1]==='index'?'/':'/'+designAlias[1]+'/',301);
 const aliases:Record<string,string>={'/liberdade/index.asp':'/liberdade/','/m/liberdade/index.asp':'/m/liberdade/','/linktree/index.asp':'/linktree/','/delivery/index.asp':'/delivery/'};
 if(aliases[p])return redirect(aliases[p]);
 // Carta de vinhos da Savassi agora fica na página Gastronomia, no padrão do cardápio.
 if(p==='/carta-de-vinhos/'||p==='/carta-de-vinhos')return redirect('/gastronomia/#vinhos',302);
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
  if(section==='menu')return redirect((unit==='Liberdade'?'/liberdade':'')+({all:'/cardapio/',wine:unit==='Liberdade'?'/carta-de-vinhos/':'/gastronomia/#vinhos',dessert:'/sobremesas/'}[subsection]||'/cardapio/'),301,unit);
  if(unit==='Savassi'&&p.startsWith('/m')&&!section)return redirect('/'+url.hash,301,unit);
  const isMobile=p.startsWith('/m');const target=isMobile?mobileBase:base;
  if(requested||p.endsWith('.asp')||p==='/m'||p!==target)return redirect(target,301,unit);
  if(unit==='Liberdade'&&!isMobile&&/Android|iPhone|iPod|Windows Phone|Mobile/i.test(request.headers.get('user-agent')||''))return redirect(mobileBase,302,unit);
 }
 return context.next();
}
