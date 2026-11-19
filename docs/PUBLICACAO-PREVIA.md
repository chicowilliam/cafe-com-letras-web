# GitHub privado e prévia Pages — etapa autorizada

A autorização mais recente permite a prévia demonstrativa com contato, reservas e quatro imagens históricas pendentes. Isso substitui o bloqueio funcional descrito no relatório anterior; não homologa produção.

## GitHub

Novo repositório exclusivo: https://github.com/chicowilliam/cafe-com-letras-web . Criado pela CLI oficial; a API confirmou `private: true` e `visibility: private` antes de qualquer push. O repositório público antigo não foi modificado.

**Código enviado com sucesso:** commit inicial `18f4006`, branch `main`, remoto `origin` exclusivo do novo repositório. O push terminou com `main -> main`; o acompanhamento de `origin/main` foi configurado. Um commit adicional registra este resultado. Não houve force push. Isso confirma envio ao GitHub, não deploy automático no Cloudflare, que continua pendente.

Verificações locais repetidas nesta execução: TypeScript com zero erros/avisos/hints em 16 arquivos; testes dos artefatos aprovados para 14 páginas, 12 URLs de sitemap e 17 casos de middleware, em modo **preview**. O build estático de prévia já validado foi mantido; não se alterou layout ou código funcional nesta rodada. Credenciais, SQL, ASP e evidências locais ficaram fora do commit.

O pacote Astro exclui SQL, ASP, backups, credenciais, documentos privados, administração, dependências instaladas, build e evidências locais. A triagem objetiva não identificou extensões/diretórios proibidos nem padrões de segredo entre os arquivos candidatos. Histórico inicial exclusivamente deste projeto, branch `main`, sem force push.

## Cloudflare: bloqueio técnico observado

Foi aberto o painel oficial na conta já conectada. O navegador informa que seu endereço de e-mail precisa de verificação. A leitura da interface funciona, porém tentativas de acionar o menu retornam `coordinate input geometry is unavailable`; capturas da janela também expiram. A alternativa de acesso às abas informa `The browser access host is unavailable`.

Não se criou projeto Pages, associação Git, deploy ou URL fictícia. Não houve Direct Upload, instalação de Wrangler, criação de token ou serviço pago. A limitação é o controle do painel, não as pendências secundárias já autorizadas.

## Intervenção mínima para continuar

No painel Cloudflare já aberto, concluir a verificação da conta se solicitada. Depois acessar Workers & Pages → Pages → conexão de repositório Git e autorizar **somente** `chicowilliam/cafe-com-letras-web` na integração GitHub, caso a instalação ainda não tenha acesso ao novo repositório privado. Não compartilhar senha, token ou código de verificação no chat.

Configuração prevista, sem domínio oficial:

- Pages com Git Integration; repositório **novo** privado; branch de produção `main`.
- Comando `npm run build`; saída `dist`; Node `24.14.1` conforme `.nvmrc`.
- `DEPLOY_ENV=preview` **em Production e Preview** enquanto todo o projeto for uma demonstração em pages.dev. Usar `ASTRO_TELEMETRY_DISABLED=1` no build se desejado.
- Não associar `cafecomletras.com.br`, não alterar DNS/nameservers, não escolher serviços pagos.
- Depois da integração, conferir que um commit de `main` dispara o build automaticamente, verificar o SHA do deploy e só então declarar o deploy automático validado.

HTTPS, navegação, CSS/JS, responsividade, robots, cabeçalhos, canonical, sitemap, JSON-LD e redirecionamentos no Cloudflare precisam ser testados na URL efetivamente criada. Testes locais não substituem essa verificação online.

## Funcionalidades da demonstração

O layout original foi preservado. O original depende de ASP/SMTP para contato e de integração externa para reservas; essa operação não existe no pacote estático. Formulários de envio permanecem desabilitados e reservas apresenta indisponibilidade; não se simula sucesso. Links externos são bloqueados pelo cliente na prévia. Não foram enviados e-mails, reservas, inscrições ou pedidos reais.

As imagens públicas existentes foram preservadas. Faltam os arquivos dos artistas IDs 4, 819, 820 e 890, usados em quatro eventos históricos de 2017/2021/2022; podem falhar ao consultar essas datas no calendário público, sem afetar a referência corrente. Não foram usados substitutos inventados.

## Futuro corte oficial

Resolver/aceitar os fluxos operacionais e revisar preços, PDFs, contatos, horários, programação e situação da Liberdade. Depois de nova autorização: confirmar/exportar a zona DNS inteira, preservar MX/SPF/DKIM/DMARC, preparar reversão e associar o domínio. A consulta DNS anterior identificou NS `dns1` a `dns4.tulioaraujo.com`; o inventário bruto permanece no laboratório, fora do Git.

Somente na publicação oficial, alterar o build correspondente para `DEPLOY_ENV=production`, conferir ausência de `noindex` no domínio principal e manter pages.dev não indexável por hostname/cabeçalhos, também nas Functions. Canonical permanece `https://cafecomletras.com.br`. Search Console: confirmar propriedade, autorizar separadamente qualquer TXT, enviar sitemap oficial, inspecionar URLs e monitorar indexação/CWV. Não solicitar indexação de pages.dev. SEO local e GEO/AEO permanecem factuais, sem dados inventados ou garantia de ranking/citação.

Guias: [SEO/GSC/DNS](SEO-GSC-DEPLOY.md), [relatório da migração](RELATORIO-MIGRACAO-FIEL.md) e [mapa de URLs](MAPA-URLS.md).
