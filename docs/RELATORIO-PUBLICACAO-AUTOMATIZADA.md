# Publicação automatizada — concluída em 19/11/2026

## Resultado efetivo

- URL pública: https://cafe-com-letras-pages.pages.dev
- Projeto Cloudflare **Pages**: cafe-com-letras-pages.
- ID do projeto: 8517f735-191b-46e1-a7d8-0313ddbe6f75.
- Repositório privado: https://github.com/chicowilliam/cafe-com-letras-web . Privacidade reconfirmada pela API GitHub.
- Branch main; build npm run build; saída dist; framework do código Astro, sem necessidade de adaptador SSR. A API não preencheu o rótulo visual de framework; o build Astro foi executado e aprovado.
- Primeiro deploy: bbf2bccb-a3e4-418e-9cff-68a701b991fb; status success; Pages Functions compiladas e ativas.
- Commit implantado: a97fe473e699b00bc569a0e2081619d3d48768e3.
- Finalização: 19/11/2026, 12:16:12, horário de Brasília.

## Git Integration e automação

Criação e publicação executadas pela CLI oficial cf e API Cloudflare, após OAuth aprovado pelo responsável. O projeto foi criado com source.type=github e IDs do repositório privado; o primeiro deploy buscou a branch main no GitHub. Os logs confirmam clone, build e publicação. Não foi usado Direct Upload. As mensagens de upload dos logs são etapas internas do build Git do Pages.

A API confirma deployments_enabled=true, production_deployments_enabled=true e production_branch=main. Novos commits em main estão configurados para disparar builds. Builds de outras branches foram desabilitados para reduzir execuções desnecessárias; isso não altera a condição demonstrativa da URL pages.dev.

Não foi feito push adicional para testar um webhook: o Worker existente cafe-com-letras-web também está ligado ao repositório e um push poderia disparar seu pipeline. Não houve alteração ou exclusão desse Worker. Portanto, a configuração de deploy automático está confirmada pela API, mas o disparo por um novo commit ainda não foi ensaiado. A eventual desassociação do Worker exige autorização específica.

DEPLOY_ENV=preview e ASTRO_TELEMETRY_DISABLED=1 estão em Production e Preview. O ambiente de main se chama Production na plataforma, mas esta publicação continua sendo prévia demonstrativa, não homologação do domínio oficial. Não foram adicionados banco, credenciais de produção, integrações comerciais ou serviços pagos.

## Verificações realizadas

- Astro check: 16 arquivos; zero erros, avisos ou hints.
- Build local estático concluído em preview: 14 páginas públicas mais 404; 214 meses de agenda.
- Testes locais: 14 páginas, 12 URLs de sitemap, 17 casos de middleware/redirecionamento e 1.606 arquivos aprovados.
- Triagem de 1.404 arquivos versionados: nenhum caminho proibido ou padrão de segredo detectado. Contrato de dados contém somente coleções públicas. Não é uma certificação exaustiva de conteúdo editorial.
- Build remoto: clone do GitHub privado, Astro, assets e Functions concluídos com sucesso; Node 24.14.1 detectado conforme .nvmrc. O ambiente emitiu aviso de manutenção desse runtime: programar atualização validada, sem mudança nesta etapa.
- HTTPS com certificado validado pelo cliente; 14 páginas públicas com HTTP 200 na URL principal.
- HTML: títulos, descriptions, canonical oficial, JSON-LD parseável e noindex confirmados nas 14 páginas.
- Sitemap index e sitemap-0.xml: XML válido, 12 URLs canônicas. robots.txt: Disallow: /. X-Robots-Tag: noindex também confirmado em páginas estáticas e Functions.
- Compatibilidade ASP: /index.asp?unity=Liberdade e menu com query string retornam 301 para equivalentes; mobile UA retorna 302 para /m/. PDF de prevenção redireciona corretamente.
- /admin/, /system/ e /novostalentos/: 404; página inexistente: 404; unidade inválida: 400; endpoint de contato: 503, sem simular sucesso.
- Playwright/Chrome em contexto novo: desktop 1440x1000 e mobile 390x844, Savassi e Liberdade. Sem erros JavaScript ou recursos HTTP com falha; sem overflow horizontal ou imagens visíveis quebradas nas telas verificadas. Calendário avança no desktop; navegação do cardápio mobile testada. Nenhuma requisição externa da página identificada; o teste permitiu somente o hostname desta prévia.
- Um primeiro detector de imagens contava slides lazy fora do viewport horizontal como falhas; foi corrigida somente a geometria do teste. A repetição passou sem mudança no site ou relaxamento do bloqueio de rede.
- Capturas de referência em evidencias/pages: desktop-savassi.png, desktop-liberdade.png, mobile-savassi.png, mobile-liberdade.png. HTTP/SEO, navegador e configuração da API registrados em JSON no mesmo diretório, ignorado pelo Git.

