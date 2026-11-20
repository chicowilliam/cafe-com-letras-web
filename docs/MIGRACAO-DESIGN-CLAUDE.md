# Migração visual Claude — homologação

Implementação em `feature/novo-design-claude`, em worktree separado (`C:/Users/User1/Desktop/CafeComLetras-Claude`). A pasta original e suas alterações não commitadas foram preservadas. Nenhum acesso ao MySQL, alteração de DNS, hospedagem antiga ou merge para main faz parte desta entrega.

## Referência e implementação

O ZIP indicado no Desktop não estava presente. Foi usado o pacote já extraído em `C:/Users/User1/Downloads/cafe-com-letras-site/cafe-com-letras-site`. Os sete HTMLs, artboards, geradores, documentação e screenshots originais estão versionados em `design-reference/claude`, com SHA-256 dos HTMLs. Não houve reconstrução estética. A documentação do pacote declara que seus PNGs usam fontes substitutas; a comparação de migração utiliza também os HTMLs originais renderizados no mesmo navegador e com as mesmas fontes.

Rotas Astro: `/`, `/gastronomia/`, `/programacao/`, `/evento/`, `/livraria/`, `/casa/`, `/celular/`. As variantes `.html` têm 301 para as URLs amigáveis. O CSS global original permanece em `src/design/claude/original.css`; o HTML de conteúdo é importado no build pelo layout Astro. Não há React nem dependências novas: a stack existente é Astro e TypeScript e este trabalho não exige componentes React ou conversão para Tailwind.

Os geradores Python do pacote continuam arquivados como referência, mas a fonte da aplicação passa a ser `src/design/claude`. `scripts/import-claude.py` reproduz a importação a partir da pasta entregue e sobrescreve esse diretório; não executá-lo após editar conteúdo sem revisar as diferenças.

## Decisões de responsividade

- Desktop a 1440px: CSS, textos, dimensões e composição do pacote preservados. Os botões mantêm o raio em pílula aprovado no pacote, prevalecendo sobre a preferência geral de 12px.
- Home até 600px: usa o artboard `celular.html`, em vez de reinterpretar a Home desktop. Em telas menores que 390px, o container pode encolher. A 390px mantém a largura original. O artboard isolado continua disponível em `/celular/`.
- Até 900px: grids inline das páginas desktop passam a uma coluna; títulos de 132/150/180px recebem limites proporcionais. O grid das abas e as quatro ações rápidas do artboard mobile permanecem originais.
- Até 600px: título de evento reduzido a 60px, foto de marcação do evento com altura mínima de 360px; cabeçalho pode quebrar linhas. Não existe referência mobile das páginas internas no pacote: estes ajustes são adaptações técnicas documentadas.
- Menu mobile funciona com as mesmas páginas e aparência fechada do pacote. Sem animação.

## Integrações e impacto funcional

| Recurso | Tratamento |
|---|---|
| WhatsApp | `https://wa.me/5531984244285` com a mensagem predefinida existente, codificada na query. Nenhuma mensagem enviada nos testes. |
| Reservas | Destino existente `https://usetag.me/cafecomletras`, documentado no projeto como redirecionamento verificado ao Tagme. O Getin do pacote não substitui automaticamente o canal vigente. Nenhuma reserva realizada. |
| Delivery | Botões apontam para `/delivery/`, preservando a página e os destinos comerciais legados. O iFood não é inventado a partir do marcador do pacote. Os relatórios anteriores registram bloqueio antiautomação no provedor; operação comercial ainda requer homologação humana. |
| Newsletter e eventos privados | Permanecem demonstrativos: aviso no clique, sem envio; campos de texto somente leitura. Integração anterior da newsletter e seu opt-in `NEWSLETTER_ENABLED` continuam no código legado, mas não ativam o formulário do novo design. Reintegrar e homologar consentimento antes do lançamento. |
| Filtros, PT/EN, imprensa, calendário, lembrete, ecossistema | Aviso de demonstração ao clicar; atributos acessíveis identificam a indisponibilidade. Não há simulação de sucesso. |
| Detalhe de evento | Existe somente o modelo Matheus Avelar. Links de outros artistas não fingem abrir o detalhe correto: mostram aviso. A página modelo precisa de homologação e conexão aos dados. |
| Programação | Layout e agenda estáticos do pacote preservados. `public-source.json`, contratos TypeScript, scripts de atualização, dados mensais e testes operacionais legados permanecem. Atualizar esses dados ainda NÃO atualiza os textos da proposta: conectar o layout aos dados é um bloqueio de lançamento. |
| Catálogos, Liberdade, linktree, PDFs, página delivery | Rotas e recursos existentes mantidos por compatibilidade; ainda usam o layout legado. Não são as sete páginas desta adaptação. |
| Mobile legado | `/m/` Savassi recebe 301 para a Home responsiva; Liberdade mantém sua compatibilidade anterior. |

SEO: títulos, descriptions, canonical, Open Graph, Twitter, favicon e entidades institucionais Schema.org presentes. Nenhum Event fictício é criado para o modelo de evento. Schema Event legado continua nas rotas legadas em que há dados reais. `/celular/` usa canonical da Home e é excluído do sitemap; `/evento/` é modelo e também não entra no sitemap. A prévia usa noindex/robots bloqueado, inclusive pelo middleware. CSP permite as fontes Google originais. Redirecionamentos anteriores, dados e arquivos públicos preservados.

## Pendências para lançamento

Todos os itens de `design-reference/claude/PENDENCIAS.md` continuam sujeitos à homologação do proprietário: fotos (blocos de marcação preservados), exposição, preços, bebidas, executivo por dia, releases, formação do quarteto, couverts de dezembro e carta de vinhos. As referências a “hoje”, “ao vivo” e datas de novembro/dezembro são texto fixo da proposta, não estado operacional em tempo real.

É necessário aprovar o conteúdo comercial, conectar agenda e detalhes por evento aos dados existentes, decidir filtros/idioma/links institucionais e restaurar ou aceitar explicitamente os fluxos de formulário. A fidelidade do layout não equivale a homologação comercial. A prévia destina-se a revisão e não autoriza substituir a produção.

As validações e comparações finais são registradas em `docs/VALIDACAO-DESIGN-CLAUDE.md`. Evidências completas de navegador ficam em `output/playwright/claude/` (não publicadas no dist).
