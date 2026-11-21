# Etapa 3 — institucional, privacidade e confiabilidade

Branch: feature/institucional-privacidade. Base: main 9a18755. Nenhuma publicação em produção autorizada nesta etapa. Alterações locais da outra worktree preservadas.

## Auditoria (21/11/2026)

Home oficial, contexto Chrome limpo: zero cookies, localStorage e sessionStorage vazios. Requisições externas para Google Fonts e tentativa de beacon Cloudflare (bloqueada por CSP). Sem GA, GTM ou pixel. Configuração Pages: analytics não configurado; NEWSLETTER_ENABLED ausente. Não foram lidos ou publicados valores de segredos.

Inventário de código: cookie unity de unidade, 7 dias, SameSite=Lax e Secure em HTTPS; definido no middleware ao escolher unidade e pelo cliente legado. sessionStorage cafe-agenda-filter transporta categoria e é removido ao chegar à agenda. Não há categorias opcionais ativas; não se cria banner, escolhas ou registro de consentimento fictício. Painel nativo informa o inventário e limpa as preferências. Antes/depois da abertura e limpeza, nenhuma integração opcional é iniciada. Aceitação/rejeição/revogação opcionais: não aplicáveis sem fornecedor ativo. Se um fornecedor for introduzido, exige inventário, bloqueio prévio, categorias reais e testes de escolha/revogação; a estrutura atual não se apresenta como CMP preparada para terceiros.

Google Fonts permanece para preservar a tipografia; processa IP/dados de conexão. Self-host é uma opção futura sujeita à revisão de arquivos/licenças. Nenhum Google Consent Mode, CMP, banco, autenticação, pixel ou infraestrutura nova. CSP preservada; beacon não liberado. A configuração de injeção na borda precisa de revisão independente antes de ativar monitoramento.

## Formulários e canais

Newsletter: endpoint legado 25.idmkt8.com arquivado no código, condicionado a NEWSLETTER_ENABLED=1; não habilitado. Conta, contrato, consentimento, confirmação e descadastramento não foram verificados. A nova interface mostra indisponibilidade antes do clique e desabilita campos/botão: zero envio, zero PII armazenada, zero confirmação fictícia. Não há necessidade de antispam ou validação de campos desabilitados. Reativar requer backend/provedor com validação, deduplicação, proteção contra abuso e descadastramento reais.

Eventos privados: formulário desativado com WhatsApp contextual como alternativa explícita. Não é criada reserva paralela. Contato usa número oficial; e-mail não informado, portanto não inventado. Imprensa e trabalhe conosco continuam pendentes de destino oficial. Tagme, delivery e redes sociais preservados. Maps usa link de busca do endereço já confirmado, sem embed nem coleta prévia pelo Maps. Nenhuma reserva, mensagem, inscrição ou envio de e-mail foi realizado nos testes.

## Jurídico e publicação

Três páginas no layout existente: /politica-de-privacidade/, /politica-de-cookies/, /termos-de-uso/. Rascunhos com data, aviso visível, dados e bases legais propostos, pendências de controlador/CNPJ/encarregado/canal de direitos/retenção/transferências. Noindex e fora do sitemap. Build de produção falha enquanto legalReview.approved=false; remover/atualizar bloqueio somente após revisão jurídica e aprovação do responsável. Não há garantia de conformidade legal.

Referências: [guia ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf), [recomendações ANPD](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-emite-recomendacoes-para-adequacao-da-pratica-de-coleta-de-cookies-do-portal-gov.br).

## Eventos e UX

Agenda existente mantida; linhas têm início ISO com fuso -03:00. Estados calculados no navegador e atualizados a cada minuto. Sem horário final confirmado, não é inventada duração: mostra Iniciado — término não informado ou Data passada. Estados Em andamento/Encerrado são suportados quando houver fim explícito. Datas do design não são chamadas de hoje. Compartilhar evento transmite o link e a data, não a mensagem genérica de atendimento. FAQ usa apenas endereço/canais e condições já existentes. Modais usam dialog nativo com foco modal, Escape, retorno ao acionador e scroll lock. Links e estilos editoriais preservados; novos controles usam raio 12px. Sem widget genérico.

## Pendências externas

Revisão jurídica; identificação do controlador e canal de direitos; retenção e contratos dos fornecedores; homologação do provedor de newsletter; destino de imprensa/carreiras; confirmação comercial de agenda, preços e fotos provisórias. Não alterar produção, DNS, Worker ou MySQL.
