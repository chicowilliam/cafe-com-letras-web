# Refinamento incremental de UI/UX

Base da validação inicial: `cafe-com-letras-web`, `9a18755` (`main`). A publicação foi integrada à atualização institucional `cd2ccfa` da branch principal, preservando avisos de privacidade, exclusão de rascunhos jurídicos em produção, formulário de cookies e newsletter desativada. Referência consultada: `cafe-com-letras`, `c2619b9`. Implementação preparada na branch `polish/ui-ux`; a publicação foi autorizada posteriormente pelo usuário.

## Comparação e decisões

| Referência antiga | Decisão no projeto atual |
| --- | --- |
| `SiteWallpaper.tsx`, `HomeBotanicalSheet.tsx` e caminhos botânicos | Avaliados. Não transportar a camada contínua, os padrões ou as transparências: os fundos sólidos Mesa e Palco são parte da composição atual. Nesta passagem, preservar os espaços existentes trouxe menos risco visual que acrescentar ornamentos. |
| `Footer.tsx`, `InstagramIcon.tsx`, `SpotifyIcon.tsx` | Recuperar apenas o princípio de SVG monocromático, nomes acessíveis e alinhamento. Instagram e YouTube usam os destinos já presentes no projeto atual. Spotify não foi acrescentado: o endereço da referência antiga não foi homologado para este projeto. |
| `Newsletter.tsx` | A versão antiga abre WhatsApp. A newsletter atual é demonstrativa, sem integração de cadastro. Não transportar o fluxo antigo nem simular sucesso: informar a indisponibilidade junto ao campo e preservar o formulário. |
| `Navbar.tsx`, `Hero.tsx` | Preservar o cabeçalho e o hero atuais; manter reservas em destaque. Acrescentar acesso ao conteúdo por teclado, `aria-current` na navegação existente e alvos maiores no menu mobile. |
| `SectionBridge.tsx` | Não importar divisórias, ondas, sobreposições ou espaçamentos que mudem a sequência visual. |
| Componentes de curadoria | Avaliados os estados acessíveis e o respeito a movimento reduzido. Não transportar vídeos, carrosséis, dependências ou a arquitetura React. |

## Alterações

- CSS específico em `src/styles/polish.css`, sem alterar os tokens de identidade. Botões e proporções existentes mantidos; raio de 12 px apenas nos estados dos links da barra mobile.
- Instagram e YouTube recebem SVGs de 18 px, traço consistente, `currentColor`, nomes visíveis e ícones ocultos de leitores de tela. O rodapé mobile ganha os mesmos dois destinos em uma linha compacta.
- Menu, chips e links do rodapé têm alvos de pelo menos 44 px no celular. Menu longo pode rolar dentro da altura disponível, reservando espaço para a barra de ações em telas baixas.
- Newsletter alinha campo e botão de 48 px, mantém a composição e ocupa a largura disponível no celular. O aviso associado ao campo informa que nenhum dado é enviado.
- Feedback demonstrativo da newsletter fica inline. O bloqueio de submit passa a atingir apenas formulários explicitamente demonstrativos, preservando futuras integrações funcionais.
- Skip links distinguem a home desktop e mobile. Páginas internas e de artistas recebem destino de foco pelo layout, preservando o marcador `<main>` usado na montagem da página de artista. O link ativo da navegação informa `aria-current="page"`.
- Nenhuma dependência, backend, URL social nova não verificada, alteração de Tagme ou nova biblioteca de animação.
- Hashes CSP foram regenerados pelo pós-processamento original do build; as diretivas e permissões da política permanecem iguais.

## Evidências e limites

Arquivos locais em `output/playwright/polish/` (ignorados pelo Git):

- `preservation.json`: tokens, configuração WhatsApp, dependências, destinos originais, Tagme e quantidade de seções preservados.
- `after.json`: 32 combinações das sete páginas e da rota de DJ Poetry em 320, 390, 768 e 1440 px; sem overflow, imagens quebradas ou erros de JavaScript. Menu, Escape, retorno de foco, navegação, alvos de toque, skip link e feedback honesto da newsletter verificados.
- `controlled-before-*` / `controlled-after-*` e `comparison.json`: home e gastronomia em 390 e 1440 px. A baseline foi reconstruída com o HTML de `HEAD` na mesma sessão e os ajustes locais revertidos no DOM/CSS. Os primeiros 700 px permanecem idênticos pixel a pixel; fundos e família tipográfica permanecem iguais.
- Capturas completas das sete páginas e da rota de DJ Poetry em 390 e 1440 px, além de recorte de revisão do rodapé desktop.

As capturas finais usam as três famílias oficiais (Bricolage Grotesque, Inter e IBM Plex Mono), obtidas do Google e servidas por cache de teste local para estabilizar a comparação. O carregamento das três famílias foi confirmado nas 32 combinações. Nenhum arquivo de fonte ou URL do produto foi modificado. Não houve medição de Core Web Vitals em dispositivos reais. O refinamento adiciona cerca de 2,2 KB de CSS fonte, incorporado ao stylesheet existente, e SVGs inline; não acrescenta pedidos de rede, vídeo ou filtros pesados.

O site continua com conteúdos demonstrativos e formulários sem integração que já existiam. Não foi introduzida mensagem de sucesso de inscrição.

## Build e testes

TypeScript: 27 arquivos, 0 erros e 0 avisos. Agenda: 3.611 eventos reais preservados. Artefatos: 21 páginas verificadas, 17 URLs de sitemap, 17 testes de redirecionamento, 1.620 arquivos e 23 eventos em schema. Migração e pré-produção passaram (34 casos de política/rotas); WhatsApp passou em 14 páginas e 30 links existentes. No navegador, menu, Escape, retorno de foco, navegação, skip link, newsletter sem simulação e menu livre da barra de ações em tela de 320 px de altura passaram.

`npm run build` foi executado, mas a etapa do Astro que relê e compara todos os assets públicos para preservar timestamps tornou a execução local excessivamente lenta. A compilação estática completa foi validada por uma configuração temporária em `output/playwright/polish/astro.validation.config.mjs`: a cópia pública interna foi desativada no hook do ambiente Vite, e os mesmos 1.373 arquivos públicos foram copiados pela API nativa do filesystem, preservando timestamps. O Astro gerou as 22 páginas em cerca de 50 segundos, antes da cópia nativa. O pós-processamento original gerou os dados, cabeçalhos e hashes CSP, e seus testes foram executados. O contorno é local: `astro.config.mjs`, `scripts/build.mjs` e as versões das dependências do projeto permanecem inalterados.

Uma tentativa offline de instalar as mesmas dependências isoladamente foi interrompida; seus arquivos parciais foram preservados em `output/playwright/polish/partial-dependencies`. A cópia de trabalho usa um junction para as dependências locais existentes em `../integration/node_modules`, sem alterar essa instalação.
