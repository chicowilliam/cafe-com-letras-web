# Validação da etapa institucional

- Base de produção antes e após implementação: `9a187552254b064e2546b115ef680dd7be600efc`; Cloudflare Pages `ee050861-537f-4dad-9007-4c1df4fa2088`. Nenhum deploy desta branch em produção.
- CI limpo no GitHub Actions: [execução 44875517449](https://github.com/chicowilliam/cafe-com-letras-web/actions/runs/44875517449), build e testes aprovados. Pipeline inclui TypeScript, programação, artefatos públicos/SEO/WhatsApp, migração, pré-produção e testes institucionais.
- TypeScript local: 34 arquivos, zero erros, avisos ou hints. Auditoria npm das dependências de produção: zero vulnerabilidades.
- Playwright (plugin Browser ausente): Chrome desktop 1440 × 900 e WebKit com perfil iPhone 13. Home, três rascunhos jurídicos, Casa e Programação: 12 combinações com HTTP 200, H1 presente, zero overflow e nenhuma imagem visível quebrada; zero erros JavaScript.
- Interações: foco permanece no modal; Tab e Escape funcionam; foco retorna ao acionador; rolagem da página fica bloqueada; cookie unity e sessionStorage do filtro são removidos; nenhum registro fictício de consentimento criado; nenhum analytics/marketing ou POST disparado; FAQ responde ao teclado; filtro de jazz funciona.
- As imagens lazy em variantes ocultas da home são excluídas da contagem de imagens visíveis quebradas. Arquivos de foto originais não foram substituídos.
- Capturas e relatório detalhado fora do código publicado: `../institutional-qa/`. Emulação WebKit não substitui teste em iPhone físico; leitor de tela e auditoria WCAG completa ainda exigem avaliação manual.

Aceitar/rejeitar/revogar categorias opcionais não se aplica a esta versão: não há fornecedor opcional ativo. Foi verificada a ausência de requisições opcionais antes/depois da abertura e limpeza das preferências. Uma futura integração exige implementação e testes próprios de consentimento, sem reaproveitar este painel como se já fosse uma CMP.

Rascunhos jurídicos não equivalem a aprovação legal. Newsletter, confirmação/descadastramento e canais de imprensa/carreiras dependem de homologação externa. Reservas continuam no Tagme; os testes não realizam reservas, mensagens, cadastros ou envios de e-mail.
