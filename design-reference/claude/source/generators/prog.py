from common import *

ag = [
("Novembro",[
 ("Sex","20","20h","DJ Poetry","DJ","R$ 8",True),
 ("Sáb","21","20h","DJ Xoxottini","DJ","R$ 8",False),
 ("Dom","22","18h30","Piano Bar com Luciana Alvarenga","Piano Bar","R$ 8",False),
 ("Ter","24","19h","Lançamento de “A Conta do Crescimento”, de Bárbara Andrade","Livros","",False),
 ("Qua","25","20h","Nova Onda: Matheus Avelar Quarteto","Jazz · ao vivo","R$ 15",False),
 ("Qui","26","19h","Festival Vinyl Land 18 anos: DJ Bob G (SP)","DJ · vinil","R$ 8",False),
 ("Sex","27","20h","Festival Vinyl Land 18 anos: Rafa Jazz (SP)","DJ · vinil","R$ 8",False),
 ("Sáb","28","13h30","Afro-Sambas, de Baden Powell e Vinicius de Moraes, por Vinicius Mendes e Rodrigo Torino Quarteto","Bossa Nova","",False),
 ("Sáb","28","20h","Festival Vinyl Land 18 anos: DJ Pedro Paiva (JF)","DJ · vinil","R$ 8",False),
 ("Dom","29","18h30","Piano Bar com Gabruga","Piano Bar","",False)]),
("Dezembro",[
 ("Ter","01","19h","Lançamento de “O muro caiu, Helena”, de Luiz Belém","Livros","",False),
 ("Qua","02","20h","Michael Eckroth Quarteto (EUA)","Jazz · ao vivo","",False),
 ("Sex","04","20h","DJ Mellow","DJ","",False),
 ("Sáb","05","11h","Lançamento de “Pra te lembrar da vida”, de Tayná","Livros","",False),
 ("Sáb","05","13h30","Marilton Borges e o Clube da Bossa Nova","Bossa Nova","",False),
 ("Sáb","05","20h","DJ Pied de Poule","DJ","",False),
 ("Sex","11","20h","Palomita DJ","DJ · música brasileira","",False),
 ("Sáb","12","13h30","Vinicius Mendes e Rodrigo Torino Quarteto tocam Marcos Valle","Bossa Nova","",False),
 ("Sáb","12","20h","DJ Leo Oliveira","DJ","",False),
 ("Dom","13","18h30","Piano Bar com Emílio Castilho","Piano Bar","",False),
 ("Qua","16","20h","Jazz de Natal, com Izza","Jazz · ao vivo","",False)])]

def kindcol(k):
    return "#161614" if k.startswith("Livros") else "#1D2B53"

blocks=[]
for mes,evs in ag:
    rs=[]
    for dw,dn,h,t,k,c,hoje in evs:
        hl = "background:#E3E7F1;" if hoje else ""
        cv = f'<span class="mono" style="font-size:15px">Couvert {c}</span>' if c else '<span class="mono" style="font-size:15px;color:#77746C">—</span>'
        rs.append(f'<a href="Evento.dc.html" style="{hl}text-decoration:none;display:grid;grid-template-columns:120px 90px minmax(0,1fr) 170px 150px 40px;gap:20px;align-items:center;padding:20px 16px;border-bottom:1px solid rgba(22,22,20,.18)"><span style="display:flex;align-items:baseline;gap:10px"><span class="tag">{dw}</span><span class="disp" style="font-size:40px">{dn}</span></span><span class="mono" style="font-size:16px">{h}</span><span style="font-weight:700;font-size:19px;line-height:1.3">{t}{" <span class=\"tag\" style=\"color:#1D2B53\">· hoje</span>" if hoje else ""}</span><span style="font-size:14px;font-weight:600"><span class="dot" style="background:{kindcol(k)}"></span>{k}</span>{cv}<span aria-hidden="true" style="font-size:22px">→</span></a>')
    blocks.append(f'<div style="margin-bottom:56px"><h3 class="h3" style="font-size:36px;padding:0 16px 14px;border-bottom:3px solid #1D2B53">{mes} de 2026</h3>{"".join(rs)}</div>')

