from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor,MatchedDonor
from recipient.models import Recipient
from django.http import JsonResponse
import json
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import pyotp
import time
from sms import send_sms
from twilio.rest import Client
import random
from django.conf import settings
import uuid
import jwt
import pytz
from django.conf import settings


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
        address = body['address']

        isDonor = Donor.objects.filter(phoneNumber  = phoneNumber).first()
        if isDonor is not None:
            return JsonResponse({"error":"PhoneNumber Already Exists for another Donor"},status=401)



        date_format = '%Y-%m-%d'
        id=str(uuid.uuid4())
        print(id)
        print(dob)
        date_obj = datetime.strptime(dob, date_format)


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
            return JsonResponse({'status': 'error'},status=401)
        return JsonResponse({"success" : "Donor Registered Successfully"},status = 200)
    return JsonResponse({"error" : "Invalid request method"},status =400)
 




@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        body  = json.loads(request.body)
        phoneNumber  = body['phoneNumber'] 
        if not phoneNumber:
            return JsonResponse({'detail': 'Mobile number is required.'}, status=400)
        
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
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
            # Replace 'to' with the recipient's phone number
            to = phoneNumber
            
            # Replace 'from_' with your Twilio phone number
            from_ = settings.TWILIO_PHONE_NUMBER

            
            message = client.messages.create(
                body="Hi, your otp is" + otp,
                to=to,
                from_=from_
            )
            
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=401)
        
        return JsonResponse({"success" : "SMS sent successfully","otp" : otp},status  =200) 
    return JsonResponse({"error" :"Invalid request Method"}, status=400)

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
        except :
            
        return JsonResponse({"status" : "OTP verification status " + str(status)},status=200)



@csrf_exempt
def resend_otp(request):
    if request.method== "GET": 
        phoneNumber = request.session.get('phoneNumber')
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
                body="Hi , your otp is" + otp,
                to=to,
                from_=from_
            )
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=401)
        
        return JsonResponse({"success" : "SMS sent successfully","otp" : otp},status  =200)
    return JsonResponse({"error" : "Invalid request method"},status = 400)




        
@csrf_exempt
def confirm_donor(request):
    if request.method=="POST":
        matched_id  = request.POST.get('matched_id')
        try:

            pair = MatchedDonor.objects.filter(id = matched_id).first()
            pair.status = 'Confirmed'
            pair.save()
            recipient_id = pair.recipient
            recipient = Recipient.objects.filter(id = recipient_id,status = 'Pending').first()
            recipient.status = 'Confirmed'
            recipient.save()
          
            records = MatchedDonor.objects.filter(recipient = recipient_id , status = 'Pending')
            if records is not None:
                for record in records:
                    record.delete()
                
            
        
        except Exception as e:
            print(e)
            return JsonResponse({"error":"Confirmation Failed"},status=401)
       
        try: 
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

            recipient = Recipient.objects.filter(id= recipient_id).first()
            donor_id = pair.donor
            donor = Donor.objects.filter(id = donor_id ).first()

            # Replace 'to' with the recipient's phone number
            to = "+91" + recipient.phoneNumber
            
            # Replace 'from_' with your Twilio phone number
            from_ = settings.TWILIO_PHONE_NUMBER
            
            message = client.messages.create(
                body="Hi "+ recipient.firstName + " , your request for blood has been confirmed, we are sharing you the details of the donor. Donor Number: "+ donor.phoneNumber +"\n Thank You.", 
                to=to,
                from_=from_
            )

            return JsonResponse({"success" : "Comfirmation Done Successfully"},status=200)
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=401)

        
    return JsonResponse({"error" : "Invalid request method"},status = 400)

@csrf_exempt
def confirmDonation(request):
    if request.method == "POST" : 
        matched_id = request.POST.get('matched_id')
        try:

            pair = MatchedDonor.objects.filter(id = matched_id).first()
            pair.donated = 'Yes'
            pair.save()
            donor_id = pair.donor
            donor = Donor.objects.filter(id = donor_id).first()
            dateObj = datetime.now(tz=pytz.timezone('Asia/Kolkata'))
            iso_format = "%Y-%m-%d"
            date  = datetime.strftime(dateObj, iso_format)
            donor.lastDonated = date
            donor.save()

        except Exception as e:
            return JsonResponse({"error" : e},status =500)

    

