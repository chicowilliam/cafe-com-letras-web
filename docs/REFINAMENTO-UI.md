# Refinamento editorial — Café com Letras

## Direção e referências

Preservados os blocos Mesa/Palco, terracota, azul, papel, Bricolage Grotesque,
Inter, IBM Plex Mono e o conteúdo existente. Sem troca de stack ou publicação.

- [The Rechabite / Awwwards](https://www.awwwards.com/sites/the-rechabite):
  hierarquia de eventos e feedback em ações. Aplicação deliberadamente discreta,
  sem reproduzir os efeitos cênicos do original.
- [NewGround Coffee](https://www.newgroundcoffee.com/), encontrado na
  [curadoria Food & Drink do SiteInspire](https://www.siteinspire.com/websites/category/food-and-drink):
  navegação por intenção e separação clara entre conteúdo e ações.
- [The Center for Fiction](https://centerforfiction.org/), também presente na
  [curadoria de literatura do SiteInspire](https://www.siteinspire.com/websites/category/books-and-literature):
  organização editorial de agenda, livros, visita e café.
- [The Jazz Cafe](https://thejazzcafe.com/): centralidade da programação e
  convivência entre identidade cultural e ações de visita/reserva.

O Godly foi consultado, mas redirecionou para `recent.design`, indisponível
na ferramenta de pesquisa. Nenhuma referência foi atribuída a esse catálogo.

## Auditoria e prioridades

1. Header das páginas internas ocupava cerca de 370 px na tela de 390 px:
   navegação compacta com controles nativos, Escape e restauração de foco.
2. Contato sem acesso persistente: botão WhatsApp SVG, número da configuração,
   texto contextual codificado, safe areas e afastamento da barra de ações.
3. Ritmo editorial: linhas de leitura limitadas, títulos balanceados, entrelinha,
   intervalos menores no celular, controles com raio de 12 px e estados claros.
4. Links demonstrativos de eventos levavam a detalhes indisponíveis: encaminhados
   à agenda. Links de imprensa/trabalho encaminhados ao contato com contexto.
   Ações de mapa abrem busca pelo endereço existente, sem mapas ou SDK pesados.
5. Cardápios legados tinham largura fixa de 960 px: ajustes limitados ao mobile.
6. Assets: dimensões explícitas nas logos, preconnect de fontes; fontes, imagens,
   regras de prioridade LCP e carregamento da agenda existente preservados.
7. Cardápio e programação: filtros por marcações veganas e pela seção
   “Para começar e dividir”. A carta de vinhos e a vista de calendário
   usam os destinos já servidos pelo projeto.

## Limites conhecidos

Há diferenças entre conteúdo publicado e o checkout local. Comparação visual
principal realizada com screenshots locais antes/depois; a produção não foi alterada.
Fotos ilustrativas, exposição a confirmar, traduções e integrações demonstrativas
preexistentes não foram substituídas por conteúdo inventado. Newsletter depende de
integração homologada. INP de campo exige tráfego real; TBT do Lighthouse não é INP.

As dependências declaradas foram restauradas com `npm ci`, sem alterar o lockfile.
Screenshots e resultados brutos de QA ficam fora do repositório, em
`%LOCALAPPDATA%/Temp/cafe-refinement`.

## Arquivos alterados

- `src/components/MobileHeader.astro` e `src/components/WhatsAppContact.astro` (novos).
- `src/layouts/ClaudeLayout.astro` e `src/layouts/OriginalLayout.astro`.
- `src/client/interactions.ts` e `src/client/fidelity.ts`.
- `src/config/whatsapp.ts`.
- `src/styles/refinements.css` (novo), `site.css`, `tokens.css` e `claude-responsive.css`.
- `src/design/claude/index.html`, `celular.html`, `gastronomia.html`,
  `programacao.html`, `evento.html`, `livraria.html` e `casa.html`.
- `tests/whatsapp.mjs`: aceita somente as mensagens configuradas para os contextos conhecidos.
- `shared/security-policy.ts`: hashes regenerados pelo build existente.
- Este documento.

O símbolo do WhatsApp usa a marca da coleção Font Awesome Free,
licenciada sob [CC BY 4.0](https://fontawesome.com/license/free).
O portal de marca da Meta exigiu login para acessar o arquivo original.

## Condições da medição de performance

As primeiras coletas Lighthouse tiveram falhas de protocolo do Chrome. Os JSONs
foram preservados como diagnóstico, não como aprovação ou comparação de release.
A coleta de desenvolvimento registrou desempenho 59, acessibilidade 98, LCP 8,14 s,
CLS 0,0015 e TBT 0 ms. O aviso `PROTOCOL_TIMEOUT` impede tratar esses números
como uma avaliação completa. A produção e o checkout também têm conteúdo diferente.

O build final passou em `npm run build`, incluindo tipos, programação, artefatos,
WhatsApp, migração e pré-produção. O Chrome verificou 20 rotas em 390 e 1440 px,
58 interações e a navegação legada em 768 px. A revisão não encontrou rolagem
horizontal, imagens quebradas, erros de console ou links internos ativos quebrados.

O Lighthouse na home estática registrou 87 em performance e 100 em
acessibilidade na rodada anterior aos filtros finais, com LCP de 1,81 s,
CLS de 0,0018 e TBT de 424 ms. A rodada do build final registrou 27 e 100,
com LCP de 7,88 s, CLS de 0,0015 e TBT de 6.740 ms. A última coleta apontou
atraso de renderização no título e bloqueio pela folha do Google Fonts.
Essa dispersão deixa a meta de performance em aberto. O INP de campo
não foi medido.
