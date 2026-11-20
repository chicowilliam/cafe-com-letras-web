# Atualização imediata da programação

O /admin/home/ antigo era ASP Clássico, com escrita em T_CALENDAR/T_ARTISTS no MySQL. O novo projeto é Astro estático e bloqueia /admin/* no middleware. Remover esse bloqueio não faz o ASP funcionar. A agenda pública atual usa src/data/public-source.json, com 3.611 eventos e 1.182 artistas migrados; a exportação é de 18/11/2026 e há 16 eventos a partir de 20/11/2026, até 18/12/2026. Esses registros já estão no site, não são novos cadastros recebidos agora.

O build gera o HTML desktop/mobile, o índice de meses e os arquivos /data/calendar/{unidade}/{AAAAMM}.json. Salvar no antigo MySQL não atualiza o site novo. O caminho imediato é alterar os dados locais, testar e fazer commit/push na main do repositório privado. O Pages já tem deploy automático ativo. A autenticação operacional é o acesso existente ao computador/repositório privado; nenhum formulário ou endpoint administrativo público é criado por este procedimento.

## Dados a solicitar ao proprietário

Para cada novo evento: unidade (Savassi ou Liberdade), data completa, horário, artista/nome da apresentação, descrição pública e couvert/valor ou confirmação explícita de gratuito. Foto é opcional. Confirmar se é inclusão, correção ou cancelamento; para correção/cancelamento informar o evento/data anteriores. Publicação na unidade Liberdade requer confirmação de funcionamento, pois o site preserva o aviso anterior de fechamento.

O operador resolve os IDs; o proprietário não precisa fornecê-los.

## Comando disponível agora

```powershell
node scripts/programacao.mjs --artists "parte do nome"
node scripts/programacao.mjs --file "evidencias/programacao/lote-aprovado.json"
node scripts/programacao.mjs --file "evidencias/programacao/lote-aprovado.json" --apply
```

Sem --apply há apenas simulação. --apply altera somente os arquivos locais de conteúdo; não publica, não faz requisições de rede e não acessa MySQL. O lote é totalmente validado antes da escrita. Não colocar senhas, dados internos ou informações ainda não aprovadas no lote.

Contrato JSON (não é uma lista de eventos a publicar): objeto com arrays opcionais artists, events e deleteEvents. Pelo menos uma operação é necessária.

| Campo de events | Preenchimento |
|---|---|
| calendar_id | Omitir para inclusão com ID gerado; informar ID existente para correção |
| calendar_unity | 1 para Savassi; 3 para Liberdade |
| calendar_date | Data real, texto de oito dígitos AAAAMMDD |
| calendar_time | Horário local de Belo Horizonte, texto de quatro dígitos HHMM |
| calendar_artist | ID consultado com --artists ou cadastrado no mesmo lote |
| calendar_price | Texto público aprovado, inclusive para evento gratuito |

Para novo artista: incluir em artists um objeto com artist_id positivo ainda não utilizado, artist_name e artist_release. --artists informa nextArtistId. A descrição é sanitizada antes de ser salva. Para atualizar artista existente, informar seu ID; isso altera o texto compartilhado pelas suas apresentações, inclusive históricas. Criar outro artista/apresentação quando o conteúdo for específico de uma atração diferente.

Novos artistas ficam sem imagem até o cadastro de uma foto aprovada: o comando acrescenta seu ID à lista existente unavailable-artist-images.json para evitar imagens quebradas. Não inventa foto, valor ou descrição. Fotos já existentes não são alteradas. A inclusão posterior de foto deve ser revisada pelo operador com os arquivos aprovados.

Para cancelamento: colocar os IDs existentes no array deleteEvents; o comando não remove artistas nem outros conteúdos. Um mesmo ID não pode ser corrigido e cancelado no mesmo lote. Reimportar uma inclusão idêntica é tratado como operação sem mudança; conflito de unidade/data/horário/artista exige o ID correto, evitando duplicação acidental.

## Revisar e publicar

```powershell
node tests/programacao.mjs
npm run check
npm run build:production
npm run test:artifacts
git diff -- src/data/public-source.json src/data/unavailable-artist-images.json
git add -- src/data/public-source.json src/data/unavailable-artist-images.json src/data/calendar-months.json shared/security-policy.ts
git diff --cached --stat
git commit -m "Atualiza programação cultural aprovada"
git push origin main
```

Revisar os dados e artefatos gerados antes do commit; incluir apenas mudanças relacionadas ao lote. Não usar git add . quando houver trabalho de outras tarefas na pasta. Se não houver eventos reais novos, não aplicar lote vazio e não publicar eventos fictícios.

Após deploy bem-sucedido: conferir o JSON do mês/unidade, o evento no calendário desktop e na agenda mobile, horários/couvert e imagem quando fornecida. Validar no domínio oficial, sem concluir somente pelo build. O site permanece no deployment anterior até o Pages publicar uma versão válida.

Rollback de um lote: reverter seu commit e fazer novo push. O histórico original e o MySQL não são alterados. Manter a hospedagem antiga, sem reabrir o ASP publicamente.

Os testes do comando usam registros reais já migrados em cópias na memória; nenhum evento de teste é escrito nos dados de publicação. O teste cobre inclusão, correção, cancelamento, duplicidade, datas/horários inválidos, vínculos inexistentes, sanitização e preservação das demais coleções.
