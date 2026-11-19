# ETAPA 7A — Migração fiel do Café com Letras

Data: **19/11/2026**. Projeto independente: `CafeComLetras-Web`.

**Resultado:** leitura pública migrada e validada localmente em Astro + TypeScript, preservando o desenho do legado. **A substituição integral da hospedagem ainda não está homologada**, principalmente pelos fluxos de envio/reservas e pela validação do futuro ambiente Cloudflare. Nada foi publicado; DNS e produção não foram acessados ou modificados.

## Implementação

A infraestrutura Astro existente foi aproveitada; a homepage redesenhada anterior foi arquivada fora do projeto. React e Tailwind foram retirados desta versão, pois o uso direto do CSS original reproduz a aparência com menos dependências. O build gera HTML estático indexável, sem IIS, ASP, ODBC ou conexão MySQL na hospedagem.

Foram preservados os temas Savassi/Liberdade, tipografia, imagens, dimensões, cores, espaçamentos, navegação e a versão mobile separada. Os comportamentos necessários dos plugins antigos foram reimplementados em JavaScript nativo, mantendo sua marcação/CSS visual: destaques, notícias, navegação fixa, menu por data, calendário mensal, agenda, galeria e carrosséis mobile. Não foram criadas seções ou identidade visual novas.

### Páginas públicas

| Módulo | URLs estáticas | Resultado |
| --- | --- | --- |
| Home desktop das unidades | `/`, `/liberdade/` | Destaques, projetos, navegação, menu diário, calendário, notícias, institucional, galeria, contatos e redes preservados |
| Versões mobile | `/m/`, `/m/liberdade/` | Estrutura original, serviços, menu e agenda em carrosséis, notícias/institucional/contatos preservados |
| Cardápio completo | `/cardapio/`, `/liberdade/cardapio/` | 169 e 164 itens, respectivamente, iguais ao ASP |
| Carta de vinhos | `/carta-de-vinhos/`, `/liberdade/carta-de-vinhos/` | 27 e 47 linhas, respectivamente |
| Sobremesas | `/sobremesas/`, `/liberdade/sobremesas/` | 9 e 10 linhas, respectivamente |
| Variante de cardápios digitais | `/cardapiodigital/`, `/liberdade/cardapiodigital/` | Bloco original de PDFs preservado; compatibilidade com `/index-cardapios.asp` |
| Links públicos e delivery | `/linktree/`, `/delivery/` | Conteúdo, destinos e documentos públicos recuperados |
| Prevenção | `/medidas-prevencao/` | Redirecionamento para o PDF original, sem página inventada |
| Erro | `404.html` | Resposta HTTP 404 e `noindex`, sem falso redirecionamento para a home |

São **14 páginas públicas HTML**, mais a 404. Notícias e galeria continuam seções das páginas, como no original; não foram inventadas páginas de artigo ou de evento.

## Conteúdo e preservação

A exportação utilizou somente `127.0.0.1:3307/cafecomletras_dev`, com consultas explícitas de campos públicos e transação somente leitura, encerrada com rollback. Contas administrativas, assinantes, inscrições e documentos pessoais não foram exportados. Não há dump SQL, configuração de conexão ou credenciais no novo projeto.

O contrato tipado público contém 2 unidades/configurações, 28 categorias, **333 itens publicados**, **3.611 registros de agenda**, 1.182 artistas vinculados, 5 destaques, 1 notícia, 19 fotos, 3 links, configuração social e institucional. Os 29 itens sem categoria válida não aparecem no ASP e foram excluídos somente da exportação pública, por join; **não foram apagados do banco**. Pratos soltos sem sugestões publicadas também não foram copiados. O backup não possui sugestões diárias ativas: o estado vazio original foi preservado, sem inventar refeições.

HTML público recuperado foi sanitizado; nomes/campos são escapados na renderização, URLs perigosas e eventos inline não são mantidos. Dados são convertidos para UTF-8. Não se reutilizam cookies de autenticação, SQL concatenado, painel ou componentes de upload do legado.

