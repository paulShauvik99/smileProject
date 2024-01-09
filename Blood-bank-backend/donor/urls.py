from . import views
from django.urls import include, path

urlpatterns = [
    path('register/', views.register ),
    path('send_otp/',views.send_otp),
    path('donor_send_otp/',views.donor_send_otp),
    path('verify_otp/',views.verify_otp),
    path('logout/',views.user_logout),

    path('get_donor_records/',views.get_donor_records),
  
]