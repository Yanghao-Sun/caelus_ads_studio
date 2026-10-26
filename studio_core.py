"""Current project access shared by CLI and build tooling. No video providers."""
from pathlib import Path
import json, hashlib, zipfile, shutil
ROOT=Path(__file__).resolve().parent

def load(root=ROOT):
    root=Path(root)
    cfg=json.loads((root/'project.local.json').read_text()) if (root/'project.local.json').exists() else {}
    path=root/cfg.get('content','studio/timeline-v1/content.json')
    return json.loads(path.read_text()) if path.exists() else json.loads((root/'templates/project-content.json').read_text())

def tasks(data):
    for scene in data['scenes']:
        for beat in scene['beats']:
            if beat.get('candidate_tasks'):
                for i,t in enumerate(beat['candidate_tasks']):
                    yield t.get('id',beat['id']+'-'+chr(65+i)),t['package'],beat
            elif (beat.get('candidate_handoff') or {}).get('package'):
                yield beat['id'],beat['candidate_handoff']['package'],beat

def package_errors(path):
    errors=[]
    with zipfile.ZipFile(path) as z:
        names=z.namelist(); files=[n for n in names if not n.endswith('/')]
        if any('/' in n or '\\' in n for n in names):errors.append('package must be flat')
        texts=[n for n in files if n.lower().endswith('.txt')]
        images=[n for n in files if Path(n).suffix.lower() in ['.png','.jpg','.jpeg','.webp']]
        if len(texts)!=1:errors.append('requires exactly one text prompt')
        if not 1<=len(images)<=10:errors.append('requires 1–10 frames')
        if len(texts)+len(images)!=len(files):errors.append('unexpected file type')
        if z.testzip():errors.append('corrupt archive')
    return errors

def check(root=ROOT):
    root=Path(root);data=load(root);errors=[]
    for scene in data['scenes']:
        for beat in scene['beats']:
            for f in beat.get('frames',[])+beat.get('candidate_frames',[]):
                p=root/'studio'/f['src']
                if not p.is_file():errors.append(f'missing: {p}')
                elif f.get('sha256') and hashlib.sha256(p.read_bytes()).hexdigest()!=f['sha256']:errors.append(f'hash mismatch: {p}')
    for name,p,beat in tasks(data):
        path=root/'studio'/p
        if not path.is_file():errors.append(f'missing package: {name}: {p}')
        else:
            errors += [name+': '+e for e in package_errors(path)]
            task=next((t for t in beat.get('candidate_tasks',[]) if t.get('id')==name),beat.get('candidate_handoff') or {})
            frames=beat.get('candidate_frames',[])
            selected=[frames[i] for i in task.get('frame_indices',range(len(frames)))]
            with zipfile.ZipFile(path) as z:
                images=sorted(n for n in z.namelist() if Path(n).suffix.lower() in ['.png','.jpg','.jpeg','.webp'])
                expected=[f['sha256'] for f in selected]
                actual=[hashlib.sha256(z.read(n)).hexdigest() for n in images]
                if expected!=actual:errors.append(name+': packaged frames differ from current ordered candidates')
                texts=[n for n in z.namelist() if n.lower().endswith('.txt')]
                if task.get('prompt_sha256') and len(texts)==1 and hashlib.sha256(z.read(texts[0])).hexdigest()!=task['prompt_sha256']:errors.append(name+': prompt hash differs')
    return errors

def status(root=ROOT):
    d=load(root)
    return {'scenes':len(d['scenes']),'story_beats':sum(len(s['beats']) for s in d['scenes']),'tasks':[n for n,_,_ in tasks(d)],'browser_acceptance':'Read in the original Studio browser; CLI does not infer acceptance.','validation_limit':'File/hash/package checks do not establish visual correctness or human acceptance.'}
