from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor,MatchedDonor
from recipient.models import Recipient
from django.http import JsonResponse
import json
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
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

        isDonor = Donor.objects.filter(phoneNumber  = phoneNumber).first()
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

            request.session.set_expiry(3000000)

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
        return JsonResponse("You're logged out.")
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
                body="Hi, your otp is" + otp,
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

            request.session.set_expiry(3000000)
            
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
                body="Hi , your otp is" + otp,
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
            data = []
            donorJson ={}
            pendingRecipientJson={}
            donationList = MatchedDonor.objects.filter(status = "Confirmed",donated = "Yes", donor = donor.id).all()
            print(donationList)
            pendingDonation = MatchedDonor.objects.filter(status = "Confirmed",donated = "No", donor = donor.id).first()
            
            if pendingDonation is not None:
                pendingRecipient = Recipient.objects.filter(id = pendingDonation.recipient).first()
                print(pendingRecipient)
                
                pendingRecipientJson = {
                    "name" : pendingRecipient.firstName +" " +  pendingRecipient.lastName,
                    "address" : pendingRecipient.address,
                    "phoneNumber" : pendingRecipient.phoneNumber,
                    "alternatephoneNumber" : pendingRecipient.alternateNumber,
                    "date" : pendingRecipient.date
                }
            print(donationList)
            if donationList:
                for obj in donationList:
                    print(obj)
                    
                    recipient = Recipient.objects.filter(id = obj.recipient).first()
                    data.append({
                        "recipient_name" : recipient.firstName +" "+ recipient.lastName,
                        "bloodGroup" : recipient.bloodGroup,
                        "address" : recipient.address,
                        "date" : recipient.date,
                        "phoneNumber" : recipient.phoneNumber
                        

                    })

            #
            
            donorJson = {
                "name" : donor.firstName +" "+ donor.lastName,
                "bloodGroup" : donor.bloodGroup,
                "lastDonation" : donor.lastDonated,
                "address" : donor.address,

            }
            
            
        except Exception as e:
            print(e)
            JsonResponse({"error" : "Error while fetching data"},status=500)
        return JsonResponse({"status" : "Data fetched","pastRecord" :data,"donorDetails" : donorJson,"pendingDonation" : pendingRecipientJson },status=200)
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)
        




#ADMIN API's

#Get all matched donors and recipients
def authorize_admin(request):
    username  =  request.user
    user  = User.objects.filter(username = username).first()
    if user == None or user.is_superuser == False:
        return False




@csrf_exempt
def get_matched_donors(request):
    if (request.method =='GET'):
        # phoneNumber = request.session.get('member_id')
        # print(phoneNumber)
        # if phoneNumber is None:
        #     return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:
            recipient_list = Recipient.objects.filter(status = 'Pending')
            r_list = []
            d_list = {}
            i=1
            if recipient_list:
                for recipient in recipient_list:

                    recipient_id = recipient.id
                    
                    
                    matchedDonors = MatchedDonor.objects.filter(recipient = recipient_id , status  = 'Pending')
                    donorlist = []
                    j=1
                    for pair in matchedDonors:
                        donor = Donor.objects.filter(id = pair.donor).first()
                        donorlist.append({
                            'id' : donor.id,
                            'name' : donor.firstName +" "+donor.lastName,
                            'bloodGroup' : donor.bloodGroup,
                            'phoneNumber' : donor.phoneNumber,
                            'address' : donor.address,
                            'matched_id' : pair.id,
                            'sl' : str(j) 
                        })
                        j+=1

                    recipient_details = {
                        'id' : recipient.id,
                        'name' : recipient.firstName + recipient.lastName,
                        'phoneNumber' : recipient.phoneNumber,
                        "alternateNumber" : recipient.alternateNumber,
                        'bloodgroup' : recipient.bloodGroup,
                        'units' : recipient.units,
                        'address' : recipient.address,
                        'date' : recipient.date,
                        'sl' : str(i),
                        'donor_list' : donorlist

                    }
                    r_list.append(recipient_details)

                        
                    i+=1
                
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
        return JsonResponse({'success' : 'returned successsfully', 'recipient_list' : r_list},status =200)
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm donor-recipient pair

@csrf_exempt
def confirm_donor(request):
    if request.method=="POST":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
         
        body  = json.loads(request.body)
        id  = body['matched_id'] 
        matched_id = uuid.UUID(id)
        try:

            pair = MatchedDonor.objects.filter(id = matched_id).first()
            print(pair)
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


            donor = pair.donor
            donorRecords = MatchedDonor.objects.filter(donor = donor,status = 'Pending')
            if donorRecords is not None:
                for record in donorRecords:
                    record.delete()

                
            
        
        except Exception as e:
            print(e)
            return JsonResponse({"error":"Confirmation Failed"},status=500)
       
        try: 
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

            recipient = Recipient.objects.filter(id= recipient_id).first()
            donor_id = pair.donor
            donor = Donor.objects.filter(id = donor_id ).first()

            # Replace 'to' with the recipient's phone number
            to = recipient.phoneNumber
            
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
            pass

        
    return JsonResponse({"error" : "Invalid request method"},status = 400)


#get confirmed pair list

@csrf_exempt
def get_confirmed_donors(request):
    if (request.method =='GET'):
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:
            matchedDonors = MatchedDonor.objects.filter(status = 'Confirmed',donated = "No").order_by("-date").all()
            list = []
            sl = 1
            for pair in matchedDonors:
                recipient = Recipient.objects.filter(id = pair.recipient).first()
                donor  = Donor.objects.filter(id = pair.donor).first()
                list.append({
                    'recipient_name' : recipient.firstName + recipient.lastName,
                    'donor_name' : donor.firstName + donor.lastName,
                    'donor_phoneNumber' : donor.phoneNumber,
                    'recipient_phonenumber': recipient.phoneNumber,
                    'bloodgroup' : recipient.bloodGroup,
                    'id' : pair.id,
                    'sl' : str(sl),
                    'date' : pair.date

                })
                sl+=1
                
            print(list)
            return JsonResponse({'success' : 'returned successsfully', 'list' : list},status =200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm Donation

@csrf_exempt
def confirmDonation(request):
    if request.method == "POST" : 
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        body  = json.loads(request.body)
        id  = body['matched_id'] 
        matched_id = uuid.UUID(id) 
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

            return JsonResponse({"status" : "Request saved successfully"},status=200)

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
            records = MatchedDonor.objects.filter(recipient = recipient_id , status = 'Pending')
            if records:
                for record in records:
                    record.delete()
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

