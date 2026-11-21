# Procedimento padrão: planilha de programação → site

Regra do Bruno (21/11/2026): toda atração confirmada na planilha de programação do Café entra no site
com página de artista e foto, e aparece na lista da Programação. Se o artista já tem página, só se
acrescenta a nova data. Uma tarefa agendada roda isto toda madrugada; o mesmo passo a passo vale para
qualquer pessoa ou agente que cadastre programação à mão.

## 1. Fonte: a planilha

- 2026: "Café 2026 - Programação" (Google Sheets, id `1u__NRuUKeDLd4M6klKjhSnRLSm3nNfOvjoXu1OYUiZs`),
  uma aba por mês ("Novembro", "Dezembro"). Em 2027: a planilha do ano novo (procure no Drive por
  "Café 2027 - Programação"; nunca invente o id).
- Ache as colunas pelo cabeçalho da linha 1 (a ordem muda entre abas): Dia do mês, Horário, Status,
  Atração, Projeto, Tags/ Descrição, Couvert.
- Entram as linhas com **Status = "Confirmado"** e Atração preenchida, de hoje até o fim do mês
  seguinte. Não entram: "Aguardando", Feriado, Férias, linhas sem atração, eventos internos.
- A coluna A ("Site") não é critério e a planilha **não deve ser alterada**.

## 2. O que já está no site

- Dados: `src/data/public-source.json` (`events` e `artists`; unidade Savassi = `calendar_unity` 1).
- Perfis e fotos: `src/data/artist-profiles.json` → página `/artistas/<slug>/`; fotos em
  `public/img/destaques/<slug>-<largura>.webp`.
- Lista da Programação: linhas `<a ... data-event-row data-event-start="AAAA-MM-DDTHH:MM:00-03:00">`
  em `src/design/claude/programacao.html`.
- A home ("No palco" e "Esta semana") é gerada dos dados: não se edita à mão.

Compare cada linha confirmada da planilha (data + horário) com os eventos da Savassi. Para cada
diferença: inclusão, correção de horário/couvert ou cancelamento (evento no site que saiu da planilha
ou deixou de estar "Confirmado" — cancelar só se a data for futura).

## 3. Artista: reaproveitar ou criar

- Procure o artista em `artists` pelo nome (sem acento, sem maiúsculas; "DJ Mellow" = "DJ Melloow",
  "SaFa DJs" = "DJs SaFa"). Se existir, **reaproveite o `artist_id`**: a página antiga só ganha a data.
- Se a atração for outro espetáculo do mesmo grupo (ex.: "Vinicius Mendes e Rodrigo Torino Quarteto
  toca Marcos Valle"), crie um artista novo com o nome do espetáculo, pois o release é diferente.
- Nome público: tire anotações internas da planilha ("(SEM buffet)", "(Buffet 26-50p)", "?").
  Lançamentos seguem o padrão `Lançamento do Livro "<título>" de <autor>`.
- Novo `artist_id` = maior id + 1; novo `calendar_id` = maior id + 1.

## 4. Release (sempre revisado antes de publicar)

- Drive compartilhado "Artistas" (id `0AMWbHxx9X4GzUk9PVA`), pastas Bandas e DJs: procure a pasta do
  artista (search_files com `title contains`), leia o release (Docs/docx/pdf).
- Revise: ortografia, nomes, datas e cidades; corte trechos datados de outros shows. Não invente
  nada. Formato: parágrafos separados por `<br><br>`.
- Sem release no Drive: para artista já existente, mantenha o release atual; para artista novo, use
  só o que a planilha diz (Projeto e Tags) em uma frase factual e registre a pendência no resumo.

## 5. Foto (sempre)

- Na mesma pasta do Drive, escolha uma foto do artista (retrato ou em ação; nunca flyer, cartaz ou
  capa com texto, exceto capa de livro em lançamento). Prefira arquivos de 100 KB a 5 MB.
- Baixe com `download_file_content`: a imagem fica salva em `/tmp/claude-tool-results/...` (o caminho
  vem no resultado). Olhe a imagem e confirme que é a pessoa/grupo certo.
- Recorte 4:5 centrado no rosto com Pillow e salve WebP (qualidade 80) em largura 800 (ou a largura
  original, se menor) e 440: `public/img/destaques/<slug>-800.webp` e `<slug>-440.webp`.
- Sem foto no Drive: use `public/img/artists/<id>.jpg` se existir (foto do site antigo); senão
  publique sem foto e registre a pendência.

## 6. Gravar

1. `public-source.json`: acrescente artista/evento (`calendar_date` AAAAMMDD, `calendar_time` HHMM,
   `calendar_price` "R$ 8 por pessoa" etc.; lançamento de livro sem couvert = "."). O comando
   `node scripts/programacao.mjs` faz isso com validação quando há `node_modules`; sem ele, edite o JSON
   com Python mantendo o formato e a ordem existentes. Artista novo sem `public/img/artists/<id>.jpg`
   entra em `src/data/unavailable-artist-images.json`.
2. Couvert: o da planilha. Vazio: DJ e Piano Bar "R$ 8 por pessoa"; Show e Bossa Nova
   "R$ 15 por pessoa"; Livraria "." (sem couvert).
3. `artist-profiles.json` (artista novo ou ainda sem perfil): `artistId`, `slug` (kebab-case, sem
   acento), `kind` (DJ, Jazz, Bossa Nova, Piano Bar, Livro, Show), `genres` (curto, minúsculas, a
   partir das Tags da planilha ou do release) e `photo` {src, small, width, height, alt, position}.
4. `programacao.html`: copie uma linha da mesma categoria e insira na ordem cronológica, com `href`
   `/artistas/<slug>/`, `data-event-start`, `data-event-category` (dj, jazz, bossa, piano, books),
   dia da semana abreviado, dia com dois dígitos, horário ("20h", "13h30"), nome, rótulo e couvert
   ("Couvert R$ 8"; "—" quando não houver). Se o mês ainda não existir na lista, copie o bloco do mês.

## 7. Conferir e publicar

- Valide: JSONs carregam; ids únicos; cada `photo.src`/`small` existe; cada `href` da Programação
  aponta para um slug existente; nenhuma linha duplicada (mesma data e horário).
- Siga as preferências do repositório (AGENTS.md): parta da main mais recente
  (`git fetch --depth=20 origin main` + rebase), commit e push direto na `main`; o Cloudflare Pages
  publica. Se não houver nada novo, não faça commit.
- Depois de ~4 minutos, confira no domínio oficial a página de cada artista novo/atualizado e a
  Programação. Se o build falhar, o site continua na versão anterior: corrija ou reverta o commit.

## Destaques "Em cartaz" da home

Todo destaque da seção "Em cartaz" da home leva a uma página sobre o próprio
conteúdo do destaque, nunca à Programação geral:

- show de um artista → página do artista (`/artistas/<slug>/`, o mesmo link da linha na Programação);
- festival ou série com vários artistas → página do festival (`/festivais/<slug>/`), que reúne
  todos os artistas com foto, data, horário, couvert e link para a página de cada um.
  Para criar uma, acrescente o festival em `src/data/festivals.json` (título, chamada,
  texto de abertura tirado do release revisado e os `artistIds`).

O teste `tests/home-destaques.mjs` (no `npm run build`) falha se algum destaque
apontar para `/programacao/` ou para uma página diferente da do seu conteúdo.
