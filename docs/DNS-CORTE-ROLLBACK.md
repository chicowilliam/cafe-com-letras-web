# Pré-produção: DNS, corte e rollback

Nenhum registro DNS, nameserver, domínio customizado ou hospedagem antiga foi alterado. A API de zonas da conta Cloudflare retornou lista vazia para cafecomletras.com.br. A preparação abaixo é offline; não há zona Cloudflare importada ou ativada.

## Inventário observado em 19/11/2026

Foram feitas 68 consultas públicas, com 22 registros distintos sob o domínio. Dados completos, TTLs observados e rascunho BIND ficam em `evidencias/pages/preproducao/dns-observado.json` e `zona-cloudflare-pendente.zone`, fora do Git e do diretório publicado.

| Nome/tipo | Situação observada e preservação necessária |
|---|---|
| NS | dns1, dns2, dns3 e dns4.tulioaraujo.com; manter até autorização de corte |
| SOA | Autoridade dns1.tulioaraujo.com; serial observado registrado na evidência |
| Apex A | 187.1.142.49; destino atual e referência de rollback |
| Apex AAAA | 2804:10:8021::142:49; destino atual e referência de rollback |
| www, m, linktree, ftp CNAME | web21f38.uni5.net.; não mover ftp para Pages |
| MX | Google: ASPMX.L.GOOGLE.COM (1), ALT1/ALT2 (5), ALT3/ALT4 (10); preservar os cinco |
| TXT SPF | v=spf1 a mx include:_spf.uni5.net include:_spf.google.com include:_spf.kmitd.com ~all |
| Outro TXT | Verificação Microsoft existente preservada no inventário, sem necessidade de reproduzir token neste roteiro |
| DMARC | p=none, com endereço de relatório do domínio; preservar registro completo da exportação |
| webmail CNAME | ghs.googlehosted.com.; manter DNS-only |
| autodiscover/autoconfig CNAME | autoconfig.uni5.net.; preservar até confirmar utilização |
| CAA | Nenhuma resposta na consulta realizada; confirmar exportação e herança antes de emitir certificados |
| DS e DNSKEY | Nenhuma resposta nas consultas realizadas; confirmar no registrador e provedor antes do corte |
| DKIM | Seletores comuns consultados não retornaram registros; isso NÃO prova ausência de DKIM. Obter nomes e chaves efetivos no provedor de e-mail/exportação |

O SPF contém `a`: trocar o IP do apex altera o significado desse mecanismo, mesmo preservando o TXT literalmente. Confirmar quais serviços enviam e-mails e validar autorizações SPF de cada emissor; não remover includes por suposição. Não criar segundo registro SPF.

**Bloqueio real:** DNS público não permite inventariar todos os nomes existentes. É indispensável obter a exportação completa da zona do provedor autoritativo, incluindo subdomínios, SRV, curingas, verificações, DKIM e TTLs originais. O rascunho é marcado INCOMPLETO/NÃO IMPORTAR. Não se alega inventário integral nem zona preparada no painel com base apenas nessas consultas.

## Preparação após exportação e autorização específica

1. Conferir a exportação integral com o responsável; guardar cópia privada datada e validar por SHA-256. Registrar acesso ao registrador e aos dois provedores. Não confundir cópia de zona com backup de mensagens.
2. Criar zona Cloudflare no plano gratuito, ainda pendente; importar e comparar registro a registro. Importar TXT com aspas e conteúdo integral. Não copiar SOA/NS internos nem DNSKEY/DS antigos como registros comuns. Manter e-mail, ftp, autodiscover e serviços auxiliares em DNS-only.
3. Antes da troca de NS, manter A/AAAA/CNAME web apontando para os destinos antigos na zona nova. Isso separa a migração da autoridade DNS da migração do site e facilita rollback. Confirmar TTLs com o provedor; diminuir TTL é alteração DNS e exige autorização.
4. Conferir DNSSEC no registrador. Se houver DS, coordenar sua remoção/rotação e os prazos com o provedor; um DS incompatível provoca SERVFAIL. Não executar esse procedimento agora.
5. Solicitar aprovação do inventário e janela de mudança antes de alterar nameservers. Anotar os nameservers atribuídos realmente pela Cloudflare, sem inventar valores.

## Corte do site — somente após autorização separada

- Para apex em Pages, a documentação oficial exige zona e nameservers Cloudflare. Após ativar a zona preservando os destinos antigos, associar cafecomletras.com.br em Pages > Custom domains, esperar certificado ativo e só então efetivar o destino web criado pelo fluxo Pages. Não basta inserir um CNAME sem associar o domínio.
- A alteração do apex deve considerar A e AAAA antigos: não deixar IPv6 levando parte dos visitantes à hospedagem anterior. Não mover e-mail ou ftp junto do site.
- Associar www, m e linktree apenas se confirmados em uso. Usar os redirects já preparados para apex, /m/ e /linktree/. Validar cada certificado e evitar loops. Não inferir aliases adicionais.
- O código determina indexação por hostname: somente HTTPS cafecomletras.com.br com resposta 200 de página válida é indexável. pages.dev, hosts desconhecidos, erros e 404 continuam noindex, independentemente de DEPLOY_ENV. Robots oficial anuncia sitemap; prévia bloqueia rastreamento.
- O build pode continuar em DEPLOY_ENV=preview para manter newsletter sem envio e o HTML estático com política conservadora; o middleware aplica a política correta ao hostname oficial. Não usar DEPLOY_ENV=production para ativar serviços não homologados. Todas as páginas HTML/robots passam pelo middleware; assets ficam fora e recebem os headers por hostname.
- Validar HTTPS/cadeia de certificado, HTML, CSS, JS, fontes, imagens, PDFs, agenda, cardápios, páginas das duas unidades e redirecionamentos ASP. Confirmar 404 real e bloqueio de administração/documentos. Testar IPv4 e IPv6, navegador mobile e desktop. Nunca usar apenas mudança local no arquivo hosts como prova de certificado público.
- Validar meta robots e X-Robots-Tag no domínio oficial e em pages.dev após o corte; conferir canonicals e sitemap, envio de formulários desativados e links realmente habilitados. Confirmar operação de e-mail com o responsável, sem enviar mensagens de teste sem autorização.

## Rollback

Guardar: exportação da zona, valores web antigos acima, nameservers antigos, TTLs, identificação do último deploy Pages bom e acessos à hospedagem anterior. Não desativar a hospedagem antiga durante a janela de estabilização.

Se a autoridade Cloudflare já estiver estável e apenas o site falhar, preferir restaurar A/AAAA/CNAME web antigos na zona Cloudflare, preservando MX/TXT e serviços; considerar modo DNS-only para regressar à origem e evitar loops/TLS de proxy. A propagação segue TTLs e não é instantânea. Se o erro for exclusivamente do código novo, usar rollback para um deploy Pages previamente validado.

Se a migração da autoridade DNS falhar, reverter nameservers no registrador para os quatro NS antigos e coordenar DNSSEC/DS com o responsável. Revalidar resolução em múltiplos resolvedores e e-mail; não alterar registros ao acaso. Registrar horário, motivo e resultado. Critérios para abortar: HTTPS inválido, SERVFAIL, e-mail afetado, perda de recursos essenciais, 5xx persistentes ou indexação indevidamente bloqueada.

Referências: https://developers.cloudflare.com/pages/configuration/custom-domains/ e https://developers.cloudflare.com/pages/configuration/headers/ .
