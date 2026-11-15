# WiyMood: rules for every agent and session

WiyMood is a creative agency (branding, websites, AI automation) working with businesses anywhere. Marketing is Armenian first with a short English part.

## Always use what we've learned
- Before any marketing, content, video, client-branding, website, sales or outreach task, read `marketing/knowledge/playbook.md` and apply what fits. Sections 1–8: our own Instagram/content. 9: client branding. 10: websites and landing pages. 11: sales, offers, pricing. 12: marketing advice for clients.
- Deeper sources when needed: `marketing/knowledge/research/*.md` (topic research, incl. `music.md`) and `marketing/knowledge/videos/*.md` (one note per studied video).
- Skills: `marketing`, `reel-director` (2D videos), `outreach`, `prospect`, `trainer` (finds and vets new learning sources every week), `watch`, and the sales agents `brief` (client onboarding), `proposal` (problem-led proposals from `config/bundles.json` + PDF), `reply` (comment/DM drafts), `insights` (Instagram numbers → playbook), `case-study` (anonymised portfolio stories), `followup` (quiet prospects, check-ins, referrals) in `.claude/skills/`.

## Keep the learning flowing (automatic)
- New video or resource notes land in `marketing/knowledge/videos/` (watcher: `marketing/knowledge/watch_queue.py`; text sources noted by the `trainer` skill as `9NN-*.md`).
- `marketing/knowledge/distilled.txt` lists the notes already turned into playbook rules. Whenever notes exist that are not in that list: read them, add new, well-supported rules to the right playbook section (merge, no duplicates, cite note numbers), update a skill's SKILL.md if a lesson changes how that workflow should run, add the files to `distilled.txt`, then commit and push.

## House rules (never break)
- Every post is approved by the team in Telegram; never approve or publish on your own.
- One exception (team lead, 15 Nov 2026): a comment that is only the code word «ԲՐԵՆԴ»/BRAND gets an automatic answer from `ig-sync` (one fixed DM + a short public reply, once per person per 30 days). Every other reply still needs the team's ✅.
- Never name clients publicly; never invent results or numbers; no AI-generated people, faces or voices in published content.
- Don't tie WiyMood to one city in public content.
- No WiyMood prices in public content (posts, stories, reels, captions, comment replies, bio, our website). Prices are only for private conversations: proposals, calls and DMs after someone asks.
- Secrets live in Supabase Vault or the environment's network secrets; never paste them anywhere.
- Free tools only until the team says "go paid".
- Picsart Media Studio (connector) is on the team's FREE plan: use it as much as the free plan allows, never spend money, never upgrade or buy credits; if a step would need payment or is blocked by a plan limit, stop that step, fall back to our own pipeline and tell the team.
