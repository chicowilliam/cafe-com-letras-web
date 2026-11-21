# Correção mobile — Café com Letras

Branch: `fix/mobile-viewport`. Código: `7a5aa13`.

Prévia isolada: https://f300350b.cafe-com-letras-pages.pages.dev

## Causa e correção

A Home mobile vinha de um artboard de largura fixa: `width:390px`, com uma regra herdada que mantinha `max-width:390px`. A validação anterior verificava o overflow em 390px, mas não verificava conteúdo **menor** que a viewport. Em 414px o documento media 414px, enquanto o canvas terminava em 390px: **24px sem conteúdo à direita**, reproduzidos em Chromium e WebKit. O seletor que tentava corrigir a largura também dependia da serialização exata do atributo `style`.

Foi removida a largura fixa e essa dependência de seletor por texto. O canvas usa `w-full min-w-0`, ocupando toda a largura dos celulares. O limite de 390px existe apenas acima de 600px na página de referência `/celular/`, conservando sua apresentação desktop. `body` e o wrapper mobile também usam largura completa e permitem encolhimento correto dos filhos.

O meta viewport já continha `width=device-width, initial-scale=1`. Foi acrescentado `viewport-fit=cover`; `text-size-adjust:100%` normaliza a inflação automática de texto no Safari sem desabilitar zoom. Não se aplicou `overflow-x:hidden`.

## Ajustes pontuais

- Preço do executivo com `whitespace-nowrap` e `shrink-0`; descrição pode ocupar o restante da linha. Nenhum valor foi alterado.
- Botões mobile podem quebrar texto de forma legível, mantendo tamanho mínimo e espaçamento interno; preços nas linhas do cardápio não encolhem.
- Logo com dimensões intrínsecas reais (373×121), preservando a altura visual existente e reservando o espaço antes do carregamento.
- Fotos de marcação da Home usam proporções equivalentes ao artboard de 390px, adaptando sua altura à largura disponível.
- Botão do menu não encolhe; o menu existente mantém seus comportamentos e ocupa o novo canvas fluido.
- Abas “À mesa” e “No palco” continuam em duas colunas iguais.
- Barra inferior fixa apenas nos celulares, com largura da viewport, quatro ações e padding de `env(safe-area-inset-bottom)`. O footer reserva espaço para a barra e a área segura; scroll-padding evita focos e âncoras junto à borda inferior.
- As mudanças estruturais usam Tailwind; o CSS adicional fica limitado à integração das áreas seguras, comportamento tipográfico do Safari e adaptações existentes.

## Conteúdo demonstrativo

Foram conferidos os marcadores “EXEMPLO”, “Foto do artista”, fotos/capas/mapa de marcação, exposição e formação a confirmar. A programação continua sendo o retrato estático do pacote, cuja origem está documentada em `design-reference/claude/TRANSFERENCIA_TECNICA.md`; esta tarefa não homologou agenda, preços, fotos ou nomes pendentes. Nenhum evento, imagem ou preço foi inventado. O modelo de evento não gera um Event fictício no Schema.org. A prévia permanece com noindex e não foi promovida à produção.

## Testes e evidências

Os resultados completos ficam em `docs/mobile-validation/`; screenshots e pranchas em `output/playwright/mobile-fix/`. A validação verifica documento/viewport, canvas, todos os elementos visíveis, preços, imagens, menu, links da barra, posição no início/fim da página e área segura simulada de 34px.

Build limpa no Cloudflare: TypeScript em 25 arquivos sem erros/avisos; testes da programação com 3.611 eventos reais preservados; 21 rotas geradas; teste de artefatos em 20 páginas, 16 URLs no sitemap, 17 redirecionamentos e 1.617 arquivos. Evidência em `docs/mobile-validation/build-proof.json`.

O bundle JavaScript permanece **idêntico**, inclusive SHA-256 e tamanho de 6.088 bytes no módulo comum. Não houve nova dependência do site, JavaScript adicional ou alteração das fontes e imagens existentes. As dimensões dos logos previnem mudança de layout durante o carregamento. O WebKit usado na validação é um motor Playwright de teste, não um iPhone físico.

Não houve merge para main, deploy de produção, alteração de Cloudflare/DNS ou banco. Foram criados somente deployments de preview no projeto Pages existente.

## Resultado final

- **84/84 casos aprovados**: sete páginas em 320, 375, 390, 414, 768 e 1440px, tanto Chromium quanto WebKit 26.5. Documento igual à viewport, zero overflow, zero elementos fora dos limites, zero imagens quebradas e zero erros de recursos/JavaScript.
- **16/16 verificações** de menu/barra/área segura aprovadas: menu abre/fecha; barra cobre a largura e fica na base no início/fim da página; área segura de 34px produz padding de 46px.
- **16/16 verificações de preços** mediram uma única linha com Range.getClientRects. O box do span pode ter altura da descrição por alinhamento flex; a medição correta considera a linha de texto.
- Abas À mesa/No palco, acesso à Casa e filtros Jazz/Tudo funcionaram nos dois motores.
- Desktop: sete páginas com dimensões iguais às referências; seis com zero pixels distintos. A Casa apresentou apenas 117 pixels com variação máxima de 2/255, sem diferença visível.
- JavaScript: mesmo bundle, **6.088 bytes e SHA-256 idêntico** antes/depois. Zero código cliente adicional.
- Laboratório mobile (390×844, CPU 4×, rede 1,6Mbps/150ms, cache aquecido, três amostras alternadas): LCP mediano **608→592ms**, CLS de carga **0→0**. Resultados de laboratório, não INP/percentil de usuários reais. Não se instalou Lighthouse nem bibliotecas no site.

Galeria: [comparativos antes/depois](../output/playwright/mobile-fix/index.html). Arquivo local: `C:/Users/User1/Desktop/CafeComLetras-Claude/output/playwright/mobile-fix/index.html`.

A produção observada durante esta etapa permaneceu no deployment `1af442d5-71c3-4a3e-9267-27b6776c8407`. A nova versão está somente na prévia.
