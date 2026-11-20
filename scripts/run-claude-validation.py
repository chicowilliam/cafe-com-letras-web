"""Executa o Playwright CLI sem perda de aspas pelo shell do Windows."""
from pathlib import Path
import subprocess,json,sys
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4321'
tag='local' if '127.0.0.1' in base else 'preview'
code=Path('scripts/validate-claude.cjs.txt').read_text(encoding='utf-8')
code=code.replace("const live=report.base;",'const live='+json.dumps(base)+';')
code=code.replace("const tag=live===report.base?'local':'preview';",'const tag='+json.dumps(tag)+';')
code=code.replace("const report={base:'http://127.0.0.1:4321'",'const report={base:'+json.dumps(base))
out=Path('output/playwright/claude');out.mkdir(parents=True,exist_ok=True)
cache=Path.home()/'AppData/Local/npm-cache/_npx'
cli=next(cache.glob('*/node_modules/@playwright/cli/playwright-cli.js'))
r=subprocess.run(['node',str(cli),'-s=claude','run-code',code],capture_output=True,text=True,encoding='utf-8')
(out/f'{tag}-validation.log').write_text(r.stdout+r.stderr,encoding='utf-8')
if '### Result\n' in r.stdout:
    result=r.stdout.split('### Result\n',1)[1].split('\n###',1)[0]
    report=json.loads(result)
    (out/f'{tag}-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=True))
else:
    print(r.stdout);print(r.stderr)
sys.exit(r.returncode)
