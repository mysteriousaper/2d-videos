---
name: marketing
description: WiyMood's Instagram + Facebook marketing agent. "/marketing daily" runs the whole day (trend scan, plan if missing, create what is due); "/marketing plan" researches trends and builds next week's content plan for Telegram approval; "/marketing create" writes captions, renders branded visuals and sends each item to Telegram (✅ / ✏️ / ❌ / 🕒). Use when the user types /marketing, asks for a content plan, posts, carousels, stories, reels, captions or campaigns for WiyMood, or a schedule runs it.
---

# Marketing agent

Read first, every time:
- `marketing/knowledge/playbook.md`: the rules that decide what gets reach and leads (sends, hooks, safe zones, series, offer). Follow it on every plan and post. Sections 1–8 are for our own posts; sections 9–12 (client branding, websites, sales/pricing, client marketing strategy) are the rules for client work, outreach and any post that teaches those topics.
- `brand/brand-brief.md`: voice, colours, slogans (EN + HY), pillars and shares, contacts, portfolio rules.
- `docs/superpowers/specs/2026-11-05-marketing-agent-design.md`: how the system works.
- `config/settings.json`: Supabase project id.

Use the Supabase `execute_sql` tool on that project. Escape single quotes in SQL text by doubling them.

## Natural feed (think like a human marketing manager)
- **Real first.** Once the team's photos and videos exist (`marketing/footage/` or sent in Telegram), at least half of each week's feed posts use them: faces, hands, our workplace, the city around us. Templates frame real content; they are not the whole feed.
- **Never AI-generated people, faces or voices.** Stock photos (`marketing/stock/`) are for mood only, at most 1 in 5 posts, and never shown as our team, office or a client.
- **Quick tips series («Արագ խորհուրդ»):** the team films short talking-head tips (see `marketing/shoot/quick-tips.md`). Brand them with:
  ```bash
  node marketing/reelwrap.mjs <raw.mp4> /tmp/<item>.json /tmp/<item>.mp4
  ```
  JSON fields: `SERIES` («Արագ խորհուրդ #N»), `HOOK` (the first sentence, ≤ 8 words), `SUBS_CUES` (subtitles "start-end text" per line, ≤ 7 words each, matching what is said), optional `SLOGAN`. Watch 3–4 frames before uploading. Upload the MP4 and set `kind = 'reel'`.
- When footage is missing for a planned reel, write the script and shot list in the caption draft and tell the team in the report what to film; never fake it.
- Mix every week: real reel(s), a carousel with value, a story with a question, Wiy for tips, one offer. Avoid three graphic-only posts in a row.

## Hard rules
- **No WiyMood prices in public content** (team rule, 8 Nov 2026): no prices, "from" figures, price ranges or discounts in posts, stories, reels, captions, on-image text or the bio. Offers point to a DM or call instead («գրեք մեզ Direct»). Talking about value, process or *why* cheap work costs more later is fine; numbers stay private.
- **Never publish anything yourself.** You create drafts; the team approves in Telegram; the `publisher` posts.
- **Never name clients.** Case studies say the industry and city only ("a donut shop since 1997"). Never tie WiyMood to one city: we work for businesses anywhere, so posts, captions, hashtags and videos do not say "Yerevan" or "in Armenia" about us.
- **Never invent** results, numbers, testimonials or awards.
- **Armenian first.** Our main audience is Armenian businesses. Captions: Armenian block first, then a short English block (2–3 lines). On-image text: Armenian by default, English on about 1 in 3 posts (portfolio, trends). The renderer switches to Armenian type rules automatically.
- **Armenian quality:** use the `anthropic-skills:hy-writer` skill for every Armenian text: write in Armenian from the start (never translate line by line), reformed spelling, ։ ՝ ՞ « », polite lowercase «դուք/ձեր» in posts, no calques or fog words. Then check captions and on-image text:
  `python3 -I marketing/hy_check.py /tmp/<item>-hy.txt` and fix every real issue before sending. Unknown names and loanwords (բրենդ, Instagram-ը) are fine.
- Terms (team's words, 7 Nov 2026): «լոգո» for logo (never «տարբերանշան»; forms: լոգոն, լոգոներ), «բրենդ» for brand, «կայք», «լուսանկար», «տեսանյութ», «հաճախորդ». DM keyword: «ԲՐԵՆԴ» or BRAND (both accepted).
- No spam tactics, no engagement bait like "follow for follow".

## `/marketing daily`  (run once every morning; this is what the schedule runs)

The agent's whole day, in order. Stop and tell the team if a step fails; never skip approval.

1. **Trend scan (10 min, free web search; keep the URLs):**
   - Today and the next 7 days in Armenia: holidays, city events, business news, sports or culture moments that people talk about (check news.am, armenpress.am, civilnet.am in Armenian and English).
   - Instagram/Facebook this week: new features, trending reel formats and hooks, trending audio styles (search "Instagram trends this week", "trending reels audio <month> <year>", Later/Metricool/Hootsuite blogs).
   - Design world: brand launches, rebrands and logo stories (Brand New / UnderConsideration, It's Nice That, Dieline) that a business owner would find interesting.
   - Keep only **brand-safe** items: no politics, tragedies, religion fights or competitor bashing. Never use a tragedy for marketing.
2. **Act on it:**
   - Save the findings: `update public.marketing_plans set research = coalesce(research, '{}'::jsonb) || jsonb_build_object('<YYYY-MM-DD>', '<json: trends, urls>'::jsonb) where week_start = date_trunc('week', now())::date;`
   - If a trend fits WiyMood strongly (a holiday, a famous rebrand, a viral format), add **one** reactive item for today or tomorrow: a story, or a reel if it is a format trend. Insert it with `plan_id` = this week's plan and status `draft`. If the plan is already approved it goes straight into step 4; the team still approves the item itself in Telegram.
   - If a planned item is now stale or clashes with the news (for example a playful post on a day of mourning), set it to `changes_requested` with a short `change_request` explaining why, and make a replacement.
3. **Plan:** on Thursday, or whenever next week has no plan, run `/marketing plan` for next Monday (it uses everything saved in step 2).
4. **Create:** run `/marketing create` (everything due in 48 h plus `changes_requested`).
5. **Report** in 5 lines: trends found (with links), items added or changed, items sent to Telegram, anything the team must do (film footage, approve the plan, fix a key).

Rhythm the agent keeps every week: at least 2 motion pieces (reels), at least 3 carousels, Wiy in about 1 of 4 feed posts, Armenian on-image text by default, no single-image posts.

**Sales first (team lead, 13 Nov 2026; playbook section 0):** every feed post is tagged *proof*, *problem* or *offer* and ends with one concrete step (DM «ԲՐԵՆԴ», WhatsApp, or "send this to an owner who…"). Each week: at least 2 *offer* posts (a package or the free audit, no prices) and at least 2 *proof* posts (real screens of our products on real devices, real work in real places, demos). Lead with one of the three doors (Brand / Digital / Systems), never the whole list. The 5-line report starts with sales numbers: new conversations, audits requested, meetings, proposals, deals; then content.

**Real-footage week 15–22 Nov 2026 (team lead; playbook 0.0):** create no template feed posts this week; only real footage and ink-style reels. If footage is missing, send the team a shot list instead of filling the slot. Every reel needs its own cover in assets.

**Natural mix (team lead, 13 Nov 2026; playbook 0.5a):** each week about 40% templates, 20% philosophy/leader posts (the founder's first-person view, written with the founder, signed with their name, never invented quotes) and 40% natural posts (real team photos/clips, light edit). Never 3 template posts in a row. When natural footage is missing, don't fill the slot with another template: send the team a shot list for that slot and use a leader post instead.

## `/marketing plan [YYYY-MM-DD]`  (week starting Monday; default: next Monday)

1. **Research** with web search (free sources only), and keep the source URLs:
   - Instagram/Facebook format trends for this month (carousel styles, reel hooks, story mechanics).
   - What leading branding studios post (Pentagram and similar), and the team's references in the brand brief.
   - Dates in that week: holidays and events in Armenia, global design days.
2. **Read last results** (if any): `select pillar, kind, status, stats from public.marketing_items where planned_at > now() - interval '14 days';`
3. **Volume:** `select warmup_start from public.marketing_config;` Up to 2 feed posts/day (alternate reel and carousel). Stories: up to 3/day in weeks 1–2 after warm-up start, then up to 7/day.
4. **Slots (Asia/Yerevan, stored as timestamptz):** feed 12:30 and 19:30; stories 10:00, 14:00, 18:00, 21:00.
5. **Pillar mix over the week:** case study 30%, expert tip 25%, process 15%, free brand check offer 15%, trend 10%, brand & team 5%.
6. **Save in ONE `execute_sql` call** (one transaction: the Telegram notice is sent only after it commits, so it already sees all items):
   ```sql
   with p as (
     insert into public.marketing_plans (week_start, summary, research, status)
     values ('<monday>', '<3-5 line summary>', '<json: sources, trends>'::jsonb, 'waiting_approval')
     returning id
   )
   insert into public.marketing_items (plan_id, kind, pillar, planned_at, caption, status)
   select p.id, v.kind, v.pillar, v.planned_at::timestamptz, v.idea, 'draft'
   from p, (values
     ('carousel', 'tip', '2026-11-09 12:30+04', '5 signs your logo is losing customers'),
     ('story', 'offer', '2026-11-09 18:00+04', 'Free brand check: DM BRAND')
     -- one row per item
   ) as v(kind, pillar, planned_at, idea);
   ```
7. Reply with the plan as a short table.

## `/marketing create [today|tomorrow|<n>]`  (default: everything due in the next 48 h)

Only for items whose plan is approved, plus any item in `changes_requested`:
```sql
select i.* from public.marketing_items i left join public.marketing_plans p on p.id = i.plan_id
where (i.status = 'draft' and p.status = 'approved' and i.planned_at < now() + interval '48 hours')
   or i.status = 'changes_requested'
order by i.planned_at;
```

For each item:
1. **If `changes_requested`:** apply `change_request` exactly; keep what wasn't criticised.
2. **Caption:** hook in the first line; 60–150 words (stories: 1–2 short lines); one clear call to action, e.g. "DM us BRAND for a free brand check" or "WhatsApp +374 94 649786 · wiymood@gmail.com"; write search-friendly natural phrases (what owners would type: «բրենդինգ», «լոգո», "branding agency", "website for a café"; never a city name for WiyMood, see playbook 1.7); put 0–3 hashtags in `hashtags` (2026 data: hashtags reduce reach). Avoid single-image posts; prefer carousels and reels.
3. **Visual:** write a data JSON and render with the templates (see `marketing/samples/*.json` for fields):
   ```bash
   node marketing/render.mjs <template> /tmp/<item>.json /tmp/<item>-1.jpg --size feed|story
   ```
   Templates: `carousel-cover`, `carousel-slide` (one per slide, `PROGRESS` = slide/total*100), `before-after`, `device-mockup`, `quote`, `story-offer`, `reel-cover`, `photo-cover` (photo on top, brand panel below), `mascot` (Wiy the monster with a speech bubble: tips, myths, offers; `MASCOT_IMG` = `brand/mascot/wiy-monster.png`). Use project images from `portfolio/`; for mood photos use `marketing/stock/` (CC0 placeholders, see CREDITS.md: never present them as our office, team or client work). Use the mascot in about 1 of 4 feed posts so it stays a signature, not wallpaper.
   More templates (samples in `marketing/samples/` and `marketing/samples/hy/`):
   - `myth-fact`: myth crossed out on top, fact in blue below (`MYTH`, `FACT`). Great for saves.
   - `checklist`: self-check with ✓/✕ (`ITEMS_LIST`: one per line, `+ ` = ✓, `- ` = ✕). 4–6 items.
   - `steps`: a real process, numbered (`STEPS_LIST`, 3–5 lines). Only for true sequences.
   - `holiday`: greeting for Armenian and global holidays (`KICKER` = date, `TITLE`, `TEXT`); feed or story.
   - `case-cover`: case study opener on a project photo (`INDUSTRY` = industry · city, never the client name; `SERVICES`).
   - `this-or-that`: A or B with two photos, answer in comments (`QUESTION`, `A_IMG`/`A_LABEL`, `B_IMG`/`B_LABEL`, `CTA`). Drives comments.
   - `palette`: colour story (`COLORS_SWATCHES`: `#RRGGBB Name` per line, 3–6 colours, first is shown wider).
   Vary the formats: never the same template two feed posts in a row. Always render **.jpg** (Instagram only accepts JPEG). Check each image by looking at it before uploading. The look-check (playbook 8, note 051): one focal point, loud vs quiet parts, related items grouped, real size contrast, empty space left empty.
   **Motion (reels and stories):** brand animations render straight to MP4 (1080×1920, 30 fps):
   ```bash
   node marketing/animate.mjs <motion> /tmp/<item>.json /tmp/<item>.mp4
   ```
   Motions (`marketing/motion/`, samples in `marketing/samples/motion/`):
   - `mascot-pop` (7 s): Wiy pops up, the tip appears word by word.
   - `kinetic-title` (6 s): big words rise, the red dot bounces onto the brand wave.
   - `before-after-wipe` (7 s): a line wipes from the old look to the new one (`BEFORE_IMG`, `AFTER_IMG`). Best reel for case studies.
   - `checklist-tick` (8 s): items slide in and get ✓/✕ (`ITEMS_LIST`, 3–5 items).
   - `photo-zoom` (6 s): slow push-in on a real photo with a rising title (`PHOTO_IMG`, `SUBTITLE`). For places, team, behind the scenes.
   - `brand-sting` (4 s): WiyMood logo reveal with the slogan (`SLOGAN`); use as a reel intro/outro or a short story.
   - **For every reel and 2D explainer, follow the `reel-director` skill** (story, voice sync, checks, sound mix).
   - `explainer` (any length): faceless 2D video for a voice-over. `SCENES_SCENES`: one line per spoken sentence, `start-end mood[:effect] icons text` (mood: problem | solution | brand | cta; effects: spin, blur, leave, big; icons from `marketing/elements/icons.js` joined with `+`, or `-`). Set top-level `"duration"` to the voice length. Story order that works: the owner's daily problems → «Մենք դա լուծում ենք» (solution:big) → solutions → who we are (brand) → keyword offer (cta). Without the team's voice, send it as a PREVIEW; once the voice arrives, retime the scenes to it, mux the audio (`ffmpeg -i video.mp4 -i voice.m4a -map 0:v -map 1:a -c:v copy -c:a aac -shortest`) and send it for a final ✅. `_WORDS` fields animate word by word; keep them to 3–8 words. Check 3–4 frames (`ffmpeg -ss <t> -i x.mp4 -frames:v 1 f.png`) before uploading. Use at least 2 motion pieces a week: reels beat static posts for reach.
   Reels: write the script in the caption field's first block (hook 0–2 s, 3–5 beats, CTA), render the `reel-cover` (cover line and Wiy inside the central 3:4 grid band, y ≈ 240–1680 of 1920; one cover layout per series, note 917), and say in the caption which footage the team must film.
4. **Upload** each image or MP4 (the session's network proxy adds the upload key; if the upload answers 403, stop and tell the team the key needs fixing):
   ```bash
   node marketing/upload.mjs /tmp/<item>-1.jpg items/<item id>/1.jpg
   ```
5. **Send for approval:**
   ```sql
   update public.marketing_items set caption = '<caption>', hashtags = '<tags>',
     assets = array['items/<id>/1.jpg', ...], change_request = null, status = 'waiting_approval'
   where id = '<id>';
   ```
6. Reply with a short list: time · kind · pillar · first line.

## Paid ads
Not active. Only when the team says "go paid" in their own words.

## Music for reels
- Every reel gets song ideas in `marketing_items.music` (2–3 lines, `Song — Artist · mood · why`, plus ` · https://www.instagram.com/reels/audio/<id>/` when the song's Instagram audio page is found: that becomes a one-tap button), researched that week; rules and sources in `marketing/knowledge/research/music.md`.
- The video file itself only ever carries our own copyright-free track (`marketing/music_bed.py`), mixed to −14 LUFS and quiet under any voice.
- In Telegram the team chooses: ✅ (posts automatically with our track) or 🎵 (the bot sends the file and caption; they post from the app with an Instagram song and tap 📲 Posted).
- Photo carousels can carry music too (it makes them eligible for Reels surfaces; the API cannot set it): add 1–2 song ideas for carousels as well, so the team can add the track in the app. Music can be added or replaced after publishing without losing engagement, so suggest it for a carousel that is slow in its first hours. Promotional posts: royalty-free tracks only (playbook 8, notes 903).
