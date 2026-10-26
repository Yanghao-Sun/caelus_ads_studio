---
name: caelus_commercial_studio
description: Create, continue and revise Caelus commercials in the shared shooting Studio, from narrative sketches and Blender-grounded keyframes to concise external-video handoff packages and returned-clip review. Codex never generates video.
---

# Caelus Commercial Studio

## Enter the actual Studio

Locate the repository containing this skill and studio.py. Read its AGENTS.md, README.md, contracts/studio.json and current studio/timeline-v1/content.json. Run `python3 studio.py status`. The existing Studio is the working surface, not a disposable preview. Preserve its project state and exact browser adoption records; do not start the retired Console.

For new work align audience, intended experience, confirmed product facts, narrative, style and necessary delivery constraints. Recover established choices rather than asking again. For continuation inspect current story, Canvas tasks, candidate/accepted hashes, sources and returned clips. A filename or conversation recollection is not current state. Keep unknowns explicit.

Read [directing](references/directing.md) and [story/Canvas](references/storyboard-canvas.md) when planning or revising narrative. Keep character viewpoint, spatial cause, setup/reveal/payoff and expressive acting central. Do not color in an implausible drawing.

## Three mandatory review boundaries

1. **Story/Storyboard review:** check the approved intent, sequence, physical staging and capability claims before execution planning. Correct misleading storytelling rather than making downstream images obey it. Read [keyframes](references/keyframes.md) for source roles.
2. **Blender review:** use the installed `caelus-blender` skill for every lamp keyframe creation/edit. Actually inspect relevant original Hero renders and pose/view coverage; pass Hero images to every image call. If coverage is missing OR structure review fails, use the real Blender model to supply/correct static references, repair the candidate and re-review. A generic attached product sheet does not prove coverage. Keep constraints, lengths and connections intact. Reuse a previously verified exact static reference when applicable; rendering anew is not a quota.
3. **Delivery review:** read [delivery](references/delivery.md), compare the actual ordered frames and final prompt, and resolve conflicting geometry, emission, camera, time and action directions before packaging. File checks cannot certify this semantic review.

These reviews reduce risk; they do not eliminate generative mistakes or prove hardware motion. Record what was actually inspected, exact files/hashes, findings and remaining limits. Do not invent a pass from source attachment or generation success.

## Execute and hand off

Use ImageGen for authorized drawings/photographic edits, with real role-specific images. Use simplified director sketches for Storyboard; Canvas carries the execution frames. Choose only states that matter, at most 10 per generation task. Distinguish continuous interpolation, cuts and transitions. Keep original assets, rejected attempts and prior candidates.

Codex NEVER calls a video-generation provider. Frank generates externally. Each task package is flat: ordered keyframes plus one concise English prompt.txt, with duration/ratio presented separately. Use `the lamp` in external generation prompts. No Studio IDs, version notes, JSON, source assets or return instructions in the model-facing package. AR/precise text stay in post.

Creating or packaging photos does not authorize replacing Canvas sketches. Record Frank's explicit approval of the exact image set separately from technical and creative review. Revisions do not inherit approval by filename. Read [finishing](references/finishing.md) for returned-video or local post work.

## Maintain the common facts

Project rules and state serve both the page and the agent. Edit the current content/project-rules files, run `python3 scripts/build_studio.py`, and verify the visible path where available. Internal source/review records stay outside provider ZIPs. Use `python3 studio.py check` for deterministic checks and inspect images separately.

Use Developer Tools only when product-capability evidence is relevant: inspect its pinned source/version and report unknown support. Do not introduce Core or hardware control into this Studio. The source-inspired pattern is shared facts and thin entrances, not a requirement to add MCP, a model service or a vector database.