### Integridade confirmada

- Original: **1.782 arquivos**, todos os hashes iguais ao início desta etapa.
- Dev: **1.810 arquivos**, todos os hashes iguais ao início desta etapa.
- Backup SQL privado: SHA-256 **BA7153B2927074DAF796D229DC491DB674B794230000B05885244286C9117177**, intacto e fora do Web.
- Banco local: **26 tabelas, 6.612 registros**, 26 hashes de dados, definições de colunas, índices e contadores `AUTO_INCREMENT` conferidos; sem divergências nos relacionamentos em relação ao manifesto recuperado. Contas e `sql_mode` global inalterados.

O verificador inicial sinalizou `AUTO_INCREMENT` divergente ao consultar estatísticas em cache/antes da abertura das tabelas. A conferência independente abriu as tabelas com `SELECT MAX(...)` e consultou os metadados com `information_schema_stats_expiry=0` **somente na sessão**: 26/26 contadores coincidiram. Não houve `ALTER`, `ANALYZE`, importação, ajuste global ou escrita nos dados. [A documentação MySQL descreve esse cache de metadados dinâmicos](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_information_schema_stats_expiry).

## Comparação visual e regressão

A referência foi o ASP local sob os bloqueios já validados, nunca a produção. As duas versões foram navegadas com Playwright/Chrome instalado; o navegador de teste utilizou proxy e allowlist de loopback. O ASP passou pelos bloqueios HTTP e pela verificação de conexão somente leitura antes de ser liberado para captura.

- Desktop: **1440 × 1000**; mobile: **390 × 844**; Savassi e Liberdade.
- **12 capturas comparativas**: topo, menu/calendário, notícias/institucional e contato no desktop, além das capturas mobile. Na rodada final, **0% dos pixels ultrapassaram o limiar de diferença adotado** (diferença de luminância >20/255). Pequenas diferenças numéricas abaixo desse limiar não são alegação de identidade binária dos screenshots.
- **14 páginas HTTP 200** e contagens de linhas dos catálogos iguais às capturas ASP.
- **21 verificações de interação aprovadas**: navegação, mês/dia da agenda, seleção de dia/semana do menu, destaques, galeria, carrosséis mobile de menu e eventos, 404 e bloqueio de requisição externa.
- Nenhum erro JavaScript, erro inesperado de console ou falha de recurso nas páginas testadas. Os registros de console remanescentes são a 404 deliberada e a tentativa externa proposital rejeitada pela CSP.
- Nenhuma requisição externa foi encaminhada pelo navegador/gateway de teste. Não houve envio de formulário nem operação de escrita.

As diferenças encontradas durante a implementação foram corrigidas: logotipo filtrado por um estilo com URL relativa, perda do parâmetro de catálogo durante a captura ASP, referências a `localhost:8080` no CSS mobile, caminho do ícone de delivery, carregamento da imagem da notícia, espaços entre dias inline e estado visual das setas mobile. Os ajustes ocorreram somente no Web ou nos utilitários de teste do laboratório.

**Limite do aceite visual:** corresponde às capturas/estados acima, não a todas as combinações de navegador, largura e eventos históricos. A estrutura desktop fixa e a interface `/m/` foram preservadas; não se promete responsividade redesenhada.

### Screenshots e evidências

- [Savassi desktop](../evidencias/fiel/savassi-desktop.png) e [mobile](../evidencias/fiel/savassi-mobile.png).
- [Liberdade desktop](../evidencias/fiel/liberdade-desktop.png) e [mobile](../evidencias/fiel/liberdade-mobile.png).
- [Agenda mobile](../evidencias/fiel/savassi-mobile-agenda.png).
- [Regressão e métricas](../evidencias/fiel/qa-final.json), [artefatos/URLs/SEO](../evidencias/fiel/artifacts-production.json), [preservação](../evidencias/fiel/preservacao.json), [integridade do banco](../evidencias/fiel/banco-integridade.json).

