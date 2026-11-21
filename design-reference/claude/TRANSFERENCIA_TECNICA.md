# Transferência técnica — site Café com Letras (proposta v1)

Data da transferência: 20/11/2026. Origem: projeto criado com o Claude (claude.ai) num canvas de Design, a partir de uma pesquisa de referências e de um documento de estratégia.

## 1. O que foi recuperado e o que foi reconstruído

| Item | Situação | Onde está |
|---|---|---|
| 7 artboards do canvas (`.dc.html`) | **Recuperados integralmente**, hashes idênticos à versão publicada do canvas | `source/design-canvas/project/` |
| Índice do canvas (`canvas.json`) | Recuperado | `source/design-canvas/project/canvas.json` |
| Geradores Python que produziram os artboards | **Recuperados** (originais), só com o caminho de saída tornado configurável; reproduzem os artboards byte a byte | `source/generators/` |
| Logo | Recuperado do site atual (`cafecomletras.com.br/optimized/img/bg/bg-cafecomletras-savassi.webp`) e recolorido em duas versões | `site/assets/`, `source/design-canvas/assets/` |
| Site estático (`site/*.html`) | **Conversão** dos artboards: remove o runtime do editor, troca URLs de assets e links e acrescenta a meta viewport. Sem mudança de conteúdo ou estilo | `site/`, `tools/export_static.py` |
| PDF da proposta | Recuperado. Usa fontes substitutas (Archivo Black e DejaVu Sans Mono) porque o ambiente de geração não tinha as fontes originais | `docs/` |
| Runtime do editor de Design (`support.js`, `dc-runtime.js`) | **Não incluído**: pertence à plataforma claude.ai e não é parte do site. O site não depende dele | — |
| Documento de estratégia (Claude Doc) | Não exportado para este pacote. Ver `PENDENCIAS.md` | claude.ai |

Nada foi inventado na transferência. Os conteúdos marcados como exemplo já eram exemplos no design original (seção 7).

## 2. Arquitetura

- **No ambiente original:** cada página é um artboard `.dc.html` (formato "Design Component" do canvas do Claude): HTML com `<x-dc>`, `<helmet>` (estilos e fontes) e um `<script type="text/x-dc">` com `class Component extends DCLogic { renderVals(){ return {}; } }`, ou seja, **sem lógica**. As páginas são marcadas como `expand: "fill"` (página fluida) e `is_interactive: true` (links navegáveis no modo Play).
- **Geração:** os artboards não foram escritos à mão. São gerados por Python (`source/generators/`). `common.py` concentra o CSS global (`CSS`), as fontes (`FONTS`), o cabeçalho (`util()`, `header()`), o rodapé (`footer()`), o molde de página (`page()`), o helper `rows()` (linhas de cardápio com preço e selo vegano) e as constantes de links externos. Cada outro arquivo gera uma página.
- **Publicação:** `tools/export_static.py` transforma os artboards em HTML puro em `site/`. Não há etapa de build obrigatória para publicar: `site/` já está pronto.
- **Sem backend, sem banco, sem autenticação, sem JavaScript, sem cookies.**

### Mapa de páginas e navegação

| Página estática | Artboard original | Título (`<title>`) |
|---|---|---|
| `index.html` | `Main.dc.html` | Café com Letras · Home |
| `gastronomia.html` | `Gastronomia.dc.html` | Café com Letras · Gastronomia |
| `programacao.html` | `Programacao.dc.html` | Café com Letras · Programação |
| `evento.html` | `Evento.dc.html` | Café com Letras · Evento |
| `livraria.html` | `Livraria.dc.html` | Café com Letras · Livraria |
| `casa.html` | `Casa.dc.html` | Café com Letras · A Casa |
| `celular.html` | `HomeMobile.dc.html` | Café com Letras · Home no celular |

- **Menu principal** (em todas as páginas desktop): Gastronomia, Programação, Livraria, Exposições (→ `programacao.html#em-cartaz`), A Casa. O item da página atual tem sublinhado de 2 px (`.nav a.on`).
- **Ações fixas no header:** Reservar (Getin), Delivery (iFood, ainda um marcador) e WhatsApp.
- **Âncoras internas que existem:** `gastronomia.html#executivo #chef #cardapio #bar #vinhos`, `programacao.html#agenda #em-cartaz`, `casa.html#visite #mapa #eventos-privados`, `index.html#em-cartaz`.
- **Âncoras-marcador sem destino** (herdadas do design, não são erro de conversão): `#delivery-ifood`, `#pt`, `#en`, `#imprensa`, `#trabalhe`, `#lembrete`, `#calendario`, `#mapa` fora de `casa.html`, e `href="#"` nos cartões do ecossistema em `casa.html`.

