from common import *

lanc=[("Ter","24/11","19h","A Conta do Crescimento","Bárbara Andrade","Finanças para quem empreende: a autora, CFO e mentora, propõe trocar a pergunta “onde consigo dinheiro?” por “qual conta minha empresa está preparada para pagar?”."),("Ter","01/12","19h","O muro caiu, Helena","Luiz Belém",""),("Sáb","05/12","11h","Pra te lembrar da vida","Tayná","")]
lanccards="".join(f'<div style="display:grid;grid-template-columns:220px minmax(0,1fr) 200px;gap:32px;padding:28px 0;border-top:1.5px solid #161614;align-items:start"><div><div class="tag">{dw}</div><div class="disp" style="font-size:56px">{d}</div><div class="mono" style="margin-top:4px">{h}</div></div><div><div class="h3" style="font-size:34px">{t}</div><div style="font-size:17px;margin-top:6px;color:#3F3D38">{a}</div>{f"<p class=\"p\" style=\"margin-top:12px;color:#55534D;max-width:620px\">{x}</p>" if x else ""}</div><div class="photo" style="height:250px">Capa do livro</div></div>' for dw,d,h,t,a,x in lanc)

body = header("Livraria") + f'''
<main>
<section style="background:#161614;color:#FAFAF7">
 <div class="wrap grid2" style="gap:56px;padding-top:72px;padding-bottom:80px;align-items:end">
  <div><div class="tag" style="color:#B9B6AE">Livraria do Café</div><h1 class="disp" style="font-size:150px;margin-top:16px">Livros à mesa</h1></div>
  <div><p class="lead" style="font-size:22px;color:#D6D3CB">Desde 1996 os livros dividem o salão com a cozinha e a música. A livraria recebe lançamentos, clubes de leitura e conversas com autores.</p><p class="p" style="margin-top:16px;color:#B9B6AE">Os livros estão à venda na loja, para folhear à mesa ou levar para casa.</p></div>
 </div>
 <div class="photo" style="height:420px;background:#3A3936;color:#B9B6AE;max-width:1360px;margin:0 auto">Foto: estantes e salão do Café</div>
 <div style="height:80px"></div>
</section>

<section class="wrap" style="padding-top:96px;padding-bottom:64px">
 <div style="display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:24px"><div><div class="tag">Agenda da livraria</div><h2 class="h2" style="margin-top:12px">Próximos lançamentos</h2></div><a class="btn ink" href="{GETIN}">Reservar lugar</a></div>
 {lanccards}
 <div style="border-top:1.5px solid #161614"></div>
</section>

<section style="background:#EDEBE4;padding:96px 0">
 <div class="wrap">
  <div class="tag">Leitura em grupo</div><h2 class="h2" style="margin-top:12px;margin-bottom:40px">Clubes de leitura</h2>
  <div class="grid2" style="gap:32px">
   <div style="background:#fff;border:1.5px solid #161614;padding:36px"><div class="h3" style="font-size:36px">Clube de Leitura Mulherio</div><p class="p" style="margin-top:12px;color:#55534D">Encontros para ler e conversar sobre livros de autoras.</p><div class="tag" style="margin:28px 0 6px">Leituras recentes</div>{rows([("Autobiografia do Vermelho","Anne Carson · 03/11",""),("A Casa dos Espíritos","Isabel Allende · 08/11","")])}<a class="btn" href="{WHATS}" style="margin-top:24px">Quero participar</a></div>
   <div style="background:#fff;border:1.5px solid #161614;padding:36px"><div class="h3" style="font-size:36px">Contraponto de encontro: lendo os clássicos</div><p class="p" style="margin-top:12px;color:#55534D">Um clássico por encontro, lido e discutido em grupo.</p><div class="tag" style="margin:28px 0 6px">Leitura recente</div>{rows([("Contos de Sebastopol","10/11","")])}<a class="btn" href="{WHATS}" style="margin-top:24px">Quero participar</a></div>
  </div>
 </div>
</section>

<section class="wrap" style="padding-top:96px;padding-bottom:96px">
 <div class="tag">Passaram por aqui</div><h2 class="h2" style="margin-top:12px;margin-bottom:32px">Lançamentos recentes</h2>
 <div class="grid4">
  <div><div class="photo" style="height:300px">Capa</div><div class="mono" style="font-size:14px;margin-top:14px">17/11</div><div class="h3" style="font-size:22px;margin-top:4px">O dragão sob o céu: Direito, Soberania e Socialismo na China</div><div style="color:#55534D;margin-top:4px">Silvio Almeida</div></div>
  <div><div class="photo" style="height:300px">Capa</div><div class="mono" style="font-size:14px;margin-top:14px">14/11</div><div class="h3" style="font-size:22px;margin-top:4px">Papai Tone</div><div style="color:#55534D;margin-top:4px">Mário Xavier</div></div>
  <div style="grid-column:span 2;background:#161614;color:#FAFAF7;padding:40px;display:flex;flex-direction:column;justify-content:space-between;gap:24px"><div><div class="tag" style="color:#B9B6AE">Para autores e editoras</div><div class="h2" style="font-size:48px;margin-top:12px">Lance seu livro no Café</div><p class="p" style="margin-top:14px;color:#D6D3CB">Lançamentos com ou sem buffet. Conte sobre o seu livro e a gente responde.</p></div><a class="btn w" href="{WHATS}" style="align-self:flex-start">Propor um lançamento</a></div>
 </div>
</section>
</main>
''' + footer()

open(OUT_DIR + '/Livraria.dc.html','w').write(page("Café com Letras · Livraria", body, 1440, 2900))
print("ok")
