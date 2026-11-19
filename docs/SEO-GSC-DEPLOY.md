# Publicação futura, domínio e indexação

Preparado em 19/11/2026. **Nenhum deploy, alteração de DNS ou acesso à produção foi realizado.** Este roteiro depende da resolução dos bloqueios do relatório de migração e de autorização posterior.

## Configuração preparada

- Astro 7, TypeScript, `output: static`; saída `dist`. Não precisa de adaptador SSR, IIS, ASP, MySQL ou ODBC na hospedagem.
- Domínio canônico: **https://cafecomletras.com.br**, comprovado pela regra HTTPS permanente do `web.config` original. Não foi feita consulta à configuração DNS/painel atual; propriedade, registros e configuração efetivamente publicada devem ser confirmados pelo responsável antes do corte.
- HTML com `lang=pt-BR`, título, descrição, canonical, Open Graph e JSON-LD. Desktop/mobile permanecem separados para preservar o original. `/m/` aponta canonical para `/`; `/m/liberdade/` para `/liberdade/`. O desktop anuncia sua alternativa mobile.
- Sitemap gerado por `@astrojs/sitemap`, com 12 URLs canônicas. Variantes mobile e 404 ficam fora. A raiz `404.html` evita o fallback de SPA do Pages.
- `_redirects` cuida dos caminhos estáticos e aliases de domínio. A pequena `functions/_middleware.ts` trata parâmetros legados e redirecionamento mobile. **Upload somente de `dist` pelo painel não substitui a compilação dessas Functions.**
- `_headers` e o middleware aplicam CSP, `nosniff`, proteção contra enquadramento e política de referência. A CSP permite recursos locais; somente o formulário público de newsletter existente pode enviar ao destino HTTPS original no build de produção. Não há SMTP, analytics ou API adicionada.

## Build e prévias

```powershell
cd C:\Users\User1\Desktop\CafeComLetras-Web
npm.cmd run check
npm.cmd run build
npm.cmd run test:artifacts
npm.cmd run preview
```

Prévia: `http://localhost:4321`. Servidor escuta **127.0.0.1**; outros nomes Host são rejeitados. Encerrar com Ctrl+C. Não manter `dev` e `preview` simultaneamente nessa porta.

O build padrão é `preview`: HTML `noindex, nofollow`, robots `Disallow: /` e cabeçalho `X-Robots-Tag`. O servidor de prévia local sempre acrescenta `X-Robots-Tag: noindex`, inclusive quando serve artefatos de produção. `npm run dev` serve para editar templates; não emula as regras Pages de compatibilidade. Usar `preview` para testar URLs antigas.

Para gerar **somente artefatos de produção**, sem publicar:

```powershell
npm.cmd run build:production
npm.cmd run test:artifacts
```

Nesse modo, páginas públicas têm `index, follow`, robots permite rastreamento e anuncia `https://cafecomletras.com.br/sitemap-index.xml`. A 404 continua `noindex`. Nunca reutilizar um build de prévia como produção; conferir `dist/build-info.json`, HTML, robots e os cabeçalhos reais após o futuro deploy.

## Cloudflare Pages — somente após autorização

