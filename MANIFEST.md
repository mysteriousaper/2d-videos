# ink-kit: WiyMood ink-reel toolkit (packed 15 Nov 2026)

Everything needed to rebuild or adapt the «Մի հատ նորից» ink reel (50.6 s, 1080×1920, 30 fps).
Start with `marketing/motion/ink-rewind/PROMPT.md` (recipe + a ready prompt). Paths below keep the repo layout.
No secrets inside (checked: no tokens, keys or passwords; `upload.mjs` only has the placeholder `proxy-injected`).

## Files

### Rules and knowledge
| File | What it is |
|---|---|
| `CLAUDE.md` | House rules for every WiyMood session (approval in Telegram, no prices in public, no AI people, Armenian first…). |
| `marketing/knowledge/playbook.md` | Everything learned about content, reels, sales; read before any marketing task. |
| `marketing/motion/ink-rewind/PROMPT.md` | Full recipe: copy-paste prompt, accounts/connectors, environment, 11-step pipeline with settings, lessons. |
| `marketing/replies/library.md` | Approved reply texts (comments, Direct, free check rules C0–C3). Only these go to people. |
| `.claude/skills/reel-director/SKILL.md` | Skill: how to direct a reel (story, voice sync, checks, sound mix). |
| `.claude/skills/marketing/SKILL.md` | Skill: daily marketing agent, create/plan/approve flow, hard rules. |
| `.claude/skills/hy-writer/SKILL.md` | Skill: natural Eastern Armenian (spelling, punctuation, calques); contains its own copy of a checker script. |
| `marketing/hy_check.py` | Armenian text checker: `python3 hy_check.py text.txt [--no-spell]`. Std-lib only, but on first run it pip-installs `spylls` and downloads the HySpell dictionary from GitHub into `/tmp/hyspell/` (needs network). |
| `marketing/upload.mjs` | Uploads a file to our Supabase storage: `node marketing/upload.mjs <file> items/<uuid>/<name>`. Calls the `asset-upload` edge function of OUR project (URL hard-coded) with header `x-wiymood-secret`; works only where the network proxy injects that key or `WIYMOOD_UPLOAD_SECRET` is set. Useless in another project without changing the URL. |

