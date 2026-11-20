"""Orquestra Playwright CLI, preservando aspas no Windows; não requer dependências no app."""
from pathlib import Path
import subprocess,json,sys
script=Path(sys.argv[1]);output=Path(sys.argv[2]);output.parent.mkdir(parents=True,exist_ok=True)
before=sys.argv[3] if len(sys.argv)>3 else 'https://2cdec9c2.cafe-com-letras-pages.pages.dev'
after=sys.argv[4] if len(sys.argv)>4 else 'http://127.0.0.1:4330'
code=script.read_text(encoding='utf-8').replace('__BASELINE__',json.dumps(before)).replace('__CANDIDATE__',json.dumps(after))
cli=next((Path.home()/'AppData/Local/npm-cache/_npx').glob('*/node_modules/@playwright/cli/playwright-cli.js'))
r=subprocess.run(['node',str(cli),'-s=evolution','run-code',code],capture_output=True,text=True,encoding='utf-8')
output.with_suffix('.log').write_text(r.stdout+r.stderr,encoding='utf-8')
if '### Result\n' in r.stdout:
 result=json.loads(r.stdout.split('### Result\n',1)[1].split('\n###',1)[0])
 output.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(result,ensure_ascii=True))
 if isinstance(result,dict) and result.get('passed') is False:sys.exit(1)
else:
 print(r.stdout[:3000]);print(r.stderr[:1000]);sys.exit(1)
sys.exit(r.returncode)
