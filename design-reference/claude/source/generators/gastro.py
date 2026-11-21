from common import *

petiscos=[("Dupla de pão de queijo","","R$ 5,50"),("Pão de queijo recheado","mussarela de búfala e tomate seco","R$ 37"),("Pão de queijo recheado","queijo canastra e geleia de damasco","R$ 37"),("Bruschettas clássicas","mussarela de búfala","R$ 49"),("Bruschettas do chef","cogumelos e parmesão","R$ 58"),("Fish and chips","tilápia empanada, fritas e aioli","R$ 57"),("Carpaccio de carne","molho de alcaparras, parmesão e rúcula","R$ 59"),("Queijo brie assado","geleia de frutas vermelhas e alecrim","R$ 62"),("Tartare de salmão","limão, salsinha e chips de batata-doce roxa","R$ 75"),("Tábua Pub","frango, fritas, onion rings e três molhos","R$ 88"),("Tábua pub vegana","mussarela de mandioca, bolinho de feijão-fradinho, onion rings e fritas","R$ 89",True),("Dadinhos veganos","melaço e azeite trufado","R$ 25",True),("Iscas de filé aos três molhos","","R$ 150")]
saladas=[("Salada de pera com gorgonzola","mel, nozes e castanha de caju","R$ 48"),("Salada Caesar","com frango grelhado","R$ 63"),("Salada de salmão curado","maçã verde e mostarda l'ancienne","R$ 70")]
pratos=[("PF do Café","steak de filé a cavalo, arroz, feijão, farofa de bacon e couve","R$ 97"),("PF Vegano","bifinho de grãos e cogumelos, arroz, feijão, couve e banana-da-terra","R$ 55",True),("Moqueca de banana-da-terra","arroz branco, batata chips e folhas","R$ 35",True),("Filé com fritas do Café","molho gorgonzola","R$ 90"),("Filé à parmegiana","com fettuccine na manteiga de sálvia","R$ 98"),("Steak de filé ao molho de jabuticaba","purê de batatas e mix de folhas","R$ 114"),("Escalope de filé","risoto de funghi","R$ 114"),("Tilápia grelhada","ravióli de búfala ao creme de alcaparras","R$ 77"),("Bobó de camarão","arroz cremoso de coco queimado","R$ 92"),("Salmão grelhado","risoto de agrião e bacon","R$ 125"),("Paella vegana","arroz integral, legumes, cogumelos e castanha","R$ 68",True)]
massas=[("Fettuccine trifolati","três cogumelos e azeite trufado","R$ 49"),("Ravióli de mussarela de búfala","pomodoro e basílico","R$ 55"),("Ravióli vegano","queijo vegano da casa, creme de cenoura e funghi","R$ 43",True),("Risoto de cogumelos e pupunha","","R$ 57",True),("Risoto de parmesão e filé","","R$ 92"),("Fettuccine al limone","camarões e limão-siciliano","R$ 105"),("Pappardelle com iscas de filé","pomodoro, búfala, tomate confit e rúcula","R$ 114"),("Risoto de camarões","","R$ 118")]
grelhados=[("Bifinho de soja","legumes e folhas","R$ 40",True),("Frango","legumes e folhas","R$ 43"),("Tilápia","legumes e folhas","R$ 52"),("Salmão","legumes e folhas","R$ 85"),("Filé","legumes e folhas","R$ 99")]
sanduiches=[("Hambúrguer Mineirices","canastra, bacon, barbecue de goiabada e couve","R$ 55"),("Veg Crispy","hambúrguer de soja e bacon vegano","R$ 53",True),("Veg Cheddar","cheddar vegano e cebola caramelizada","R$ 65",True),("Sanduíche caprese","búfala, tomate confit e pesto","R$ 58"),("Crepe de cogumelos","","R$ 60"),("Crepe de salmão","alho-poró e maracujá","R$ 85")]
sobremesas=[("Pudim da vovó","","R$ 15"),("Bola de sorvete","calda de chocolate","R$ 16"),("Sorbet de tangerina","","R$ 16",True),("Torta de limão","","R$ 20"),("Tortinha de banana","sorbet de tangerina","R$ 28",True),("Brownie vegano","sorbet de tangerina e nozes","R$ 35",True),("Tiramisù de frutas vermelhas","","R$ 35",True),("Brownie mix","sorvete de creme","R$ 37"),("Tiramisù","","R$ 37"),("Petit gâteau de chocolate","sorvete de creme e creme inglês","R$ 39")]
infantil=[("Talharim infantil","molho pomodoro","R$ 32"),("PF do Café infantil","","R$ 57")]

def sec(title, items, note=""):
    n = f'<p class="p" style="color:#55534D;margin-top:6px">{note}</p>' if note else ''
    return f'<div style="break-inside:avoid;margin-bottom:48px"><h3 class="h3" style="font-size:32px;padding-bottom:12px;border-bottom:3px solid #B83C18">{title}</h3>{n}{rows(items)}</div>'

