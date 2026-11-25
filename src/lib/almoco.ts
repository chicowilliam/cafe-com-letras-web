// Almoço executivo: segunda a sexta, 12h às 15h, exceto feriados.
// Cada dia tem três opções: Menu do Dia (entrada + principal + sobremesa), Executivo e Executivo vegano.
// Dados: src/data/almoco-executivo.json. Usado no build (HTML inicial) e no navegador (src/client/almoco.ts),
// para a troca de dia e o fim do serviço às 15h não dependerem de novo deploy.

export interface Prato { prato: string; preco: number }
export interface MenuDoDia { preco: number; entrada: string; principal: string; sobremesa: string }
export interface DiaAlmoco { data: string; feriado?: string; menuDoDia?: MenuDoDia; executivo?: Prato; vegano?: Prato }
export interface AlmocoData { dias: DiaAlmoco[] }
export interface Agora { day: string; minutes: number } // day = AAAAMMDD (Belo Horizonte)

export const INICIO = 12 * 60;
export const FIM = 15 * 60;
const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const shortWeekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const iso = (day: string) => `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`;
const utc = (date: string) => new Date(`${date}T12:00:00Z`);
const plus = (date: string, n: number) => { const d = utc(date); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekday = (date: string) => utc(date).getUTCDay();
const dm = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const brl = (value: number) => `R$ ${Number.isInteger(value) ? value : value.toFixed(2).replace('.', ',')}`;
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const isServiceWeekday = (date: string) => weekday(date) >= 1 && weekday(date) <= 5;
const hasMenu = (d: DiaAlmoco) => !d.feriado && !!(d.menuDoDia || d.executivo || d.vegano);

/** Data (AAAAMMDD) e minutos do dia em Belo Horizonte. */
export function agoraBH(value = new Date()): Agora {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(value).map(p => [p.type, p.value]));
  return { day: `${parts.year}${parts.month}${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export interface AlmocoState {
  today: string;          // AAAA-MM-DD
  minutes: number;
  date?: string;          // próximo dia de serviço (hoje, se ainda não passou das 15h)
  dia?: DiaAlmoco;        // cardápio desse dia; ausente = cardápio ainda não publicado
  week: DiaAlmoco[];      // segunda a sexta da semana desse dia (inclui feriados), só se houver cardápio
}

/** Escolhe o dia a mostrar: hoje até as 15h; depois, o próximo dia útil com almoço (pulando fins de semana e feriados). */
export function pickAlmoco(data: AlmocoData, now: Agora): AlmocoState {
  const today = iso(now.day);
  const byDate = new Map(data.dias.map(d => [d.data, d]));
  let date: string | undefined;
  for (let i = 0; i < 21; i++) {
    const candidate = plus(today, i);
    if (!isServiceWeekday(candidate)) continue;
    if (i === 0 && now.minutes >= FIM) continue;
    const entry = byDate.get(candidate);
    if (entry?.feriado) continue;
    date = candidate;
    break;
  }
  const dia = date ? byDate.get(date) : undefined;
  if (!date || !dia || !hasMenu(dia)) return { today, minutes: now.minutes, date, week: [] };
  const monday = plus(date, 1 - weekday(date));
  const friday = plus(monday, 4);
  const week = data.dias.filter(d => d.data >= monday && d.data <= friday).sort((a, b) => a.data.localeCompare(b.data));
  return { today, minutes: now.minutes, date, dia, week };
}

export function almocoSignature(state: AlmocoState) {
  const phase = state.date !== state.today ? 'futuro' : state.minutes < INICIO ? 'antes' : 'servindo';
  return `${state.date ?? '-'}:${state.dia ? 'ok' : 'vazio'}:${phase}:${state.week.length}`;
}

function relative(date: string, today: string) {
  if (date === today) return 'hoje';
  if (date === plus(today, 1)) return 'amanhã';
  return weekdays[weekday(date)] ?? '';
}

/** Frase de situação: "Servido agora, até as 15h", "Hoje, a partir das 12h", "Segunda, 30/11, das 12h às 15h". */
export function almocoStatus(state: AlmocoState) {
  if (!state.date) return 'De segunda a sexta, das 12h às 15h';
  if (state.date === state.today) return state.minutes >= INICIO ? 'Servido agora, até as 15h' : 'Hoje, a partir das 12h';
  const rel = relative(state.date, state.today);
  const name = weekdays[weekday(state.date)] ?? '';
  return `${cap(rel)}${rel === name ? '' : ` (${name})`}, ${dm(state.date)}, das 12h às 15h`;
}

const emBreve = (state: AlmocoState) => state.date
  ? `O cardápio de ${weekdays[weekday(state.date)]}, ${dm(state.date)}, ainda não foi publicado. Volte em breve.`
  : 'O cardápio da próxima semana ainda não foi publicado. Volte em breve.';

const vegan = '<span class="vegan-badge" data-vegan>Vegano</span>';

/** Linhas compactas (nome do prato + preço) para os destaques da home. */
function compactRows(dia: DiaAlmoco, size: number, mobile: boolean) {
  const row = (label: string, text: string, price: number, extra = '') => `<div class="dining-price-row flex justify-between gap-[16px]" style="padding:${mobile ? 10 : 12}px 0;border-top:1px solid rgba(255,255,255,.35)"><span class="${mobile ? 'max-[601px]:min-w-0 max-[601px]:flex-1' : ''}"><span class="tag" style="display:block;opacity:.8;font-size:${mobile ? 11 : 12}px;margin-bottom:4px">${label}${extra}</span><span style="font-size:${size}px;font-weight:600;line-height:1.3">${esc(text)}</span></span><span class="mono${mobile ? ' max-[601px]:shrink-0 max-[601px]:whitespace-nowrap' : ''}" style="font-weight:500;white-space:nowrap;font-size:${size}px">${brl(price)}</span></div>`;
  return [
    dia.menuDoDia ? row('Menu do Dia · entrada, principal e sobremesa', dia.menuDoDia.principal, dia.menuDoDia.preco) : '',
    dia.executivo ? row('Executivo', dia.executivo.prato, dia.executivo.preco) : '',
    dia.vegano ? row('Executivo vegano', dia.vegano.prato, dia.vegano.preco, vegan) : '',
  ].join('');
}

/** Bloco "Almoço executivo" do destaque "À mesa" da home no computador. */
export function renderAlmocoHome(state: AlmocoState) {
  const head = `<div class="tag" style="opacity:.85">Almoço executivo · ${esc(almocoStatus(state))}</div>`;
  if (!state.dia) return `${head}<p class="mt-[8px]" style="font-size:18px;font-weight:600;line-height:1.35">${esc(emBreve(state))}</p>`;
  return `${head}<div class="mt-[10px]">${compactRows(state.dia, 17, false)}</div>`;
}

/** Destaque "Almoço executivo" da home no celular (sem o botão). */
export function renderAlmocoMobile(state: AlmocoState) {
  const head = `<div class="tag" style="opacity:.85;font-size:11px">À mesa · ${esc(almocoStatus(state))}</div><h2 class="disp dining-mobile-title">Almoço executivo</h2>`;
  if (!state.dia) return `${head}<p class="mt-[12px]" style="font-size:15px;line-height:1.4">${esc(emBreve(state))}</p>`;
  return `${head}<div class="mt-[12px]">${compactRows(state.dia, 15, true)}</div>`;
}

export function renderV2Almoco(state: AlmocoState) {
  if (!state.dia) return `<li><span class="prato">${esc(emBreve(state))}</span></li>`;
  const {menuDoDia, executivo, vegano} = state.dia;
  const row = (label: string, dish: string, price: number) => `<li><span class="tipo">${label}</span><span class="prato">${esc(dish)}</span><span class="preco">${brl(price)}</span></li>`;
  return [
    menuDoDia && row('Menu do Dia', menuDoDia.principal, menuDoDia.preco),
    executivo && row('Executivo', executivo.prato, executivo.preco),
    vegano && row('Executivo vegano', vegano.prato, vegano.preco),
  ].filter(Boolean).join('');
}

function panel(dia: DiaAlmoco) {
  if (dia.feriado || !hasMenu(dia)) {
    const reason = dia.feriado ? `Feriado (${esc(dia.feriado)}): não há almoço executivo neste dia.` : 'Cardápio deste dia ainda não publicado.';
    return `<p style="font-size:19px;font-weight:600;padding:24px 0;border-top:1.5px solid rgba(255,255,255,.55)">${reason}</p>`;
  }
  const card = (title: string, price: number, body: string, sub = '', badge = '') => `<article style="border-top:1.5px solid rgba(255,255,255,.7);padding-top:16px;min-width:0"><div class="dining-price-row flex justify-between items-baseline gap-[12px]"><h3 class="h3" style="font-size:26px">${title}${badge}</h3><span class="mono" style="font-size:20px;white-space:nowrap">${brl(price)}</span></div>${sub ? `<p class="tag" style="opacity:.8;margin-top:6px">${sub}</p>` : ''}${body}</article>`;
  const text = (value: string) => `<p style="margin-top:14px;font-size:18px;font-weight:600;line-height:1.4">${esc(value)}</p>`;
  const course = (label: string, value: string) => `<div style="padding:10px 0;border-top:1px solid rgba(255,255,255,.3)"><dt class="tag" style="opacity:.75">${label}</dt><dd style="margin:4px 0 0;font-size:17px;font-weight:600;line-height:1.35">${esc(value)}</dd></div>`;
  const m = dia.menuDoDia;
  return `<div class="grid3" style="gap:40px;align-items:start" data-responsive-grid>${[
    m ? card('Menu do Dia', m.preco, `<dl style="margin:12px 0 0">${course('Entrada', m.entrada)}${course('Prato principal', m.principal)}${course('Sobremesa', m.sobremesa)}</dl>`, 'Entrada, prato principal e sobremesa') : '',
    dia.executivo ? card('Executivo', dia.executivo.preco, text(dia.executivo.prato), 'Prato único') : '',
    dia.vegano ? card('Executivo vegano', dia.vegano.preco, text(dia.vegano.prato), 'Prato único', vegan) : '',
  ].join('')}</div>`;
}

/** Semana completa da página de Gastronomia: abas por dia, abertas no dia de serviço. */
export function renderAlmocoSemana(state: AlmocoState) {
  const status = `<p class="mono" style="font-size:16px;opacity:.92;margin-bottom:20px" data-almoco-status>${esc(almocoStatus(state))}</p>`;
  if (!state.dia) return `${status}<p style="font-size:20px;font-weight:600;padding:24px 0;border-top:1.5px solid rgba(255,255,255,.55)">${esc(emBreve(state))}</p>`;
  const tabs = state.week.map(d => {
    const on = d.data === state.date;
    const rel = d.data === state.today ? ' · hoje' : d.data === plus(state.today, 1) ? ' · amanhã' : '';
    return `<button type="button" class="chip" role="tab" id="almoco-tab-${d.data}" aria-controls="almoco-dia-${d.data}" aria-selected="${on}" tabindex="${on ? 0 : -1}" data-almoco-tab="${d.data}"${d.feriado ? ' data-feriado' : ''}><span aria-hidden="true">${shortWeekdays[weekday(d.data)]} ${dm(d.data)}${rel}${d.feriado ? ' · feriado' : ''}</span><span class="sr-only">${cap(weekdays[weekday(d.data)] ?? '')}, ${dm(d.data)}${rel}${d.feriado ? ', feriado' : ''}</span></button>`;
  }).join('');
  const panels = state.week.map(d => `<div role="tabpanel" id="almoco-dia-${d.data}" aria-labelledby="almoco-tab-${d.data}" tabindex="0"${d.data === state.date ? '' : ' hidden'}>${panel(d)}</div>`).join('');
  return `${status}<div role="tablist" aria-label="Dias da semana" class="flex gap-[10px] flex-wrap" style="margin-bottom:28px">${tabs}</div>${panels}`;
}
