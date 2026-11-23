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

O dia mostrado é calculado pela hora de Belo Horizonte, no build e de novo no navegador
(a cada minuto): até as 15h mostra **hoje**; depois das 15h, no fim de semana ou em feriado,
mostra o **próximo dia de serviço**. Se esse dia não estiver cadastrado, o site diz que o
cardápio ainda não foi publicado — nunca mostra cardápio vencido.

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