autorais=[("Hora da Estrela","vodka, flor de sabugueiro, limão, soda de baunilha e espuma de jabuticaba","R$ 42"),("Veredas","gin Amazzoni, Martini Rosato, mel, limão, vinho tinto e espuma de jabuticaba","R$ 45"),("Iracema","cachaça Primeira de Minas, flor de sabugueiro, limão e soda de baunilha","R$ 22"),("Capitão Bala","cachaça, xarope de amêndoas, limão, bitter e soda de gengibre","R$ 25"),("Moramora","xarope de gengibre, morango e limão","R$ 27")]
classicos=[("Caipirinha","cachaça Primeira de Minas","R$ 19"),("Caipiroska","","R$ 22"),("Mojito","","R$ 25"),("Negroni","","R$ 25"),("Cosmopolitan do Café","","R$ 25"),("Fitzgerald","","R$ 30"),("Kir Royale","","R$ 32"),("Gin tônica","","R$ 32"),("Aperol Spritz","","R$ 34"),("Margarita","","R$ 45")]
semalc=[("Pimentônica","morango, limão-siciliano, pimenta-rosa e tônica","R$ 19")]

days=[("Seg","Picadinho do presidente, arroz, feijão, banana frita, farofa de ovo e couve"),("Ter","Galinhada caipira com ora-pro-nóbis, quiabo, farofa e tomate confitado"),("Qua","Tilápia ao mediterrâneo, purê de batata e salada"),("Qui","Costelinha ao próprio molho com angu, arroz e feijão"),("Sex","Paillard de filé ao molho madeira, penne com azeite de ervas e salada")]
execrows="".join(f'<div style="display:grid;grid-template-columns:90px minmax(0,1fr);gap:20px;padding:18px 0;border-top:1.5px solid rgba(255,255,255,.55){";background:rgba(255,255,255,.08)" if d=="Sex" else ""}"><span class="disp" style="font-size:34px">{d}</span><span style="font-size:19px;font-weight:600;line-height:1.35">{t}{" <span class=\"tag\" style=\"opacity:.8\">· hoje</span>" if d=="Sex" else ""}</span></div>' for d,t in days)

chef=[("Ceviche de banana","banana-da-terra, cebola roxa, coentro, gengibre e batata-doce roxa"),("Moqueca de banana e palmito","dendê, leite de coco e farofa"),("Picadinho de carne com chuchu","cuscuz e banana-da-terra"),("Banoffee","banana, doce de leite de Viçosa e canela")]
chefcards="".join(f'<div style="border-top:3px solid #161614;padding-top:16px"><div class="photo" style="height:220px;margin-bottom:16px">Foto do prato</div><div class="h3" style="font-size:24px">{n}</div><p class="p" style="margin-top:8px;color:#55534D">{d}</p></div>' for n,d in chef)

