from common import *

pair=[("Hora da Estrela","drink autoral","R$ 42"),("Tábua Pub","para dividir","R$ 88"),("Dadinhos veganos","petisco vegano","R$ 25"),("Petit gâteau","sobremesa da casa","R$ 39")]
paircards="".join(f'<a href="Gastronomia.dc.html" style="text-decoration:none;background:#fff;border:1.5px solid #161614;display:block"><div class="photo" style="height:150px">Foto</div><div style="padding:18px"><div style="font-weight:700;font-size:18px">{n}</div><div style="font-size:14px;color:#55534D;margin-top:4px">{d}</div><div class="mono" style="margin-top:10px">{p}</div></div></a>' for n,d,p in pair)

more=[("Qui 26 · 19h","Vinyl Land 18 anos: DJ Bob G (SP)","DJ · vinil"),("Sex 27 · 20h","Vinyl Land 18 anos: Rafa Jazz (SP)","DJ · vinil"),("Sáb 28 · 13h30","Afro-Sambas, por Vinicius Mendes e Rodrigo Torino Quarteto","Bossa Nova")]
morecards="".join(f'<a href="Programacao.dc.html" style="text-decoration:none;display:block;border-top:3px solid #1D2B53;padding-top:16px"><div class="photo dark" style="height:200px;margin-bottom:16px">Foto do artista</div><div class="mono" style="font-size:14px;color:#1D2B53">{d}</div><div class="h3" style="font-size:24px;margin-top:6px">{t}</div><div style="font-size:14px;color:#55534D;margin-top:6px">{k}</div></a>' for d,t,k in more)

body = header("Programação") + f'''
<main>
<div class="wrap" style="padding-top:24px;padding-bottom:24px;font-size:14px;color:#55534D"><a href="Programacao.dc.html">Programação</a> / Jazz / Nova Onda</div>
<section class="wrap" style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:56px;padding-bottom:96px">
 <div class="photo dark" style="min-height:720px">Foto do artista · Matheus Avelar Quarteto</div>
 <div style="display:flex;flex-direction:column;gap:28px">
  <div><div class="tag" style="color:#1D2B53">Jazz · Série Nova Onda</div><h1 class="disp" style="font-size:84px;margin-top:14px">Matheus Avelar Quarteto</h1></div>
  <div style="background:#1D2B53;color:#fff;padding:28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px">
   <div><div class="tag" style="opacity:.75">Quando</div><div style="font-weight:700;font-size:20px;margin-top:6px">Quarta, 25/11</div></div>
   <div><div class="tag" style="opacity:.75">Horário</div><div style="font-weight:700;font-size:20px;margin-top:6px">20h</div></div>
   <div><div class="tag" style="opacity:.75">Couvert</div><div style="font-weight:700;font-size:20px;margin-top:6px">R$ 15</div></div>
  </div>
  <div class="acts"><a class="btn palco" href="{GETIN}">Reservar mesa para esta noite</a><a class="btn" href="#lembrete">Adicionar à agenda</a><a class="btn" href="{WHATS}">Compartilhar</a></div>
  <a href="{YT}" style="text-decoration:none;display:flex;gap:16px;align-items:center;border:1.5px solid #1D2B53;padding:18px 20px"><span style="width:12px;height:12px;border-radius:50%;background:#C8102E;flex:none"></span><span><strong>Ao vivo no YouTube</strong><br><span style="font-size:14px;color:#55534D">Transmissão às 20h no canal @cafecomletrastv</span></span></a>
  <div><div class="tag" style="margin-bottom:10px">Sobre o show</div><p class="lead">Matheus Avelar é pianista, compositor e arranjador de Belo Horizonte e estudante de Música Popular na UFMG.</p><p class="p" style="margin-top:14px">À frente de seu quarteto, apresenta composições autorais na linguagem do jazz contemporâneo, com influências que vão de Tom Jobim e Toninho Horta a Robert Glasper, Kendrick Scott, Dani Gurgel e Makoto Ozone.</p></div>
  <div><div class="tag" style="margin-bottom:6px">Formação</div>{rows([("Matheus Avelar","piano",""),("[Nome]","[instrumento] · do release",""),("[Nome]","[instrumento] · do release",""),("[Nome]","[instrumento] · do release","")])}</div>
 </div>
</section>

<section style="background:#F6E4DC;padding:80px 0">
 <div class="wrap"><div style="display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:32px"><div><div class="tag" style="color:#B83C18">Para acompanhar o show</div><h2 class="h2" style="margin-top:12px">Da cozinha e do bar</h2></div><a class="btn mesa" href="Gastronomia.dc.html">Ver o cardápio completo</a></div><div class="grid4">{paircards}</div></div>
</section>

<section class="wrap" style="padding-top:80px;padding-bottom:96px">
 <h2 class="h2" style="margin-bottom:32px">Mais nesta semana</h2>
 <div class="grid3">{morecards}</div>
</section>
</main>
''' + footer()

open(OUT_DIR + '/Evento.dc.html','w').write(page("Café com Letras · Evento", body, 1440, 2500))
print("ok")
