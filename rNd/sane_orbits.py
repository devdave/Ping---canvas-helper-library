#Orbits test logic
import math
import random as r

maxRadi = 300
minRadi = 25
desiredCount = 9
minAvgSize = 6
maxAvgSize = min(12, (maxRadi-minRadi) / desiredCount)

for i in range(desiredCount):
    pSize = r.randint(minAvgSize, maxAvgSize)
    
    print "planets[i++] = [%s, %s];" % (pSize, pSize + minRadi + 9,)
    minRadi += pSize + 9