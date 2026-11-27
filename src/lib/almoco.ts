export interface Prato { prato: string; preco: number }
export interface MenuDoDia { preco: number; entrada: string; principal: string; sobremesa: string }
export interface DiaAlmoco { data: string; feriado?: string; menuDoDia?: MenuDoDia; executivo?: Prato; vegano?: Prato }
export interface AlmocoData { dias: DiaAlmoco[] }
export interface Agora { day: string; minutes: number } // day = AAAAMMDD (Belo Horizonte)

export const INICIO = 12 * 60;
export const FIM = 14 * 60 + 30;
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
// Feriados nacionais do calendário federal (Portaria MGI nº 11.460/2025).
const fixedHolidays = new Set(['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25']);
function nationalHoliday(date: string) {
  if (fixedHolidays.has(date.slice(5))) return true;
  // Computus gregoriano (Meeus/Jones/Butcher): Sexta-feira da Paixão = Páscoa − 2 dias.
  const year = Number(date.slice(0, 4));
  const a = year % 19;
  const century = Math.floor(year / 100);
  const y = year % 100;
  const h = (19 * a + century - Math.floor(century / 4) - Math.floor((century - Math.floor((century + 8) / 25) + 1) / 3) + 15) % 30;
  const l = (32 + 2 * (century % 4) + 2 * Math.floor(y / 4) - h - y % 4) % 7;
  const correction = Math.floor((a + 11 * h + 22 * l) / 451);
  const easter = h + l - 7 * correction + 114;
  return date === new Date(Date.UTC(year, Math.floor(easter / 31) - 1, easter % 31 - 1)).toISOString().slice(0, 10);
}

const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export function agoraBH(value = new Date()): Agora {
  const parts = Object.fromEntries(clock.formatToParts(value).map(p => [p.type, p.value]));
  return { day: `${parts.year}${parts.month}${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export interface AlmocoState {
  today: string;
  minutes: number;
  dia?: DiaAlmoco;
  week: DiaAlmoco[];
}

const validPrice = (price: number) => Number.isFinite(price) && price > 0;
function validMenu(d: DiaAlmoco): DiaAlmoco {
  const { menuDoDia, executivo, vegano } = d;
  const validDish = (dish?: Prato) => dish && validPrice(dish.preco) && dish.prato?.trim() ? dish : undefined;
  return {
    ...d,
    menuDoDia: menuDoDia && validPrice(menuDoDia.preco) && menuDoDia.entrada?.trim() && menuDoDia.principal?.trim() && menuDoDia.sobremesa?.trim() ? menuDoDia : undefined,
    executivo: validDish(executivo),
    vegano: validDish(vegano),
  };
}
const hasMenu = (d: DiaAlmoco) => !d.feriado && !!(d.menuDoDia || d.executivo || d.vegano);

export function pickAlmoco(data: AlmocoData, now = agoraBH()): AlmocoState {
  const today = iso(now.day);
  const minutes = now.minutes;
  const day = weekday(today);
  const empty = { today, minutes, week: [] };
  if (day === 0 || day === 6 || minutes >= FIM || nationalHoliday(today)) return empty;

  const entry = data.dias.find(d => d.data === today);
  if (!entry) return empty;
  const dia = validMenu(entry);
  if (!hasMenu(dia)) return empty;

  const monday = plus(today, 1 - day);
  const friday = plus(monday, 4);
  const week = data.dias.filter(d => d.data >= monday && d.data <= friday)
    .sort((a, b) => a.data.localeCompare(b.data))
    .map(d => nationalHoliday(d.data) ? { data: d.data, feriado: d.feriado ?? 'Nacional' } : validMenu(d));
  return { today, minutes, dia, week };
}

export function almocoSignature(state: AlmocoState) {
  return state.dia ? `${state.today}:${state.minutes < INICIO ? 'antes' : 'servindo'}` : '-';
}

export function almocoStatus(state: AlmocoState) {
  return state.minutes >= INICIO ? 'Servido agora, até as 15h' : 'Hoje, a partir das 12h';
}

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
  if (!state.dia) return '';
  const head = `<div class="tag" style="opacity:.85">Almoço executivo · ${esc(almocoStatus(state))}</div>`;
  return `${head}<div class="mt-[10px]">${compactRows(state.dia, 17, false)}</div>`;
}

/** Destaque "Almoço executivo" da home no celular (sem o botão). */
export function renderAlmocoMobile(state: AlmocoState) {
  if (!state.dia) return '';
  const head = `<div class="tag" style="opacity:.85;font-size:11px">À mesa · ${esc(almocoStatus(state))}</div><h2 class="disp dining-mobile-title">Almoço executivo</h2>`;
  return `${head}<div class="mt-[12px]">${compactRows(state.dia, 15, true)}</div>`;
}

export function renderV2Almoco(state: AlmocoState) {
  if (!state.dia) return '';
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
  if (!state.dia) return '';
  const status = `<p class="mono" style="font-size:16px;opacity:.92;margin-bottom:20px" data-almoco-status>${esc(almocoStatus(state))}</p>`;
  const tabs = state.week.map(d => {
    const on = d.data === state.today;
    const rel = d.data === state.today ? ' · hoje' : d.data === plus(state.today, 1) ? ' · amanhã' : '';
    return `<button type="button" class="chip" role="tab" id="almoco-tab-${d.data}" aria-controls="almoco-dia-${d.data}" aria-selected="${on}" tabindex="${on ? 0 : -1}" data-almoco-tab="${d.data}"${d.feriado ? ' data-feriado' : ''}><span aria-hidden="true">${shortWeekdays[weekday(d.data)]} ${dm(d.data)}${rel}${d.feriado ? ' · feriado' : ''}</span><span class="sr-only">${cap(weekdays[weekday(d.data)] ?? '')}, ${dm(d.data)}${rel}${d.feriado ? ', feriado' : ''}</span></button>`;
  }).join('');
  const panels = state.week.map(d => `<div role="tabpanel" id="almoco-dia-${d.data}" aria-labelledby="almoco-tab-${d.data}" tabindex="0"${d.data === state.today ? '' : ' hidden'}>${panel(d)}</div>`).join('');
  return `${status}<div role="tablist" aria-label="Dias da semana" class="flex gap-[10px] flex-wrap" style="margin-bottom:28px">${tabs}</div>${panels}`;
}
