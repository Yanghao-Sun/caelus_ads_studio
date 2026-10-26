# Independent provider handoff

Review the chosen files and final prompt together before release. Confirm order, identity, continuous vs cut relationships, start/end state, human anatomy, lamp geometry, emission, timing and camera. Record the review against frame and prompt hashes; separate story review and Blender review. Missing semantic evidence stays unreviewed, never auto-passed by packaging.

Prompt: short English, subject `the lamp`; action sequence, camera/cuts, speed/holds, necessary light changes and ending. Let images carry appearance. Keep one short diffuser-only constraint when the lamp is visible. No IDs, versions, return instructions, metadata or prose referencing Studio access. Do not describe the lamp as lighting the room if other fixtures do it. Specify illumination from the start when that is the story. Avoid accidental dolly-in language. No AR/subtitles/precise on-screen text generation.

A task folder/ZIP contains only ordered keyframe images and one prompt.txt. No subfolders, Hero/furniture sources, JSON, receipts or separate caption documents. External providers may require selecting images individually; a ZIP is a human handoff, not a promised provider API. Show suggested seconds and aspect separately. Multi-shot timing should fit the selected total, without computing real-world time-lapse ratios.

Current `studio.py package TASK --out PATH` copies an already-reviewed existing task package after deterministic checks; it does not author a prompt, certify semantic quality, regenerate images or approve candidates. Historical packages may be inspected/downloaded as historical candidates; re-release under this contract requires the reviews above. Do not claim migrated media has newly passed every review.

Returned video: retain original bytes, task/package provenance if known, provider as reported, review and adoption separately. Watch actual motion for hallucination/expressiveness/camera/time transitions. Metadata and frame sampling alone do not equal complete playback or listening.