### The reel (`marketing/motion/ink-rewind/final/`)
| File | What it does |
|---|---|
| `reel.html` | The whole reel as one canvas page. Defines scenes, camera, intro fly-through, rewind, captions, easter eggs. Exposes `boot()`, `renderFrame(t,fps)`, `checkFrame(t)`, `renderShort2(t,fps)`. |
| `ink.js` | Ink engine (`window.Ink`): line boil, pen pressure, double line, gaps, write-on (`prog`), glyph-outline text (`inkText`) via opentype.js. Palette in `INK`. |
| `opentype.min.js` | opentype.js 1.3.4 (MIT), loaded by `reel.html` to read font outlines. |
| `f/SA.woff`, `f/SL.woff` | Noto Sans Armenian (Fontsource 5.3.0), Armenian and Latin subsets; outlines for pen-drawn text. `f/RA.woff`, `f/RL.woff`: regular weight, not used by the final page. |
| `fonts/NotoSansArmenian.ttf`, `fonts/Montserrat.ttf` | CSS fonts `SA` and `MO` for solid captions. `fonts/NotoSerifArmenian.ttf` is not used by the final page. |
| `logo.png`, `wiy.png` | WiyMood logo and the Wiy mascot drawn into the reel. |
| `render.cjs` | Renders frames: `node render.cjs <firstFrame> <lastFrame>` → `fr/0000.jpg…` (JPEG q 0.93, 30 fps, `t=i/30`). Run several ranges in parallel. |
| `render_short2.cjs` | Same for the rejected short version (`renderShort2`) → `frs2/`. Kept as an example only. |
| `check.cjs` | Bounds check: `node check.cjs <port> <step> [outDir]` → prints JSON of text boxes outside the safe frame/phone screens over 0–50.6 s; with `outDir` also saves 22 key frames. |
| `shots.cjs` | Quick stills: `node shots.cjs 12.5 30 …` → `z_<t>.jpg`. |
| `cover2.cjs` | Cover: renders t=4.0 without background doodles plus «9 ժամ / առանց պատասխանի» → `cover_v2.jpg`. |
| `asr2.py` | Whisper word timings: reads `v16.raw` (mono float32, 16 kHz), faster-whisper `medium`, int8 CPU, `language='hy'`, `word_timestamps=True`; prints words per segment. |
| `words.json` | Example output format: `[[start, end, "word"], …]` (raw Whisper spelling, not corrected). |
| `voice_f2.wav` | The team lead's voice on the final timeline (+0.6 s offset), 48 kHz. Use only as a test input. |
| `prev.py` | Audio preview base: loads `race48.raw` (music, stereo float32 48 kHz) and `voice48.raw` (voice), filters (`lp/hp/bp`), segment helpers, rewind variants → `prev/*.wav`. |
| `prev2.py` | More rewind/scratch variants (exec's `prev.py` first). |
| `prev3.py` | The chosen one: exactly 4 DJ scratches at 172.25 BPM, tape stop, track enters on the kick at 11.274 s → `prev/A4c_scratch_x4.wav`. |
| `pen4.py` | Pen-scratch sound for every scene start → `pen4.wav` (mono, 48 kHz, 50.6 s). |
| `sfx4.py` | Synth SFX (whoosh, pop, ticks…) on the timeline → `sfx4.wav`. |
| `storyboard.md` | Scene-by-scene plan (times, variants, emotion, sound). |
| `package.json`, `package-lock.json` | npm deps (below). |

## How it connects
- `reel.html` loads `opentype.min.js`, `ink.js`, `logo.png`, `wiy.png`, CSS fonts `fonts/NotoSansArmenian.ttf` (SA) and `fonts/Montserrat.ttf` (MO), and outline fonts `f/SA.woff`, `f/SL.woff` (in `boot()`). All paths are relative: serve the folder over HTTP.
- **Port 8771 is hard-coded** in `render.cjs`, `render_short2.cjs`, `shots.cjs`, `cover2.cjs` (`http://127.0.0.1:8771/reel.html`); `check.cjs` takes the port as an argument. Start: `cd final && setsid nohup python3 -m http.server 8771 >/dev/null 2>&1 &`.
- Timeline constants in `reel.html`: `TOFF=0.6` (intro shift), `LOSS_END=24.3`, `RW=[27.057,28.45]`, `BEAT=60/172.25`, `DROP=28.45`, total 50.6 s (also hard-coded in `check.cjs`, `pen4.py`, `sfx4.py`).
- Video: `node render.cjs 0 1517` (in chunks) → `fr/` → `ffmpeg -framerate 30 -i fr/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 video.mp4`.
- Audio, in order:
  1. Make raw inputs with ffmpeg (not scripted): music → `race48.raw` (`-f f32le -ac 2 -ar 48000`), voice → `voice48.raw` (same), voice → `v16.raw` (`-f f32le -ac 1 -ar 16000`).
  2. `asr2.py` (word timings) → adjust scene times in `reel.html`.
  3. `prev.py` / `prev2.py` / `prev3.py` → rewind previews; a human picks one.
  4. `pen4.py` → `pen4.wav`; `sfx4.py` → `sfx4.wav`.
  5. Final mix: **not in the kit as a script** (it was run as one-off commands). Settings: music muffled (low-pass) in the loss half, EQ cuts on music at 1.5 kHz and 3 kHz, sidechain ducking 16–21 dB under the voice, 8 ms fade-in on gated voice parts, chosen rewind block, pen + sfx, then `loudnorm` to −14 LUFS.
  6. Mux: `ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`; for upload `-crf 25 -maxrate 4M -bufsize 8M` (<17 MB).
- Output files written next to the scripts: `fr/`, `frs2/`, `prev/`, `pen4.wav`, `sfx4.wav`, `cover_v2.jpg`, `z_*.jpg`.

## Packages
- npm (from `package-lock.json`): `@fontsource/noto-sans-armenian` 5.3.0, `@fontsource/noto-serif-armenian` 5.3.0, `opentype.js` 1.3.4 (+ its deps `string.prototype.codepointat` 0.2.1, `tiny-inflate` 1.0.3). Plus `playwright` (used preinstalled, not in package.json; any recent version with Chromium).
- Python (versions used): numpy 2.5.3, scipy 1.18.1, faster-whisper 1.2.1 (ctranslate2 4.8.5, av 19.0.2); `spylls` for `hy_check.py` (auto-installed).
- Tools: Node 22, Python 3.13, ffmpeg 6.1.

## Not in the kit (you need these)
- The music: "Racing Speed Gaming Music" by ViacheslavStarostin on Pixabay (download it by hand; convert to `race48.raw`).
- The Whisper `medium` model (downloads on first run, ~1.5 GB; needs network to huggingface.co).
- The HySpell dictionary for `hy_check.py` (downloads on first run from raw.githubusercontent.com).
- `node_modules/` (run `npm install` in `final/`) and Playwright Chromium.
- The final audio-mix script (see step 5 above).
- Our Supabase project, edge functions (`publisher`, `marketing-notify`, `telegram-webhook`, `asset-upload`, `sign-url`, `ig-sync`, `ig-webhook`), Vault secrets, Telegram bot and Meta app: the publishing side lives in the repo `supabase/` folder and our accounts, not here. Without them, stop at the finished MP4 + cover.
- Logo/mascot source files and the rest of `brand/`.
