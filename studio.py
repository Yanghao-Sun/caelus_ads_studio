#!/usr/bin/env python3
import argparse,json,shutil
from pathlib import Path
from studio_core import ROOT,load,tasks,status,check,package_errors
p=argparse.ArgumentParser();s=p.add_subparsers(dest='command',required=True)
s.add_parser('status');s.add_parser('check');a=s.add_parser('package');a.add_argument('task');a.add_argument('--out',required=True)
a=p.parse_args()
if a.command=='status':print(json.dumps(status(),ensure_ascii=False,indent=2))
elif a.command=='check':
    errors=check();print('\n'.join(errors) if errors else 'PASS: file hashes and flat package structure. Visual/semantic review and acceptance remain separate.');raise SystemExit(bool(errors))
else:
    matches=[x for x in tasks(load()) if x[0]==a.task]
    if len(matches)!=1:p.error('Task not uniquely found. Run status.')
    src=ROOT/'studio'/matches[0][1];err=[e for e in check() if e.startswith(a.task+':')]
    if err:p.error('; '.join(err))
    out=Path(a.out)
    if out.exists():p.error('Output already exists; choose a new filename.')
    out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,out);print(out.resolve())
