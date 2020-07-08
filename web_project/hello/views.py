from django.shortcuts import render
from django.http import HttpResponse

import re
from datetime import datetime

from hello.models import LogMessage
from hello.forms import LogMessageForm
from django.shortcuts import redirect

from django.views.generic import ListView

# Create your views here.
def home(request):
    return HttpResponse("Hello, Django!")


def hello_there(requset, name):
    '''
    now = datetime.now()
    formatted_now = now.strftime("%A, %d %B, %Y at %X")

    # Filter the name argument to letters only using regular expressions. URL arguments
    # can contain arbitrary text, so we restrict to safe characters only.
    match_object = re.match("[a-zA-Z]+", name)

    if match_object:
        clean_name = match_object.group(0)
    else:
        clean_name = "Friend"

    content = "Hello there, " + clean_name + "! It's " + formatted_now
    return HttpResponse(content)
    '''
    return render(
        requset,
        'hello/hello_there.html',
        {
            'name': name,
            'date': datetime.now()
        }
    )

def self_introduction(request):
    '''
    content = "Hello there, I'm Lee-Minseoung!\n"
    return HttpResponse(content)
    '''
    return render(
        request,
        'hello/self_introduction.html'
    )


#def home(request):
#    return render(request, "hello/home.html")

class HomeListView(ListView):
    model = LogMessage

    def get_context_data(self, **kwargs):
        context = super(HomeListView, self).get_context_data(**kwargs)
        return context

def about(request):
    return render(request, "hello/about.html")

def contact(request):
    return render(request, "hello/contact.html")
    
def log_message(request):
    form = LogMessageForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            message = form.save(commit=False)
            message.log_date = datetime.now()
            message.save()
            return redirect("home")
    else:
        return render(request, "hello/log_message.html", {"form":form})