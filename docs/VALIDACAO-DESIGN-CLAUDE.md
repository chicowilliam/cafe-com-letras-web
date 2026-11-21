# Validação da migração visual Claude

Data: 20/11/2026. Branch: `feature/novo-design-claude`.

Prévia final: https://2cdec9c2.cafe-com-letras-pages.pages.dev

Código visual e navegação: commit `bf15ecf`. Não houve merge para main. A produção do Cloudflare foi conferida antes e depois e permaneceu no deployment `f43e9998-9cec-4400-b85d-3c0e90b662d5`. Configuração de build existente: `npm run build`, saída `dist`. Nenhum DNS, nameserver, domínio, MySQL ou hospedagem antiga foi modificado.

## Páginas e navegador

Playwright CLI com Google Chrome, fontes originais carregadas, capturas de página inteira. Referência: os HTMLs originais do pacote renderizados no mesmo contexto. Os PNGs fornecidos no pacote também foram inspecionados e preservados; usam fontes substitutas, conforme a própria transferência técnica.

| Página | Desktop 1440 | Tablet 768 | Mobile 390 |
|---|---|---|---|
| Home | OK | OK | OK — artboard celular |
| Gastronomia | OK | OK | OK |
| Programação | OK | OK | OK |
| Evento | OK | OK | OK |
| Livraria | OK | OK | OK |
| A Casa | OK | OK | OK |
| Referência mobile | OK | OK | OK |

Nas 21 combinações: HTTP 200, zero overflow horizontal, zero imagens quebradas, três famílias de fonte carregadas, zero erros JavaScript, zero erros no console e zero recursos com falha. Menu mobile e navegação até Gastronomia funcionaram. WhatsApp mantém o número oficial e a mensagem existente. As seis variantes `.html` retornam 301 para as URLs amigáveis.

A matriz e as capturas completas foram verificadas no deployment `1b0b3e11` (commit `c6f4149`). O último commit muda apenas o tratamento dos fragmentos legados em `hashchange`; não muda HTML, estilos, fontes ou conteúdo renderizado. A prévia final foi submetida também à verificação incremental de navegação e recursos.

## Resultado visual e diferenças restantes

- Em 1440px, as sete páginas têm as mesmas dimensões das referências. Nenhum pixel apresenta diferença maior que 8 em 255 por canal.
- Home, Gastronomia, Programação, Evento, Livraria e Celular tiveram diferença estrita de zero pixels. Em A Casa, 463 pixels apresentaram variação máxima de **1/255**, limitada à rasterização do navegador; não há diferença visível de layout, cor ou conteúdo. Valores completos em `docs/claude-validation/pixel-report.json`.
- Home em 390px e a referência Celular em 390px tiveram diferença estrita de zero pixels.
- Nas internas a 768/390px, as diferenças de altura e disposição são os ajustes responsivos autorizados: empilhamento dos grids, redução dos títulos e adaptação da foto de marcação no evento. A referência original tinha overflow; a adaptação tem zero. Não há design mobile original dessas internas a reproduzir.
- Fotos, mapas e capas de marcação do pacote continuam marcadores; nenhuma imagem foi inventada.

Galeria local com 14 pranchas desktop/mobile e links para capturas tablet: `C:/Users/User1/Desktop/CafeComLetras-Claude/output/playwright/claude/index.html`. Capturas finais nomeadas `preview-PAGINA-LARGURA.png`; referências `reference-PAGINA-LARGURA.png`; pranchas `compare-PAGINA-LARGURA.png`.

## Testes e SEO

- `npm run check`: 23 arquivos; zero erros, avisos ou hints.
- `npm run build`: 21 rotas geradas, incluindo 404; saída estática `dist` e artefatos de Pages produzidos.
- Teste de programação, executado pela build: passou; **3.611 eventos reais preservados**, dados fictícios somente no diretório temporário de testes.
- `npm run test:artifacts`: passou; 20 páginas públicas, 16 URLs no sitemap, 17 casos de redirecionamento, 1.615 arquivos; recursos locais presentes, 23 entidades Event reais mantidas nas rotas legadas. Nenhum Event inventado para o modelo.
- `node tests/migration.mjs`: passou — HTTPS, www, pages.dev, paths, query e indexação por hostname.
- `node tests/preproduction.mjs`: passou — 34 casos de políticas e rotas; conteúdo indevido ausente; quatro imagens legadas ausentes explicitamente registradas, sem substituição inventada.
- WhatsApp: 28 controles em 13 páginas, número e mensagem verificados.
- HTTP remoto: as sete páginas, robots e os dois sitemaps responderam 200; página inexistente respondeu 404. Todas as respostas de prévia usam `X-Robots-Tag: noindex, nofollow`; robots bloqueia indexação. Canonicals mantêm o domínio oficial. Scripts inline têm hashes CSP válidos; Google Fonts é permitido pela política.

O artboard Celular e o modelo Evento permanecem fora do sitemap; ambos usam noindex também se futuramente servidos no hostname oficial. Sitemap, metadados, entidades institucionais e redirecionamentos existentes foram preservados/adaptados. As rotas comerciais e de compatibilidade legadas não foram removidas.

## Homologação e lançamento

A prévia é uma proposta navegável, não uma autorização de lançamento. Permanecem bloqueios: validar fotos, preços, releases, executivo por dia, carta de vinhos, exposição e agenda; conectar a programação estática e detalhes de cada evento aos dados existentes; homologar formulários, filtros, idioma, links institucionais e canais comerciais. Formulários não enviam dados, filtros não filtram e itens demonstrativos exibem aviso. As expressões “hoje” e “ao vivo” são texto estático do design.

Reservas mantêm Tagme, canal previamente verificado no projeto, em vez de substituir automaticamente pelo Getin do pacote. Delivery mantém a página legada e seus destinos. O WhatsApp mantém `wa.me/5531984244285` com a mensagem configurada. Consulte `MIGRACAO-DESIGN-CLAUDE.md` para impactos e decisões detalhadas e `design-reference/claude/PENDENCIAS.md` para a lista editorial original.
