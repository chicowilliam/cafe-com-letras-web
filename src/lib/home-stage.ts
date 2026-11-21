// Destaque "No palco" e "Esta semana" da home, escolhidos pela data/hora de Belo Horizonte.
// Usado no build (HTML inicial) e no navegador (virada da meia-noite sem novo deploy).
import profilesRaw from '../data/artist-profiles.json';
import highlightsRaw from '../data/home-highlights.json';

export interface StageEvent { calendar_id: number; calendar_unity: number; calendar_date: string; calendar_time: string; calendar_artist: number; calendar_price: string }
export interface StageArtist { artist_id: number; artist_name: string; artist_release: string }
interface Photo { src: string; small: string; width: number; height: number; alt: string; position: string }
interface Profile { artistId: number; slug: string; kind: string; genres: string; photo?: Photo }
interface Highlight { summary?: string; tags?: string; genres?: string }

const profiles = new Map((profilesRaw as Profile[]).map(p => [p.artistId, p]));
const highlights = highlightsRaw as Record<string, Highlight>;
export const SAVASSI = 1;
const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const shortWeekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (html: string) => html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Data (AAAAMMDD) e minutos do dia em Belo Horizonte. */
export function bhNow(value = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(value).map(p => [p.type, p.value]));
  return { day: `${parts.year}${parts.month}${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}
const utc = (day: string) => new Date(`${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}T12:00:00Z`);
export function addDays(day: string, n: number) { const d = utc(day); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10).replaceAll('-', ''); }
const weekday = (day: string) => utc(day).getUTCDay();
const dmy = (day: string) => `${day.slice(6, 8)}/${day.slice(4, 6)}/${day.slice(0, 4)}`;
const hour = (time: string) => `${Number(time.slice(0, 2))}h${time.slice(2) === '00' ? '' : time.slice(2)}`;
const minutesOf = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(2));
const longDate = (day: string) => `${weekdays[weekday(day)]}, ${Number(day.slice(6))} de ${months[Number(day.slice(4, 6)) - 1]} de ${day.slice(0, 4)}`;

function displayName(name: string) {
  const book = name.match(/^Lançamento do Livro\s+["“]([^"”]+)["”]/i);
  return book ? `Lançamento: ${book[1]}` : name;
}
function category(event: StageEvent, name: string) {
  const hl = highlights[String(event.calendar_artist)];
  if (hl?.tags) return hl.tags;
  const profile = profiles.get(event.calendar_artist);
  if (profile) return profile.kind;
  if (/^Lançamento/i.test(name)) return 'Livro';
  if (/Piano Bar/i.test(name)) return 'Piano';
  if (/^Festival/i.test(name)) return 'Festival';
  if (/(^|\s)DJs?(\s|$)/.test(name)) return 'DJ';
  if (weekday(event.calendar_date) === 6 && event.calendar_time === '1330') return 'Bossa Nova na Savassi';
  if (weekday(event.calendar_date) === 3) return 'Jazz · ao vivo no YouTube';
  return 'Música';
}
const isBook = (name: string) => /^Lançamento/i.test(name);
const link = (event: StageEvent) => { const p = profiles.get(event.calendar_artist); return p ? `/artistas/${p.slug}/` : '/programacao/#agenda'; };
function summary(event: StageEvent, artist?: StageArtist) {
  const hl = highlights[String(event.calendar_artist)];
  if (hl?.summary) return hl.summary;
  const text = plain(artist?.artist_release ?? '');
  const first = text.split(/(?<=[.!?])\s/)[0] ?? '';
  if (first.length <= 170) return first;
  const cut = first.slice(0, 165);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
const hasPrice = (price: string) => /\d|gratuit|livre/i.test(price);
const couvert = (price: string) => /^R\$/.test(price.trim()) ? `Couvert ${price.trim()}` : price.trim();

export interface HomeState { today: string; featured?: StageEvent; next: StageEvent[]; week: StageEvent[] }

/** Escolhe a atração do dia: a próxima de hoje que ainda não terminou (≈2h30 após o início); senão a próxima data. */
export function pickHome(events: StageEvent[], now = bhNow()): HomeState {
  const list = events.filter(e => e.calendar_unity === SAVASSI).sort((a, b) => (a.calendar_date + a.calendar_time).localeCompare(b.calendar_date + b.calendar_time));
  const today = list.filter(e => e.calendar_date === now.day);
  let featured = today.find(e => minutesOf(e.calendar_time) + 150 > now.minutes) ?? today.at(-1);
  if (!featured) featured = list.find(e => e.calendar_date > now.day);
  const index = featured ? list.indexOf(featured) : -1;
  const next = index >= 0 ? list.slice(index + 1, index + 3) : [];
  const end = addDays(now.day, 6);
  const week = list.filter(e => e.calendar_date >= now.day && e.calendar_date <= end);
  return { today: now.day, featured, next, week };
}

const fontFor = (name: string, big: number) => name.length > 40 ? Math.round(big * 0.6) : name.length > 22 ? Math.round(big * 0.78) : big;
function relative(day: string, today: string) {
  if (day === today) return 'Hoje';
  if (day === addDays(today, 1)) return 'Amanhã';
  return weekdays[weekday(day)] ?? '';
}

/** Bloco "No palco" da home desktop (conteúdo entre o título e os botões). */
export function renderStage(state: HomeState, artists: Map<number, StageArtist>) {
  const e = state.featured;
  if (!e) return `<div class="tag" style="opacity:.85">Programação</div><h1 class="disp" style="font-size:132px">No palco</h1><p class="p" style="margin-top:auto;opacity:.9">Confira as próximas datas na programação.</p>`;
  const artist = artists.get(e.calendar_artist);
  const name = displayName(artist?.artist_name ?? 'Programação do Café');
  const photo = profiles.get(e.calendar_artist)?.photo;
  const img = photo ? `<img src="${photo.src}" srcset="${photo.small} 440w, ${photo.src} ${photo.width}w" sizes="(max-width:900px) 100vw, 220px" width="${photo.width}" height="${photo.height}" alt="${esc(photo.alt)}" loading="lazy" decoding="async" style="display:block;width:100%;height:280px;object-fit:cover;object-position:${photo.position};background:var(--color-palco-photo)">` : '';
  const price = hasPrice(e.calendar_price) ? `<div class="mono" style="margin-top:14px;font-size:14px">${esc(couvert(e.calendar_price))}</div>` : '';
  const next = state.next.map(n => `<span><span class="tag" style="opacity:.75">${relative(n.calendar_date, state.today)}</span>  ${hour(n.calendar_time)} · ${esc(displayName(artists.get(n.calendar_artist)?.artist_name ?? ''))}</span>`).join('');
  return `<div class="tag" style="opacity:.85">Programação · ${dmy(e.calendar_date)}</div>
  <h1 class="disp" style="font-size:132px">No palco</h1>
  <div class="gap-[24px] items-end" style="display:grid;grid-template-columns:${img ? 'minmax(0,1fr) 220px' : 'minmax(0,1fr)'};margin-top:auto" data-responsive-grid>
   <div><div class="mono" style="font-size:15px;opacity:.85">${longDate(e.calendar_date)} · ${hour(e.calendar_time)}</div><div class="disp" style="font-size:${fontFor(name, 72)}px;margin-top:10px">${esc(name)}</div><p class="p" style="margin-top:14px;opacity:.9;max-width:420px">${esc(summary(e, artist))}</p>${price}</div>
   ${img}
  </div>
  ${next ? `<div class="flex justify-between gap-[12px] flex-wrap" style="border-top:1.5px solid rgba(255,255,255,.5);padding-top:14px;font-size:15px">${next}</div>` : ''}`;
}

/** Grade "Esta semana no Café" (7 dias a partir de hoje). */
export function renderWeek(state: HomeState, artists: Map<number, StageArtist>) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(state.today, i));
  const cols = days.map(day => {
    const today = day === state.today;
    const items = state.week.filter(e => e.calendar_date === day).map(e => {
      const raw = artists.get(e.calendar_artist)?.artist_name ?? '';
      const name = displayName(raw);
      return `<a href="${link(e)}" class="block no-underline" style="padding:14px 0;border-top:1px solid rgba(22,22,20,.18)"><div class="mono" style="font-size:13px;color:var(--color-text-muted)"><span class="dot" style="background:var(${isBook(raw) ? '--color-ink' : '--color-palco'})"></span>${hour(e.calendar_time)}</div><div class="mt-[6px]" style="font-weight:700;font-size:16px;line-height:1.3">${esc(name)}</div><div class="mt-[4px]" style="font-size:13px;color:var(--color-text-muted)">${esc(category(e, raw))}</div></a>`;
    }).join('');
    return `<div style="min-width:0"><div class="flex items-baseline gap-[8px]" style="padding:10px 12px${today ? ';background:var(--color-palco);color:#fff' : ''}"><span class="tag">${shortWeekdays[weekday(day)]}</span><span class="disp" style="font-size:40px">${Number(day.slice(6))}</span><span class="tag" style="margin-left:auto">${today ? dmy(day) : ''}</span></div><div style="padding:0 12px">${items || '<div style="padding:14px 0;border-top:1px solid rgba(22,22,20,.18);font-size:14px;color:var(--color-text-subtle)">Casa aberta, sem programação</div>'}</div></div>`;
  }).join('');
  return `<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:0;border-top:1.5px solid var(--color-ink);border-bottom:1.5px solid var(--color-ink)" data-responsive-grid>${cols}</div>`;
}

