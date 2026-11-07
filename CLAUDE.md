# HMCAS CPG v2.6 Update Training

Offline, interactive training course that gets HMCAS Ambulance Paramedics (AP) and Critical Care Paramedics (CCP) familiar with the CPG v2.6 update (in effect from 1 October 2026).
Plain HTML/CSS/JS with no build step and no framework. Users open `index.html` by double-clicking it (file://), so it must keep working without a server.

## Where things live (open only the file you need)
| What | File |
|---|---|
| Page shell + script load order | `index.html` (keep it small) |
| All styling | `css/style.css` (image paths are relative to `css/`, so use `../tx/...`) |
| Module check bank (`QB`), final-only questions (`FQ`), diagnostic (`DQ`), module names (`MODS`), critical items (`CRITICAL`) | `js/content/questions.js` |
| Text visuals (`V`), "what changed" flip cards (`CHANGES`), quick reference (`REF`) | `js/content/changes-reference.js` |
| Lessons for each module | `js/content/courses/01-intro.js` … `06-final.js` (each one does `COURSES.push({...})`) |
| State/progress, icons, views (home, modules, reference, progress), lesson player | `js/app.js` |
| TXA hands-on simulation (also the shared stage engine `TXS`, sounds, voice) | `js/hands-on/txa.js` |
| Newborn thermal care hands-on (`scene:"thermo"`) | `js/hands-on/thermal.js` |
| Newborn resus (`nbr`), code clock (`code`), stretcher/SMR (`smr`) hands-on | `js/hands-on/resus.js` |
| App tour coach marks (started by a `{type:"tour"}` step in Start Here) | `js/tour.js` |
| Click/key/input handlers, startup | `js/events.js` |
| Images: brand logos / TXA + avatar / thermal / resus equipment | `brand/`, `tx/`, `th/`, `rx/` |

## How the code fits together
- These are classic `<script>` files that share one global scope. **Load order in `index.html` matters**: content → `app.js` → hands-on → `tour.js` → `events.js`. A file can't call a function from a later file at load time. Don't switch to ES modules, because they break on file://.
- Lesson step types: `read`, `choice`, `multi`, `sort`, `match` (drag definitions onto terms; `pairs` of `term` and `def`), `order` (put items in sequence; `items` stored in the correct order), `input`, `walk`, `watch`, `video`, `lookup`, `stage` (a hands-on stage, handled by `TXS[...]`), `tour` (closes the player and runs the app tour).
- Progress is saved in localStorage under the key `stepwise-cpg26-v1`. If you change the state shape, keep old saves loading (`S={...blank(),...saved}`).

## Clinical content rules (important)
- Clinical content must match the **approved HMCAS CPG v2.6 (2026)**. Never invent or "correct" doses, thresholds, time windows or algorithms from general knowledge. If something looks wrong, flag it and ask.
- Keep the `src` / "CPG x.y p.N" citations next to the content they support. Update the citation whenever you change the content.
- Unverified items go in the step's pending-verification list, not into the main content.
- Audience: APs and CCPs. The `scope` field marks each item: `"AP"` shows as "AP & CCP" (both act), `"CCP"` as "CCP only" (APs recognise and escalate). Write in plain, clear English.
- Question options: keep all options a similar length so the longest is not a clue. Put the reasoning in the feedback or explanation, not in the correct option. Wrong options must be plausible and clinically wrong.
- Learner-facing tone: professional, concise and factual, like an official HMCAS course. No chatty or self-evident instructions ("Everyone starts here", "Tap your answer", "help it stick"), no cheerleading, no filler.

## Working conventions
- Match the existing compact code style (dense one-line functions, template-literal HTML).
- To check a change, open `index.html` in Edge or Chrome. Don't add a build tool or dependencies.
- Keep `README.txt` (instructions for end users) accurate if the folder layout changes.
