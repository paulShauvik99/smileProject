from . import views
from django.urls import include, path

urlpatterns = [
    path('request_blood/', views.request_blood ),
    path('get_available_dates/',views.get_available_dates),
    path('get_recipient_records/',views.get_recipient_records),
]