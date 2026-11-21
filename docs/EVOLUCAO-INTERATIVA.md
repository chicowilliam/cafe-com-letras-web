# Evolução interativa — Café com Letras

Branch `feature/interacoes-tailwind`, baseada em `f9cef64` (migração visual Claude). Código da primeira prévia desta etapa: `14e8a8a`.

Prévia: https://2a7421bc.cafe-com-letras-pages.pages.dev

## Estilização e fidelidade

Tailwind CSS e `@tailwindcss/vite` **4.3.5**, fixados no lockfile. São dependências de desenvolvimento: o navegador recebe apenas o CSS compilado. Nenhuma versão de dependência preexistente foi alterada. O plugin segue a integração oficial de Astro/Vite; Preflight foi omitido para conservar margens e controles nativos da referência.

Foram migradas **515 declarações repetidas** de elementos sem classes para utilitários: flex, alinhamento, gaps, margens e decoração de links. Padrões compartilhados de grids, ações, botões, linhas e tipografia monoespaçada usam utilitários e `@apply`. O CSS de composição, os grids complexos da agenda, bordas de 1,5px, escalas tipográficas e breakpoints foram mantidos explícitos onde a conversão reduziria a clareza ou fidelidade.

- `src/styles/tokens.css`: 24 cores originais, três famílias tipográficas, espaçamentos, container, raio de ação e tokens de movimento. Valores HEX originais, sem reinterpretar a paleta.
- `src/styles/components.css`: composição e componentes compartilhados; utilitários aplicados sem reset global.
- `src/styles/site.css`: entrada CSS, fontes de classes limitadas aos diretórios da interface; dados, relatórios e arquivos de referência não geram utilitários extras.
- `src/styles/interactions.css`: estados e movimento.
- `src/styles/claude-responsive.css`: adaptações responsivas da etapa anterior, com compatibilidade para os novos utilitários.
- `src/design/claude/original.css` e `design-reference/claude/`: referências preservadas. O runtime agora usa `components.css` compilado.

A largura máxima do container permanece como CSS explícito para evitar ambiguidade entre tokens de largura e espaçamento. Os botões mantêm as pílulas do design aprovado; o novo feedback contextual usa raio de 12px.

O CSS compilado é incluído no HTML inicial para evitar uma requisição bloqueante adicional. A decisão e o custo em bytes são registrados na comparação de performance.

## Interações

| Recurso | Comportamento |
|---|---|
| Botões e links | Feedback de cor/opacidade de 160ms; pressão com escala 0,98 em 120ms. Sem alteração da composição em repouso. |
| Cards e imagens de marcação | Deslocamento de 2px em cards e opacidade sutil nas fotos, somente com mouse e ponteiro preciso. |
| Scroll | Revelação de 6px/opacidade em 280ms, uma vez, somente abaixo da dobra. Hero e candidato a LCP não são ocultados. IntersectionObserver nativo; conteúdo visível sem JS ou sem suporte. |
| Menu mobile | Abertura 220ms, fechamento 140ms, retoggles cancelam a animação anterior. Popover de navegação sobreposto, sem deslocar o conteúdo. Tab nativo, Escape, foco devolvido ao botão e fechamento por clique externo. |
| Navegação | `aria-current` na página atual; atalhos reais de Gastronomia funcionam e indicam a seção selecionada. |
| Agenda | Filtros reais de Tudo, Jazz, Bossa Nova, DJs, Piano Bar e Livros. Enter/Espaço, `aria-pressed`, quantidade anunciada e meses sem resultados ocultados. |
| Filtros na Home | Intenção levada à Programação por sessionStorage, sem alterar URLs ou conteúdo. A chave é consumida na página de destino. Nenhum dado pessoal é guardado. |
| Recursos demonstrativos | Feedback contextual não modal substitui `alert`. Não envia formulários nem simula operações. Popover pode ser fechado com Escape ou clique externo. |

Os filtros usam **os 21 registros já exibidos no design**, com categorias explícitas: 3 Jazz, 3 Bossa Nova, 9 DJs, 3 Piano Bar e 3 Livros. Não substituem os dados pelo acervo legado e não prometem sincronização automática. As 3.611 entradas legadas e seus contratos continuam preservados.

Formulários, PT/EN, calendário, lembretes, filtros de cardápio sem metadados suficientes e detalhes de eventos ainda demonstrativos permanecem identificados como pendentes. Os atalhos de Gastronomia que já tinham destino real foram liberados para navegação normal. Nenhuma tradução, preço, evento ou imagem foi inventada.

## Acessibilidade e custo

CSS e APIs nativas (WAAPI, IntersectionObserver e Popover). React Islands não foram necessários para este estado de interface; React, GSAP e Framer Motion não foram adicionados. O código da agenda é carregado somente na Programação.

`prefers-reduced-motion` desativa deslocamentos e animações. A mudança de preferência é tratada durante a sessão. Ações por teclado não esperam animação; o menu em fechamento fica inert. Focus e impressão revelam o conteúdo imediatamente. Não há animações contínuas, `transition: all`, `will-change` permanente ou animação de altura/largura.

## Validação e manutenção

Ver `RESULTADOS-EVOLUCAO-INTERATIVA.md` e `docs/evolution-validation/` para resultados finais, bytes e métricas de laboratório. A galeria local está em `output/playwright/evolution/index.html`.

O build continua `npm run build`, com saída `dist`, no projeto Pages existente. Não houve alteração de DNS, domínio, banco ou configuração de infraestrutura. Não houve merge para main nem troca de produção.

A fonte de manutenção é `src/design/claude` junto aos estilos e módulos TypeScript. Os scripts `import-claude.py` e `migrate-design-tailwind.py` são ferramentas históricas de importação/migração, não etapas do build; não devem ser reaplicados sobre os arquivos evoluídos, pois partem da estrutura da proposta anterior.

Fontes técnicas: [integração oficial Tailwind/Astro](https://tailwindcss.com/docs/installation/framework-guides/astro), [Preflight e importação sem reset](https://tailwindcss.com/docs/preflight), [detecção explícita de classes](https://tailwindcss.com/docs/detecting-classes-in-source-files), [Core Web Vitals e métricas de campo](https://web.dev/articles/vitals), [diferenças entre laboratório e campo](https://web.dev/articles/lab-and-field-data-differences).
