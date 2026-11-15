from faster_whisper import WhisperModel
import numpy as np
m=WhisperModel('medium',device='cpu',compute_type='int8')
a=np.fromfile('v16.raw',dtype='float32')
for s,e in [(19.6,24.3),(24.3,28.0),(27.9,31.0)]:
    seg=a[int(s*16000):int(e*16000)]
    r,_=m.transcribe(seg,language='hy',word_timestamps=True,beam_size=5,condition_on_previous_text=False)
    print(s,e,[(round(w.start+s,2),round(w.end+s,2),w.word) for x in r for w in x.words])