As referências ASP permanecem no laboratório local `CafeComLetras-Local/etapa7a-fiel/referencias`. Evidências antigas do redesign não são referência desta entrega.

## SEO, segurança e Cloudflare Pages

- Astro **7.4.12**, TypeScript **6.0.3**, `@astrojs/check` **0.9.12**, `@astrojs/sitemap` **3.7.5**. Build estático e verificação TypeScript aprovados; **0 erros/avisos/hints** no check final.
- **1.606 arquivos em `dist`**; maior arquivo com 7.067.704 bytes, abaixo do limite de 25 MiB por asset. HTML, PDFs e recursos são arquivos estáticos; não há dependências ASP incompatíveis no pacote.
- Sitemap e índice XML parseados; **12 URLs canônicas**. Robots, títulos, descrições, canonical, Open Graph, alternativa mobile e política de indexação verificados nos artefatos. O build de produção não aplica `noindex` às páginas públicas; a 404 permanece não indexável. Builds de prévia usam bloqueio de indexação, conforme o guia.
- JSON-LD validado localmente quanto a sintaxe, campos e correspondência com conteúdo renderizado: Website/WebPage e Restaurant/LocalBusiness por unidade; Event somente para registros futuros válidos do cadastro e nunca para Liberdade fechada. **Não é homologação do Rich Results Test nem garantia de rich results**: não há páginas individuais de evento no legado, o que limita essa elegibilidade.
- Canonical confirmado documentalmente: **https://cafecomletras.com.br**. Não foi feita verificação online da zona/hospedagem atual, por restrição desta etapa.
- **17 casos de middleware/redirecionamentos/bloqueios aprovados**, incluindo URLs ASP, unidade/catálogo, UA mobile, entrada inválida e acesso a diretórios privados. Redirecionamento por UA declara `Vary: User-Agent`.
- Conteúdo chega em HTML antes do JavaScript. SEO local/GEO/AEO se apoiam apenas em conteúdo e dados públicos verificáveis; não foram criadas avaliações, FAQs, coordenadas ou promessas de indexação/citação por IA.
- CSP restritiva e sanitização protegem a publicação estática. Painel, inscrições, uploads, documentos privados e banco não fazem parte do Web. O legado continua com seu status anterior de não homologado; esta migração não homologa seus fluxos bloqueados.
- `npm audit`: **0 vulnerabilidades reportadas em 19/11/2026**. O advisory transitivo anteriormente observado foi [retirado em 18/11](https://github.com/advisories/GHSA-fc5q-39xc-vjpf); não foi usado downgrade forçado para ocultá-lo. Repetir a consulta antes da publicação, pois a base muda.

### Performance

Foram mantidos caminhos/arquivos públicos originais, gerados **22 derivados WebP sem perda**, conferida igualdade dos pixels e economizados 210.118 bytes nas referências convertidas. Sessenta imagens receberam metadados de dimensões; há prioridade para o primeiro destaque, fontes locais, carregamento adiado de imagens apropriadas e cache duradouro para bundles com hash. O JavaScript público compilado soma **16.006 bytes**, sem React ou plugins legados no navegador.

Nas rodadas locais, CLS foi 0 no desktop e aproximadamente 0,000204 no mobile; LCP variou significativamente, chegando a aproximadamente **6,82 s na home Savassi na última rodada**, enquanto outras rodadas tiveram cerca de 1,6 s. São medições sem throttling padronizado, passando pelo proxy de isolamento, **não aprovação de Core Web Vitals**. Repetir performance na prévia Cloudflare autorizada e posteriormente em dados de campo, investigando LCP se a lentidão persistir. Não foi instalado Lighthouse ou dependência adicional para produzir uma nota artificial.

## Impedimentos para substituir a hospedagem

| Pendência | Estado atual | Solução mínima antes do corte |
| --- | --- | --- |
| Contato ASP/SMTP | Formulário visual mantido, envio desabilitado; endpoint responde 503 | Aprovar canal de contato existente ou pequeno serviço de envio com validação, controle de abuso e segredo fora do frontend; não reaproveitar credenciais de produção |
| Reservas | Integração legada não homologada, sem operação de reserva local | Confirmar serviço vigente/destino oficial; preservar o botão, aprovar redirecionamento ou integração necessária |
| Newsletter | Formulário HTTPS público original pode operar no build de produção; nenhuma submissão foi feita | Confirmar vigência do provedor, lista e condições de uso/consentimento. Prévias não enviam dados |
| Links de serviços, WhatsApp, projetos/redes e notícia externa | Destinos públicos recuperados preservados, sem acesso externo de teste | Responsável confirmar disponibilidade e contatos atuais; não substituir destinos por suposição |
| Agenda, preços, PDFs, horários e Liberdade | Retrato do acervo; aviso de Liberdade não funcionando preservado | Aceite comercial explícito dos dados antes da publicação; não anunciar Liberdade como aberta ou inventar programação |
| Atualização de conteúdo | Build usa dados estáticos; nenhum painel novo | Definir responsável/cadência de exportação pública e rebuild; decidir backend separado somente se necessário |
| Quatro imagens históricas | Arquivos dos artistas públicos IDs 4, 819, 820 e 890 ausentes no acervo; eventos de 2017, 2021 e 2022 | Recuperar de outra fonte autorizada ou aprovar tratamento editorial. Nenhuma imagem foi inventada e os documentos pessoais não foram usados como substitutos |
| AJAX antigo | Novos controles usam JSON estático; URLs de fragmentos recebem redirect para a página equivalente | Confirmar se existe consumidor externo desconhecido que exija adaptador do contrato HTML antigo |
| Inscrições/concursos/administração/uploads | Não migrados para o público; permanecem inacessíveis | Manter arquivados se inativos; se essenciais, aprovar implementação segura própria. Não dependem de instalar Persits para servir o público estático |
| Cloudflare, DNS e Search Console | Configurações preparadas, sem acesso/deploy | Validar runtime real das Functions, cabeçalhos, domínio, DNS e indexação após autorização; não basta copiar apenas `dist` ignorando as Functions |

**Não liberar a substituição integral enquanto funcionalidades essenciais ainda dependerem de decisões/serviços não homologados.** A migração de leitura está implementada; os fluxos acima não foram declarados funcionais apenas por simulação.

## Handoff

Os arquivos principais estão em `src/pages`, `src/layouts/OriginalLayout.astro`, `src/lib`, `src/client/fidelity.ts`, `src/data`, `public`, `functions/_middleware.ts`, `shared/security-policy.ts`, `scripts` e `tests`. [README](../README.md) contém os comandos locais. [Mapa de URLs](MAPA-URLS.md) registra os equivalentes. [Guia de Cloudflare/DNS/GSC](SEO-GSC-DEPLOY.md) contém a sequência de publicação futura e o checklist de indexação.

Para atualizar o conteúdo a partir deste laboratório, reutilizar os utilitários em `CafeComLetras-Local/etapa7a-fiel`: `Exportar-Publico.ps1` (campos públicos/rollback), `capturar.py` (ASP sob isolamento) e `preparar-publicacao.py` (templates e assets públicos). Executar depois `scripts/optimize-public-images.py`, check, build e regressão. Esses utilitários dependem do ambiente local privado existente; **não devem levar seus helpers/credenciais para o Pages**. O build normal do Web não executa essa exportação nem acessa MySQL.

Servidores de teste encerrados e portas de teste 4321, 8080 e 3307 conferidas sem listener ao final desta etapa. Publicação, DNS e qualquer backend adicional aguardam autorização.