rec=[("Quarta","20h","Jazz ao vivo","Shows de jazz e música instrumental, transmitidos no YouTube. Série Nova Onda com a nova geração."),("Sábado","13h30","Bossa Nova na Savassi","Dois sets à tarde, no parklet (ou no salão, se chover)."),("Sexta e sábado","20h","DJs","Discotecagem para a noite: música brasileira, soul, jazz, house."),("Domingo","18h30","Piano Bar","Pianistas de Belo Horizonte em dois sets, no fim de tarde.")]
reccards="".join(f'<div style="border:1.5px solid rgba(255,255,255,.6);padding:24px;display:flex;flex-direction:column;gap:10px;min-height:250px"><div class="tag" style="opacity:.8">Todo {d.lower() if d!="Sexta e sábado" else "fim de semana"}</div><div class="disp" style="font-size:40px">{d}</div><div class="mono" style="font-size:16px">{h} · {t}</div><p class="p" style="opacity:.88;font-size:15px">{x}</p></div>' for d,h,t,x in rec)

body = header("Programação") + f'''
<main>
<section style="background:#1D2B53;color:#fff">
 <div class="wrap" style="padding-top:72px;padding-bottom:64px">
  <div class="tag" style="opacity:.85">Programação</div>
  <h1 class="disp" style="font-size:150px;margin-top:16px">No palco</h1>
  <div class="grid2" style="gap:48px;margin-top:32px;align-items:end"><p class="lead" style="font-size:22px">Jazz, bossa nova, DJs, piano, lançamentos de livros e clubes de leitura. A casa abre todos os dias às 12h, e a música começa à noite.</p><div class="acts" style="justify-content:flex-end"><a class="btn w" href="{GETIN}">Reservar mesa</a><a class="btn wo" href="{YT}">Assistir ao vivo</a></div></div>
  <div class="grid4" style="margin-top:64px">{reccards}</div>
 </div>
</section>

<section class="wrap" style="padding-top:80px;padding-bottom:40px">
 <div style="display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:28px"><h2 class="h2">Agenda</h2><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="chip on" href="#agenda">Tudo</a><a class="chip" href="#agenda">Jazz</a><a class="chip" href="#agenda">Bossa Nova</a><a class="chip" href="#agenda">DJs</a><a class="chip" href="#agenda">Piano Bar</a><a class="chip" href="Livraria.dc.html">Livros</a><a class="chip" href="#calendario">Ver em calendário</a></div></div>
 <div id="agenda">{"".join(blocks)}</div>
 <p class="p" style="color:#55534D;margin-top:-24px">Couvert artístico por pessoa. A agenda é atualizada direto da planilha de programação da casa.</p>
</section>

<section id="em-cartaz" style="background:#EDEBE4;padding:96px 0">
 <div class="wrap">
  <div class="tag">Em cartaz · longa duração</div><h2 class="h2" style="margin-top:12px;margin-bottom:40px">Exposições e festivais</h2>
  <div class="grid2" style="gap:40px">
   <div><div class="photo" style="height:440px">Foto da exposição</div><div class="tag" style="margin-top:18px">Exposição de fotografia · em cartaz até dezembro</div><div class="h3" style="font-size:40px;margin-top:8px">[Nome da exposição] <span class="ex">a confirmar</span></div><p class="p" style="margin-top:12px;color:#55534D;max-width:560px">[Artista] · Nas paredes do Café, aberta todos os dias no horário da casa. Entrada livre.</p></div>
   <div style="display:flex;flex-direction:column;gap:24px">
    <div style="background:#1D2B53;color:#fff;padding:32px"><div class="tag" style="opacity:.8">Festival · 26 a 28 de novembro</div><div class="h3" style="font-size:40px;margin-top:10px">Vinyl Land Records 18 anos</div><p class="p" style="margin-top:12px;opacity:.9">O Café entra na comemoração do selo mineiro dedicado à música brasileira em vinil: três noites de discotecagem só em vinil, com Bob G (SP), Rafa Jazz (SP) e Pedro Paiva (JF).</p></div>
    <div style="border:1.5px dashed #161614;padding:32px"><div class="tag">Próxima exposição</div><div class="h3" style="font-size:28px;margin-top:10px">Espaço para a próxima mostra</div><p class="p" style="margin-top:10px;color:#55534D">Cada exposição ganha página própria, com texto curatorial, artista e período.</p></div>
   </div>
  </div>
 </div>
</section>
</main>
''' + footer()

open(OUT_DIR + '/Programacao.dc.html','w').write(page("Café com Letras · Programação", body, 1440, 3600))
print("ok")
