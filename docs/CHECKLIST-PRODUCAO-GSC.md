# Google Search Console e checklist de liberação

Nenhuma propriedade Search Console foi criada/alterada, nenhum TXT foi publicado e nenhum sitemap foi enviado nesta etapa. Não há conexão Search Console disponível com a qual confirmar propriedade ou obter o token real.

## Antes do corte

- [ ] Obter exportação DNS integral e homologar serviços de e-mail/seletores DKIM. Preparação offline não é importação de zona Cloudflare.
- [ ] Aprovar conteúdo comercial, telefones, horários, preços, PDFs, agenda futura e situação da unidade Liberdade com o responsável. Dados recuperados não comprovam operação comercial atual.
- [ ] Definir canal de contato operacional. Telefone e WhatsApp estão preservados; o formulário ASP/e-mail continua sem backend e desabilitado. Não simular sucesso nem ativar SMTP.
- [ ] Homologar reservas no provedor real com o responsável. O link existente Savassi usetag.me/cafecomletras foi preservado e redireciona ao provedor Tagme; não foi feita reserva. Liberdade mantém aviso de indisponibilidade.
- [ ] Corrigir/confirmar certificado de letras.cidadescriativas.org.br; o teste encontrou incompatibilidade de hostname. Links bit.ly não puderam ser validados por falha de confiança TLS do cliente; não desativar verificação TLS. Delivery sujeito a bloqueios de automação requer teste humano, sem efetuar pedido.
- [ ] Resolver a duplicidade de Workers Builds mediante autorização específica. A proteção do repositório encerra esse build antes do deploy; o projeto Pages permanece o destino suportado. Não foi alterada a configuração ou versão do Worker.
- [ ] Acessar a propriedade Search Console existente, preferindo propriedade Domínio cafecomletras.com.br. Não criar propriedade duplicada por inferência.
- [ ] Se a conta não estiver verificada, selecionar verificação DNS e copiar o TXT real fornecido pelo Google. Guardar esse valor no local privado de operação; NÃO inventar token e NÃO importar placeholders.
- [ ] Solicitar autorização separada para acrescentar TXT de verificação no DNS autoritativo atual (ou na Cloudflare depois de ativa), sem substituir TXT existentes. Confirmar propagação e clicar Verificar na conta correta. Preservar a verificação após o corte.
- [ ] Registrar URLs/consultas importantes, indexação e páginas com links externos a partir da propriedade autorizada; complementar o mapa legado. Não foram acessados dados da hospedagem antiga.

## Após o corte autorizado

- [ ] Conferir HTTPS, 200, títulos, descriptions, Open Graph e canonicals em cafecomletras.com.br, sem noindex no HTML/cabeçalho de páginas válidas.
- [ ] Confirmar pages.dev com noindex mesmo compartilhando o build e todas as páginas/robots atendidas pelas Functions de hostname.
- [ ] Conferir robots oficial Allow e sitemap https://cafecomletras.com.br/sitemap-index.xml . O sitemap tem 12 URLs canônicas para 14 páginas: /m/ e /m/liberdade/ são alternativas mobile das homes, com canonical para / e /liberdade/, portanto não são exclusões indevidas.
- [ ] Enviar apenas sitemap oficial na propriedade correta. Não enviar pages.dev para indexação.
- [ ] Usar inspeção de URLs para home, Liberdade, cardápios, cartas, sobremesas, diretórios digitais e páginas de links/delivery. Conferir canonical declarada/escolhida e recursos renderizados.
- [ ] Validar dados estruturados no Rich Results Test/Schema Markup Validator. JSON-LD parseável não é garantia de rich results. Não incluir avaliações, localização, horários ou eventos inventados.
- [ ] Solicitar indexação seletiva das páginas principais e monitorar exclusões, 404, 301, desempenho e Core Web Vitals. Não prometer prazo/posicionamento/citações por IA.
- [ ] Monitorar Segurança e ações manuais da propriedade: foi encontrado spam oculto no conteúdo recuperado. A limpeza da cópia nova não comprova que a hospedagem antiga esteja limpa, nem revoga comprometimento anterior.
- [ ] Não usar ferramenta Mudança de endereço ao apenas trocar hospedagem mantendo o mesmo domínio.

SEO local/GEO/AEO: HTML indexável no domínio oficial, entidades Restaurant/LocalBusiness com endereço/telefone recuperados e revisão humana antes do corte, separação das unidades e conteúdo cultural verdadeiro. Não foram criados FAQs artificiais, avaliações, geocoordenadas ou serviços fictícios.

Referência: https://developers.google.com/search/docs/monitor-debug/search-console-start .
