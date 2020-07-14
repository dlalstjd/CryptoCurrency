from django.shortcuts import render
from django.http import HttpResponse

import re
from datetime import datetime

from notice.models import Notice
#from notice.forms import NoticeForm
from django.shortcuts import redirect

from django.views.generic import ListView
from notice import crawling_notice

# Create your views here!
class UpbitListView(ListView):
    
    #Notice.objects.all().delete()
    url = 'https://upbit.com/service_center/notice'
    crawling_notice.get_notice(url)
    #model = Notice

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
