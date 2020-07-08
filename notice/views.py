from django.shortcuts import render
from django.http import HttpResponse

import re
from datetime import datetime

from notice.models import Notice
#from notice.forms import NoticeForm
from django.shortcuts import redirect

from django.views.generic import ListView

import requests
from bs4 import BeautifulSoup

import time
from selenium import webdriver

# Create your views here!
class UpbitListView(ListView):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('headless')

    driver = webdriver.Chrome('chromedriver', chrome_options=chrome_options)
    url = 'https://upbit.com/service_center/notice'
    driver.get(url)

    time.sleep(6)

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    notices = soup.select_one('#UpbitLayout > div.subMain > div > section.ty02 > article > div > div.tableB > table > tbody')
    child = 0

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
        Notice( notice = title, date = date).save()

    model = Notice

    def get_context_data(self, **kwargs):
        context = super(UpbitListView, self).get_context_data(**kwargs)
        return context

'''
class emptyListView1(ListView):
    return render(request, "hello/about.html")


class emptyListView2(ListView):
    return render(request, "hello/about.html")


class emptyListView3(ListView):
    return render(request, "hello/about.html")
'''

def empty1(request):
    return render(request, "notice/empty1.html")

def empty2(request):
    return render(request, "notice/empty2.html")
    
def empty3(request):
    return render(request, "notice/empty3.html")