## 3. Identidade visual

**Conceito "Mesa e Palco":** gastronomia (laranja) e programação (azul-noite) têm o mesmo peso, lado a lado. Livraria e exposições usam a terceira voz, papel e tinta (preto e off-white). Logo atual mantido.

### Cores (HEX, todas as ocorrências no código)

| Cor | Papel |
|---|---|
| `#161614` | Tinta: texto principal, botões `.btn.ink`, fundos pretos (livraria, bar, rodapé, barra utilitária) |
| `#FAFAF7` | Papel: fundo da página e texto sobre preto |
| `#B83C18` | **Mesa** (gastronomia): hero, botões `.btn.mesa`, filetes de seção do cardápio |
| `#8E2E12` | Mesa escuro: faixa do almoço executivo |
| `#9E3414` / `#F6D9CD` | Bloco de foto "quente" (`.photo.warm`) / texto dele |
| `#F6E4DC` | Fundo rosado das seções de gastronomia na Home, Evento e Casa |
| `#1D2B53` | **Palco** (programação): hero, botões `.btn.palco`, marcadores de evento |
| `#2C3A63` / `#D5DAEA` | Bloco de foto "noite" (`.photo.dark`) / texto dele |
| `#E3E7F1` | Destaque da linha "hoje" na agenda |
| `#D8D5CC` / `#3F3D38` | Bloco de foto neutro (`.photo`) / texto dele |
| `#EDEBE4` | Fundo neutro de seções (Em cartaz, clubes de leitura, 30 anos) |
| `#E9E7E1`, `#D6D3CB`, `#B9B6AE`, `#8E8B83` | Textos claros e secundários sobre preto |
| `#55534D`, `#77746C` | Textos secundários sobre claro |
| `#4A4844`, `#3A3936` | Filetes e blocos sobre preto |
| `#2F6B3A` | Selo vegano "V" (`.v`) |
| `#FFE58A` | Etiqueta amarela "exemplo / a confirmar" (`.ex`): **marcador de revisão, não faz parte da identidade final** |
| `#C8102E` | Ponto vermelho "ao vivo" na página de evento |
| `rgba(22,22,20,.18)` | Filetes entre linhas (`.row`) |
| `rgba(255,255,255,.5–.9)` | Filetes e bordas sobre cor |

### Tipografia

| Uso | Fonte | Especificação |
|---|---|---|
| Display (`.disp`) | Bricolage Grotesque 800 | letter-spacing −0.035em, line-height .9; tamanhos de 34 a 180 px (hero das páginas internas: 150 px; Home: 132 px; Casa: 180 px) |
| Título de seção (`.h2`) | Bricolage Grotesque 800 | 64 px, −0.03em, line-height .95 (44 px abaixo de 900 px) |
| Subtítulo (`.h3`) | Bricolage Grotesque 700 | 28 px (variações inline de 22 a 40 px), −0.02em |
| Corpo (`.p` / `.lead`) | Inter | 16 px / 1.55 e 19 px / 1.5; pesos 400–700 |
| Rótulos (`.tag`) | IBM Plex Mono 500 | 12 px, caixa-alta, letter-spacing .1em |
| Preços e horários (`.mono`) | IBM Plex Mono 400 | 13–18 px |

Fontes carregadas por `<link>` do Google Fonts em cada página (`common.py → FONTS`).

### Espaçamento, forma e componentes

