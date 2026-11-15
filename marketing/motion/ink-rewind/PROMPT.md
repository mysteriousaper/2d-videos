# How we made the «Մի հատ նորից» ink reel: the full recipe and a ready prompt

Published 15 Nov 2026 (https://www.instagram.com/reel/DfwrZ7BgIVE/). 50.6 s, 1080×1920, 30 fps, −14 LUFS.
Everything below is free: no paid tools, no AI video, no AI voice, no AI people.

---

## 1. Copy-paste prompt (start a new Claude Code session on this repo and paste this)

```text
Make a vertical Instagram reel for WiyMood in our hand-drawn ink style, the same way we made
«Մի հատ նորից» (marketing/motion/ink-rewind/). Read first: CLAUDE.md, marketing/knowledge/playbook.md,
marketing/motion/ink-rewind/PROMPT.md (this file), .claude/skills/reel-director/SKILL.md and
.claude/skills/marketing/SKILL.md. Use the skills reel-director, marketing and anthropic-skills:hy-writer.

Topic / story: <one line: whose problem, what goes wrong, how it gets fixed>
Length: <30–50 s>. Voice: <team member records it; I will send a .wav/.m4a>.
Music: <track name + link; I download it myself, you can't download from Pixabay>.

Rules:
1. Plan first: hook options (customer POV, first 1–2 s), a storyboard table (time, scene, emotion, sound),
   then wait for my pick. Armenian first, short English part in the caption only.
2. Write the voice script in Armenian (hy-writer rules, run marketing/hy_check.py), tell me how long it should be
   and how to record it (quiet room, phone or USB mic 15–20 cm away, WAV, 2 s silence at start).
3. When the voice arrives: transcribe with faster-whisper (word timestamps), time every scene to the words.
4. Build the animation with the ink engine (marketing/motion/ink-rewind/final/ink.js + reel.html as the template):
   ink on paper, line boil, pen write-on, loose double line, no fills, brand colours only, one continuous camera
   over one sheet, Armenian text drawn from real glyph outlines. Hide 3–5 small easter eggs (Wiy, funny signs).
5. Check every text stays inside the safe frame (check.cjs) and look at a contact sheet of frames before rendering.
6. Sound: voice cleaned (declick 8 ms fade-ins), music under the voice (−16…−21 dB ducking), effects on beat,
   cuts on the kick transient, loudnorm −14 LUFS. Send me 2–4 short audio previews to choose from;
   I listen, you can't.
7. Render, compress for upload (<17 MB), make a cover inside the 3:4 grid zone (y 240–1680), show me both.
8. Only after my ✅: upload with marketing/upload.mjs, create the marketing_items row (status waiting_approval)
   so the team approves it in Telegram. Never publish yourself. Caption: one connected thought, CTA only if I ask
   (we are in the "activity" phase: no "write us" unless I say so), 2–3 hashtags on the topic.
Ask me only what you can't decide yourself. Show me previews early; don't render the final until I say go.
```

---

## 2. What you need (accounts, connectors, environment)

| What | Used for | Notes |
|---|---|---|
| **Claude Code** (web, cloud session) with this GitHub repo `Exishe/WiyMood-Website` | everything | branch per session; commit sources to `marketing/motion/<name>/` |
| **Supabase connector** (MCP), project id in `config/settings.json` | DB rows (`marketing_items`, `marketing_plans`, `inbox_messages`), edge functions, Vault | secrets only in Supabase Vault, never in chat |
| Edge functions in `supabase/functions/` | `publisher` (posts to Instagram at `planned_at`), `marketing-notify` + `telegram-webhook` (approval in Telegram), `asset-upload`/`sign-url` (files), `ig-sync` (comments, DMs, insights, auto-answer to «ԲՐԵՆԴ»), `ig-webhook` (instant comment events, setup in `docs/ig-webhook-setup.md`) | |
| **Telegram bot** | team approves ✅/✏️/❌ every post and reply | bot token in Vault |
| **Meta app + Instagram professional account + Facebook page** | publishing, comments, private replies | page token in Vault (`meta_page_token`); "Allow access to messages" on in Instagram |
| **Pixabay** (free licence, no credit needed) | music | a human downloads the mp3 (Pixabay blocks automated downloads) |
| A real person's **voice** | narration | phone or USB mic (we used a Fifine A6T), WAV |
| Not used for this reel | Picsart (free plan only), Figma, Runway, any AI video/voice | house rules: no AI people, faces or voices |

Environment (the cloud container already has most of it):
- Node 22 + **Playwright Chromium** (preinstalled; renders the canvas frame by frame).
- **ffmpeg / ffprobe** (encode, cut, loudnorm, contact sheets).
- Python 3 with **numpy, scipy** (all audio: mixing, ducking, scratches, tape stop, SFX synthesis) and **faster-whisper** (`medium` model, pass a numpy array, not a file path).
- npm in the reel folder: `@fontsource/noto-sans-armenian`, `@fontsource/noto-serif-armenian`, `opentype.js` (glyph outlines for the pen write-on). Fonts used: `f/SA.woff`, `f/SL.woff` (Noto Sans Armenian, Armenian and Latin subsets); Montserrat for Latin headings.
- A local static server for the page: `setsid nohup python3 -m http.server 8771 &` inside the reel folder (start it with setsid, or it dies between commands).

---

## 3. The pipeline, step by step (with the settings we used)

1. **Idea and hook.** Customer POV, first line on screen in the first second. We tested 6 hooks; the winner was the customer's view of an unanswered message. Storyboard: `final/storyboard.md`.
2. **Script and voice.** Armenian, written natively (hy-writer), checked with `marketing/hy_check.py`. The team lead recorded it; one line was re-recorded later and spliced in.
3. **Word timing.** `final/asr2.py`: faster-whisper `medium`, word timestamps → `words.json`; every scene starts on a word.
4. **Animation** (`final/reel.html` + `final/ink.js`):
   - Canvas 1080×1920, 30 fps. Palette: ink `#0B1B33`, blue `#005DC2`, red `#F23C29`, grey `#5B6B82`, paper `#F7F9FC`.
   - Ink engine: every shape is contours; per boil frame (10 fps, ×1.6 in energetic parts) points jitter, pen pressure varies, a loose second line and small gaps appear; `prog` reveals the stroke like a pen. Armenian text is drawn from real font outlines (`inkText`).
   - World: all scenes sit on one big sheet (`scene(t0,t1,x,y,fn)`, drawing starts 0.3 s early so the camera never lands on a blank page). Camera keys with heavy easing for travel, slow drift on holds, motion blur on travel.
   - Intro: a continuous fly-through (depth layers, smooth fades) that lands exactly on the first scene's camera pose. Easter eggs on signs (funny café names, «Վուլկանիզացիա», Wiy hidden 5 times).
   - Rewind: at «Մի րոպե՛» the pen stops; on «Մի հատ նորից» the drawing un-draws in 4 stepwise jerks on the beat (BPM 172.25), then the good version is drawn.
   - Captions burned in, inside the safe zone; `checkFrame(t)` / `check.cjs` report any text outside the 50 px margins or inside phone screens.
5. **Look before render.** Contact sheets: `ffmpeg -i x.mp4 -vf "fps=1/2,scale=360:-2,tile=6x3" sheet.jpg` and single frames at key moments.
6. **Render.** `node render.cjs <firstFrame> <lastFrame>` (in parallel chunks) → `fr/*.jpg` → `ffmpeg -framerate 30 -i fr/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18`.
7. **Sound** (all in numpy/scipy; previews in `final/prev*.py`, effects `pen4.py`, `sfx4.py`):
   - Track analysed first: 172.25 BPM, full part starts on the kick at 11.274 s, second drop at 74.705 s.
   - First half (the loss): music low-passed (muffled) under the voice.
   - «Մի րոպե՛»: tape stop (playback rate 1 → 0.05 over ~0.4 s).
   - Rewind: exactly 4 DJ scratches, one per beat; the track enters on beat 5 on «Ուրեմն…», cut exactly on the kick transient (25 ms late already sounds wrong).
   - Voice: 8 ms fade-in on every gated part (no clicks); EQ cut on the music at 1.5 kHz and 3 kHz to make room for speech; sidechain ducking 16–21 dB under the voice; final `loudnorm` to −14 LUFS.
   - Mux: `ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`.
8. **Upload size.** The upload function fails above ~20 MB: compress with `-crf 25 -maxrate 4M -bufsize 8M` (ours: 15.7 MB).
9. **Cover.** `final/cover2.cjs`: a frame re-drawn without background doodles, big red «9 ժամ» + «առանց պատասխանի», all inside the 3:4 grid band (y 240–1680). Check it as a grid tile at phone size before uploading.
10. **Publish through the system.** `node marketing/upload.mjs file items/<id>/1.mp4` (and `cover.jpg`), then the `marketing_items` row (caption, 2–3 hashtags, `music` note, assets, `planned_at`) with status `waiting_approval` → the team approves in Telegram → `publisher` posts and saves the link.
11. **After publishing.** `ig-sync` pulls comments every 15 min (instantly once `ig-webhook` is on), auto-answers a comment that is only «ԲՐԵՆԴ» (one DM + a public reply), everything else goes to Telegram for ✅ using texts from `marketing/replies/library.md`.

---

## 4. Lessons (what went wrong and what the team rejected)

- Fake-out music bursts and freezes: rejected. Start the music for real, once.
- Short cut-down of the long story: rejected; the long version tested better with people.
- A jerky intro (stop-and-go, side jumps, a phone swap, a 10 px seam) was the biggest complaint: one continuous camera move fixed it.
- Easter eggs must be big enough to read on a phone; colours strictly from the brand palette.
- Caption: one connected thought, not several unrelated sentences; «մրցակից», not «հարևան».
- Publish with a ready plan for the replies (library first), or the first leads meet a half-built process.
- I (Claude) can't listen to audio: always send short previews and let a human choose.
