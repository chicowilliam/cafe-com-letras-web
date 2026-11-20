"""Importação fiel e auditável do pacote entregue; nunca lê o banco legado."""
from pathlib import Path
import re, shutil, hashlib, json
root = Path(__file__).resolve().parents[1]
source = Path(r'C:\Users\User1\Downloads\cafe-com-letras-site\cafe-com-letras-site')
target = root / 'design-reference/claude'
target.mkdir(parents=True, exist_ok=True)
for folder in ['site', 'source', 'docs']:
    shutil.copytree(source / folder, target / folder, dirs_exist_ok=True)
for name in ['README.md', 'TRANSFERENCIA_TECNICA.md', 'PENDENCIAS.md']:
    shutil.copy2(source / name, target / name)
shutil.copytree(source / 'site/assets', root / 'public/claude/assets', dirs_exist_ok=True)
out = root / 'src/design/claude'
out.mkdir(parents=True, exist_ok=True)
hashes = {}
for file in sorted((source / 'site').glob('*.html')):
    html = file.read_text(encoding='utf-8')
    hashes[file.name] = hashlib.sha256(file.read_bytes()).hexdigest()
    css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    body = re.search(r'<body>(.*?)</body>', html, re.S).group(1)
    # Links relativos passam a rotas amigáveis. Conteúdo e CSS não são reescritos.
    for name in ['index','gastronomia','programacao','evento','livraria','casa','celular']:
        body = body.replace('href="'+name+'.html', 'href="'+('/' if name == 'index' else '/'+name+'/'))
    body = body.replace('src="assets/', 'src="/claude/assets/')
    body = body.replace('https://reservation.getin.app/36qBovkN', 'https://usetag.me/cafecomletras')
    body = body.replace('href="#delivery-ifood"', 'href="/delivery/"')
    # O WhatsApp é interpolado pelo componente a partir da configuração existente.
    body = body.replace('https://wa.me/5531984244285', '__WHATSAPP__')
    # Preservar a aparência, explicitar os controles demonstrativos ao foco/clique.
    pending = ['#delivery-ifood','#pt','#en','#imprensa','#trabalhe','#lembrete','#calendario','#']
    for href in pending:
        body = body.replace('href="'+href+'"', 'href="'+href+'" data-demo="Este recurso faz parte da proposta visual e aguarda homologação." aria-disabled="true" title="Demonstração — indisponível nesta prévia"')
    body = re.sub(r'(<a\b[^>]*class="[^"]*chip[^\"]*"[^>]*)(>)',r'\1 data-demo="Filtros demonstrativos: a filtragem ainda não está implementada." title="Filtro demonstrativo"\2',body)
    body = body.replace('type="button"', 'type="button" data-demo="Formulário demonstrativo: nenhum dado é enviado."')
    body = body.replace('<input ', '<input data-demo-input readonly aria-description="Campo demonstrativo; envio indisponível." ')
    body = re.sub(r'<input\b[^>]*type="date"[^>]*>', lambda m:m.group(0).replace(' readonly',''), body)
    body = body.replace('<textarea ', '<textarea data-demo-input readonly aria-description="Campo demonstrativo; envio indisponível." ')
    body = re.sub(r'<a\b([^>]*href="/evento/"[^>]*)>(.*?)</a>', lambda m: m.group(0) if 'Matheus Avelar' in m.group(2) else '<a'+m.group(1)+' data-demo="Existe apenas um modelo de evento nesta proposta. O detalhe deste evento ainda não foi integrado." title="Detalhe demonstrativo">'+m.group(2)+'</a>', body, flags=re.S)
    # A referência mobile mantém o mesmo botão fechado; abrir usa navegação real.
    body = body.replace('data-demo="Formulário demonstrativo: nenhum dado é enviado." aria-label="Abrir menu"', 'data-mobile-menu aria-expanded="false" aria-controls="mobile-navigation" aria-label="Abrir menu"')
    if file.stem == 'celular':
        nav = '<nav id="mobile-navigation" hidden aria-label="Principal"><a href="/gastronomia/">Gastronomia</a><a href="/programacao/">Programação</a><a href="/livraria/">Livraria</a><a href="/programacao/#em-cartaz">Exposições</a><a href="/casa/">A Casa</a></nav>'
        body = body.replace('</header>', '</header>'+nav,1)
    if file.stem != 'celular':
        body = re.sub(r'(<[^>]+style="[^"]*display:grid[^"]*")', r'\1 data-responsive-grid', body)
    (out / (file.stem+'.html')).write_text(body, encoding='utf-8')
    if file.stem == 'index':
        (out / 'original.css').write_text(css, encoding='utf-8')
(target / 'sha256.json').write_text(json.dumps(hashes,indent=2),encoding='utf-8')
print('Sete páginas importadas; originais e hashes preservados.')
