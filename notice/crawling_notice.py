import requests
from bs4 import BeautifulSoup

import time
from selenium import webdriver

from notice.models import Notice

def get_notice(url):

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('headless')

    driver = webdriver.Chrome('chromedriver', chrome_options=chrome_options)
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

        try:
            original_notice = Notice.objects.get(pk=child)
            original_title = original_notice.notice
            orignial_date = original_notice.date
            if(title == original_title):
                continue
            else:
                original_notice.notice = title
                orignial_notice.date = date
                original_notice.save()
        except:
            new_notice = Notice()
            new_notice.notice = title
            new_notice.date = date
            new_notice.id = child
            new_notice.save()