Limites: os aliases por hash e main retornaram 403 no cliente HTTP deste ambiente; a URL principal acima foi efetivamente validada com 200 por HTTP e navegador sobre TLS. O acesso HTTP sem TLS também retornou 403; não foi possível comprovar redirecionamento automático HTTP→HTTPS. Utilizar a URL HTTPS principal. Não foi determinada a causa desses 403 nem alterada qualquer configuração de segurança global.

A validação local de JSON-LD não equivale à aprovação do Google ou à elegibilidade para rich results. Não se declara homologação de produção ou Core Web Vitals de campo. O layout foi inspecionado nas capturas da versão publicada; não se repetiu nesta rodada a comparação pixel a pixel com o ASP, já realizada na migração.

## Pendências da demonstração

Contato e reservas não têm serviço operacional: formulários estão desabilitados e reservas informa indisponibilidade; não houve envio ou simulação de sucesso. Links externos são bloqueados na prévia. Quatro imagens históricas ausentes (artistas 4, 819, 820 e 890) permanecem documentadas; nenhuma substituição inventada. Sua ausência pode aparecer ao navegar pelas datas antigas correspondentes, não nas telas correntes testadas.

## Domínio oficial, indexação e Search Console

Antes de associar cafecomletras.com.br: obter autorização separada; validar conteúdo comercial, preços, PDFs, horários, agenda e situação das unidades; resolver/aceitar fluxos operacionais de contato/reservas; inventariar/exportar a zona DNS e preservar MX/SPF/DKIM/DMARC e subdomínios; preparar reversão e confirmar URLs legadas e HTTPS. Nada disso foi alterado agora.

Para indexação oficial: revisar conjuntamente DEPLOY_ENV=production, HTML, robots e cabeçalhos. Antes de mudar a variável, implementar/validar tratamento por hostname ou separar ambientes para que TODOS os endereços pages.dev continuem noindex quando o domínio oficial se tornar indexável. A configuração atual bloqueia indexação de todo o projeto. Não basta mudar apenas a variável e presumir a separação. Conferir ausência de noindex exclusivamente no domínio oficial e canonical correto em cada rota.

Search Console: utilizar propriedade existente quando disponível; aprovar separadamente eventual TXT DNS; enviar https://cafecomletras.com.br/sitemap-index.xml somente após o corte autorizado; inspecionar URLs das unidades e cardápios; monitorar indexação, 301, 404 e Core Web Vitals. Não enviar pages.dev para indexação. SEO local/GEO/AEO deve manter dados factuais, sem inventar horários, avaliações ou promessas de posicionamento.

## Preservação

Original, Dev, MySQL, backups, repositório público antigo, Worker existente, hospedagem oficial e DNS não foram modificados. Nenhum backend foi criado. Browsers de teste encerrados. Relatório e evidências permanecem locais, sem novo commit/push para evitar disparar o Worker existente. Os relatórios anteriores que descrevem bloqueio OAuth são históricos; este documento registra o resultado final desta execução.
