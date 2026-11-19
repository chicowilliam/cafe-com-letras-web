# Corre??es de conte?do e pr?-produ??o

## Conte?do indevido confirmado

Cinco blocos de publicidade de jogos de azar estavam ocultos na se??o Sobre por altura 0,1 px, deslocamento horizontal negativo ou display:none. Os destinos n?o t?m rela??o com as informa??es culturais/gastron?micas do estabelecimento. Havia 35 ocorr?ncias: cinco na cole??o about e as mesmas cinco em seis snapshots p?blicos (homes desktop/mobile e card?pios digitais das duas unidades).

Foram removidos somente esses blocos na nova implementa??o. Textos leg?timos que usam palavras como ?aposta? em contexto liter?rio foram preservados. A compara??o estrutural com o commit anterior confirmou manuten??o de todas as cole??es, quantidades e campos, exceto as altera??es editoriais explicitadas abaixo. N?o se alteraram ASP, MySQL, backup, hospedagem antiga ou hist?rico Git.

| Dom?nio indevido (desativado neste relat?rio) | Evid?ncia de oculta??o | SHA-256 do bloco original na cole??o about |
|---|---|---|
| raccoonbet[.]com | overflow: hidden; height: 0.1px; | 985d182c913e04e7fd6c8a1d9b0720f39a58d663fdd128c76019bbbc7e13a448 |
| casino-portugal[.]com[.]pt | position: absolute; left: -7842px; | 9c5922455946e27bb9fc6923eaa632fa3811b8853f6666af6ecd1312b5aa5fc5 |
| casinotop[.]pt | display: none; | 849fa93ba3ba9cb47f6199797a987b4ef3d424f0b7346b085ec7d584d2487e5b |
| casinosnobrasil[.]com[.]br | position: absolute; left: -9523px; | 0efc1d7ca54d8aa309f2aa3556a8079634e6d1e6489cd61a93d33d522ad2aab1 |
| casinoonline777[.]com[.]br | position: absolute; left: -8523px; | 61b273e86a17157a7436142898fdc24e4aee1c6345fcc95be07d5197833280f3 |

Os hashes, campos e tamanhos de todas as ocorr?ncias est?o no arquivo local ignorado pelo Git evidencias/pages/preproducao/conteudo-removido.json. N?o se copiaram os blocos de spam para o diret?rio publicado. Os testes procuram os cinco destinos nos dados-fonte e no HTML/JSON final para impedir regress?o. N?o se visitaram os sites de apostas. A limpeza n?o permite concluir a causa do comprometimento ou a seguran?a da hospedagem antiga.

## Contatos, reservas e servi?os

- WhatsApp: o link antigo tinha n?mero m?vel com oito d?gitos; foi reconciliado com o telefone de nove d?gitos presente no cadastro p?blico e nos dados estruturados. A URL corrigida recebeu 302 para api.whatsapp.com com o mesmo n?mero. N?o se enviou mensagem, telefonou ou comprovou titularidade/atendimento em tempo real.
- Reservas Savassi: preservado o endere?o real usetag.me/cafecomletras, que respondeu com redirecionamento para o widget Tagme. O bot?o mobile passa a utilizar esse mesmo destino quando servido no dom?nio oficial. A pr?via continua bloqueando navega??o externa e identificando links desativados via t?tulo/aria-disabled. N?o se efetuou reserva nem se homologou disponibilidade comercial do provedor.
- Liberdade: permanece com o aviso recuperado de n?o funcionamento e reservas indispon?veis; n?o se inventou reabertura.
- Contato por formul?rio e newsletter: permanecem desabilitados no build de pr?via e sem simula??o de sucesso. Nenhum SMTP/backend foi adicionado. N?o ativar newsletter via build de produ??o antes da homologa??o espec?fica.
- Savassi Festival e Instagram responderam 200 ao HEAD; Savassi Records redirecionou. Isso valida resposta HTTP, n?o comprova a opera??o comercial atual.
- letras.cidadescriativas.org.br apresentou certificado de hostname incompat?vel; bit.ly apresentou falha de confian?a TLS neste cliente. N?o se ignorou TLS nem substitu?ram esses links por destinos inventados. S?o pend?ncias para valida??o humana/corre??o pelo respons?vel.
- Delivery: iFood bloqueou HEAD com 403 e Uber direcionou para desafio antiautoma??o. N?o se conclui que est?o fora do ar. Links e identidade originais preservados; validar manualmente, sem pedir ou pagar.

## Imagens hist?ricas

N?o foram encontrados os arquivos de artistas 4, 819, 820 e 890 entre as imagens p?blicas recuperadas do projeto novo. Em vez de inventar substitutos, a renderiza??o conserva a ?rea e os textos do evento sem gerar img para esses IDs; JSON-LD tamb?m n?o declara imagens ausentes. Recupera??o dos originais continua pendente. Imagens existentes, dimens?es e CSS foram preservados.

## SEO e indexa??o

O sitemap permanece com 12 URLs can?nicas para 14 p?ginas p?blicas: /m/ e /m/liberdade/ s?o alternativas mobile e apontam canonical para / e /liberdade/. N?o h? exclus?o indevida nessas duas rotas.

T?tulos, descriptions, Open Graph e JSON-LD foram mantidos factuais. Restaurant/LocalBusiness diferencia unidades, n?o declara reabertura de Liberdade nem avalia??es/coordenadas inventadas; Event s? corresponde ao acervo real futuro e v?lido na data do build, sujeito ? confirma??o comercial antes do corte.

A pol?tica de indexa??o agora depende do hostname e status HTTP, n?o apenas da vari?vel de build: somente HTTPS cafecomletras.com.br em p?ginas v?lidas 200 recebe index/follow e robots Allow; pages.dev, hosts desconhecidos e erros permanecem noindex/Disallow. _headers cobre assets dos hostnames pages.dev e aliases; Functions cobre HTML/robots e headers dos caminhos din?micos. Os testes cruzam hostname, DEPLOY_ENV, GET/HEAD, erros e aliases ASP. A configura??o DEPLOY_ENV=preview pode ser mantida sem bloquear o futuro dom?nio oficial pelo middleware; n?o se conectou esse dom?nio para testar rede real.

## Pipelines e preserva??o do Worker

A API de leitura confirmou cafe-com-letras-web no mesmo reposit?rio/main, auto_build_enabled=true, build npm run build e deploy npx wrangler deploy. Nenhuma configura??o do Worker foi alterada. O build deste reposit?rio agora falha antes de construir/publicar se executado em Workers Builds (WORKERS_CI ou WORKERS_CI_BUILD_UUID), conforme vari?veis documentadas pela Cloudflare. Isso impede um deploy duplicado do c?digo Astro no Worker existente. O pipeline duplicado pode aparecer com falha intencional; a solu??o definitiva ? desassoci?-lo/desabilit?-lo com autoriza??o espec?fica.

Plano de DNS, migra??o e rollback: DNS-CORTE-ROLLBACK.md. Checklist de homologa??o e Search Console: CHECKLIST-PRODUCAO-GSC.md. Evid?ncias da execu??o e resultados finais devem ser conferidos no relat?rio local final e nos JSONs de evidencias/pages/preproducao, sem trat?-los como aprova??o comercial ou publica??o oficial.
