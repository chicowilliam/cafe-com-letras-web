"""Compara capturas Playwright e gera pranchas para revisão humana."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
import json,sys
root=Path('output/playwright/claude')
tag=sys.argv[1] if len(sys.argv)>1 else 'local'
report=[]
for name in ['index','gastronomia','programacao','evento','livraria','casa','celular']:
    for width in [1440,768,390]:
        ref=root/f'reference-{name}-{width}.png'
        local=root/f'{tag}-{name}-{width}.png'
        if not ref.exists() or not local.exists(): continue
        a,b=Image.open(ref).convert('RGB'),Image.open(local).convert('RGB')
        # Home mobile é comparada ao artboard móvel aprovado.
        if name=='index' and width==390:
            a=Image.open(root/'reference-celular-390.png').convert('RGB')
        same_size=a.size==b.size
        result={'source':tag,'name':name,'width':width,'referenceSize':a.size,'actualSize':b.size,'sameSize':same_size}
        if same_size:
            diff=ImageChops.difference(a,b)
            channels=diff.split()
            maximum=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2])
            histogram=maximum.histogram()
            result['strictChangedPixels']=a.width*a.height-histogram[0]
            result['maxChannelDelta']=max(i for i,n in enumerate(histogram) if n)
            changed=sum(histogram[9:])
            result['changedPixelsOver8']=changed
            result['changedPercent']=round(changed/(a.width*a.height)*100,5)
            if width==1440 or (name in ['index','celular'] and width==390):
                diff.save(root/f'diff-{name}-{width}.png')
        if width in [1440,390]:
            scale=min(640/width,1)
            aa=a.resize((int(a.width*scale),int(a.height*scale)))
            bb=b.resize((int(b.width*scale),int(b.height*scale)))
            board=Image.new('RGB',(aa.width+bb.width+24,max(aa.height,bb.height)+42),'#eeeae2')
            d=ImageDraw.Draw(board);d.text((8,12),'REFERENCIA HTML',fill='black');d.text((aa.width+24,12),'ASTRO',fill='black')
            board.paste(aa,(0,42));board.paste(bb,(aa.width+24,42))
            board.save(root/f'compare-{name}-{width}.png')
        report.append(result)
(root/'pixel-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