1. Resolver contato/envios e demais bloqueios do relatório; aprovar o conteúdo comercial, preços, horários e situação das unidades. Definir responsável por atualizar agenda e dados estáticos.
2. Confirmar conta, plano, tráfego e limites aplicáveis. Não foi ativado serviço pago. As Functions acrescentam execução apenas às rotas listadas em `dist/_routes.json`; não acessam banco nem serviços externos.
3. Em ambiente de build novo, usar `npm ci`, lockfile e Node da `.nvmrc`. Configuração Pages: raiz deste projeto, comando **`npm run build`**, diretório de saída **`dist`**. Manter `functions/` e `shared/` na raiz do projeto junto do código-fonte.
4. Definir **DEPLOY_ENV=production apenas no ambiente Production**; no ambiente Preview usar **DEPLOY_ENV=preview**. Não usar o comando `build:production` como comando comum das prévias. `ASTRO_TELEMETRY_DISABLED=1` pode ser aplicado ao build. Nenhuma credencial MySQL deve ser cadastrada no Pages.
5. Fazer uma prévia autorizada e protegida, validar as Functions compiladas, redirects com query strings, UA mobile, cabeçalhos e 404 no runtime real do Cloudflare. Os testes atuais usam handler local; não substituem esse ensaio.
6. Associar o domínio canônico pelo fluxo de Custom Domains. Antes de qualquer alteração, inventariar/exportar a zona e preservar os registros de e-mail (MX, SPF, DKIM, DMARC), subdomínios e serviços existentes. Domínio apex e CNAME/subdomínios dependem da zona e do provedor atuais: não substituir nomes/valores por suposição.
7. Se estiverem efetivamente em uso, configurar os aliases `www`, `m` e `linktree` para que cheguem ao projeto. As regras de alias só atuam depois que o domínio estiver associado e o tráfego chegar ao Pages. Confirmar HTTPS e ausência de loops. Não criar aliases novos por inferência.
8. Validar os mesmos caminhos e recursos antes do corte; registrar plano de reversão para a hospedagem atual. Não transferir banco ou documentos privados para essa hospedagem.

## Google Search Console

- [ ] Acessar a propriedade existente antes de criar outra. Preferir propriedade **Domínio** `cafecomletras.com.br`, abrangendo protocolos e subdomínios.
- [ ] Se necessário, obter o TXT fornecido pelo Google e solicitar autorização para sua inclusão no DNS. Não inventar token nem excluir verificações existentes. Alternativa URL-prefix deve ser discutida se não houver acesso à zona.
- [ ] Antes do corte: registrar URLs/consultas relevantes de Search Console e listas aprovadas de links antigos, sem fazer crawl de produção nesta etapa.
- [ ] Depois do deploy autorizado: confirmar HTTP 200 das páginas/PDFs, 301 dos equivalentes ASP, 404 real para inexistentes, canonical correto e ausência de `noindex` nas páginas públicas. Validar também URLs finais após redirecionamentos.
- [ ] Enviar `https://cafecomletras.com.br/sitemap-index.xml` em Sitemaps.
- [ ] Inspecionar `/`, `/liberdade/`, catálogos das duas unidades, `/linktree/` e `/delivery/`: renderização, URL canônica declarada/escolhida, acesso de recursos, versão mobile e teste ao vivo.
- [ ] Testar JSON-LD no Rich Results Test/Schema Markup Validator. A validação local de sintaxe/campos não equivale à aprovação do Google. Eventos no calendário não têm página de detalhe exclusiva; a elegibilidade para rich results de Event permanece limitada.
- [ ] Solicitar indexação seletiva das URLs principais; não automatizar pedidos em massa ou prometer prazo/posição.
- [ ] Monitorar indexação, exclusões, erros 404/soft 404, redirecionamentos, desempenho e Core Web Vitals após o corte. Dados de campo dependem de tráfego real; medições locais não homologam CWV.
- [ ] A troca de hospedagem mantendo o mesmo domínio não exige usar a ferramenta de mudança de endereço. Avaliar tal ferramenta apenas se o domínio efetivamente mudar.

## SEO local, GEO e AEO

Foram preservados textos, nomes, endereços e conteúdos públicos, com HTML disponível antes de JavaScript. Dados de unidades têm identidade estável no JSON-LD; telefones foram extraídos das linhas de endereço, pois o campo legado chamado `phone` também contém link de recrutamento. Não há avaliações, coordenadas, CEP, FAQs, preços de ofertas ou respostas inventadas.

O aviso de Liberdade fechada foi mantido; não se declara fechamento permanente nem se anuncia evento nessa unidade. Event é usado somente para registros reais do calendário recuperado, futuros na data do build e com data/hora válidas. Revalidar comercialmente essas datas antes de publicar. Conteúdo de IA segue a mesma base factual; não existe configuração que garanta citação por assistentes ou indexação.

## Referências oficiais

- [Astro no Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/), [integração sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/).
- [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [Functions routing](https://developers.cloudflare.com/pages/functions/routing/).
- [Google canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Event](https://developers.google.com/search/docs/appearance/structured-data/event), [recursos de IA](https://developers.google.com/search/docs/appearance/ai-features).
