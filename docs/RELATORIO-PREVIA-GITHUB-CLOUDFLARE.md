# Preparação GitHub + Cloudflare Pages — execução interrompida antes de publicar

## Resultado

**Prévia não publicada, sem URL pages.dev e sem deploy automático configurado.** A restrição explícita desta etapa determina não publicar quando faltar funcionalidade essencial. Contato/envio e reservas continuam ausentes; não foram declarados aprovados apenas por análise estática. Não houve push, alteração de visibilidade de repositório, deploy, mudança de DNS/nameservers ou acesso HTTP ao site oficial. ASP e MySQL não foram executados nem modificados nesta etapa.

## Operações concluídas

- Leitura dos relatórios da migração e do guia SEO/GSC/deploy.
- Git inicializado **somente em CafeComLetras-Web**, branch `main`. Sem remote ou commit: falta confirmar o destino privado compatível com o histórico existente. Não foi criado repositório remoto novo nem usado force push.
- `.gitignore` ampliado para excluir dependências, build, evidências locais, ambientes/segredos, SQL, ASP, backups, chaves e caches. Arquivos `.env.example` continuam permitidos.
- Triagem de 1.402 arquivos candidatos: nenhum arquivo de extensão/diretório proibido encontrado e nenhum padrão de segredo identificado. Essa triagem não é certificação de ausência de toda informação sensível. O teste dos artefatos também verifica que o pacote não contém ASP, SQL ou diretórios privados.
- TypeScript: 16 arquivos, zero erros, avisos e hints.
- `npm run build`: build estático **preview** aprovado, 14 páginas públicas mais 404, 214 chunks mensais de agenda.
- `npm run test:artifacts`: aprovado, 12 URLs no sitemap, 17 testes de middleware/redirecionamento/bloqueio, verificação de canonical, JSON-LD, recursos e política de indexação.
- O build atual em `dist` é de prévia: HTML `noindex`, robots `Disallow: /` e `X-Robots-Tag`. Nenhuma URL pública temporária foi inventada para preencher a entrega.

Evidências locais, excluídas do Git: `evidencias/fiel/revisao-pre-publicacao.json` e `artifacts-preview.json`. Não foi iniciado servidor nesta rodada; os testes foram de build e artefatos. HTTPS público, runtime Cloudflare, navegação e responsividade online permanecem não testados, pois não houve publicação. As comparações Playwright anteriores permanecem no relatório de migração.

## Repositórios identificados