- **Container:** `.wrap` com max-width de 1360 px e padding lateral de 40 px (20 px abaixo de 900 px).
- **Ritmo vertical das seções:** 64–96 px; entre blocos, gaps de 24, 32, 40, 48, 56 e 64 px.
- **Sem sombras, gradientes ou cantos arredondados em cartões.** Bordas de 1.5 px em tinta; filetes de 3 px na cor da seção.
- **Botões (`.btn`):** pílula (radius 999 px), altura mínima de 44 px, padding 0 20 px, peso 600, 15 px. Variantes: `ink`, `mesa`, `palco`, `w` (branco), `wo` (contorno branco) e padrão (contorno tinta).
- **Chips (`.chip`):** pílula de 40 px de altura; `.chip.on` preenchido.
- **Linhas de cardápio (`.row`):** nome (600, 17 px) + descrição (14 px) à esquerda, preço mono à direita, filete inferior.
- **Selo vegano:** círculo verde de 22 px com "V" (`.v`, `aria-label="vegano"`).
- **Fotos:** blocos `.photo`, `.photo.dark` e `.photo.warm` com legenda mono no canto. São **marcadores**, não imagens.
- **Ícones:** só na barra inferior de `celular.html` (Reservar, Delivery, WhatsApp, Chegar) e no botão de menu: SVG inline de traço 1.6–2 px. A seta "→" na agenda é um caractere de texto.

### Animações e microinterações

Não existem animações nem transições. A única interação visual é o hover dos links: `a:hover{opacity:.82}`.

## 4. Conteúdo e origem dos dados

| Conteúdo | Fonte |
|---|---|
| Programação de 20/11 a 29/11/2026 (horários, releases, couverts) | Site atual cafecomletras.com.br, lido em 20/11/2026 |
| Programação de dezembro/2026 | Planilha Google "Café 2026 - Programação", aba Dezembro (eventos com status Confirmado; couverts de dezembro não informados) |
| Pratos, descrições e preços | Planilha "Fichas Técnicas Café com Letras e Clube_2026", aba "Cardapio Fixo Comida 2026" (preço = coluna "Preço atual", atualizada em 26/08/2026) |
| Drinks e preços | Mesma planilha, aba "Cardapio Fixo Drinks 2026". Os preços foram associados aos nomes **pela ordem dos blocos** (ver PENDENCIAS) |
| Pratos do executivo | Aba "Executivos 2026"; só o preço do Paillard (R$ 70) foi lido |
| Sugestões do chef | Aba "Sugestão do Chef 2026" (série "Chef Ju Muradas"), sem preços |
| Endereço, horários, telefone, horário do delivery, história | Site atual e informações da casa |

**Links externos reais** (definidos em `common.py`):

| Link | Endereço |
|---|---|
| Reserva (Getin) | `https://reservation.getin.app/36qBovkN` |
| WhatsApp | `https://wa.me/5531984244285` |
| YouTube | `https://www.youtube.com/@cafecomletrastv` |
| Instagram | `https://www.instagram.com/cafe_com_letras/` |

## 5. Funcionalidades

| Funcionalidade | Estado verificado |
|---|---|
| Navegação entre as 7 páginas | Funciona: todos os links entre páginas foram testados e apontam para arquivos existentes |
| Âncoras internas (seção 2) | Funcionam |
| Reservar, WhatsApp, YouTube e Instagram | Links externos reais |
| Delivery (iFood) | **Marcador** `#delivery-ifood`, sem link real |
| Formulário de newsletter (Home) | **Só visual**: `<input type="email">` + botão `type="button"`, sem envio |
| Formulário de eventos privados (Casa) | **Só visual**: campos com `<label>`, botão `type="button"`, sem envio |
| Filtros (chips) da agenda, cardápio e semana | **Só visual**: links para âncoras, sem filtragem |
| PT / EN | **Marcador**: não há versão em inglês |
| "Adicionar à agenda", "Ver em calendário", mapa | **Marcadores** |
| Botão de menu no celular | **Só visual**: não abre menu |
| Carta de vinhos | **Placeholder** de seção |

## 6. Responsividade (medido)

Há um único breakpoint em CSS: `@media (max-width: 900px)`. Nele, `.grid2`, `.grid3` e `.grid4` viram uma coluna, `.h2` cai para 44 px e `.wrap` para padding de 20 px. Vários grids são definidos **inline** (semana de 7 colunas, agenda, hero do evento, drinks em 5 colunas, cartões da livraria etc.) e não colapsam.

Overflow horizontal medido em Chrome headless (px a mais que a largura da janela):

| Página | 1440 px | 768 px | 390 px |
|---|---|---|---|
| index | 0 | 0 | 45 |
| gastronomia | 0 | 28 | 104 |
| programacao | 0 | 0 | 316 |
| evento | 0 | 0 | 170 |
| livraria | 0 | 0 | 114 |
| casa | 0 | 0 | 257 |
| celular (390 fixo) | — | — | 0 |

