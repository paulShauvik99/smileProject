from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor
from recipient.models import Recipient
from django.http import JsonResponse
import json
from datetime import datetime
from django.contrib.auth.models import User

from django.views.decorators.csrf import csrf_exempt
import pyotp
from sms import send_sms
from twilio.rest import Client
from django.core.serializers import serialize
from django.conf import settings
import uuid
import jwt




# Create your views here.
key = settings.SECRET_KEY
#print(key)


@csrf_exempt
def register(request) :
    if request.method == "POST":
        body = json.loads(request.body)
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        bloodGroup = body['bloodGroup']
        phoneNumber = body['phoneNumber']
        email = body['email']
        otp = body['otp']
        address = body['address']

        isDonor = Donor.objects.filter(phoneNumber = phoneNumber).first()
        if isDonor is not None:
            return JsonResponse({"error":"PhoneNumber Already Exists for another Donor"},status=409)



        date_format = '%Y-%m-%d'
        id=str(uuid.uuid4())
        print(id)
        print(dob)
        date_obj = datetime.strptime(dob, date_format)
        
        try:
            
            secret_key = request.session.get('secret_key')
            print(secret_key)
            totp = pyotp.TOTP(secret_key,interval=300)
            status = totp.verify(otp)
            print(status)
            phoneNumber = request.session.get('phoneNumber')
            del request.session['phoneNumber']
            del request.session['secret_key']
            
            request.session['member_id'] = phoneNumber

            isDonor = True
            isRecipient = False
            recipient = Recipient.objects.filter(phoneNumber= phoneNumber).first()
            if recipient is not None:
                isRecipient = True

            type = jwt.encode({'isDonor': isDonor,"isRecipient" : isRecipient}, key, algorithm='HS256')

            request.session.set_expiry(20*60)

            if status == False:
                return JsonResponse({"error" : "Incorrect OTP"  },status=400)
            

        except Exception as e:
            print(e)
            return JsonResponse({"status" : "OTP verification Failed "  },status=400)



        try:
            new_donor = Donor(
                firstName = firstName,
                lastName = lastName,
                dob = date_obj.date(),
                bloodGroup = bloodGroup,
                phoneNumber = phoneNumber,
                email = email,
                address = address,
                id = id
            )
            new_donor.save()
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'While regestering'},status=500)
        
        
        return JsonResponse({"success" : "Donor Registered Successfully","user_type" : type},status = 200)
    return JsonResponse({"error" : "Invalid request method"},status =400)
 


@csrf_exempt

def user_logout(request):
    if request.method=="GET":
        try:
            del request.session["member_id"]
        except KeyError:
           JsonResponse({'error' : "Invalid session key"})
        return JsonResponse({"status" : "You're logged out."})
    return JsonResponse({"error" : "Invalid request method"},status =400)


#only for recipient
@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        body  = json.loads(request.body)
        phoneNumber  = body['phoneNumber'] 
        if not phoneNumber:
            return JsonResponse({'status': 'Mobile number is required.'}, status=400)
        
        secret_key = pyotp.random_base32()
        #print(secret_key)
        totp = pyotp.TOTP(secret_key, interval=300)  
        otp = totp.now()
     

        # Store the OTP and its creation time in the session
        print(key)
        request.session['secret_key'] = secret_key
        #request.session['otp_creation_time'] = time.time()
        request.session['phoneNumber'] = phoneNumber
        
        


        try: 
            print(settings.TWILIO_AUTH_TOKEN)
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
            # Replace 'to' with the recipient's phone number
            to = phoneNumber
            
            # Replace 'from_' with your Twilio phone number
            from_ = settings.TWILIO_PHONE_NUMBER

            
            message = client.messages.create(
                body="Hi, your otp is " + otp,
                to=to,
                from_=from_
            )
            
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=500)
        
        return JsonResponse({"success" : "SMS sent successfully"},status  =200) 
    return JsonResponse({"error" :"Invalid request Method"}, status=409)

