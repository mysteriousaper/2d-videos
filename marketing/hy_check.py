"""hy_check.py: checks Eastern Armenian text (reformed spelling).
Usage: python3 hy_check.py text.txt [--no-spell]
Spelling uses the HySpell reformed dictionary (MIT), downloaded on first run.
Everything it prints is a candidate to look at, not an automatic error."""
import os, re, subprocess, sys

L = "Ա-Ֆա-և"          # Armenian letters only
P = "՚-՟"                        # Armenian in-word marks ՚ ՛ ՜ ՝ ՞ ՟
args = [a for a in sys.argv[1:] if not a.startswith("--")]
text = open(args[0], encoding="utf-8").read() if args else sys.stdin.read()
issues = []

def add(kind, frag):
    issues.append((kind, frag.strip()[:80]))

def ctx(line, m, a=25, b=10):
    return line[max(0, m.start() - a):m.end() + b]

# 1. Punctuation and characters
for line in text.splitlines():
    if not re.search(f"[{L}]", line):
        continue
    for m in re.finditer(f"[{L}{P}]\\:(?!\\d)", line):
        add("Latin ':' after a word: use ։ (end) or ․ (colon role)", ctx(line, m))
    for m in re.finditer(f"[{L}{P}]\\.(\\s+[{L}]|\\s*$)", line):
        add("Latin '.': sentence end → ։ ; colon/abbreviation → ․", ctx(line, m))
    for m in re.finditer(f"[{L}{P}][?!]", line):
        add("Latin ? or ! : put ՞ / ՜ on the stressed vowel of the word", ctx(line, m))
    for m in re.finditer(f"[{L}]`", line):
        add("Backtick used as բութ: use ՝ (U+055D)", ctx(line, m))
    for m in re.finditer(r"[\"“”„]", line):
        add("Use « » quotes", ctx(line, m, 25, 25))
    for m in re.finditer(r"'", line):
        add("Straight apostrophe: Armenian uses ՛ (emphasis) or ՚, usually none", ctx(line, m, 20, 20))
    for m in re.finditer(r"\S+", line):
        w = re.sub(r"[^\w\-]", "", m.group())
        core = w.split("-")[0] if "-" in w else w
        if re.search(f"[{L}]", core) and re.search(r"[A-Za-z]", core):
            add("Latin and Armenian letters mixed in one word (look-alike letters?)", w)
    for m in re.finditer(f"[{L}]+", re.sub(f"[{P}]", "", line)):
        w = m.group()
        if "իւ" in w or "եօ" in w or re.search("(?<![ոՈ])ւ", w):
            add("Classical spelling or typo (use reformed: նաև, թիվ)", w)
        elif re.search("^.+է", w) and not re.search("(^չէ|^անէ|ևէ)", w.lower()):
            add("Check: է inside a word is classical unless it's a compound", w)
        elif re.search("^.+օ", w) and not re.search("(այսօր|առօր|ամենօր|հանօր|անօ|օրօր|եցօր)", w.lower()):
            add("Check: օ inside a word is classical unless it's a compound (այսօր, առօրյա)", w)
    for s_ in re.split(r"[։:]", line):
        if s_.count("՞") > 1 and "թե՞" not in s_:
            add("More than one ՞ in one sentence: a question usually has one ՞", s_)

# 2. Vocabulary: calques, confused words, misspellings, colloquial forms, clichés
WORDS = {
    "հանդիսան": "calque of «является»: usually just «է»",
    "իրականացն": "bureaucratic «осуществлять»: անել, կազմակերպել, անցկացնել",
    "կատարել ընտրություն": "→ ընտրել", "կատարել վճարում": "→ վճարել",
    "կատարել զանգ": "→ զանգել", "կատարել գնում": "→ գնել",
    "ուշադրություն տալ": "→ ուշադրություն դարձնել",
    "դեր է խաղում": "calque «играет роль»: դեր ունի / կարևոր է",
    "հանդես գալ որպես": "calque «выступать в качестве»: լինել",
    "ի դեմս": "calque «в лице»: rephrase",
    "ձեր ուշադրությանն ենք ներկայացնում": "→ ներկայացնում ենք",
    "կիսվ": "calque of 'share': պատմել, ասել, գրել (check meaning)",
    "առավել ": "often «более»: prefer ավելի",
    "կողմից": "check: passive + «X-ի կողմից» (calque «кем-то»): make it active",
    "պաշտոնեական": "check: պաշտոնական (official) vs պաշտոնեական (of a post)",
    "ավանդություն": "check: ավանդություն = legend, ավանդույթ = tradition",
    "հրավերք": "check: հրավերք = feast, հրավեր = invitation",
    "մեղանչ": "means 'to sin', not 'to repent'",
    "ծրագրավոր": "check: ծրագրավորել = programming; plans → ծրագրել",
    "վարքաբեկ": "→ վարկաբեկել", "տնօրենություն": "check: management → տնօրինություն",
    "ցուցմունք": "check: ցուցմունք = testimony, ցուցում = instruction",
    "բարդույթ": "check: բարդույթ = (psych.) complex, բարդություն = difficulty",
    "շնորհիվ": "check: only for positive causes; negative → պատճառով",
    "կանանցի": "→ կանացի", "բարձրունք": "→ բարձունք", "ավելնորդ": "→ ավելորդ",
    "ութանասուն": "→ ութսուն", "սեկտեմբեր": "→ սեպտեմբեր", "օրեկան": "→ օրական",
    "ամսեկան": "→ ամսական", "տարեկետում": "→ տարկետում", "անձեռնամխելի": "→ անձեռնմխելի",
    "մտահաղացում": "→ մտահղացում", "առայժմս": "→ առայժմ", "ալանի": "→ անալի",
    "հետաքրքրիր": "→ հետաքրքիր",
    "կարամ": "colloquial → կարող եմ", "կարաս": "colloquial → կարող ես",
    "տեսնվ": "colloquial → հանդիպել", "տուժվ": "→ տուժել", "վիճվ": "→ վիճել",
    "թռնել": "→ թռչել", "փախնել": "→ փախչել", "կպնել": "→ կպչել",
    "տարբերանշան": "team word is «լոգո» (լոգոն, լոգոներ)",
    "կրեատիվ": "→ ստեղծարար", "տենդենց": "→ միտում", "լայքել": "→ հավանել",
    "անմոռանալի": "cliché: say what exactly happens", "յուրահատուկ": "cliché: say what is special",
    "եզակի": "cliché (unique)", "կատարյալ": "cliché (perfect)", "լավագույն": "unproven superlative",
    "բացահայտեք": "cliché CTA (Discover)", "վայելեք": "cliché CTA (Enjoy)",
    "հիասքանչ": "cliché", "անզուգական": "cliché", "նորարարական": "cliché (innovative)",
    "փորձառություն": "check: calque of 'experience' as a product",
}
low = text.lower()
for k, v in WORDS.items():
    n = low.count(k)
    if n:
        add(f"«{k.strip()}» ×{n}", v)
