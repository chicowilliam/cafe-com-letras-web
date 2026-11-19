# Compatibilidade de URLs

Mantida a divisão original entre Savassi e Liberdade e entre desktop e `/m/`. Novos caminhos são equivalentes estáticos das consultas ASP, sem páginas ou seções editoriais novas.

| Entrada antiga | Destino / tratamento |
| --- | --- |
| `/` | Savassi desktop; 302 para `/m/` em UA mobile, como no legado |
| `/index.asp` | 301 para a unidade selecionada; preferência de cookie só auxilia entradas legadas |
| `/?unity=Savassi` | 301 `/`, grava preferência pública de unidade |
| `/?unity=Liberdade` | 301 `/liberdade/`, grava preferência |
| `?section=menu&subsection=all` | 301 `/cardapio/` ou `/liberdade/cardapio/` |
| `?section=menu&subsection=wine` | 301 `/carta-de-vinhos/` ou `/liberdade/carta-de-vinhos/` |
| `?section=menu&subsection=dessert` | 301 `/sobremesas/` ou `/liberdade/sobremesas/` |
| `/m/`, `/m/index.asp` e `unity` | `/m/` ou `/m/liberdade/`; entrada ASP/query recebe 301 |
| `/index-cardapios.asp` | 301 `/cardapiodigital/` ou `/liberdade/cardapiodigital/` |
| `/linktree/`, `/delivery/` | Preservados; respectivas variantes `index.asp` recebem 301 |
| `/medidas-prevencao/` | 301 `/medidas-prevencao/medidas-prevencao.pdf`, preservando o PDF recuperado |
| `/ajax/calendar.asp` | 301 para unidade com `date`/`calendar` numéricos e `#part2` |
| `/ajax/menu-card.asp` | 301 para unidade com data e `#part1` |
| Imagens por ID, CSS, fontes e PDFs selecionados | Caminhos públicos existentes mantidos; derivados WebP são adicionais e sem perda |
| `www`, `m` e `linktree` como hostname | Regras preparadas para apex, `/m/` e `/linktree/`; associação de domínios/DNS ainda não realizada |
| Admin, includes, SQL, documentos e inscrições privadas | Não copiados; 404. Nenhum redirecionamento para arquivos pessoais |
| Contato ASP | 503 explícito; sem SMTP/backend de envio nesta migração |
| Caminhos inexistentes | 404 real, sem redirecionamento genérico para a home |

`_redirects` não decide com base em query strings; por isso as regras de unidade/catálogo e seleção por UA estão na Function mínima. Ela não renderiza o site, não executa ASP e não consulta banco.

Os contratos AJAX antigos eram fragmentos HTML para o JavaScript legado. Como esse cliente foi substituído por JavaScript nativo e JSON estático, esses endpoints agora levam à interface equivalente. **Não se mantêm como API de fragmentos para algum consumidor externo desconhecido.** Confirmar consumidores antes do corte; se algum existir, aprovar adaptador específico.

A referência é o acervo local, não uma lista completa de URLs realmente indexadas em produção. Complementar o mapa com Search Console e fontes aprovadas pelo responsável antes da substituição da hospedagem.