@csrf_exempt
def verify_otp(request):
    if request.method=="POST":
        try:
            body = json.loads(request.body)
            otp = body['otp']
            secret_key = request.session.get('secret_key')
            print(secret_key)
            totp = pyotp.TOTP(secret_key,interval=300)
            status = totp.verify(otp)
            print(status)
            phoneNumber = request.session.get('phoneNumber')
            del request.session['phoneNumber']
            del request.session['secret_key']
            
            request.session['member_id'] = phoneNumber

            isDonor = False
            isRecipient = True
            donor = Donor.objects.filter(phoneNumber= phoneNumber).first()
            if donor is not None:
                isDonor = True
            
            type = jwt.encode({'isDonor': isDonor,"isRecipient" : isRecipient}, key, algorithm='HS256')

            request.session.set_expiry(24*60*60)
            
            if status == False:
                return JsonResponse({"error" : "Incorrect OTP"  },status=400)
            
            return JsonResponse({"success" : "OTP verification success " ,"user_type" : type},status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "OTP verification Failed"  },status=400)
            
        
    
    return JsonResponse({"error" : "Invalid Request method"},status =400)





@csrf_exempt
def donor_send_otp(request):
    if request.method== "POST": 
        body  = json.loads(request.body)
        phoneNumber  = body['phoneNumber'] 
        if not phoneNumber:
            return JsonResponse({'status': 'Mobile number is required.'}, status=400)
        donor = Donor.objects.filter(phoneNumber= phoneNumber).first()
        if donor is None:
            return JsonResponse({"error" : "Donor Not Registered"},status = 401)
        secret_key = pyotp.random_base32()
        print(secret_key)
        totp = pyotp.TOTP(secret_key, interval=300)  
        otp = totp.now()
     

        # Store the OTP and its creation time in the session
        request.session['secret_key'] = secret_key
        #request.session['otp_creation_time'] = time.time()
        request.session['phoneNumber'] = phoneNumber
        
        #generate JWT token for user verification
        try: 
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
            # Replace 'to' with the recipient's phone number
            to = phoneNumber
            
            # Replace 'from_' with your Twilio phone number
            from_ = settings.TWILIO_PHONE_NUMBER
            
            message = client.messages.create(
                body="Hi , your otp is " + otp,
                to=to,
                from_=from_
            )
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=500)
        
        return JsonResponse({"success" : "SMS sent successfully"},status  =200)
    return JsonResponse({"error" : "Invalid request method"},status = 400)

#get donor past records

@csrf_exempt
def get_donor_records(request):
    if request.method == "GET":
        phoneNumber = request.session.get('member_id')
        if phoneNumber is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        donor = Donor.objects.filter(phoneNumber = phoneNumber).first()
        if donor is None : 
            JsonResponse({"error" : "Something Went Wrong"},status=401)

        try :
            donorList = Donor.objects.order_by("-totalDonation").all()
            donor_list_data = []
            if donorList:
                donor_list_data = [{'id': donor.id, 
                                    'firstName': donor.firstName,
                                    'lastName': donor.lastName,
                                    
                                    'totalDonation' : donor.totalDonation,
                                    } for donor in donorList]
                print(donor_list_data)
            donorDetailsObj = Donor.objects.filter(phoneNumber=phoneNumber).first()
            
            is_eligible = True
            differenceInDays = 90
            if donorDetailsObj.lastDonated is not None:

                last_donation_date = donorDetailsObj.lastDonated
                current_date = datetime.now().date()
                difference = current_date - last_donation_date
                #difference_in_months = (current_date.year - last_donation_date.year) * 12 + current_date.month - last_donation_date.month
                is_eligible = difference.days >= 90 
                differenceInDays = difference.days
            # print(difference.days)
            donorDetails = {
                "id" : donorDetailsObj.id,
                "firstName" : donorDetailsObj.firstName,
                "lastName" : donorDetailsObj.lastName,
                 "lastDonated" : donorDetailsObj.lastDonated,
                 "phoneNumber" : donorDetailsObj.phoneNumber,
                 "emailId" : donorDetailsObj.email,
                 "address" : donorDetailsObj.address,
                 "bloodGroup" : donorDetailsObj.bloodGroup,
                 'totalDonation' : donorDetailsObj.totalDonation,
                 'isEligible' : is_eligible,
                 'remainingDays' : (90 - differenceInDays) 

                
            }

            
        except Exception as e:
            print(e)
            JsonResponse({"error" : "Error while fetching data"},status=500)
        return JsonResponse({"status" : "Data fetched","donorDetails" : donorDetails,"donorList" : donor_list_data },status=200)
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)
        




