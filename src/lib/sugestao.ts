// Sugestão do chef: um menu por temporada, com até quatro etapas, sempre nesta ordem:
// Para compartilhar → Entrada → Prato principal → Sobremesa.
// Dados: src/data/sugestao-do-chef.json. Só aparece entre "inicio" e "fim" (datas de Belo Horizonte).

export type Etapa = 'compartilhar' | 'entrada' | 'principal' | 'sobremesa';
export interface Foto { src: string; alt: string; width?: number; height?: number }
export interface Sugestao { nome: string; contexto?: string; descricao?: string; vegano?: boolean; preco?: number; inicio: string; fim: string; etapas: Partial<Record<Etapa, string>>; fotos?: Partial<Record<Etapa | 'menu', Foto>>; creditoFotos?: string }

export const ORDEM: [Etapa, string][] = [['compartilhar', 'Para compartilhar'], ['entrada', 'Entrada'], ['principal', 'Prato principal'], ['sobremesa', 'Sobremesa']];
const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brl = (value: number) => `R$ ${Number.isInteger(value) ? value : value.toFixed(2).replace('.', ',')}`;
const dm = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const vegan = '<span class="vegan-badge" data-vegan>Vegano</span>';

/** A sugestão vigente no dia (AAAAMMDD), ou undefined fora do período. */
export function sugestaoVigente(data: Sugestao, day: string): Sugestao | undefined {
  const today = `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`;
  return today >= data.inicio && today <= data.fim && ORDEM.some(([k]) => data.etapas[k]) ? data : undefined;
}

export const sugestaoSignature = (s?: Sugestao) => s ? `${s.nome}:${s.fim}` : 'nenhuma';

/** Foto de uma etapa (ou do menu completo), em retrato 4:5. */
function foto(f?: Foto) {
  if (!f) return '';
  const size = f.width && f.height ? ` width="${f.width}" height="${f.height}"` : '';
  return `<img src="${esc(f.src)}" alt="${esc(f.alt)}"${size} loading="lazy" decoding="async" style="display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;margin-bottom:16px;background:var(--color-mesa-soft)">`;
}

/** Lista curta das etapas presentes: "entrada, prato principal e sobremesa". */
function etapasTexto(s: Sugestao) {
  const names = ORDEM.filter(([k]) => s.etapas[k]).map(([, label]) => label.toLowerCase());
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names.at(-1)}` : names[0] ?? '';
}

/** Seção da página de Gastronomia (cabeçalho e etapas). */
export function renderSugestaoSecao(s?: Sugestao) {
  if (!s) return `<div><div class="tag" style="color:var(--color-mesa)">Sugestão do chef</div><h2 class="h2" id="t-chef" style="margin-top:12px">Sugestão do chef</h2><p class="p" style="margin-top:16px;color:var(--color-text-muted)">Nova sugestão do chef em breve.</p></div>`;
  const tag = [s.contexto, `até ${dm(s.fim)}`].filter(Boolean).join(' · ');
  const head = `<div class="flex justify-between items-end gap-[24px] flex-wrap mb-[40px]"><div><div class="tag" style="color:var(--color-mesa)">${esc(tag)}</div><h2 class="h2" id="t-chef" style="margin-top:12px">Sugestão do chef</h2></div><div style="max-width:460px"><div class="flex items-baseline gap-[16px] flex-wrap"><span class="h3" style="font-size:30px">${esc(s.nome)}${s.vegano ? vegan : ''}</span>${s.preco ? `<span class="mono" style="font-size:22px">${brl(s.preco)}</span>` : ''}</div>${s.descricao ? `<p class="p" style="margin-top:8px;color:var(--color-text-muted)">${esc(s.descricao)}</p>` : ''}</div></div>`;
  const items = ORDEM.filter(([k]) => s.etapas[k]).map(([k, label]) => `<div style="border-top:3px solid var(--color-ink);padding-top:16px;min-width:0">${foto(s.fotos?.[k])}<div class="tag" style="color:var(--color-mesa)">${label}</div><p class="h3" style="font-size:24px;margin-top:10px;line-height:1.25">${esc(s.etapas[k] ?? '')}</p></div>`);
  const menu = s.fotos?.menu;
  if (menu) {
    const texto = etapasTexto(s);
    items.unshift(`<div style="border-top:3px solid var(--color-mesa);padding-top:16px;min-width:0">${foto(menu)}<div class="tag" style="color:var(--color-mesa)">O menu completo</div><p class="h3" style="font-size:24px;margin-top:10px;line-height:1.25">${esc(texto.charAt(0).toUpperCase() + texto.slice(1))}</p></div>`);
  }
  const cols = items.length >= 4 ? 'grid4' : 'grid3';
  const credito = s.creditoFotos ? `<p class="p" style="margin-top:20px;font-size:13px;color:var(--color-text-muted)">${esc(s.creditoFotos)}</p>` : '';
  return `${head}<div class="${cols}" data-responsive-grid>${items.join('')}</div>${credito}`;
}

/** Linha "Sugestão do chef" do destaque "À mesa" da home (computador ou celular). */
export function renderSugestaoHome(s: Sugestao | undefined, mobile = false) {
  if (!s) return mobile ? '<h2 class="disp dining-mobile-title">Sugestão do chef</h2><p>Nova sugestão em breve.</p>' : '';
  const label = `Sugestão do chef${s.contexto ? ` · ${esc(s.contexto)}` : ''}`;
  const price = s.preco ? `<span class="mono" style="font-weight:500;white-space:nowrap">${brl(s.preco)}</span>` : '';
  if (mobile) return `<div class="dining-chef-note"><span class="tag" style="font-size:11px;opacity:.85">${label}</span><div class="dining-price-row flex justify-between gap-[12px] mt-[4px]"><strong>${esc(s.nome)}${s.vegano ? vegan : ''}</strong>${price}</div><div style="font-size:13px;opacity:.85;margin-top:2px">${esc(etapasTexto(s))}</div></div>`;
  return `<div style="border-top:1.5px solid rgba(255,255,255,.7);padding:16px 0"><div class="tag" style="opacity:.85">${label}</div><div class="flex justify-between gap-[16px] mt-[8px]" style="font-size:20px;font-weight:600;line-height:1.3"><span>${esc(s.nome)}${s.vegano ? vegan : ''}<span style="display:block;font-size:15px;font-weight:500;opacity:.85;margin-top:2px">${esc(etapasTexto(s))}</span></span>${price}</div></div>`;
}

export function renderV2Sugestao(s?: Sugestao) {
  const title = s ? `Sugestão do chef${s.contexto ? ` · ${esc(s.contexto)}` : ''}` : 'Sugestão do chef';
  const dish = s ? `${esc(s.nome)}${s.vegano ? vegan : ''}<br><small>${esc(etapasTexto(s))}</small>` : 'Nova sugestão em breve.';
  return `<li><span class="tipo">${s ? `<a href="/gastronomia/#chef">${title}</a>` : title}</span><span class="prato">${dish}</span>${s?.preco ? `<span class="preco">${brl(s.preco)}</span>` : ''}</li>`;
}
