#!/usr/bin/env python3
from pathlib import Path
import sys,json,argparse
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT))
from studio_core import load
p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
c=json.loads((ROOT/'contracts/studio.json').read_text());d=load();pr=ROOT/'studio/timeline-v1/project-rules.json';project=json.loads(pr.read_text()) if pr.exists() else []
d['rules']=c['rules']+project;d['contract_version']=c['version']
outputs={ROOT/'studio/timeline-v1/content.json':json.dumps(d,ensure_ascii=False,indent=2)+'\n',ROOT/'studio/timeline-v1/data.js':'const studioTimeline = '+json.dumps(d,ensure_ascii=False)+';\n',ROOT/'docs/studio-contract.md':'# Studio 创作契约\n\n'+c['version']+'\n\n'+'\n\n'.join('## '+h+'\n\n'+v for h,v in c['rules'])+'\n'}
bad=[]
for path,text in outputs.items():
    if args.check:
        if not path.exists() or path.read_text()!=text:bad.append(str(path))
    else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text)
if bad:print('Stale outputs: '+'\n'.join(bad));raise SystemExit(1)
print('Build check passed' if args.check else 'Built current project and shared rules')
