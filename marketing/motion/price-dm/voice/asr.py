import numpy as np, json
from faster_whisper import WhisperModel
a=np.fromfile('voice/v16.raw',dtype=np.float32)
m=WhisperModel('medium',device='cpu',compute_type='int8')
segs,_=m.transcribe(a,language='hy',word_timestamps=True,beam_size=5,vad_filter=False)
W=[]
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    for w in s.words: W.append([round(w.start,2),round(w.end,2),w.word.strip()])
json.dump(W,open('voice/words.json','w'),ensure_ascii=False)
