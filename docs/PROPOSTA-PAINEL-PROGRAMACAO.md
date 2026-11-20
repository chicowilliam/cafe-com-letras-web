# Painel mínimo proposto — implementação depende de aprovação

## Opção mais curta: persistência no GitHub já existente

Fluxo: proprietário autenticado pelo Cloudflare Access → tela de programação no Pages → Pages Functions protegidas → atualização versionada do JSON no GitHub privado → deploy automático atual → agenda publicada com o mesmo design, URLs e SEO.

O repositório existente é a persistência, com histórico e rollback. Isso evita criar um banco e mudar a leitura pública da agenda agora. A publicação continua levando o tempo de um build; salvar não significa que já está no ar. O painel deverá comparar o hash esperado com build-info.json e indicar separadamente salvamento, publicação pendente e publicação confirmada.

Escopo da tela: listar, cadastrar, editar e cancelar eventos; selecionar/cadastrar artista; unidade, data, horário, descrição e couvert; revisão e confirmação antes de publicar. Na primeira versão, usar imagens aprovadas já disponíveis e permitir evento sem foto. Nenhum módulo de cardápio, usuários, pagamentos ou reservas.

## Autenticação e proteção

- Cloudflare Access com allowlist dos e-mails indicados pelo proprietário e OTP/identidade existente, dentro do plano gratuito disponível. Nenhuma contratação paga; confirmar habilitação/limites antes de configurar.
- Proteger /admin/* e /api/admin/*; validar nas Functions a assinatura JWT do Access, issuer, audience, expiração e identidade autorizada. Não confiar somente em cabeçalho de e-mail.
- Rejeitar acesso administrativo pelos hosts pages.dev, prévias e aliases; o bloqueio atual de /admin continua até a nova proteção estar pronta.
- Escritas apenas com método permitido, Content-Type JSON, limite de tamanho, validação estrita, verificação de Origin e proteção CSRF. Credencial GitHub de escrita restrita ao repositório, mantida somente em Cloudflare Secrets, nunca no navegador, no Git ou no chat.
- Validação pura do comando operacional será compartilhada com a Function; somente o adaptador de persistência muda. A Function não executa shell ou código fornecido pelo usuário.

## Persistência e publicação

Leitura autenticada do arquivo conhecido no repositório; leitura raw/Blob apropriada para o arquivo atual de aproximadamente 1,5 MB. Escrita por API oficial GitHub, restrita a caminho/branch fixos, com SHA para impedir sobrescrita de edição concorrente. Commit registra autor e operação; conflitos exigem recarregar. Não aceitar caminhos de arquivo ou SQL fornecidos pelo navegador. Sanitizar a descrição e manter IDs/relações válidos.

Usar publicação explícita por lote para reduzir builds; verificar falha/sucesso antes de informar que o evento está no ar. Sem workflow Actions novo, sem MySQL e sem reabrir ASP. O proprietário precisará autorizar o mecanismo GitHub de escrita de menor privilégio e informar os e-mails de acesso em configuração privada.

## Quando considerar D1

Se for necessário salvar e publicar instantaneamente, sem build, a alternativa é Pages Functions + D1 separado para artistas/eventos e uma leitura pública controlada. A conta consultada não tem D1 criado nem binding de banco neste Pages. Essa alternativa exige adaptar o carregamento da agenda e coordenar HTML/JSON-LD para não perder SEO, portanto é maior que a opção GitHub e não é a primeira medida urgente. Não criar D1 ou alterar o site público sem aprovação.

## Administrativo antigo e protótipo existente

O ASP antigo confere apenas a presença de um cookie administrativo e concatena entradas em comandos SQL nos arquivos de programação. Por isso não será reaberto publicamente nem por simples alias. Só seria cogitável em origem isolada, sem acesso público direto, por VPN/Tunnel com Access e contas autorizadas, após endurecimento e revisão. Isso ainda escreveria no MySQL antigo e não sincronizaria o novo site; não atende ao objetivo imediato sob as restrições atuais.

Existe também um protótipo local Next.js/Prisma/Neon/Auth.js em cafe-com-letras-admin. Seu escopo é cardápio, executivo e fotos; não tem modelo de programação nem integração com esta agenda Astro. Não foi modificado, iniciado, publicado ou conectado à produção.

## Aprovação solicitada

Aprovar ou rejeitar a opção Pages Functions + Cloudflare Access + persistência no GitHub existente, com publicação pelo deploy atual. Após aprovação, configurar as identidades permitidas e o acesso GitHub privado, implementar apenas o CRUD de programação e testar falhas de autenticação, concorrência, dados inválidos e publicação antes de liberar ao proprietário.

Referências oficiais: [Pages Functions](https://developers.cloudflare.com/pages/functions/), [validação JWT do Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [GitHub REST Contents](https://docs.github.com/en/rest/repos/contents), [integração Git do Pages](https://developers.cloudflare.com/pages/get-started/git-integration/).
