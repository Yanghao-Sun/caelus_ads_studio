# Caelus Commercial Studio

This is Frank's independent local commercial-making Studio. Read README.md, contracts/studio.json and the current studio/timeline-v1/content.json. The public repository contains application code and workflow contracts; local production media/state are not Git content.

Use .agents/skills/caelus_commercial_studio/SKILL.md as the production entrance. Keep the existing Studio page, narrative, sketches, candidate groups, accepted clips and browser storage identities. Never resume the retired Console or call video generation.

Contracts/studio.json is the shared general rule source. Film-specific rules live in studio/timeline-v1/project-rules.json; scripts/build_studio.py generates the displayed rules and data.js. Do not edit generated data.js independently. Edit scene state in content.json and run the builder. Reload actual files before editing; preserve unrelated concurrent changes.

Mandatory review: story/Storyboard semantic fidelity before execution; caelus-blender product-structure review for every lamp keyframe creation/edit, with original Hero attached to actual image calls; final image+prompt consistency before delivery. Failed structure review requires Blender-grounded repair. These are inspection obligations, not invented human approval ceremonies. Exact-set Canvas adoption remains Frank's choice.

Preserve media bytes, input/output hashes and historical records. Old source paths in provenance are historical; project.local.json maps them to migrated preserved files. No source history becomes a current default. Rejected artifacts are not generation inputs. Do not infer hardware limits or implemented capabilities from static art.

Use python3 studio.py status/check/package and python3 server.py for this project. Existing version-specific production scripts under local studio history are records, not supported current commands. Do not automatically execute them.

Before completion run python3 -m unittest discover -s tests -v, python3 scripts/build_studio.py --check, and relevant real-surface checks. Report technical checks separately from visual review, user acceptance, and browser playback. No media generation for setup verification.

This tooling does not alter Core, Official Plugins, runtime or CMPP. Their authorization and owner boundaries remain separate. No credentials, raw household media, personal paths or local state in public commits. No git reset/clean over local production data.
