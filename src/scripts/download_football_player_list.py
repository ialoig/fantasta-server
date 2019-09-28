#!/usr/bin/python3

import requests

urlClassic = "http://www.fantacalcio.it//Servizi/Excel.ashx?type=0&r=1&t=306743188957"
urlMantra = "https://www.fantacalcio.it//Servizi/Excel.ashx?type=0&r=3&t=306743188957"

# Download excel file for classic rule
resp = requests.get(urlClassic)
outputClassic = open('footballPlayerListClassic.xls', 'wb')
outputClassic.write(resp.content)
outputClassic.close()

# Download excel file for mantra rule
resp = requests.get(urlMantra)
outputMantra = open('footballPlayerListMantra.xls', 'wb')
outputMantra.write(resp.content)
outputMantra.close()