for m in re.finditer(f"[{L}]+ ա(?=[\\s,։․.]|$)", text):
    add("Colloquial «ա» as 'is': written → «է»", m.group())
for m in re.finditer(r"(պետք|լավ|ճիշտ|հեշտ|հնարավոր) չի(?![{0}])".format(L), text):
    add("Copula «չի»: written → «չէ»", m.group())

# 3. Sentences: length, «որը» chains, polite form consistency
sents = [s.strip() for s in re.split(r"[։:.!?\n]+", text) if re.search(f"[{L}]", s)]
lens = [len(s.split()) for s in sents]
for s in sents:
    if len(s.split()) > 25:
        add("Long sentence (>25 words): split it", s[:70])
    if len(re.findall(r"(?<![{0}])(որը|որի|որոնք|որոնց|որտեղ)(?![{0}])".format(L), s)) >= 2:
        add("Chain of «որը/որոնք» clauses (Russian «который» style): split or use a participle", s[:70])
caps = len(re.findall(r"(?<![{0}])(Դուք|Ձեր|Ձեզ)(?![{0}])".format(L), text))
small = len(re.findall(r"(?<![{0}])(դուք|ձեր|ձեզ)(?![{0}])".format(L), text))
if caps and small:
    add("Polite form mixed", f"Դուք/Ձեր ×{caps} and դուք/ձեր ×{small}: pick one")

# 4. Spelling with HySpell (reformed dictionary)
unknown = []
if "--no-spell" not in sys.argv:
    try:
        from spylls.hunspell import Dictionary
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "--break-system-packages", "spylls"], check=False)
        from spylls.hunspell import Dictionary
    base = os.path.join(os.environ.get("HYSPELL_DIR", "/tmp/hyspell"), "hy-r")
    if not os.path.exists(base + ".dic"):
        os.makedirs(os.path.dirname(base), exist_ok=True)
        for ext in ("aff", "dic"):
            subprocess.run(["curl", "-sSL", "-o", f"{base}.{ext}",
                            f"https://raw.githubusercontent.com/hyspell/HySpell_3.0.1/master/Dictionaries/Dictr/hy-r.{ext}"], check=False)
    d = Dictionary.from_files(base)
    ok = {"եք", "առցանց", "գաղտնաբառ", "ստեղծարար", "տարբերանշան", "օգտատեր", "համացանցային",
          "սերուցքային", "ռեստորաններին", "վիզա", "տուրեր", "տրանսֆեր", "տրանսֆերը",
          "բրենդ", "բրենդի", "բրենդը", "բրենդինգի", "բրենդինգ", "ուայ", "ուայի", "ուայը",
          "լոգո", "լոգոն", "լոգոներ", "լոգոյի", "բիզնես", "բիզնեսի", "բիզնեսը"}
    clean = re.sub(f"[{P}]", "", text)
    for w in sorted(set(re.findall(f"(?<![-{L}])[{L}]+", clean))):
        if w.lower() in ok or w.lower().rstrip("ն") in ok or d.lookup(w) or d.lookup(w.lower()):
            continue
        sug = list(d.suggest(w))[:3]
        unknown.append(f"{w} → {', '.join(sug) if sug else '?'}")

print(f"Sentences: {len(sents)}, avg words: {sum(lens)/max(len(lens),1):.1f}, longest: {max(lens, default=0)}")
print(f"Issues: {len(issues)}")
for k, f in issues:
    print(f"- {k}: {f}")
if unknown:
    print(f"Not in dictionary ({len(unknown)}). Names and new loanwords are normal here; check the rest:")
    for u in unknown:
        print(f"  {u}")
