Paste everything below the line into a Claude Code session on the other account (the one with the Exishe/WiyMood-Website repo).

---

I need to move our ink-reel toolkit to another Claude Code session that can't see this repo.
Pack the sources into one archive I can download and upload there. Don't change or commit anything in this repo.

1. Make a folder `/tmp/ink-kit/` and copy these into it, keeping their repo paths:
   - `CLAUDE.md`
   - `marketing/knowledge/playbook.md`
   - `marketing/motion/ink-rewind/PROMPT.md` and `final/storyboard.md`
   - Everything in `marketing/motion/ink-rewind/final/` that is source code or config:
     `ink.js`, `reel.html`, `check.cjs`, `render.cjs`, `cover2.cjs`, `asr2.py`, `prev*.py`, `pen4.py`, `sfx4.py`,
     any other `.js/.cjs/.mjs/.html/.py/.json/.md` there, `package.json` and `package-lock.json`
   - The fonts it uses: `f/SA.woff`, `f/SL.woff` and any other files in `f/`
   - `words.json` (the word timings), as an example of the format
   - `.claude/skills/reel-director/` and `.claude/skills/marketing/` (the whole folders)
   - The hy-writer skill, if its files are in the repo or in `~/.claude/skills/`
   - `marketing/hy_check.py` and anything it imports or reads (word lists, rules files)
   - `marketing/upload.mjs` and `marketing/replies/library.md`
2. Don't include: `node_modules/`, rendered frames (`fr/`), `.mp4`, `.mov`, the music `.mp3`, Whisper models,
   `.env` files, `config/settings.json`, or anything that holds a token, key or password.
   Add the voice recording only if it's under 10 MB.
   If a file you copied contains a secret, replace the value with `<REDACTED>` and tell me which file.
3. Write `/tmp/ink-kit/MANIFEST.md` with:
   - every file in the kit, one line each on what it does
   - how the files connect: what `reel.html` loads, the inputs and outputs of `render.cjs` and `check.cjs`,
     the order the audio scripts run in, and every hard-coded path or port (for example `8771`)
   - the exact npm packages and versions, and the Python packages
   - anything the pipeline needs that isn't in the kit
4. Pack it: `cd /tmp && tar czf ink-kit.tar.gz ink-kit`, and print the file list and total size. Keep it under 30 MB.
   If it's bigger, list the largest files and ask me what to drop.
5. Copy `ink-kit.tar.gz` into this session's working folder (or your scratchpad) and send it to me as a file,
   so I can download it.
