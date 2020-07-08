# specify patterns to route different URLs to their appropriate views.

from django.urls import path
from hello import views
from hello.models import LogMessage


home_list_view = views.HomeListView.as_view(
    queryset=LogMessage.objects.order_by("-log_date")[:5], #limits the results to the five most recent
    context_object_name="message_list",
    template_name="hello/home.html"
)

# one route to map root URL of the app("") to the views.home function
urlpatterns = [
    path("", home_list_view, name = "home"),
    path("hello/<name>", views.hello_there, name="hello_there"),
    path("introduction", views.self_introduction, name="self_introduction"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("log/", views.log_message, name="log"),
]