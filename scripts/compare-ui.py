from pathlib import Path
from PIL import Image,ImageChops,ImageDraw
import json
root=Path('output/playwright/evolution')
rows=[]
for name in ['index','gastronomia','programacao','evento','livraria','casa','celular']:
 for width in [1440,768,390]:
  a=Image.open(root/f'before-{name}-{width}.png').convert('RGB')
  b=Image.open(root/f'after-{name}-{width}.png').convert('RGB')
  item={'name':name,'width':width,'beforeSize':a.size,'afterSize':b.size,'sameSize':a.size==b.size}
  if item['sameSize']:
   delta=ImageChops.difference(a,b);r,g,blue=delta.split();h=ImageChops.lighter(ImageChops.lighter(r,g),blue).histogram()
   item.update({'strictChangedPixels':a.width*a.height-h[0],'pixelsOver8':sum(h[9:]),'maxChannelDelta':max(i for i,n in enumerate(h) if n),'changedPercent':round(sum(h[9:])*100/(a.width*a.height),5)})
   delta.save(root/f'diff-{name}-{width}.png')
  if width in [1440,390]:
   scale=min(640/width,1)
   aa=a.resize((int(a.width*scale),int(a.height*scale)));bb=b.resize((int(b.width*scale),int(b.height*scale)))
   board=Image.new('RGB',(aa.width+bb.width+24,max(aa.height,bb.height)+42),'#edeae2');d=ImageDraw.Draw(board);d.text((8,12),'ANTES',fill='black');d.text((aa.width+24,12),'DEPOIS',fill='black');board.paste(aa,(0,42));board.paste(bb,(aa.width+24,42));board.save(root/f'compare-{name}-{width}.png')
  rows.append(item)
(root/'pixels.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print(json.dumps(rows))
