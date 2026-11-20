"""Migração incremental, determinística; não altera texto, URLs ou CSS do arquivo de referência."""
from pathlib import Path
from html import unescape, escape
import re, json

root=Path(__file__).resolve().parents[1]
colors={
 '#161614':'ink','#FAFAF7':'paper','#B83C18':'mesa','#8E2E12':'mesa-deep',
 '#9E3414':'mesa-photo','#F6D9CD':'mesa-photo-text','#F6E4DC':'mesa-soft',
 '#1D2B53':'palco','#2C3A63':'palco-photo','#D5DAEA':'palco-photo-text','#E3E7F1':'palco-soft',
 '#D8D5CC':'photo','#3F3D38':'photo-text','#EDEBE4':'surface','#E9E7E1':'text-light',
 '#55534D':'text-muted','#77746C':'text-subtle','#B9B6AE':'text-on-dark','#8E8B83':'text-dim',
 '#4A4844':'line-dark','#3A3936':'line-deep','#2F6B3A':'vegan','#FFE58A':'example','#C8102E':'live',
}
count=0
def tokens(s):
 for color,name in colors.items():s=re.sub(re.escape(color)+r'(?![0-9a-f])',f'var(--color-{name})',s,flags=re.I)
 return s

# Somente declarações independentes em elementos sem classes: sem disputa com componentes.
simple={'display:flex':'flex','display:block':'block','flex-direction:column':'flex-col',
 'flex-wrap:wrap':'flex-wrap','justify-content:space-between':'justify-between',
 'justify-content:center':'justify-center','align-items:center':'items-center',
 'align-items:baseline':'items-baseline','align-items:end':'items-end','text-decoration:none':'no-underline'}
def migrate_tag(m):
 global count
 tag=m.group(0)
 if re.search(r'\bclass=',tag):return tag
 style=re.search(r'\bstyle="([^"]*)"',tag)
 if not style:return tag
 classes=[];remaining=[]
 for declaration in style[1].split(';'):
  declaration=declaration.strip()
  utility=simple.get(declaration)
  if not utility:
   d=re.fullmatch(r'(gap|margin-top|margin-bottom):(\d+)px',declaration)
   if d:utility={'gap':'gap','margin-top':'mt','margin-bottom':'mb'}[d[1]]+f'-[{d[2]}px]'
  if utility:classes.append(utility);count+=1
  elif declaration:remaining.append(declaration)
 if classes:
  replacement='class="'+' '.join(classes)+'"'
  if remaining:replacement+=' style="'+';'.join(remaining)+'"'
  tag=tag[:style.start()]+replacement+tag[style.end():]
 return tag

for file in (root/'src/design/claude').glob('*.html'):
 body=file.read_text(encoding='utf-8')
 body=re.sub(r'<[a-z][^>]*>',migrate_tag,body)
 body=tokens(body)
 if file.stem=='programacao':
  labels={'Tudo':'all','Jazz':'jazz','Bossa Nova':'bossa','DJs':'dj','Piano Bar':'piano','Livros':'books'}
  def filter_chip(m):
   attrs,label=m[1],m[2]
   if label not in labels:return m[0]
   attrs=re.sub(r'\s(?:data-demo|title|aria-disabled)="[^"]*"','',attrs)
   return f'<a{attrs} data-agenda-filter="{labels[label]}" role="button" aria-controls="agenda" aria-pressed="'+('true' if label=='Tudo' else 'false')+'">'+label+'</a>'
  body=re.sub(r'<a([^>]*\bclass="chip[^"]*"[^>]*)>([^<]+)</a>',filter_chip,body)
  def event_row(m):
   attrs,inside=m[1],m[2]
   category=re.search(r'font-size:14px;font-weight:600[^>]*><span[^>]*></span>([^<]+)',inside)
   if not category:raise ValueError('Categoria da agenda ausente')
   text=unescape(category[1]).strip()
   key=next((value for label,value in [('Jazz','jazz'),('Bossa Nova','bossa'),('DJ','dj'),('Piano Bar','piano'),('Livros','books')] if text.startswith(label)),None)
   if key is None:raise ValueError('Categoria desconhecida: '+text)
   return f'<a{attrs} data-event-row data-event-category="{key}">'+inside+'</a>'
  # A grade de seis colunas identifica as linhas da agenda, sem inferir categorias por nome do artista.
  body=re.sub(r'<a([^>]*grid-template-columns:120px[^>]*?)>(.*?)</a>',event_row,body,flags=re.S)
  body=body.replace('<div id="agenda">','<div id="agenda" data-agenda><p class="sr-only" data-filter-status role="status" aria-live="polite" aria-atomic="true"></p><p class="filter-empty" data-filter-empty hidden>Nenhum evento nesta seleção.</p>')
  body=body.replace('<div style="margin-bottom:56px">','<div style="margin-bottom:56px" data-agenda-month>')
  body=body.replace('<div class="mb-[56px]">','<div class="mb-[56px]" data-agenda-month>')
 elif file.stem=='index':
  def home_chip(m):
   attrs,label=m[1],m[2]
   attrs=re.sub(r'\s(?:data-demo|title)="[^"]*"','',attrs)
   intent={'Tudo':'all','Música':'music','DJs':'dj'}.get(label)
   return '<a'+attrs+(f' data-agenda-intent="{intent}"' if intent else '')+'>'+label+'</a>'
  body=re.sub(r'<a([^>]*\bclass="chip[^"]*"[^>]*)>([^<]+)</a>',home_chip,body)
 file.write_text(body,encoding='utf-8')

css=(root/'src/design/claude/original.css').read_text(encoding='utf-8')
css=tokens(css).replace("'Inter',system-ui,sans-serif",'var(--font-body)').replace("'Bricolage Grotesque',sans-serif",'var(--font-display)').replace("'IBM Plex Mono',monospace",'var(--font-mono)')
css=css.replace('a:hover{opacity:.82}','')
replacements={
 '.acts{display:flex;gap:10px;flex-wrap:wrap}':'.acts{@apply flex flex-wrap gap-[10px]}',
 '.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}':'.grid2{@apply grid grid-cols-2}',
 '.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}':'.grid3{@apply grid grid-cols-3 gap-6}',
 '.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}':'.grid4{@apply grid grid-cols-4 gap-6}',
 '.mono{font-family:var(--font-mono)}':'.mono{@apply font-mono}',
 'max-width:1360px':'max-width:var(--container-page)',
 'border-radius:999px':'border-radius:var(--radius-action)',
}
for old,new in replacements.items():css=css.replace(old,new)
(root/'src/styles/components.css').write_text(css,encoding='utf-8')
print(json.dumps({'inlineDeclarationsMigrated':count,'componentPatterns':5,'colorTokens':len(colors)}))
