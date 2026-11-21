# Resultados — evolução interativa

Data local: 20/11/2026. Branch: `feature/interacoes-tailwind`.

**Prévia final:** https://2a7421bc.cafe-com-letras-pages.pages.dev

Código de interface `14e8a8a`; build validada com verificações obrigatórias em `3a61259`. A alteração entre esses commits é somente a execução de TypeScript e testes de artefatos na build; HTML, CSS e JavaScript da interface permanecem iguais. Screenshots e suíte funcional completa foram executados em `62aa643a`; a medição isolada final usa `2a7421bc`.

## Validação visual

Playwright CLI / Chrome, sete páginas × 1440, 768 e 390px: **21/21 aprovadas**, com HTTP 200, zero overflow, zero imagens quebradas, zero erros de JavaScript/console/recursos. Conteúdo, títulos, descriptions, canonical, Open Graph, JSON-LD, URLs e tipografia permaneceram iguais.

Capturas de página inteira em repouso e com movimento reduzido: **19 de 21 pares com diferença estrita de zero pixels**. Gastronomia/768px teve 24 pixels com diferença máxima de 1/255; A Casa/1440px teve 57 pixels com diferença máxima de 2/255. São variações residuais de rasterização sem alteração visível; nenhum pixel ultrapassou a tolerância de 8/255. Todas as 21 imagens têm dimensões idênticas antes/depois. Auditoria adicional de 74 trechos de texto no mobile encontrou estilos tipográficos e retângulos de posicionamento idênticos.

Galeria local: `C:/Users/User1/Desktop/CafeComLetras-Claude/output/playwright/evolution/index.html`. As 14 pranchas desktop/mobile incluem links para os pares tablet e relatórios JSON.

## Interações e acessibilidade

A suíte publicada passou em todos os itens:

- Filtros: Jazz 3, Bossa Nova 3, DJs 9, Piano Bar 3, Livros 3, Tudo 21. Nenhuma categoria incorreta visível; meses vazios tratados e quantidade anunciada.
- Enter/Espaço, `aria-pressed`, foco preservado e zero animações de filtro disparadas por teclado.
- Menu por teclado, Tab até o primeiro link, Escape com foco devolvido, abertura/fechamento rápidos, clique externo e navegação real.
- Menu sobreposto: **deslocamento de layout de 0px** ao abrir.
- Emulação de toque: abriu/fechou corretamente; hover de mouse desativado para ponteiro grosso.
- Revelação ao scroll, redução de movimento sem animação e conteúdo sempre visível sem JavaScript (21 eventos presentes, nenhum ocultado).
- Feedback de demonstração não bloqueante, fechado por Escape; nenhum POST, mensagem, reserva ou formulário enviado durante os testes.
- Atalhos reais de Gastronomia navegam à seção e atualizam `aria-current`; o filtro de DJs levado da Home mostra os 9 registros esperados.

## JavaScript e CSS

Medição dos recursos efetivamente carregados em cada página. Valores gzip são estimativas por recurso com CompressionStream; o custo real de rede também depende de headers, Brotli/cache e da compressão do HTML.

| Recurso | Antes | Depois | Variação |
|---|---:|---:|---:|
| JS descompactado — páginas comuns | 774 B | 6.088 B | +5.314 B |
| JS gzip estimado — páginas comuns | 460 B | 2.563 B | +2.103 B |
| JS descompactado — Programação | 774 B | 7.453 B | +6.679 B |
| JS gzip por recurso — Programação | 460 B | 3.267 B | +2.807 B |
| CSS descompactado | 5.769 B | 14.513 B | +8.744 B |
| CSS gzip estimado | 1.690 B | 3.738 B | +2.048 B |

Antes o script era inline. Agora há um módulo comum cacheável (uma requisição) e um segundo módulo somente na Programação. A segunda navegação pode reutilizar o módulo comum. O filtro não é carregado nas demais páginas. Não foram enviados React, GSAP ou Framer Motion. Tailwind só participa da compilação. CSS incluído no HTML evita uma requisição bloqueante adicional de stylesheet.

## Core Web Vitals em laboratório

Chrome, CPU 4× mais lenta, rede 1,6Mbps/750Kbps e latência de 150ms, cache aquecido, três amostras alternadas por versão/largura. Medianas abaixo. LCP e CLS coletados com PerformanceObserver; interação é duração observada de eventos de menu (Event Timing), **não INP de campo/p75**. A coluna de bloqueio soma duração acima de 50ms nas tarefas observadas durante a carga; é um diagnóstico, não o TBT oficial do Lighthouse.

| Tela | Versão | LCP | CLS | Interação amostrada | Bloqueio observado |
|---|---|---:|---:|---:|---:|
| Mobile 390px | Antes | 580 ms | 0.01376 | 56 ms | 0 ms |
| Mobile 390px | Depois | 508 ms | 0.01376 | 40 ms | 0 ms |
| Desktop 1440px | Antes | 592 ms | 0.00289 | Não amostrada | 0 ms |
| Desktop 1440px | Depois | 544 ms | 0.00309 | Não amostrada | 18 ms |

LCP/CLS ficaram nas faixas boas nas amostras finais; a interação mobile mediana caiu de 56 para 40ms. Há variação entre execuções: o primeiro ensaio, feito enquanto verificações locais ainda estavam ativas, mostrou valores maiores e está preservado em `performance-initial.json`. A rodada final usou um contexto de navegador novo, sem os processos locais de validação em paralelo. Três amostras não estabelecem ganho estatístico nem garantem o p75 de usuários reais. Não foi instalado analytics ou coletado RUM; métricas de campo desta versão dependem de uso real após eventual aprovação de lançamento.

## Build e infraestrutura

A **build limpa do Cloudflare** executou os controles obrigatórios antes de publicar a prévia. Evidência integral dos resultados relevantes em `docs/evolution-validation/build-proof.json`:

- TypeScript/Astro: 25 arquivos, zero erros e avisos.
- Programação: testes aprovados, 3.611 eventos reais preservados, dados de produção intactos, registros fictícios somente em diretório temporário de teste.
- Astro: 21 rotas geradas e saída estática `dist`.
- Artefatos: 20 páginas públicas, 16 URLs no sitemap, 17 casos de redirecionamento, 1.617 arquivos, 23 entidades Event reais nas rotas legadas.
- WhatsApp: 28 controles em 13 páginas, número e mensagem originais preservados.
- Deployment final: ambiente `preview`, build/deploy com status `success`.

O ambiente Windows apresentou extração parcial de dependências e verificações locais presas em I/O. Esses processos foram interrompidos e o cache local foi recuperado sem alterar o projeto original. A validação final de TypeScript/build/artefatos acima é a execução limpa do Cloudflare, a partir do lockfile versionado; a pasta `dist` local intermediária não é a entrega homologada.

Não houve modificação de banco, DNS, domínio, nameservers, build config do projeto Pages ou merge para main. O deployment de produção permanece `f43e9998-9cec-4400-b85d-3c0e90b662d5`.

## Pendências preservadas

Formulários, PT/EN, calendário/lembretes, filtros de cardápio sem metadados suficientes e detalhes de eventos não integrados continuam honestamente demonstrativos. Fotos, preços e agenda estática seguem as pendências de homologação anteriores. Nada foi publicado como informação comercial nova. Esta prévia fica disponível para aprovação; o lançamento oficial requer autorização do proprietário.
