from common import *

wk=[("Hoje","20h","DJ Poetry","DJ"),("Sáb 21","20h","DJ Xoxottini","DJ"),("Dom 22","18h30","Piano Bar com Luciana Alvarenga","Piano Bar"),("Ter 24","19h","Lançamento: A Conta do Crescimento","Livros"),("Qua 25","20h","Nova Onda: Matheus Avelar Quarteto","Jazz · ao vivo")]
wkrows="".join(f'<a href="Evento.dc.html" style="text-decoration:none;display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;padding:14px 0;border-bottom:1px solid rgba(22,22,20,.18)"><div><div class="tag" style="font-size:11px">{d}</div><div class="mono" style="font-size:14px;margin-top:2px">{h}</div></div><div><div style="font-weight:700;font-size:16px;line-height:1.3">{t}</div><div style="font-size:13px;color:#55534D;margin-top:2px">{k}</div></div></a>' for d,h,t,k in wk)

body = f'''
<div style="width:390px;background:#FAFAF7;position:relative">
<div class="util" style="font-size:12px;padding:8px 20px;display:flex;justify-content:space-between"><span><strong>Aberto hoje</strong> · 12h às 23h</span><span>PT / EN</span></div>
<header style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1.5px solid #161614;background:#FAFAF7"><a href="Main.dc.html" style="line-height:0"><img src="{LOGO_INK}" alt="Café com Letras Savassi" style="height:40px;width:auto"></a><button type="button" aria-label="Abrir menu" style="width:44px;height:44px;border:1.5px solid #161614;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#161614" stroke-width="2" aria-hidden="true"><path d="M3 6h14M3 14h14"/></svg></button></header>

<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-bottom:1.5px solid #161614"><a href="Gastronomia.dc.html" style="text-decoration:none;background:#B83C18;color:#fff;padding:12px 16px;font-weight:700;text-align:center">À mesa</a><a href="Programacao.dc.html" style="text-decoration:none;background:#1D2B53;color:#fff;padding:12px 16px;font-weight:700;text-align:center">No palco</a></div>

<section style="background:#1D2B53;color:#fff;padding:28px 20px 24px">
 <div class="tag" style="opacity:.8;font-size:11px">No palco · hoje, 20h</div>
 <div class="disp" style="font-size:56px;margin-top:10px">DJ Poetry</div>
 <p class="p" style="margin-top:10px;font-size:15px;opacity:.9">R&amp;B, rap, house e afro music. Couvert R$ 8.</p>
 <div class="photo dark" style="height:200px;margin-top:16px">Foto do artista</div>
 <a class="btn w" href="Programacao.dc.html" style="margin-top:16px;width:100%">Ver a programação</a>
</section>
<section style="background:#B83C18;color:#fff;padding:28px 20px 24px">
 <div class="tag" style="opacity:.85;font-size:11px">À mesa · hoje <span class="ex">exemplo</span></div>
 <div class="disp" style="font-size:40px;margin-top:10px">Almoço executivo</div>
 <div style="display:flex;justify-content:space-between;gap:12px;margin-top:12px;font-size:16px;font-weight:600;line-height:1.35"><span>Paillard de filé ao molho madeira, penne e salada</span><span class="mono" style="font-weight:500">R$ 70</span></div>
 <div style="border-top:1.5px solid rgba(255,255,255,.6);margin-top:16px;padding-top:12px;font-size:15px"><span class="tag" style="font-size:11px;opacity:.85">Sugestão do chef</span><br><strong>Moqueca de banana e palmito</strong></div>
 <a class="btn w" href="Gastronomia.dc.html" style="margin-top:16px;width:100%">Ver o cardápio</a>
</section>

<section style="padding:36px 20px 8px"><div class="tag" style="color:#1D2B53;font-size:11px">Programação</div><h2 class="h2" style="font-size:40px;margin-top:8px">Esta semana</h2><div style="margin-top:12px;border-top:1.5px solid #161614">{wkrows}</div><a class="btn" href="Programacao.dc.html" style="margin-top:16px;width:100%">Agenda completa</a></section>

<section style="background:#F6E4DC;padding:36px 20px;margin-top:28px"><div class="tag" style="color:#B83C18;font-size:11px">Gastronomia</div><h2 class="h2" style="font-size:40px;margin-top:8px">Clássicos da casa</h2><div style="margin-top:12px">{rows([("Pão de queijo recheado","canastra e geleia de damasco","R$ 37"),("Tábua Pub","para dividir","R$ 88"),("PF Vegano","","R$ 55",True),("Petit gâteau","","R$ 39")])}</div><a class="btn mesa" href="Gastronomia.dc.html" style="margin-top:16px;width:100%">Cardápio completo</a></section>

<section style="padding:36px 20px"><div class="tag" style="font-size:11px">Em cartaz</div><div class="photo" style="height:220px;margin-top:12px">Foto da exposição</div><div class="h3" style="margin-top:12px;font-size:24px">[Nome da exposição] <span class="ex">a confirmar</span></div><p class="p" style="margin-top:6px;color:#55534D;font-size:15px">Fotografia · até dezembro · entrada livre</p></section>

<section style="background:#161614;color:#FAFAF7;padding:36px 20px"><div class="tag" style="color:#B9B6AE;font-size:11px">Livraria</div><h2 class="h2" style="font-size:40px;margin-top:8px">Livros à mesa</h2><div style="margin-top:16px;border-top:1px solid #4A4844;padding:14px 0"><div class="mono" style="font-size:13px;color:#B9B6AE">Ter, 24/11 · 19h</div><div style="font-weight:700;font-size:17px;margin-top:4px">A Conta do Crescimento · Bárbara Andrade</div></div><div style="border-top:1px solid #4A4844;border-bottom:1px solid #4A4844;padding:14px 0"><div class="mono" style="font-size:13px;color:#B9B6AE">Ter, 01/12 · 19h</div><div style="font-weight:700;font-size:17px;margin-top:4px">O muro caiu, Helena · Luiz Belém</div></div><a class="btn w" href="Livraria.dc.html" style="margin-top:16px;width:100%">Conhecer a livraria</a></section>

<section style="padding:32px 20px 120px;font-size:15px;line-height:1.6"><img src="{LOGO_INK}" alt="Café com Letras Savassi" style="height:44px;width:auto"><p style="margin:14px 0 0">Rua Antônio de Albuquerque, 781<br>Savassi · Belo Horizonte</p><p style="margin:10px 0 0;color:#55534D">Dom a qui 12h às 22h · Sex e sáb 12h às 23h</p></section>

<nav aria-label="Ações rápidas" style="position:sticky;bottom:0;background:#161614;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding:8px 8px 12px;gap:4px">
 <a href="{GETIN}" style="text-decoration:none;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:52px;justify-content:center;font-size:12px;font-weight:600"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/></svg>Reservar</a>
 <a href="{IFOOD}" style="text-decoration:none;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:52px;justify-content:center;font-size:12px;font-weight:600"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6" aria-hidden="true"><path d="M3 7h14l-1.5 9h-11z"/><path d="M7 7a3 3 0 0 1 6 0"/></svg>Delivery</a>
 <a href="{WHATS}" style="text-decoration:none;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:52px;justify-content:center;font-size:12px;font-weight:600"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6" aria-hidden="true"><path d="M4 16l1-3.2A6.5 6.5 0 1 1 7.6 15z"/></svg>WhatsApp</a>
 <a href="Casa.dc.html#visite" style="text-decoration:none;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:52px;justify-content:center;font-size:12px;font-weight:600"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6" aria-hidden="true"><path d="M10 18s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10z"/><circle cx="10" cy="8" r="2"/></svg>Chegar</a>
</nav>
</div>
'''
open(OUT_DIR + '/HomeMobile.dc.html','w').write(page("Café com Letras · Home no celular", body, 390, 4200))
print("ok")
