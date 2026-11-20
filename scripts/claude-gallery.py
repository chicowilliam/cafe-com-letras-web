from pathlib import Path
from html import escape
root=Path('output/playwright/claude')
names={'index':'Home','gastronomia':'Gastronomia','programacao':'Programação','evento':'Evento','livraria':'Livraria','casa':'A Casa','celular':'Referência mobile'}
html=['<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Comparação visual — Café com Letras</title><style>body{margin:32px auto;padding:0 20px;max-width:1400px;background:#fafaf7;color:#161614;font:16px system-ui}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:inherit}section{margin:48px 0}img{display:block;max-width:100%;height:auto;border:1px solid #ddd}details{margin:16px 0}summary{cursor:pointer;padding:12px;border:1px solid #aaa;border-radius:12px}p{line-height:1.5}</style><h1>Comparação visual — Café com Letras</h1><p>Referência HTML à esquerda; versão Astro publicada em prévia à direita. Desktop: 1440 px. Mobile: 390 px. As páginas internas originais transbordam no mobile; a versão adaptada empilha os grids. A Home mobile é comparada ao artboard celular aprovado.</p><nav>']
html.extend(f'<a href="#{key}">{escape(name)}</a>' for key,name in names.items());html.append('</nav>')
for key,name in names.items():
    html.append(f'<section id="{key}"><h2>{escape(name)}</h2>')
    for width,label in [(1440,'Desktop'),(390,'Mobile')]:
        html.append(f'<details><summary>{label} — {width} px</summary><a href="compare-{key}-{width}.png"><img loading="lazy" src="compare-{key}-{width}.png" alt="Comparação {escape(name)} {label}"></a></details>')
    html.append(f'<p>Tablet 768 px: <a href="reference-{key}-768.png">referência</a> · <a href="preview-{key}-768.png">prévia</a></p></section>')
html.append('<p><a href="preview-report.json">Relatório Playwright</a> · <a href="pixel-report.json">Comparação de pixels</a></p></html>')
(root/'index.html').write_text(''.join(html),encoding='utf-8')
print(root/'index.html')
