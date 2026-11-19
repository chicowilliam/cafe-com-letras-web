"""Optional local preparation; uses existing Pillow. Cloudflare builds need only Node.
Keeps original public URLs/files and creates lossless WebP only when smaller.
"""
from pathlib import Path
from PIL import Image
import re,json,posixpath,hashlib
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'public'
pages=json.loads((ROOT/'src/data/page-snapshots.json').read_text(encoding='utf8'))
refs=set(re.findall(r'(?:src=\"|url\([\"\']?)(/[^\"\'\s)]+)', '\n'.join(p['body'] for p in pages)))
for folder in ['img/bg','img/common','img/highlights','img/news','img/photos','m/img','linktree/img']:
 refs.update('/'+p.relative_to(PUBLIC).as_posix() for p in (PUBLIC/folder).rglob('*') if p.is_file())
manifest={};saved=0;converted=0
for ref in sorted(refs):
 source=PUBLIC/ref.lstrip('/')
 if source.suffix.lower() not in ['.jpg','.jpeg','.png'] or not source.is_file():continue
 try:
  with Image.open(source) as image:
   if getattr(image,'is_animated',False):continue
   manifest[ref]={'width':image.width,'height':image.height,'src':ref}
   dest=PUBLIC/'optimized'/Path(ref.lstrip('/')).with_suffix('.webp');dest.parent.mkdir(parents=True,exist_ok=True)
   pixels=image.convert('RGBA' if image.mode in ['RGBA','P'] else 'RGB');pixels.save(dest,'WEBP',lossless=True,method=4,exact=True)
   with Image.open(dest) as result:
    if pixels.tobytes()!=result.convert(pixels.mode).tobytes():raise RuntimeError('Conversão não preservou os pixels.')
   if dest.stat().st_size<source.stat().st_size*.9:
    manifest[ref]['src']='/'+dest.relative_to(PUBLIC).as_posix();saved+=source.stat().st_size-dest.stat().st_size;converted+=1
   else:dest.unlink() # only this newly generated, redundant derivative
 except (OSError,ValueError):continue
for css in PUBLIC.rglob('*.css'):
 original=css.read_text(encoding='utf8');text=re.sub(r'https?://(?:localhost:8080|(?:www\.)?cafecomletras\.com\.br)/','/',original);base='/'+css.relative_to(PUBLIC).as_posix()
 def replace(match):
  value=match.group(1).strip().strip('\"\'');ref=posixpath.normpath(posixpath.join(posixpath.dirname(base),value)) if not value.startswith('/') else value
  meta=manifest.get(ref)
  return 'url("'+meta['src']+'")' if meta and meta['src']!=ref else match.group(0)
 updated=re.sub(r'url\(([^)]+)\)',replace,text)
 if updated!=original:css.write_text(updated,encoding='utf8')
(ROOT/'src/data/image-manifest.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf8')
(ROOT/'evidencias/fiel/image-optimization.json').write_text(json.dumps({'imagesWithDimensions':len(manifest),'losslessDerivatives':converted,'bytesSavedForConvertedReferences':saved,'pixelsVerifiedEqual':True},indent=2),encoding='utf8')
print(json.dumps({'images':len(manifest),'lossless':converted,'bytesSaved':saved}))