body = header("Gastronomia") + f'''
<main>
<section style="background:#B83C18;color:#fff">
 <div class="wrap" style="padding-top:72px;padding-bottom:48px">
  <div class="tag" style="opacity:.85">Gastronomia</div>
  <h1 class="disp" style="font-size:150px;margin-top:16px">À mesa</h1>
  <div class="grid2" style="gap:48px;margin-top:32px;align-items:end"><p class="lead" style="font-size:22px">Cozinha da chef Ana Maria de Oliveira: os clássicos que atravessam 30 anos, pratos veganos de longa tradição e um bar com drinks batizados pela literatura brasileira.</p><div class="acts" style="justify-content:flex-end"><a class="btn w" href="{GETIN}">Reservar mesa</a><a class="btn wo" href="{IFOOD}">Pedir no iFood</a></div></div>
 </div>
 <nav aria-label="Seções do cardápio" style="border-top:1.5px solid rgba(255,255,255,.5)"><div class="wrap" style="display:flex;gap:10px;flex-wrap:wrap;padding-top:16px;padding-bottom:16px"><a class="chip" style="border-color:#fff;color:#161614;background:#fff" href="#executivo">Almoço executivo</a><a class="chip" style="border-color:#fff;color:#fff" href="#chef">Sugestão do chef</a><a class="chip" style="border-color:#fff;color:#fff" href="#cardapio">Cardápio</a><a class="chip" style="border-color:#fff;color:#fff" href="#bar">Bar e drinks</a><a class="chip" style="border-color:#fff;color:#fff" href="#vinhos">Vinhos</a><span style="margin-left:auto;display:flex;align-items:center;font-size:14px"><span class="v" style="margin:0 8px 0 0">V</span>prato vegano</span></div></nav>
</section>

<section id="executivo" style="background:#8E2E12;color:#fff;padding:80px 0">
 <div class="wrap grid2" style="gap:64px">
  <div><div class="tag" style="opacity:.85">Todo dia, no almoço</div><h2 class="h2" style="margin-top:12px">Almoço executivo</h2><p class="lead" style="margin-top:20px;opacity:.92">Um prato diferente a cada dia, com opção vegana sempre no cardápio.</p><div class="mono" style="margin-top:24px;font-size:18px">Paillard de filé: R$ 70 <span class="ex">demais preços a confirmar</span></div></div>
  <div><div class="tag" style="opacity:.85;margin-bottom:8px">Cardápio desta semana <span class="ex">dias ilustrativos</span></div>{execrows}</div>
 </div>
</section>

<section id="chef" class="wrap" style="padding-top:96px;padding-bottom:96px">
 <div style="display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:40px"><div><div class="tag" style="color:#B83C18">Por tempo limitado</div><h2 class="h2" style="margin-top:12px">Sugestões do chef</h2></div><p class="p" style="max-width:420px;color:#55534D">Temporada assinada pela chef Ju Muradas. <span class="ex">exemplo · preços a confirmar</span></p></div>
 <div class="grid4">{chefcards}</div>
</section>

<section id="cardapio" style="background:#fff;border-top:1.5px solid #161614;padding:96px 0">
 <div class="wrap">
  <div style="display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:48px"><div><div class="tag" style="color:#B83C18">Todos os dias, das 12h ao fechamento</div><h2 class="h2" style="margin-top:12px">Cardápio</h2></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="chip on" href="#cardapio">Tudo</a><a class="chip" href="#cardapio">Só veganos</a><a class="chip" href="#cardapio">Para dividir</a></div></div>
  <div style="column-count:2;column-gap:72px">
   {sec("Para começar e dividir", petiscos)}
   {sec("Saladas", saladas)}
   {sec("Grelhados", grelhados, "Acompanham legumes salteados e mix de folhas.")}
   {sec("Pratos", pratos)}
   {sec("Massas e risotos", massas)}
   {sec("Sanduíches e crepes", sanduiches)}
   {sec("Sobremesas", sobremesas)}
   {sec("Para as crianças", infantil)}
  </div>
 </div>
</section>

<section id="bar" style="background:#161614;color:#FAFAF7;padding:96px 0">
 <div class="wrap">
  <div class="grid2" style="gap:64px;margin-bottom:56px;align-items:end"><div><div class="tag" style="color:#B9B6AE">Bar</div><h2 class="h2" style="margin-top:12px">Drinks com nome de livro</h2></div><p class="lead" style="color:#D6D3CB">Autorais com nomes que saem das estantes da literatura brasileira, como Hora da Estrela, Veredas e Iracema.</p></div>
  <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:20px;margin-bottom:72px">{"".join(f'<div style="border:1.5px solid #4A4844;padding:22px;display:flex;flex-direction:column;gap:10px;min-height:260px"><div class="disp" style="font-size:34px">{n}</div><div style="font-size:14px;color:#B9B6AE;line-height:1.45;flex:1">{d}</div><div class="mono" style="font-size:17px">{p}</div></div>' for n,d,p in autorais)}</div>
  <div class="grid2" style="gap:72px">
   <div><h3 class="h3" style="font-size:28px;padding-bottom:12px;border-bottom:1.5px solid #FAFAF7">Clássicos</h3><div style="--x:1">{rows(classicos).replace('color:#55534D','color:#B9B6AE').replace('rgba(22,22,20,.18)','#3A3936')}</div></div>
   <div><h3 class="h3" style="font-size:28px;padding-bottom:12px;border-bottom:1.5px solid #FAFAF7">Sem álcool</h3>{rows(semalc).replace('color:#55534D','color:#B9B6AE').replace('rgba(22,22,20,.18)','#3A3936')}
    <div id="vinhos" style="margin-top:48px;border:1.5px solid #FAFAF7;padding:28px"><div class="tag" style="color:#B9B6AE">Carta de vinhos</div><div class="h3" style="margin-top:10px">Tintos, brancos, rosés e espumantes, em taça e garrafa</div><p class="p" style="margin-top:10px;color:#B9B6AE">A carta completa entra aqui, gerada da planilha. <span class="ex">a preencher</span></p><a class="btn w" href="#vinhos" style="margin-top:20px">Ver a carta de vinhos</a></div>
   </div>
  </div>
 </div>
</section>

<section class="grid2">
 <a href="{IFOOD}" style="text-decoration:none;background:#B83C18;color:#fff;padding:64px 40px;display:block"><div class="tag" style="opacity:.85">Delivery</div><div class="h2" style="margin-top:12px;font-size:52px">O Café em casa</div><p class="p" style="margin-top:14px;opacity:.9">Peça pelo iFood todos os dias, das 11h às 21h30.</p></a>
 <a href="Casa.dc.html#eventos-privados" style="text-decoration:none;background:#EDEBE4;padding:64px 40px;display:block"><div class="tag">Grupos e celebrações</div><div class="h2" style="margin-top:12px;font-size:52px">Eventos privados</div><p class="p" style="margin-top:14px;color:#55534D">Aniversários, lançamentos e encontros de empresa, com cardápio sob medida.</p></a>
</section>
</main>
''' + footer()

open(OUT_DIR + '/Gastronomia.dc.html','w').write(page("Café com Letras · Gastronomia", body, 1440, 5000))
print("ok")
