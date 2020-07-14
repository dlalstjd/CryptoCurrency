# specify patterns to route different URLs to their appropriate views.

from django.urls import path
from notice import views
from notice.models import Notice


upbit_list_view = views.UpbitListView.as_view(
    queryset=Notice.objects.all(), #limits the results to the five most recent
    context_object_name="notice_list",
    template_name="notice/upbit.html"
)

# one route to map root URL of the app("") to the views.home function
urlpatterns = [
    path("", upbit_list_view, name = "upbit"),
    path("empty1/", views.empty1, name="empty1"),
    path("empty2/", views.empty2, name="empty2"),
    path("empty3/", views.empty3, name="empty3"),
]