from PIL import Image
import glob, os

def EntropyMath(text):
    import math
    log2=lambda x:math.log(x)/math.log(2)
    exr={}
    infoc=0
    for each in text:
        try:
            exr[each]+=1
        except:
            exr[each]=1
    textlen=len(text)
    for k,v in exr.items():
        freq  =  1.0*v/textlen
        infoc+=freq*log2(freq)
    infoc*=-1
    return infoc
    "https://rosettacode.org/wiki/Entropy"
def Entropy(file1):
    
    im = Image.open(file1)
    pix = im.load()
    arrR=[]
    arrG=[]
    arrB=[]
    for x in range(im.size[0]):
        for y in range(im.size[1]):
            arrR.append(pix[x,y][0])
            arrG.append(pix[x,y][1])
            arrB.append(pix[x,y][2])
    return ((EntropyMath(arrR)) + (EntropyMath(arrB)) + (EntropyMath(arrG)))/3 > 7.1
