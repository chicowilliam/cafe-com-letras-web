from common import *

eco=[("Clube de Jazz do Café com Letras","Palco de jazz e música instrumental na Savassi."),("Ototoi","Bar de discos: vinil e drinks, eventos e DJs."),("Savassi Festival","Festival de jazz e música instrumental, desde 2003."),("Jornal Letras","O jornal cultural da casa.")]
ecocards="".join(f'<a href="#" style="text-decoration:none;display:block;border-top:3px solid #FAFAF7;padding-top:16px"><div class="h3" style="font-size:24px">{n}</div><p class="p" style="margin-top:8px;color:#B9B6AE">{d}</p></a>' for n,d in eco)

def field(i,l,t="text",ph=""):
    return f'<div style="display:flex;flex-direction:column;gap:6px"><label for="{i}" style="font-weight:600;font-size:14px">{l}</label><input id="{i}" type="{t}" placeholder="{ph}" style="min-height:48px;border:1.5px solid #161614;padding:0 14px;font-size:16px;background:#fff;font-family:inherit"></div>'

body = header("A Casa") + f'''
<main>
<section class="wrap" style="padding-top:80px;padding-bottom:80px">
 <div class="tag">A Casa · desde 1996</div>
 <h1 class="disp" style="font-size:180px;margin-top:16px">30 anos<br>de Savassi</h1>
 <div class="grid2" style="gap:64px;margin-top:56px">
  <div class="photo" style="height:520px">Foto histórica da casa</div>
  <div style="display:flex;flex-direction:column;gap:18px">
   <p class="lead" style="font-size:24px">A história do Café com Letras começa em 1996, com um sonho de três amigos de faculdade, Bruno, Cilza e Beto: um café onde livros, uma boa cozinha e encontros culturais convivessem.</p>
   <p class="p">Beto passou em frente a uma casa na Rua Antônio de Albuquerque, no coração da Savassi, e convenceu os amigos de que aquele era o lugar. Hoje Bruno Golgher segue à frente da casa.</p>
   <p class="p">Do Café nasceram projetos que hoje fazem parte da vida cultural de Belo Horizonte, como o Savassi Festival, o Clube de Jazz e a Ototoi.</p>
  </div>
 </div>
</section>

<section style="border-top:1.5px solid #161614;border-bottom:1.5px solid #161614">
 <div class="wrap" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0">
  <div style="padding:40px 32px 40px 0;border-right:1.5px solid #161614"><div class="disp" style="font-size:88px">1996</div><p class="p" style="margin-top:8px">Abre o Café com Letras, na Savassi.</p></div>
  <div style="padding:40px 32px;border-right:1.5px solid #161614"><div class="disp" style="font-size:88px">2003</div><p class="p" style="margin-top:8px">Primeira edição do Savassi Festival.</p></div>
  <div style="padding:40px 0 40px 32px"><div class="disp" style="font-size:88px;color:#B83C18">2026</div><p class="p" style="margin-top:8px">30 anos de gastronomia, música e literatura.</p></div>
 </div>
</section>

<section id="visite" class="wrap" style="padding-top:96px;padding-bottom:96px">
 <div class="tag">Visite</div><h2 class="h2" style="margin-top:12px;margin-bottom:40px">Como chegar</h2>
 <div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:48px">
  <div class="photo" id="mapa" style="height:460px">Mapa do Google · Rua Antônio de Albuquerque, 781</div>
  <div style="display:flex;flex-direction:column;gap:28px">
   <div><div class="tag" style="margin-bottom:8px">Endereço</div><div class="h3">Rua Antônio de Albuquerque, 781<br>Savassi · Belo Horizonte · MG</div><a class="btn" href="#mapa" style="margin-top:16px">Abrir no Google Maps</a></div>
   <div><div class="tag" style="margin-bottom:4px">Horários</div>{rows([("Domingo a quinta","","12h às 22h"),("Sexta e sábado","","12h às 23h"),("Delivery (iFood)","todos os dias","11h às 21h30")])}</div>
   <div class="acts"><a class="btn ink" href="{GETIN}">Reservar mesa</a><a class="btn" href="{WHATS}">WhatsApp (31) 98424-4285</a></div>
  </div>
 </div>
</section>

<section id="eventos-privados" style="background:#F6E4DC;padding:96px 0">
 <div class="wrap grid2" style="gap:64px">
  <div><div class="tag" style="color:#B83C18">Grupos e celebrações</div><h2 class="h2" style="margin-top:12px">Eventos privados</h2><p class="lead" style="margin-top:20px">Aniversários, lançamentos de livros, confraternizações e encontros de empresa, com cardápio sob medida da cozinha do Café.</p><div class="photo warm" style="height:300px;margin-top:32px">Foto de um evento no salão</div></div>
  <form style="background:#fff;border:1.5px solid #161614;padding:36px;display:flex;flex-direction:column;gap:18px">
   <div class="h3">Conte sobre o seu evento</div>
   {field("ev-nome","Nome")}{field("ev-mail","E-mail","email")}
   <div class="grid2" style="gap:16px">{field("ev-data","Data desejada","date")}{field("ev-pessoas","Número de pessoas","number")}</div>
   <div style="display:flex;flex-direction:column;gap:6px"><label for="ev-tipo" style="font-weight:600;font-size:14px">Tipo de evento</label><select id="ev-tipo" style="min-height:48px;border:1.5px solid #161614;padding:0 14px;font-size:16px;background:#fff;font-family:inherit"><option>Aniversário</option><option>Lançamento de livro</option><option>Evento de empresa</option><option>Outro</option></select></div>
   <div style="display:flex;flex-direction:column;gap:6px"><label for="ev-msg" style="font-weight:600;font-size:14px">Mensagem</label><textarea id="ev-msg" rows="4" style="border:1.5px solid #161614;padding:12px 14px;font-size:16px;font-family:inherit"></textarea></div>
   <button type="button" class="btn mesa" style="align-self:flex-start">Enviar pedido</button>
  </form>
 </div>
</section>

<section style="background:#161614;color:#FAFAF7;padding:96px 0">
 <div class="wrap"><div class="tag" style="color:#B9B6AE">Da mesma casa</div><h2 class="h2" style="margin-top:12px;margin-bottom:40px">Nosso ecossistema</h2><div class="grid4">{ecocards}</div></div>
</section>
</main>
''' + footer()

open(OUT_DIR + '/Casa.dc.html','w').write(page("Café com Letras · A Casa", body, 1440, 3000))
print("ok")
