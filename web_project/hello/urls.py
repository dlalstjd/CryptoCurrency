# specify patterns to route different URLs to their appropriate views.

from django.urls import path
from hello import views

# one route to map root URL of the app("") to the views.home function
urlpatterns = [
    path("", views.home, name = "home")
]