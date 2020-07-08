'''
import requests
from bs4 import BeautifulSoup

import time
from selenium import webdriver

driver = webdriver.Chrome('chromedriver')
url = 'https://upbit.com/service_center/notice'
driver.get(url)

time.sleep(6)

soup = BeautifulSoup(driver.page_source, 'html.parser')
notices = soup.select_one('#UpbitLayout > div.subMain > div > section.ty02 > article > div > div.tableB > table > tbody')

#print(notices)
for child in range(1, 100, 1):
    try:
        title = notices.select_one('tr:nth-child(' + str(child) + ') > td.lAlign > a').text
    except:
        break
    try:
        date = notices.select_one('tr:nth-child(' + str(child) + ') > td:nth-child(2)').text
    except:
        date = ""
    print(title, date)
#UpbitLayout > div.subMain > div > section.ty02 > article > div > div.tableB > table > tbody > tr:nth-child(2) > td.lAlign > a
driver.quit()
#UpbitLayout > div.subMain > div > section.ty02 > article > div > div.tableB > table > tbody > tr.emBlue > td > a
'''
'''
headers = { 'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'}
data = requests.get(url, headers=headersdriver.get(url)
soup = BeautifulSoup(data.text, 'html.parser')

print(soup)
notices = soup.select_one('#UpbitLayout > div.subMain > div > section.ty02 > article > div > div.tableB > table > tbody')
print(notices)
'''