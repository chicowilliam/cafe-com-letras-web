GETIN = "https://reservation.getin.app/36qBovkN"
WHATS = "https://wa.me/5531984244285"
IFOOD = "#delivery-ifood"
YT = "https://www.youtube.com/@cafecomletrastv"
IG = "https://www.instagram.com/cafe_com_letras/"
LOGO_INK = "/_blob/b958f210db5bd0e7a71f74e922f9c799"
LOGO_W = "/_blob/657f3f8cf6996109edf9d1b13afb6c01"

FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&amp;family=Inter:wght@400;500;600;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap">'

CSS = """
body{margin:0;background:#FAFAF7;color:#161614;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}a:hover{opacity:.82}
*{box-sizing:border-box}
.wrap{max-width:1360px;margin:0 auto;padding-left:40px;padding-right:40px}
.disp{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;line-height:.9;margin:0}
.h2{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.03em;line-height:.95;font-size:64px;margin:0}
.h3{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;letter-spacing:-.02em;line-height:1.05;font-size:28px;margin:0}
.mono{font-family:'IBM Plex Mono',monospace}
.tag{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:500}
.lead{font-size:19px;line-height:1.5;margin:0}
.p{font-size:16px;line-height:1.55;margin:0}
.util{background:#161614;color:#FAFAF7;font-size:13px}
.util .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:10px;padding-bottom:10px}
.hdr{background:#FAFAF7;border-bottom:1.5px solid #161614}
.hdr .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding-top:18px;padding-bottom:18px}
.nav{display:flex;gap:28px;flex-wrap:wrap;font-weight:600;font-size:15px}
.nav a{text-decoration:none;padding:10px 0;border-bottom:2px solid transparent}
.nav a.on{border-bottom-color:#161614}
.acts{display:flex;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 20px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;border:1.5px solid #161614;color:#161614;background:transparent;white-space:nowrap}
.btn.ink{background:#161614;color:#fff}
.btn.mesa{background:#B83C18;border-color:#B83C18;color:#fff}
.btn.palco{background:#1D2B53;border-color:#1D2B53;color:#fff}
.btn.w{background:#fff;border-color:#fff;color:#161614}
.btn.wo{border-color:rgba(255,255,255,.9);color:#fff}
.photo{background:#D8D5CC;display:flex;align-items:flex-end;padding:14px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#3F3D38}
.photo.dark{background:#2C3A63;color:#D5DAEA}
.photo.warm{background:#9E3414;color:#F6D9CD}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;vertical-align:middle;margin-right:8px}
.v{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#2F6B3A;color:#fff;font-size:11px;font-weight:700;margin-left:8px;vertical-align:middle}
.rule{border:0;border-top:1.5px solid #161614;margin:0}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:14px 0;border-bottom:1px solid rgba(22,22,20,.18)}
.row .n{font-weight:600;font-size:17px}
.row .d{font-size:14px;color:#55534D;margin-top:3px;line-height:1.4}
.row .pr{font-family:'IBM Plex Mono',monospace;font-size:16px;white-space:nowrap}
.foot{background:#161614;color:#E9E7E1;font-size:15px;line-height:1.6}
.foot a{text-decoration:none}
.foot .wrap{padding-top:72px;padding-bottom:40px}
.chip{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:999px;border:1.5px solid #161614;font-size:14px;font-weight:600;text-decoration:none;background:transparent;color:#161614}
.chip.on{background:#161614;color:#fff}
.ex{font-family:'IBM Plex Mono',monospace;font-size:11px;background:#FFE58A;color:#161614;padding:2px 6px;border-radius:4px;vertical-align:middle;letter-spacing:.04em}
@media(max-width:900px){.grid2,.grid3,.grid4{grid-template-columns:minmax(0,1fr)}.h2{font-size:44px}.wrap{padding-left:20px;padding-right:20px}.hide-m{display:none}}
"""

def util():
    return f'''<div class="util"><div class="wrap"><span><strong>Aberto hoje</strong> · 12h às 23h</span><span>Rua Antônio de Albuquerque, 781 · Savassi · Belo Horizonte</span><span><a href="#pt">PT</a> / <a href="#en">EN</a></span></div></div>'''

NAV = [("Gastronomia","Gastronomia.dc.html"),("Programação","Programacao.dc.html"),("Livraria","Livraria.dc.html"),("Exposições","Programacao.dc.html#em-cartaz"),("A Casa","Casa.dc.html")]

def header(active=""):
    links = "".join(f'<a href="{h}" class="{"on" if n==active else ""}">{n}</a>' for n,h in NAV)
    return f'''{util()}<header class="hdr"><div class="wrap"><a href="Main.dc.html" aria-label="Café com Letras, página inicial" style="display:block;line-height:0"><img src="{LOGO_INK}" alt="Café com Letras Savassi" style="height:52px;width:auto"></a><nav class="nav" aria-label="Principal">{links}</nav><div class="acts"><a class="btn ink" href="{GETIN}">Reservar</a><a class="btn" href="{IFOOD}">Delivery</a><a class="btn" href="{WHATS}">WhatsApp</a></div></div></header>'''

def footer():
    return f'''<footer class="foot"><div class="wrap"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:40px"><div><img src="{LOGO_W}" alt="Café com Letras Savassi" style="height:56px;width:auto"><p style="margin:20px 0 0;color:#B9B6AE">Gastronomia, música e literatura na Savassi desde 1996.</p></div><div><div class="tag" style="color:#8E8B83;margin-bottom:12px">Visite</div>Rua Antônio de Albuquerque, 781<br>Savassi · Belo Horizonte · MG<br><a href="#mapa" style="text-decoration:underline">Abrir no Google Maps</a></div><div><div class="tag" style="color:#8E8B83;margin-bottom:12px">Horários</div>Todos os dias, a partir das 12h<br>Dom a qui até 22h<br>Sex e sáb até 23h</div><div><div class="tag" style="color:#8E8B83;margin-bottom:12px">Fale com a casa</div><a href="{WHATS}">WhatsApp (31) 98424-4285</a><br><a href="{GETIN}">Reservas</a><br><a href="{IFOOD}">Delivery iFood</a><br><a href="{IG}">Instagram</a> · <a href="{YT}">YouTube</a></div><div><div class="tag" style="color:#8E8B83;margin-bottom:12px">Da mesma casa</div>Clube de Jazz do Café com Letras<br>Ototoi<br>Savassi Festival<br>Jornal Letras</div></div><hr style="border:0;border-top:1px solid #3A3936;margin:56px 0 20px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:#8E8B83"><span>© Café com Letras · 30 anos</span><span><a href="Casa.dc.html#eventos-privados">Eventos privados</a> · <a href="#trabalhe">Trabalhe conosco</a> · <a href="#imprensa">Imprensa</a></span></div></div></footer>'''

def page(title, body, w, h, lang="pt-BR"):
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>{CSS}</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''

def rows(items):
    out=[]
    for it in items:
        n,d,p = it[0], it[1], it[2]
        vg = '<span class="v" aria-label="vegano">V</span>' if len(it)>3 and it[3] else ''
        dd = f'<div class="d">{d}</div>' if d else ''
        out.append(f'<div class="row"><div><div class="n">{n}{vg}</div>{dd}</div><div class="pr">{p}</div></div>')
    return "".join(out)

# Pasta de saída dos artboards (.dc.html). Por padrão: ../design-canvas/project relativo a este arquivo.
import os as _os
OUT_DIR = _os.environ.get("DC_OUT_DIR", _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "design-canvas", "project"))
