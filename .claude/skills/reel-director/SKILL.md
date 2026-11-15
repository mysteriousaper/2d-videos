---
name: reel-director
description: Plan, time, render and check WiyMood reels and faceless 2D explainer videos (Armenian first). Use when making any reel, story video or 2D explainer, syncing an animation to a voice recording, adding captions/sound, or reviewing a video before it goes to Telegram. Works with marketing/animate.mjs, explainer.html, voice_sync.py, audio_mix.py, preview.mjs, pacing_check.py, reelwrap.mjs.
---

# Reel director

> Before starting, read `marketing/knowledge/playbook.md` (rules learned from our research and video library) and apply what fits this task.

Written for WiyMood from what the team's tutorial, the research notes (`marketing/knowledge/research/`) and the reviewed motion repos teach. Rules here are ours; no third-party text is copied.

## 1. Story first (before any pixel)
- **One idea per reel.** Write it as one sentence before scripting.
- **Hook in the first second, readable muted.** Hook types that work for business owners:
  - **"What if…"**: «Իսկ ի՞նչ կլինի, եթե ձեր սրճարանը…» (the format that grew whole channels in the team's tutorial).
  - **Problem out loud**: the owner's daily pain, in their words («Հաճախորդը գրում է… ու սպասում»).
  - **Payoff first**: show the result (before/after) in frame 1, then how.
  - **Negative / comparison**: «Մի՛ դրեք հեռախոսահամարը լոգոյի մեջ», «էժան լոգո vs բրենդ».
- **Arc:** problem → «բայց» (tension) → «դրա համար» (solution) → who we are → one action (DM «ԲՐԵՆԴ»). Problems first, us last.
- **Word budget:** ~2–3 spoken words per second → 15 s ≈ 35 words, 30 s ≈ 70–80, 45 s ≈ 100. Reels for new viewers ≤ 90 s (sweet spot 20–45 s).
- **Scene list:** one spoken line = one scene, 1.5–6 s each, every scene has a visual idea (an icon acting out the meaning, Wiy reacting, a before/after), never "text on a background" twice in a row.
- **Slideshow-risk check** (fix before rendering): same layout 3× in a row? icons only decorative? nothing moves for > 3 s? text doing all the work? any claim we can't prove?

## 2. Voice first, then animation
- The team records the voice (phone voice memo, quiet room). Never AI voices or faces in published work; Gemini TTS is allowed only as an internal timing test.
- Sync: `python3 -I marketing/voice_sync.py voice.m4a script.json synced.json` (Gemini returns start/end per line; scenes and duration follow the voice).
- Without a voice yet: render a silent PREVIEW for approval of text and animation; final always waits for the voice.

## 3. Build the explainer
`marketing/motion/explainer.html`, data `SCENES_SCENES`: `start-end mood[:effects] icons text`
- moods: `problem` (ink + red), `solution` (blue), `brand` (logo + wave draw), `cta` (Wiy acts: enter → take → point)
- effects (combine with `+`): `big` (statement, red-dot circular reveal: use once, at the problem→solution switch), `spin`, `blur`, `leave`, `wiy` (Wiy cameo reacting: surprised in problems, happy jump in solutions; single-icon scenes only), `still` (no camera move)
- mark 1–2 keywords per line as `*word*` → red marker highlight (numbers, «ԲՐԵՆԴ», the pain word)
- icons from `marketing/elements/icons.js` (chat, clock, logo, search, person, check, website, pin, store, phone, idea, growth, …)
- built in: words reveal in sync (blur-in 220 ms), icon spring entrances + idle float, slow camera push/pan, all text in the safe zone (y 270–1248 px, 65 px from the sides)
- custom text motion: steep ease-out (fast start, slow settle), never linear or bouncy; one quiet secondary touch per reveal (blur-to-sharp, line-drawn mask reveal, small scale settle, or tracking widening on a statement); keep strokes thin and letters readable (playbook 8, note 210)

## 4. Check, render, mix, check again
1. `python3 -I marketing/pacing_check.py synced.json --voice` → no FAIL (≤ 17 characters/s, scenes 0.8–7 s, hook at 0 s).
2. Trial: `node marketing/animate.mjs explainer synced.json /tmp/x.mp4` then `node marketing/preview.mjs /tmp/x.mp4 /tmp/x.jpg` → look at the contact sheet (red = Instagram UI; no text there).
3. Sound: `python3 -I marketing/audio_mix.py /tmp/x.mp4 voice.m4a synced.json /tmp/final.mp4 [--music track.mp3]` → music ducked under the voice, −14 LUFS. Aim for only 2–4 designed sound moments (hook hit, the «բայց» switch, the reveal, the CTA); `audio_mix.py` still whooshes every scene change, so on reels with many short scenes check it does not feel busy (fix tracked in `marketing/knowledge/trainer-backlog.md`). Layer those moments: a quiet ambience bed, whooshes only on big moves, a riser just before the reveal and a hit on it, small clicks/pops on key UI moments, voice always on top, no clipping. Pick the music before final timing and listen once on a phone speaker before sending (playbook 8, notes 908, 211).
4. Look at 3–4 frames of the final, then upload and send to Telegram (`marketing` skill, step "Send for approval").

## 5. Team footage (talking-head tips)
`node marketing/reelwrap.mjs raw.mp4 data.json out.mp4` (series chip, hook, subtitles 3–7 words per cue, logo, WiyMood sting). Cut silences and "um"s before wrapping when needed (ffmpeg `silenceremove`).

## 6. Style options
Default: WiyMood blue/ink with the red dot. Other looks can be added as CSS presets on the same template (e.g. warm paper with cut-out shapes) only after the team approves them; keep the red dot and Wiy in every look.

### 6a. "Warm paper explainer" look (team reference, 13 Nov 2026, note 235)
The team lead's reference reel: one presenter character fixed in the lower half, one floating UI card above him as the prop, and a headline at the top. Reproduce it with `wiy-story.html` as a preset, keeping our red dot and Wiy:
- **Background:** warm cream paper with very light grain (SVG noise) and a soft orange glow behind the card; no full-colour fills.
- **Headline:** 2–5 words, bold sans + one accent word in an italic serif in our red-orange (e.g. «ամենա*կարևորը*»). New headline every beat (1.5–2.5 s); a small dot tracker at the top shows the step.
- **Prop = UI card:** rounded white card, soft layered shadow, a small icon chip, 1–2 words; slider, progress bar, chart line drawing itself, notification dropping in, a chat bubble, slot-machine icons. Cards slide/flip in with a spring; 1 card on screen at a time.
- **Character:** same pose set every beat (point up, palm open, shrug, hand on chin, wave at the end); change pose on the spoken keyword; small idle movement, never static.
- **Structure:** hook (a promise: "storytelling so addictive it's impossible to skip") → name the framework → numbered steps 01–04, each with one concrete example card → all steps lined up as a recap row → CTA card "Comment «ԲՐԵՆԴ»" with a notification "you've got the full breakdown" → wave.
- **Sound:** light upbeat track, a soft pop on every card entry, music resolves on the last beat; voice brisk (team voice preferred, AI voice only with explicit approval).
- **Pace:** ~50 s, a visual change every 1.5–2 s, text synced to the words.

## Music (team, 8 Nov)
- Don't reuse the same calm bed on every reel. For story reels use `python3 -I marketing/music_dynamic.py <synced.json> music.wav --bpm 116-126 --seed <new each reel>`: minor and tense in the problem scenes, a riser into the first solution scene, then a driving major beat. Lower it 3 dB before `audio_mix.py --music`; the voice must stay clearly on top (check: music ≥ 15 dB under the voice in speech, Gemini listen check).
- **Captions in step with the voice (team, 8 Nov):** `voice_sync.py` line starts can lag the voice by up to 1.5 s, so never render from it directly. Run `python3 marketing/word_align.py synced.json voice.wav synced-a.json --lead 60 --spoken spoken.txt` (Whisper per phrase + pause snapping; `spoken.txt` = what was actually said, one line per scene) and render from `synced-a.json`. Captions show exactly the spoken words (don't shorten them; the word-by-word reveal keeps them readable). Fallback without Whisper: `word_sync.py --relayout`. Check 2–3 scenes with sound before sending.
- **Look (explainer v3):** drifting glow mesh + dot grid, colour grade, seeded film grain and vignette, wipe transitions with no empty frames, hand-drawn line boil on icons, masked word rise. Keep it; don't strip the texture layers to save render time.

## Picsart Media Studio (free plan, team decision 8 Nov)
- Use it for every reel where it adds quality, always on the free plan (see CLAUDE.md): transcript-driven animated captions (word reveal + decorations such as marker/highlighter, pill, laser underline, glow on keywords), looks/colour grades, transitions, motion presets, text animations, reframing to other sizes, and its checks (contact sheet, motion/pixel checks, video stills).
- It only takes media by URL: upload our files to Storage and pass a signed URL (`supabase.storage...createSignedUrl`), never local paths.
- Start with `picsart_media_quickstart` (recipes: export, contact_sheet, concat_videos) and `picsart_media_get_capabilities` with only the sections needed (`captions`, `looksCompact`, `textAnimations`, `transitions`).
- Keep our own pipeline (explainer v3 + word_align.py + music_dynamic.py + audio_mix.py) as the fallback and for anything Picsart's free plan blocks. When trying Picsart on a reel, compare it side by side with our version and let the team pick.

## Music placement (team, 10 Nov)
- **A different track on every reel.** Keep a list in `marketing/knowledge/research/music.md` of what each reel used; never repeat the previous reel's track.
- **Never cut, loop or restart the track inside a reel** (the team hears it as an interruption). Use one continuous segment: measure the track's loudness envelope, find its biggest natural build, and choose the start offset so that build lands on the turn line («Բայց…»). Fade in 1 s, fade out 2 s.
- **Duck gently:** music about 9 dB down plus a soft sidechain (ratio ~3, attack 150 ms, release ~1.2 s). Hard, fast ducking "pumps" and sounds broken.
- Real recorded/composed music over synthesised beds when the reel is dramatic (Kevin MacLeod / incompetech, CC BY 4.0, credit line in the caption).
