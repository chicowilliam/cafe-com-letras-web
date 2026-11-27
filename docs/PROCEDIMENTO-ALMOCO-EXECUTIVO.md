# Almoço executivo — atualização semanal

O almoço executivo é servido de **segunda a sexta, das 12h às 15h**, exceto em feriados.
Cada dia tem três opções, sempre nesta ordem:

1. **Menu do Dia**: entrada + prato principal + sobremesa (preço varia por dia);
2. **Executivo**: prato único;
3. **Executivo vegano**: prato único (selo V).

## Onde aparece

| Lugar | O que mostra |
|---|---|
| `/gastronomia/#executivo` | Semana inteira em abas por dia, aberta no dia de serviço |
| Home no computador ("À mesa") | As três opções do dia, com preço |
| Home no celular | As três opções do dia, com preço, e botão para a semana |

O site exibe o executivo cadastrado para **hoje**, de segunda a sexta, das **00h às 14h29** no
fuso `America/Sao_Paulo`. A partir das 14h30, em fins de semana, feriados nacionais ou quando
falta um cardápio válido, a home mostra a Sugestão do Chef e a aba do executivo fica oculta.
A troca é automática no navegador, inclusive na virada do dia e no retorno à aba.

O calendário federal reconhece as datas nacionais fixas e a Sexta-feira da Paixão. Pontos
facultativos e feriados locais seguem a regra normal de disponibilidade. Se a casa decidir
suspender o executivo em uma dessas datas, o cadastro sem pratos reflete essa decisão.

## Como atualizar (toda semana, ao receber o PDF)

1. Abra `src/data/almoco-executivo.json`.
2. Acrescente ao fim de `dias` os cinco dias da semana, copiando o PDF **sem reescrever** os pratos:

```json
{
  "data": "2026-11-30",
  "menuDoDia": { "preco": 69, "entrada": "…", "principal": "…", "sobremesa": "…" },
  "executivo": { "prato": "…", "preco": 44 },
  "vegano": { "prato": "…", "preco": 49 }
}
```

3. Feriado na semana: em vez do cardápio, `{ "data": "AAAA-MM-DD", "feriado": "Nome do feriado" }`.
4. Opcional: apague semanas antigas (mais de um mês) para o arquivo não crescer.
5. Rode `npm run build` (inclui `tests/almoco.mjs`, que valida datas, dias úteis, as três opções e os preços).
6. Commit e push na `main`; confira em https://cafecomletras.com.br/gastronomia/#executivo.

Código: `src/lib/almoco.ts` (regras e HTML), `src/client/almoco.ts` (atualização no navegador e abas).

# Sugestão do chef

Um menu por temporada, com até quatro etapas, sempre nesta ordem:
**Para compartilhar → Entrada → Prato principal → Sobremesa** (normalmente as quatro).

- Dados: `src/data/sugestao-do-chef.json` (nome, contexto, descrição, vegano, preço, `inicio`, `fim`, `etapas`).
- Aparece em `/gastronomia/#chef` e na home (computador e celular), abaixo do almoço executivo.
- Só fica no ar entre `inicio` e `fim`. Depois disso a home deixa de mostrar a sugestão e a seção diz
  "Nova sugestão do chef em breve" (recalculado também no navegador, sem novo deploy).
- Para trocar: substitua o conteúdo do arquivo pela nova sugestão (etapas ausentes são simplesmente omitidas).
- Não citar nomes de cozinheiros no texto (orientação do responsável).
- Código: `src/lib/sugestao.ts`; testes em `tests/almoco.mjs`.
