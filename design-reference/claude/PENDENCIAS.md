# Pendências — o que não pôde ser recuperado ou ainda não existe

## A. Não recuperado neste pacote

| Item | Motivo | Como obter |
|---|---|---|
| Documento "Café com Letras — Estratégia para o novo site" (pesquisa de referências, diagnóstico do site atual, recomendações de SEO/hospedagem) | Vive como Claude Doc no claude.ai e não foi exportado para este pacote | O dono abre o documento no claude.ai e usa **Exportar → Markdown ou PDF**. Sugestão de destino: `docs/estrategia.md` |
| Canvas de Design original (editor interativo, comentários, modo Play) | Pertence à plataforma claude.ai; o runtime `support.js` não é exportável | Os artboards e o índice estão em `source/design-canvas/`; o canvas continua acessível ao dono no claude.ai |
| Arquivos de fonte (Bricolage Grotesque, Inter, IBM Plex Mono) | Carregados via CDN do Google Fonts; nenhuma cópia local foi feita | Baixar de fonts.google.com (licença SIL OFL) se for fazer self-host |
| Logo em vetor ou alta resolução | Só existe o raster de 400×200 baixado do site atual | Pedir o arquivo original (AI/SVG/PDF) ao Café / designer da marca |

## B. Conteúdo que falta (já marcado no design com etiqueta amarela)

- [ ] Fotos: salão, fachada, pratos, artistas, livros, exposição, eventos. Hoje todas são blocos cinza.
- [ ] Nome, artista e texto da exposição em cartaz (fotografia, até dez/2026).
- [ ] Cardápio do almoço executivo por dia da semana e preços (só o Paillard, R$ 70, foi confirmado).
- [ ] Preços das sugestões do chef.
- [ ] Formação do Matheus Avelar Quarteto (está no release, no drive compartilhado "Artistas").
- [ ] Carta de vinhos (aba "Carta de Vinhos 2026 - Café Savassi" da planilha de Fichas Técnicas).
- [ ] Couverts de dezembro/2026.
- [ ] Link da loja no iFood (hoje `#delivery-ifood`).
- [ ] Link do Google Maps (hoje `#mapa`).
- [ ] Destinos dos cartões do ecossistema (Clube de Jazz, Ototoi, Savassi Festival, Jornal Letras), hoje `href="#"`.
- [ ] Páginas "Trabalhe conosco" e "Imprensa" (`#trabalhe`, `#imprensa`).

## C. Dados a conferir antes de publicar

- [ ] **Preços dos drinks:** na planilha, nomes e preços estão em colunas separadas e foram associados **pela ordem dos blocos**. Conferir a lista: Mojito 25, Cosmopolitan do Café 25, Margarita 45, Aperol Spritz 34, Kir Royale 32, Caipirinha 19, Caipiroska 22, Gin tônica 32, Negroni 25, Fitzgerald 30, Hora da Estrela 42, Capitão Bala 25 (e Drink do Verão 22, que não aparece no site), Veredas 45, Iracema 22, Moramora 27, Pimentônica 19.
- [ ] "Dupla de pão de queijo" aparece na planilha a R$ 5,50.
- [ ] Preços de agosto/2026: confirmar com o cardápio impresso vigente. A regra da casa é que vale o preço impresso.
- [ ] Revisar os releases de todos os artistas antes de publicar (regra da casa).
- [ ] A agenda é estática (texto fixo de nov–dez/2026). Ela precisa ser atualizada ou automatizada (item D).

## D. Funcionalidades não implementadas

- [ ] Envio dos formulários de newsletter e eventos privados.
- [ ] Filtros da agenda e do cardápio.
- [ ] Versão em inglês (PT/EN).
- [ ] Agenda alimentada automaticamente pela planilha "Café 2026 - Programação" e pela de 2027 (era a recomendação do documento de estratégia).
- [ ] Uma página por evento: hoje existe só o modelo `evento.html`.
- [ ] Menu do celular (o botão não abre nada) e uma versão responsiva das páginas internas para celular (ver `TRANSFERENCIA_TECNICA.md`, seção 6).
- [ ] "Adicionar à agenda", "Ver em calendário" e transmissão "ao vivo agora".

## E. SEO e infraestrutura ainda não feitos

- [ ] meta description, Open Graph, favicon, schema.org (Restaurant e Event), sitemap.xml, robots.txt, canonical.
- [ ] Projeto no Cloudflare Pages, domínio e DNS (nada em produção foi alterado).
- [ ] `_redirects` das URLs antigas (`/m/`, `/linktree` e outras).
- [ ] Ativar os cabeçalhos de segurança (`docs/cloudflare/_headers.example`).
- [ ] Analytics, política de privacidade e consentimento (LGPD).

## F. Acessos de que o desenvolvedor vai precisar (não fornecidos aqui)

- Repositório GitHub (a criar).
- Conta Cloudflare.
- Registro.br do domínio cafecomletras.com.br.
- Hospedagem atual, para o mapa de URLs e o backup.
- Leitura das planilhas Google: "Café 2026 - Programação" e "Fichas Técnicas Café com Letras e Clube_2026".
- Drive compartilhado "Artistas" (releases e fotos).
- Contas Getin, iFood e Google Business Profile.
