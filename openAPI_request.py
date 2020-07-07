import requests

r = requests.get('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json')

rjson = r.json()

#print(rjson)
#print(rjson['stores'][0]['addr']

stores = rjson['stores']

for store in stores:
    try:
        if store['remain_stat'] == 'plenty':
            print(store['addr'],store['name'])
    except:
        continue