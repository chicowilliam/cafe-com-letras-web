# Café com Letras — novo site (proposta v1)

Site estático (HTML + CSS, sem JavaScript, sem backend) do Café com Letras, Rua Antônio de Albuquerque, 781, Savassi, Belo Horizonte.

Este repositório reúne **tudo o que existe** do projeto, que foi criado com o Claude num canvas de Design em 20/11/2026:

- **Estado atual:** proposta de design v1, navegável, ainda **não publicada**. O site em produção (cafecomletras.com.br) é o site antigo e não foi alterado.
- **Fonte original:** sete artboards `.dc.html` gerados por scripts Python.
- **Site publicável:** a pasta `site/` contém páginas HTML estáticas convertidas desses artboards sem alterar conteúdo ou estilo. O que a conversão faz está em `tools/export_static.py`.

Leia também `TRANSFERENCIA_TECNICA.md`, `PENDENCIAS.md` e `PROMPT_CODEX.md`.

---

## Estrutura

```
cafe-com-letras-site/
├── site/                         ← SITE PUBLICÁVEL (diretório de saída do deploy)
│   ├── index.html                Home (desktop, responsiva parcial — ver limitações)
│   ├── gastronomia.html          Cardápio, executivo, sugestões do chef, bar e vinhos
│   ├── programacao.html          Rotina semanal, agenda nov–dez/2026, exposições e festivais
│   ├── evento.html               Modelo de página de evento (Nova Onda: Matheus Avelar Quarteto)
│   ├── livraria.html             Lançamentos, clubes de leitura, lançamentos recentes
│   ├── casa.html                 História (30 anos), Visite, Eventos privados, ecossistema
│   ├── celular.html              Home desenhada para celular (largura fixa 390 px)
│   └── assets/
│       ├── logo-ink.png          Logo atual recolorido em #161614 (fundo claro)
│       ├── logo-white.png        Logo atual recolorido em branco (fundo escuro)
│       └── logo-original.webp    Logo como baixado do site atual (400×200, cinza #474747)
├── source/
│   ├── design-canvas/            FONTE ORIGINAL do canvas do Claude (formato .dc.html)
│   │   ├── project/*.dc.html     7 artboards
│   │   ├── project/canvas.json   Índice do canvas (posições, títulos, notas)
│   │   └── assets/               Logos usados no canvas
│   └── generators/               Scripts Python que GERAM os .dc.html (fonte-de-verdade do conteúdo)
│       ├── common.py             CSS global, fontes, header, footer, links externos, helper de linhas de cardápio
│       ├── main.py gastro.py prog.py evento.py livraria.py casa.py mobile.py
│       └── build_all.py          Regera os 7 artboards
├── tools/
│   ├── export_static.py          Converte source/design-canvas/project/*.dc.html → site/*.html
│   └── render_pdf_original.py    Script usado para gerar o PDF da proposta (caminhos do ambiente original)
├── docs/
│   ├── Cafe-com-Letras-Proposta-de-site-v1.pdf
│   ├── screenshots/              Capturas das páginas (fontes substitutas — ver observação)
│   └── cloudflare/_headers.example  Cabeçalhos de segurança RECOMENDADOS (não ativos)
├── .env.example                  Nenhuma variável é necessária hoje (arquivo informativo)
├── TRANSFERENCIA_TECNICA.md
├── PROMPT_CODEX.md
└── PENDENCIAS.md
```

## Tecnologias e versões

| Item | Uso | Versão |
|---|---|---|
| HTML5 + CSS3 | Todas as páginas; CSS global em `<style>` no `<head>` + estilos inline | — |
| Google Fonts (CDN) | Bricolage Grotesque (opsz 12–96; pesos 500, 700, 800), Inter (400, 500, 600, 700), IBM Plex Mono (400, 500) | servidas por fonts.googleapis.com |
| Python | Geradores e conversor | **3.12 ou superior** (os geradores usam `\` dentro de expressões de f-string, sintaxe aceita a partir do 3.12). Testado em 3.13.18 |
| Playwright + Google Chrome | Só para gerar PDF/capturas (opcional) | playwright 1.63.0, pypdf 6.17.0 |

Não há Node.js, bundler, framework, banco de dados, autenticação nem JavaScript no site.

## Executar localmente

```bash
# visualizar o site estático
python3 -m http.server 8080 --directory site
# abrir http://localhost:8080
```

Também funciona abrindo `site/index.html` direto no navegador. É preciso internet para carregar as fontes do Google.

## Fluxo de manutenção (como o projeto foi construído)

O conteúdo e o estilo vivem nos geradores Python. Para alterar textos, preços, agenda ou estilos:

```bash
# 1) editar source/generators/*.py  (CSS global e header/footer em common.py)
# 2) regerar os artboards .dc.html
python3 source/generators/build_all.py
# 3) regerar o site estático
python3 tools/export_static.py
```

Verificação feita na transferência: `build_all.py` reproduz os 7 `.dc.html` **byte a byte idênticos** aos que estão no canvas (hashes SHA-256 conferidos com a versão publicada do canvas, `1795202458-5873`).

Também é possível editar `site/*.html` diretamente, se a equipe abandonar os geradores. Nesse caso, os geradores deixam de ser a fonte-de-verdade, e isso deve ser registrado.

## Build e deploy (Cloudflare Pages)

- **Build command:** nenhum (site estático). Opcionalmente, `python3 tools/export_static.py`.
- **Build output directory:** `site`
- **Variáveis de ambiente:** nenhuma.
- **Domínio, DNS, HTTPS e cabeçalhos:** ver `TRANSFERENCIA_TECNICA.md`, seção 8.

## Limitações conhecidas (resumo)

- Abaixo de cerca de 900 px de largura, as páginas desktop têm overflow horizontal: grids definidos em estilo inline não colapsam. A versão de celular foi desenhada à parte (`celular.html`). Medições estão em `TRANSFERENCIA_TECNICA.md`, seção 6.
- Formulários (newsletter e eventos privados) **não enviam nada**: os botões são `type="button"`.
- Filtros (chips) da agenda e do cardápio são links visuais, sem filtragem.
- Fotos são blocos cinza de marcação, e há conteúdos marcados como exemplo (etiqueta amarela).
- Link do iFood é um marcador (`#delivery-ifood`).

Lista completa: `PENDENCIAS.md`.
