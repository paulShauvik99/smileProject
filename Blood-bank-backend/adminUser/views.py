from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor
from recipient.models import Recipient
from django.http import JsonResponse
import json
from datetime import datetime,timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from django.views.decorators.csrf import csrf_exempt
import pyotp
import time
from sms import send_sms
from twilio.rest import Client
from django.core.serializers import serialize


import random
from django.conf import settings
import uuid
import jwt
import pytz
# Create your views here.


key = settings.SECRET_KEY

#ADMIN API's

#Get all matched donors and recipients
def authorize_admin(request):
    username  =  request.user
    user  = User.objects.filter(username = username).first()
    if user == None or user.is_superuser == False:
        return False



#completed
@csrf_exempt
def get_donor_list(request):
    if (request.method =='GET'):
        # phoneNumber = request.session.get('member_id')
        # print(phoneNumber)
        # if phoneNumber is None:
        #     return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:

           
            current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
            current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
            three_months_ago = current_date - timedelta(days=3*30)
            print(three_months_ago)
            donor_list_obj  = Donor.objects.filter(lastDonated__lte = three_months_ago).all()
            
            donor_list_data = []
            sl = 1
            if donor_list_obj:
                donor_list_data = [{
                                    'sl': index + 1,
                                    'id': donor.id, 
                                    'lastDonated': donor.lastDonated, 
                                    'firstName': donor.firstName,
                                    'lastName': donor.lastName,
                                    'thalassemia' : donor.thalassemia,
                                    'bloodGroup' : donor.bloodGroup,
                                    'phoneNumber' : donor.phoneNumber,
                                    'address' : donor.address,
                                    'totalDonation' : donor.totalDonation,
                                    } for index, donor in enumerate(donor_list_obj)]
            
           

            return JsonResponse({'success' : 'returned successsfully', 'donor_list' : donor_list_data},safe=False ,status =200)
                
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
        
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm donor-recipient pair

@csrf_exempt
def confirm_donor(request):
    if request.method=="POST":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
         
        body  = json.loads(request.body)
        id  = body['donor_id'] 
        donor_id = uuid.UUID(id)
        try:

            donor = Donor.objects.filter(id = donor_id).first()
            dateObj = datetime.now(tz=pytz.timezone('Asia/Kolkata'))
            iso_format = "%Y-%m-%d"
            date  = datetime.strftime(dateObj, iso_format)
            donor.lastDonated = date
            donor.totalDonation += 1
            donor.save()

          

        except Exception as e:
            print(e)
            return JsonResponse({"error":"Donation Confirmation Failed"},status=500)
       
        try: 
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

          

            # Replace 'to' with the recipient's phone number
            to =donor.phoneNumber
            
            # Replace 'from_' with your Twilio phone number
            from_ = settings.TWILIO_PHONE_NUMBER
            
            message = client.messages.create(
                body="Hi "+ donor.firstName + ", " + "\nThank You for your Blood Donation.", 
                to=to,
                from_=from_
            )

            return JsonResponse({"success" : "Comfirmation Done Successfully"},status=200)
            
        except Exception as e:
            print(e) 
            pass

        
    return JsonResponse({"error" : "Invalid request method"},status = 400)


#get confirmed pair list

@csrf_exempt
def get_recipient_list(request):
    if (request.method =='GET'):
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:
            current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date()
            recipientList = Recipient.objects.filter(date = current_date_string).all()
            print(recipientList.values())
            recipient_list_data=[]
            sl = 1
            if len(recipientList) != 0:
                for recipient in recipientList:
                    firstDonation={}
                    if recipient.firstDonation:
                        firstDonation = {
                                            'donBlood' : recipient.firstDonation.donBlood,
                                            'bloodBankName':recipient.firstDonation.bloodBankName,
                                            'donorName':recipient.firstDonation.donorName,
                                            'donationDate':recipient.firstDonation.donationDate,
                                            'donationReceipt': 'http://127.0.0.1:8000' + recipient.firstDonation.donationReceipt.url
                                        }
                    recipient_list_data.append({'id': recipient.id,  
                                                'sl' : sl,
                                        'firstName': recipient.firstName,
                                        'lastName': recipient.lastName,
                                        'isThalassemia' : recipient.isThalassemia,
                                        'hasCancer' : recipient.hasCancer,
                                        'hospitalName' : recipient.hospitalName,
                                        'firstDonation' : firstDonation,
                                        'firstDonCheck' : recipient.firstDonCheck,
                                        'bloodGroup' : recipient.bloodGroup,
                                        'phoneNumber' : recipient.phoneNumber,
                                        'address' : recipient.address,
                                        'status' : recipient.status,
                                        })
                    sl+=1
            return JsonResponse({'success' : 'returned successsfully', 'list' : recipient_list_data},status =200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm Donation

@csrf_exempt
def confirmRecipientDonation(request):
    if request.method == "POST" : 
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        body  = json.loads(request.body)
        id  = body['recipient_id'] 
        matched_id = uuid.UUID(id) 
        try:
            recipient = Recipient.objects.filter(id = matched_id).first()
            recipient.status = "Confirmed"
            recipient.save()
            return JsonResponse({"status" : "Request approved successfully"},status=200)

        except Exception as e:
            return JsonResponse({"error" : e},status =500)
        
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)

@csrf_exempt
def reject_request(request):
    if request.method == "POST" : 
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        body  = json.loads(request.body)
        recipient_id = body['recipient_id']
        try:
            recipient = Recipient.objects.filter(id = recipient_id).first()
            recipient.status = "Rejected"
            recipient.save()
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something Went wrong"},status =500)
        return JsonResponse({"status" : "Successfully rejected the request"},status = 200)
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)





@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        body = json.loads(request.body)
        
        username = body['username']
        password = body['password']
        # print(username)
        # print(password)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        # print(user)
        
        try: 
            if user is not None:
                # Log in the authenticated user
                login(request, user)
                request.session.set_expiry(24*60*60)

                is_staff = user.is_superuser
                #newline update

                isAdmin = jwt.encode({'isAdmin': is_staff}, key, algorithm='HS256')
                print(isAdmin)
                print(request.user)
                # for it in request.session:
                #     print(it)
                    
                
                return JsonResponse({'success': 'Admin Login Successful','is_Admin' : isAdmin},status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'},status=403)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something Went Wrong"},status =500)
    
    return JsonResponse({'error':'Invalid Request'},status = 400)

@csrf_exempt
def admin_logout(request):
    logout(request)
   
    return JsonResponse({"success": "Admin logout processed"},status=200)