- [chicowilliam/cafe-com-letras](https://github.com/chicowilliam/cafe-com-letras): público, branch `main`, com histórico e estrutura existente de Vite, `app`, `api`, `src` e `vercel.json`. Não se presume equivalência entre esse projeto e o novo Astro; não foi substituído por um commit raiz desconectado.
- Existe também `chicowilliam/cafe-com-letras-admin`, privado. Não foi utilizado: administração é outro escopo e não deve receber o site público por conveniência.
- O GitHub conectado possui acesso ao repositório Café com Letras; login não foi o impedimento. O destino precisa ser confirmado como repositório privado adequado, preservando a história. Não alterei a visibilidade de um projeto público existente sem avaliar seus impactos.

## Quatro imagens ausentes

| ID público de artista | Evento afetado | Efeito |
| --- | --- | --- |
| 4 | 08/09/2017 | Imagem ausente na agenda histórica pública |
| 820 | 03/10/2021 | Imagem ausente na agenda histórica pública |
| 819 | 10/10/2021 | Imagem ausente na agenda histórica pública |
| 890 | 01/05/2022 | Imagem ausente na agenda histórica pública |

Os quatro registros pertencem ao conteúdo público, não a documentos privados. Não afetam a programação corrente da referência recuperada, mas podem gerar imagem quebrada ao navegar por essas datas históricas. Nenhuma substituição foi inventada e o desenho não foi alterado.

## Contatos, reservas e serviços

- **Contato:** formulário desabilitado; `talk-to-us.asp` recebe 503 no adaptador. Não há serviço de envio no Astro.
- **Reservas:** integração legada não homologada; o cliente informa indisponibilidade. Nenhuma reserva real foi realizada.
- **Newsletter:** formulário legado depende de provedor externo; a prévia bloqueia envio e produção é uma configuração distinta. Não houve submissão ou validação fim a fim.
- **WhatsApp, delivery, recrutamento, redes sociais, projetos e notícia externa:** destinos públicos foram preservados. Disponibilidade comercial, titularidade dos contatos e funcionamento dos serviços não foram homologados nesta etapa; não foram feitos pedidos, inscrições ou mensagens de teste. Não se confunde presença de um link com serviço funcional.
- **Conteúdo:** horários, preços, PDFs históricos, programação e situação da Liberdade ainda exigem aceite comercial. O aviso de unidade Liberdade não funcionando permanece.

A publicação permanece bloqueada pelas ausências essenciais acima. A autorização de publicar foi condicionada a essas verificações; não permite ignorar seus resultados nem acrescentar backend/serviços de envio sem definição operacional.

## DNS: inventário de leitura

Consulta DNS pública identificou a delegação:

```
dns1.tulioaraujo.com
dns2.tulioaraujo.com
dns3.tulioaraujo.com
dns4.tulioaraujo.com
```

Esses são os nomes dos servidores autoritativos publicados; isso não identifica por si só o registrador nem comprova a empresa contratual da hospedagem. Foram consultados NS, SOA, A, AAAA, MX, TXT e CAA do apex, além de `www`, `m`, `linktree` e `_dmarc` quando disponíveis. O inventário bruto está **fora do projeto/Git**, em `CafeComLetras-Local/etapa7a-fiel/dns-publico-pre-publicacao.json`, evitando publicar identificadores TXT e dados operacionais sem necessidade.

DNS público não oferece enumeração completa da zona. Seletores DKIM, subdomínios desconhecidos, prioridades/proxy do painel e registros não descobertos precisam de exportação autorizada do painel DNS. Não foi tentada transferência de zona nem alterado qualquer registro.

## Retomada da prévia após resolver os bloqueios

1. Resolver ou definir explicitamente o tratamento dos fluxos essenciais; confirmar destino Git privado e estratégia de preservação do histórico. Repetir revisão do conjunto exato a enviar antes do primeiro commit/push.
2. Usar Git Integration do Pages, branch `main`, comando `npm run build`, saída `dist`, Node da `.nvmrc`. Não usar Direct Upload e não associar o domínio oficial nesta prévia.
3. **Enquanto o projeto inteiro for uma prévia pública, configurar DEPLOY_ENV=preview em ambos os ambientes do Pages, inclusive Production da branch main.** O nome “Production” no painel não autoriza indexação do pages.dev. Esta instrução complementa o guia anterior, que descrevia a futura publicação oficial.
4. Conferir o build-info, robots, meta robots e X-Robots-Tag na URL real, inclusive rotas atendidas por Functions; testar desktop/mobile, recursos, redirects e 404 no runtime real. Não habilitar newsletter ou outros envios para fazer testes de navegação.
5. Para o corte oficial, depois de autorização: associar domínio, revisar DNS com exportação/rollback, preservar MX/SPF/DKIM/DMARC e outros serviços, mudar o build oficial para DEPLOY_ENV=production e verificar ausência de noindex no domínio oficial. Manter pages.dev não indexável com regras de hostname/cabeçalhos também nas Functions; conferir isso antes de retirar o bloqueio global.
6. Search Console: confirmar propriedade Domínio existente, verificação TXT apenas com autorização, submeter sitemap canônico oficial, inspecionar URLs e acompanhar indexação/CWV. Não solicitar indexação da prévia. Schema.org e GEO/AEO continuam apoiados apenas no conteúdo público factual; não há garantia de rich results ou citações por IA.

O checklist detalhado continua em [SEO-GSC-DEPLOY.md](SEO-GSC-DEPLOY.md); [RELATORIO-MIGRACAO-FIEL.md](RELATORIO-MIGRACAO-FIEL.md) contém os bloqueios completos. Nenhuma integração com Cloudflare foi criada enquanto a condição de publicação não foi satisfeita.
