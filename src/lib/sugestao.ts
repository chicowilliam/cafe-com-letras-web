// Sugestão do chef: um menu por temporada, com até quatro etapas, sempre nesta ordem:
// Para compartilhar → Entrada → Prato principal → Sobremesa.
// Dados: src/data/sugestao-do-chef.json. Só aparece entre "inicio" e "fim" (datas de Belo Horizonte).

export type Etapa = 'compartilhar' | 'entrada' | 'principal' | 'sobremesa';
export interface Sugestao { nome: string; contexto?: string; descricao?: string; vegano?: boolean; preco?: number; inicio: string; fim: string; etapas: Partial<Record<Etapa, string>> }

export const ORDEM: [Etapa, string][] = [['compartilhar', 'Para compartilhar'], ['entrada', 'Entrada'], ['principal', 'Prato principal'], ['sobremesa', 'Sobremesa']];
const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (value: number) => `R$ ${Number.isInteger(value) ? value : value.toFixed(2).replace('.', ',')}`;
const dm = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const vegan = '<span class="v" role="img" aria-label="vegano" title="Vegano">V</span>';

/** A sugestão vigente no dia (AAAAMMDD), ou undefined fora do período. */
export function sugestaoVigente(data: Sugestao, day: string): Sugestao | undefined {
  const today = `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`;
  return today >= data.inicio && today <= data.fim && ORDEM.some(([k]) => data.etapas[k]) ? data : undefined;
}

export const sugestaoSignature = (s?: Sugestao) => s ? `${s.nome}:${s.fim}` : 'nenhuma';

/** Lista curta das etapas presentes: "entrada, prato principal e sobremesa". */
function etapasTexto(s: Sugestao) {
  const names = ORDEM.filter(([k]) => s.etapas[k]).map(([, label]) => label.toLowerCase());
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names.at(-1)}` : names[0] ?? '';
}

/** Seção da página de Gastronomia (cabeçalho e etapas). */
export function renderSugestaoSecao(s?: Sugestao) {
  if (!s) return `<div><div class="tag" style="color:var(--color-mesa)">Sugestão do chef</div><h2 class="h2" style="margin-top:12px">Sugestão do chef</h2><p class="p" style="margin-top:16px;color:var(--color-text-muted)">Nova sugestão do chef em breve.</p></div>`;
  const tag = [s.contexto, `até ${dm(s.fim)}`].filter(Boolean).join(' · ');
  const head = `<div class="flex justify-between items-end gap-[24px] flex-wrap mb-[40px]"><div><div class="tag" style="color:var(--color-mesa)">${esc(tag)}</div><h2 class="h2" style="margin-top:12px">Sugestão do chef</h2></div><div style="max-width:460px"><div class="flex items-baseline gap-[16px] flex-wrap"><span class="h3" style="font-size:30px">${esc(s.nome)}${s.vegano ? vegan : ''}</span>${s.preco ? `<span class="mono" style="font-size:22px">${brl(s.preco)}</span>` : ''}</div>${s.descricao ? `<p class="p" style="margin-top:8px;color:var(--color-text-muted)">${esc(s.descricao)}</p>` : ''}</div></div>`;
  const items = ORDEM.filter(([k]) => s.etapas[k]).map(([k, label]) => `<div style="border-top:3px solid var(--color-ink);padding-top:16px;min-width:0"><div class="tag" style="color:var(--color-mesa)">${label}</div><p class="h3" style="font-size:24px;margin-top:10px;line-height:1.25">${esc(s.etapas[k] ?? '')}</p></div>`);
  const cols = items.length >= 4 ? 'grid4' : 'grid3';
  return `${head}<div class="${cols}" data-responsive-grid>${items.join('')}</div>`;
}

/** Linha "Sugestão do chef" do destaque "À mesa" da home (computador ou celular). */
export function renderSugestaoHome(s: Sugestao | undefined, mobile = false) {
  if (!s) return '';
  const label = `Sugestão do chef${s.contexto ? ` · ${esc(s.contexto)}` : ''}`;
  const price = s.preco ? `<span class="mono" style="font-weight:500;white-space:nowrap">${brl(s.preco)}</span>` : '';
  if (mobile) return `<div class="mt-[16px]" style="border-top:1.5px solid rgba(255,255,255,.6);padding-top:12px;font-size:15px"><span class="tag" style="font-size:11px;opacity:.85">${label}</span><div class="flex justify-between gap-[12px] mt-[4px]"><strong>${esc(s.nome)}${s.vegano ? vegan : ''}</strong>${price}</div><div style="font-size:13px;opacity:.85;margin-top:2px">${esc(etapasTexto(s))}</div></div>`;
  return `<div style="border-top:1.5px solid rgba(255,255,255,.7);padding:16px 0"><div class="tag" style="opacity:.85">${label}</div><div class="flex justify-between gap-[16px] mt-[8px]" style="font-size:20px;font-weight:600;line-height:1.3"><span>${esc(s.nome)}${s.vegano ? vegan : ''}<span style="display:block;font-size:15px;font-weight:500;opacity:.85;margin-top:2px">${esc(etapasTexto(s))}</span></span>${price}</div></div>`;
}
