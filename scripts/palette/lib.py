import math
def hex2rgb(h):
    h=h.lstrip('#'); return [int(h[i:i+2],16)/255 for i in (0,2,4)]
def rgb2hex(c): return '#'+''.join(f"{round(max(0,min(1,x))*255):02X}" for x in c)
def lin(x): return x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4
def delin(x): return 12.92*x if x<=0.0031308 else 1.055*x**(1/2.4)-0.055
def lum(h): r,g,b=[lin(x) for x in hex2rgb(h)]; return 0.2126*r+0.7152*g+0.0722*b
def wcag(a,b):
    x,y=sorted([lum(a),lum(b)],reverse=True); return (x+0.05)/(y+0.05)
def oklab_lin(r,g,b):
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b
    m=0.2119034982*r+0.6806995451*g+0.1073969566*b
    s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[math.copysign(abs(v)**(1/3),v) for v in (l,m,s)]
    return (0.2104542553*l+0.7936177850*m-0.0040720468*s,
            1.9779984951*l-2.4285922050*m+0.4505937099*s,
            0.0259040371*l+0.7827717662*m-0.8086757660*s)
def oklab(h): return oklab_lin(*[lin(x) for x in hex2rgb(h)])
def oklch(h):
    L,a,b=oklab(h); return L, math.hypot(a,b), math.degrees(math.atan2(b,a))%360
def oklab2lin(L,a,b):
    l=L+0.3963377774*a+0.2158037573*b; m=L-0.1055613458*a-0.0638541728*b; s=L-0.0894841775*a-1.2914855480*b
    l,m,s=l**3,m**3,s**3
    return (4.0767416621*l-3.3077115913*m+0.2309699292*s,
            -1.2684380046*l+2.6097574011*m-0.3413193965*s,
            -0.0041960863*l-0.7034186147*m+1.7076147010*s)
def lch2hex(L,C,H):
    # зменшуємо хрому, доки колір не влізе в sRGB
    lo,hi=0,C
    for _ in range(30):
        c=hi if lo==hi else (lo+hi)/2
        r=oklab2lin(L,c*math.cos(math.radians(H)),c*math.sin(math.radians(H)))
        if all(-1e-4<=x<=1+1e-4 for x in r): lo=c
        else: hi=c
        if hi-lo<1e-4: break
    r=oklab2lin(L,lo*math.cos(math.radians(H)),lo*math.sin(math.radians(H)))
    return rgb2hex([delin(max(0,min(1,x))) for x in r])
def dE(a,b):
    A=oklab(a);B=oklab(b); return math.dist(A,B)*100
# Machado 2009, severity 1.0
CVD={'protan':[[0.152286,1.052583,-0.204868],[0.114503,0.786281,0.099216],[-0.003882,-0.048116,1.051998]],
     'deutan':[[0.367322,0.860646,-0.227968],[0.280085,0.672501,0.047413],[-0.011820,0.042940,0.968881]],
     'tritan':[[1.255528,-0.076749,-0.178779],[-0.078411,0.930809,0.147602],[0.004733,0.691367,0.303900]]}
def sim(h,k):
    c=[lin(x) for x in hex2rgb(h)]; M=CVD[k]
    return rgb2hex([delin(max(0,min(1,sum(M[i][j]*c[j] for j in range(3))))) for i in range(3)])
# APCA 0.0.98G
def apca(txt,bg):
    def Y(h):
        r,g,b=hex2rgb(h); return 0.2126729*r**2.4+0.7151522*g**2.4+0.0721750*b**2.4
    t,b=Y(txt),Y(bg)
    t=t if t>0.022 else t+(0.022-t)**1.414; b=b if b>0.022 else b+(0.022-b)**1.414
    if b>t: s=(b**0.56-t**0.57)*1.14; return 0 if s<0.1 else (s-0.027)*100
    s=(b**0.65-t**0.62)*1.14; return 0 if s>-0.1 else (s+0.027)*100
