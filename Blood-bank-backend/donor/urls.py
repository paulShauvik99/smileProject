from . import views
from django.urls import include, path

urlpatterns = [
    path('register/', views.register ),
    path('send_otp/',views.send_otp),
    path('donor_send_otp/',views.donor_send_otp),
    path('verify_otp/',views.verify_otp),
    path('logout/',views.user_logout),
    path('confirm_donor/',views.confirm_donor),
    path('get_donor_records/',views.get_donor_records),
    path('get_donor_list/',views.get_donor_list),
    path('get_recipient_list/',views.get_recipient_list),
    path('confirm_donation/',views.confirmDonation),
    path('reject_reject/',views.reject_request),
    path('admin_login/',views.admin_login),
    path('admin_logout/',views.admin_logout)
]