/** Destaque "No palco" da home no celular (sem o botão). */
export function renderMobileStage(state: HomeState, artists: Map<number, StageArtist>) {
  const e = state.featured;
  if (!e) return `<div class="tag" style="opacity:.8;font-size:11px">No palco</div><h1 class="disp" style="font-size:56px;margin-top:10px">Programação</h1>`;
  const artist = artists.get(e.calendar_artist);
  const name = displayName(artist?.artist_name ?? 'Programação do Café');
  const hl = highlights[String(e.calendar_artist)];
  const profile = profiles.get(e.calendar_artist);
  let text = hl?.genres ?? profile?.genres ?? summary(e, artist);
  if (text && !/[.!?…]$/.test(text)) text += '.';
  if (hasPrice(e.calendar_price)) text += ` ${couvert(e.calendar_price).replace(/\s+por pessoa$/i, '')}.`;
  const photo = profile?.photo;
  const img = photo ? `<img class="aspect-[7/4] mt-[16px]" src="${photo.src}" srcset="${photo.small} 440w, ${photo.src} ${photo.width}w" sizes="(max-width:900px) 100vw, 390px" width="${photo.width}" height="${photo.height}" alt="${esc(photo.alt)}" fetchpriority="high" decoding="async" style="display:block;width:100%;height:auto;object-fit:cover;object-position:${photo.position};background:var(--color-palco-photo)">` : '';
  return `<div class="tag" style="opacity:.8;font-size:11px">No palco · ${dmy(e.calendar_date)}, ${hour(e.calendar_time)}</div>
 <h1 class="disp" style="font-size:${fontFor(name, 56)}px;margin-top:10px">${esc(name)}</h1>
 <p class="p" style="margin-top:10px;font-size:15px;opacity:.9">${esc(text.trim())}</p>
 ${img}`;
}

