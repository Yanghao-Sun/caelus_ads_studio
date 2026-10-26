# Caelus Commercial Studio

A shared local shooting Studio for Frank and Codex: narrative sketches, executable keyframes, source-grounded review, external video handoff and returned-clip review. The existing Studio remains the working surface. The former advertising Console is retired.

## Local use

Python 3.10+; setup and serving use the standard library. No model key or video provider is required.

```sh
python3 studio.py status
python3 scripts/build_studio.py
python3 studio.py check
python3 server.py --port 8896
```

Open http://127.0.0.1:8896/ . The original file URL remains the preferred existing-project entry because browser localStorage/IndexedDB belong to their origin. Opening another origin does not migrate approvals or uploaded clips. Keep the original browser profile; export its existing review records before changing origins.

The public repository contains application/workflow sources, not the private film, images, original Blender models or returned videos. Restore the local `studio/` production directory and asset roots from your own backup before resuming that film. A fresh checkout starts an empty project; it is not a clone of Frank's media or approval history. `project.local.json` records local roots and legacy provenance aliases, and is ignored.

## Skill

Install the repository skill with `python3 scripts/install_skill.py`. Invoke `$caelus_commercial_studio`. The underscore spelling is Frank's explicit name; it intentionally differs from the generic skill validator's hyphen naming convention. The skill also uses the separately installed `caelus-blender` for mandatory structural review. It does not install Blender or change Codex MCP configuration.

Read [the shared contract](docs/studio-contract.md). `contracts/studio.json` owns general rules; local `studio/timeline-v1/project-rules.json` owns film-specific rules. The builder makes displayed rules and data.js from these sources. Scene content and exact candidate bindings remain in content.json; browser adoption remains a distinct user action.

The workflow is story → semantic review → Canvas → Blender-grounded static review → keyframes → image/prompt review → flat handoff → Frank's external video → returned review. Codex never generates video. Rule checks are not guarantees against model errors or hardware validation.

## Packages and checks

`python3 studio.py package TASK --out output.zip` validates and copies an existing selected candidate package. It never generates or adopts media. Review the exact frame set and English prompt before re-release; each ZIP holds ordered frames and one prompt.txt. See `studio.py --help`.

Run `python3 -m unittest discover -s tests -v` and `python3 scripts/build_studio.py --check`. Media checks and human/visual review are separate. No paid generation during setup tests.

## Design provenance

Inspired by [Caelus Developer Tools](https://github.com/Knightsll/Caelus_Developer_Tools/tree/78cbb6704fea721b32f2ce5871b3e158ac36397f): shared source-backed facts, thin UI/agent entrances, explicit evidence limits and local operation. This Studio does not implement Core, CMPP or hardware control. The code and assets of that project have not been imported.
