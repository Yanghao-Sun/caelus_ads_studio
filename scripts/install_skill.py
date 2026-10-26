from pathlib import Path
import os
root=Path(__file__).resolve().parents[1];source=root/'.agents/skills/caelus_commercial_studio'
target=Path(os.environ.get('CODEX_HOME',str(Path.home()/'.codex')))/'skills/caelus_commercial_studio'
if target.is_symlink() and target.resolve()==source:print('Already installed:',target)
elif target.exists() or target.is_symlink():raise SystemExit('Existing skill preserved; resolve explicitly: '+str(target))
else:target.parent.mkdir(parents=True,exist_ok=True);target.symlink_to(source,target_is_directory=True);print('Installed:',target)
