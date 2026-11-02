# HMCAS CPG v2.6 Update Training

Offline, interactive training course that gets HMCAS Ambulance Paramedics familiar with the CPG v2.6 update before it goes live.
Plain HTML/CSS/JS with no build step and no framework. Users open `index.html` by double-clicking it (file://), so it must keep working without a server.

## Where things live (open only the file you need)
| What | File |
|---|---|
| Page shell + script load order | `index.html` (keep it small) |
| All styling | `css/style.css` (image paths are relative to `css/`, so use `../tx/...`) |
| Question bank (`QB`), diagnostic (`DQ`), module names (`MODS`), critical items (`CRITICAL`) | `js/content/questions.js` |
| Text visuals (`V`), "what changed" flip cards (`CHANGES`), quick reference (`REF`) | `js/content/changes-reference.js` |
| Lessons for each module | `js/content/courses/01-intro.js` … `06-final.js` (each one does `COURSES.push({...})`) |
| State/progress, icons, views (home, modules, reference, progress), lesson player | `js/app.js` |
| TXA hands-on simulation (also the shared stage engine `TXS`, sounds, voice) | `js/hands-on/txa.js` |
| Newborn thermal care hands-on (`scene:"thermo"`) | `js/hands-on/thermal.js` |
| Newborn resus (`nbr`), code clock (`code`), stretcher/SMR (`smr`) hands-on | `js/hands-on/resus.js` |
| Click/key/input handlers, startup | `js/events.js` |
| Images: brand logos / TXA + avatar / thermal / resus equipment | `brand/`, `tx/`, `th/`, `rx/` |

## How the code fits together
- These are classic `<script>` files that share one global scope. **Load order in `index.html` matters**: content → `app.js` → hands-on → `events.js`. A file can't call a function from a later file at load time. Don't switch to ES modules, because they break on file://.
- Lesson step types: `read`, `choice`, `multi`, `sort`, `input`, `walk`, `watch`, `video`, `lookup`, `stage` (a hands-on stage, handled by `TXS[...]`).
- Progress is saved in localStorage under the key `stepwise-cpg26-v1`. If you change the state shape, keep old saves loading (`S={...blank(),...saved}`).

## Clinical content rules (important)
- Clinical content must match the **approved HMCAS CPG v2.6 (2026)**. Never invent or "correct" doses, thresholds, time windows or algorithms from general knowledge. If something looks wrong, flag it and ask.
- Keep the `src` / "CPG x.y p.N" citations next to the content they support. Update the citation whenever you change the content.
- Unverified items go in the step's pending-verification list, not into the main content.
- Audience: Ambulance Paramedics (AP) and some CCP-scope items (`scope` field). Write in plain, clear English.

## Working conventions
- Match the existing compact code style (dense one-line functions, template-literal HTML).
- To check a change, open `index.html` in Edge or Chrome. Don't add a build tool or dependencies.
- Keep `README.txt` (instructions for end users) accurate if the folder layout changes.
