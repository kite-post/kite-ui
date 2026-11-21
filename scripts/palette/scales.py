# Генератор шкал палітри Kite в OKLCH (ресьорч, docs/research/02). Запуск: python3 -I scripts/palette/scales.py
import sys, json, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
STEPS=[50,100,200,300,400,500,600,700,800,900,950]
LT=[.975,.945,.89,.82,.74,.68,.60,.52,.44,.35,.27]
CF=[.12,.25,.45,.70,.90,1,.95,.85,.72,.58,.45]   # форма кривої хроми
def ramp(H,Cmax,pins,hshift=0):
    # Крива світлоти проходить точно через якір: кроки між краєм і якорем
    # лінійно перерозподіляються, тож сусіди не злипаються.
    (ps,phex),=pins.items(); ai=STEPS.index(ps); aL=oklch(phex)[0]
    L=list(LT)
    for i in range(len(STEPS)):
        if i<ai: L[i]=LT[0]+(aL-LT[0])*(LT[i]-LT[0])/(LT[ai]-LT[0])
        elif i>ai: L[i]=aL+(LT[-1]-aL)*(LT[i]-LT[ai])/(LT[-1]-LT[ai])
    out={}
    for i,s in enumerate(STEPS):
        h=H+hshift*(i-5)/5
        out[s]=lch2hex(L[i],Cmax*CF[i],h)
    out.update(pins); return out
fam={
 'coral': ramp(34,.207,{500:'#FF5A36'},hshift=-3),
 'sky':   ramp(264,.229,{600:'#2E6BFF'}),
 'green': ramp(161,.13,{600:'#1F9D6B'}),
 'amber': ramp(73,.15,{400:'#F2A93B'},hshift=-8),
 'red':   ramp(15,.20,{700:'#C01242'}),
}
SL=[.985,.965,.925,.87,.74,.60,.48,.38,.30,.243,.216,.183]
SC=[.004,.006,.009,.012,.02,.025,.03,.035,.04,.04,.038,.031]
SS=[50,100,200,300,400,500,600,700,800,900,950,975]
fam['slate']={s:lch2hex(SL[i],SC[i],260) for i,s in enumerate(SS)}
fam['slate'].update({900:'#142033',950:'#0E1A2B',975:'#0B1220'})
if __name__=='__main__':
    for n,r in fam.items():
        print(f"{n:6}", ' '.join(f"{s}:{h}" for s,h in r.items()))
    print(json.dumps(fam, indent=1))