/** Lista "Esta semana" da home no celular. */
export function renderMobileWeek(state: HomeState, artists: Map<number, StageArtist>) {
  const rows = state.week.map(e => {
    const raw = artists.get(e.calendar_artist)?.artist_name ?? '';
    const label = e.calendar_date === state.today ? dmy(e.calendar_date) : `${shortWeekdays[weekday(e.calendar_date)]} ${Number(e.calendar_date.slice(6))}`;
    return `<a href="${link(e)}" class="no-underline gap-[12px]" style="display:grid;grid-template-columns:72px minmax(0,1fr);padding:14px 0;border-bottom:1px solid rgba(22,22,20,.18)"><div><div class="tag" style="font-size:11px">${label}</div><div class="mono" style="font-size:14px;margin-top:2px">${hour(e.calendar_time)}</div></div><div><div style="font-weight:700;font-size:16px;line-height:1.3">${esc(displayName(raw))}</div><div class="mt-[2px]" style="font-size:13px;color:var(--color-text-muted)">${esc(category(e, raw).split(' · ')[0] ?? '')}</div></div></a>`;
  }).join('');
  return rows || '<div style="padding:14px 0;border-bottom:1px solid rgba(22,22,20,.18);font-size:14px;color:var(--color-text-subtle)">Sem programação nos próximos dias.</div>';
}

/** Identifica o conteúdo exibido; o navegador só redesenha quando ele muda. */
export function homeSignature(state: HomeState) {
  return [state.today, state.featured?.calendar_id ?? 0, ...state.next.map(e => e.calendar_id), ...state.week.map(e => e.calendar_id)].join('-');
}