**Conclusão:** o design entregue é desktop (1440 px) + uma Home de celular desenhada à parte. Uma versão responsiva para celular das páginas internas **não foi desenhada**; ela precisa ser feita e é uma pendência de design, não de conversão.

## 7. Conteúdos marcados como exemplo no design (etiqueta amarela `.ex`)

- Fotos: todas são blocos cinza.
- Nome e artista da exposição em cartaz ("[Nome da exposição]").
- Dias do almoço executivo: pratos reais, distribuição pelos dias ilustrativa; preços além do Paillard a confirmar.
- Sugestões do chef: preços a confirmar.
- Formação do Matheus Avelar Quarteto ("[Nome] / [instrumento]").
- Carta de vinhos (a preencher).

## 8. Infraestrutura recomendada (não aplicada a nada em produção)

### Cloudflare Pages

- **Compatibilidade:** total, porque o site é 100% estático. Workers não são necessários.
- **Projeto:** conectar o repositório GitHub. Build command vazio, output `site`. Também é possível o upload direto da pasta `site/` (Direct Upload) ou `npx wrangler pages deploy site`.
- **Domínio e DNS:** `cafecomletras.com.br` está no Registro.br. Opções:
  1. Delegar os nameservers para a Cloudflare (permite apex + www no Pages).
  2. Manter o DNS atual e apontar `www` por CNAME para `<projeto>.pages.dev`; o domínio sem www então depende de redirecionamento no provedor atual.
- **Ainda não feito:** a hospedagem atual e o DNS **não foram alterados**. Antes de trocar, listar as URLs antigas (`/m/`, `/linktree`, âncoras `#part1…#part5`) e criar `_redirects` para elas.
- **HTTPS:** automático no Pages; ativar "Always Use HTTPS" e HSTS depois de validar.
- **Cabeçalhos de segurança:** modelo em `docs/cloudflare/_headers.example` (CSP compatível com Google Fonts, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`). Para ativar, copiar para `site/_headers` e testar.

### Formulários

Hoje não enviam nada. Ao implementar:
- Usar Cloudflare Pages Functions, Formspree/Getform ou um link de WhatsApp/e-mail.
- Validar no servidor e proteger contra spam (Cloudflare Turnstile).
- Não expor e-mails de destino nem chaves no HTML; usar variáveis de ambiente do Pages. Os nomes sugeridos estão no `.env.example` como comentário.

### Privacidade (LGPD)

- Newsletter e eventos privados coletam dados pessoais (nome, e-mail, data, número de pessoas).
- Antes de ativar: texto de consentimento, política de privacidade e definição de quem guarda os dados e por quanto tempo.
- O site hoje não usa cookies nem analytics.

### Serviços externos de que o site depende

| Serviço | Uso | Efeito se cair |
|---|---|---|
| Google Fonts | Fontes | O site usa fontes de sistema e perde a identidade tipográfica |
| Getin | Reservas | Só o destino do link |
| WhatsApp | Contato | Só o destino do link |
| YouTube / Instagram | Lives e perfil | Só o destino do link |
| iFood | Delivery | Link ainda não definido |

Para independência, as fontes podem ser hospedadas no próprio site (self-host), com as mesmas famílias e pesos.

### Monitoramento e analytics (sugestões)

- Cloudflare Web Analytics, sem cookies.
- Eventos de clique em Reservar, Delivery e WhatsApp.
- Uptime pelo próprio Cloudflare.

### SEO técnico e desempenho: estado atual

- **Existe:** `<html lang="pt-BR">`, `<title>` por página, hierarquia de títulos (`h1` no hero, `h2`/`h3` nas seções), `alt` nas imagens de logo, `aria-label` em links de ícone, labels nos formulários.
- **Não existe:**
  - `<meta name="description">`
  - Open Graph / Twitter Cards
  - favicon
  - dados estruturados schema.org (o site antigo tem Restaurant e Event)
  - `sitemap.xml`
  - `robots.txt`
  - URLs canônicas
  - versão EN
- **Desempenho:** páginas de 13 a 29 KB de HTML, sem JS e com 2 PNGs de logo (cerca de 16 KB cada). O custo principal é o Google Fonts.
