from . import views
from django.urls import include, path

urlpatterns = [
    path('request_blood/', views.request_blood ),
    path('get_matched_donors/',views.get_matched_donors),
    
   
]