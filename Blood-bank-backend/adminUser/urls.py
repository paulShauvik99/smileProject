from . import views
from django.urls import include, path

urlpatterns = [
   
    path('confirm_donor/',views.confirm_donor),
    path('get_donor_list/',views.get_donor_list),
    path('get_recipient_list/',views.get_recipient_list),
    path('confirm_recipient_donation/',views.confirmRecipientDonation),
    path('reject_request/',views.reject_request),
    path('admin_login/',views.admin_login),
    path('admin_logout/',views.admin_logout),
    path('send_requirement/<str:donor_id>',views.requirement_msg),
    path('loan_msg/<str:donor_id>',views.loan_msg),
    path('confirm_loan/<str:donor_id>',views.confirm_loan),
    path('addPhotos/',views.addPhotos),
    path('getLeaderboardImages/',views.getLeaderboardImage)
]