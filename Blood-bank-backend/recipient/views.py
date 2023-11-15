from django.shortcuts import render
import json
import datetime
from recipient.models import Recipient
from donor.models import Donor,MatchedDonor
from django.http import JsonResponse
import datetime
import pytz
import uuid
from twilio.rest import Client
from sms import send_sms
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def request_blood(request):
    if request.method == "POST" : 
        body = json.loads(request.body)
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        bloodGroup = body['bloodGroup']
        phoneNumber = body['phoneNumber']
        email = body['email']
        address = body['address']
        units =body['units']
        dateString = body['date']
        date_format = '%Y-%m-%d'
        #print(dob)
        birthDateObj = datetime.datetime.strptime(dob, date_format)
        #dateObj = datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata'))
        iso_format = "%Y-%m-%d"
        #date  = datetime.datetime.strftime(dateObj, iso_format)
        date = datetime.datetime.strptime(dateString, "%Y-%m-%d").date()
        id = str(uuid.uuid4())
        
        current_date_string= datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.datetime.strptime(current_date_string, "%Y-%m-%d").date()


        try:
            recipient = Recipient.objects.filter(phoneNumber = phoneNumber).order_by("-date").first()
            if recipient is not None:
                #lastRecieved = datetime.datetime.strptime(recipient.date,"%Y-%m-%d").date()
                if ( current_date.month-recipient.date.month)*30 + (current_date.day - recipient.date.day) <15:
                    return JsonResponse({"error" : "Cannot place request withing 15 days of last recieved"},status = 400)
            
            
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something went wrong"},status = 400)

        try:
           
            new_recipient = Recipient(
            id= id,
            firstName = firstName,
            lastName = lastName,
            dob = birthDateObj.date(),
            bloodGroup = bloodGroup,
            phoneNumber = phoneNumber,
            email = email,
            address = address,
            date = date,
            units = units,
           
            )
            new_recipient.save()

          
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error'},status=401)
        



        
        
        try:
            donors = Donor.objects.filter(bloodGroup = bloodGroup)
            
            if donors is None:
                return JsonResponse({"error" : "No donor available of this BloodGroup"},status=400)
            for donor in donors:
               lastDonated = donor.lastDonated
               
               
               
               if lastDonated:
                  months_passed = (current_date.year - lastDonated.year) * 12 + (current_date.month - lastDonated.month)
                  if months_passed > 3:
                    #add this block later
                    
                    # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

                    

                    # # Replace 'to' with the recipient's phone number
                    # to = "+91" + donor.phoneNumber
                    
                    # # Replace 'from_' with your Twilio phone number
                    # from_ = settings.TWILIO_PHONE_NUMBER
                    
                    # message = client.messages.create(
                    #     body="Hi "+ donor.firstName + " , Some Urgently needs blood of group"+ donor.bloodGroup +"\n Kindly contact to our NGO ASAP", 
                    #     to=to,
                    #     from_=from_
                    # )
                        
                    matched_donor = MatchedDonor(recipient=new_recipient.id, donor=donor.id)
                    matched_donor.save()
                
            return JsonResponse({"success" : "Request Placed Successfully"},status =200)
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "No Donor Found of this Blood Group"},status=400)
        
    return JsonResponse({"error" : "Invalid request method"},status =400)

# add JWT token verification

@csrf_exempt
def get_matched_donors(request):
    if (request.method =='GET'):
        try:
            recipient_list = Recipient.objects.filter(status = 'Pending')
            r_list = []
            for recipient in recipient_list:
        
                
                recipient_id = recipient.id
                recipient_details = {
                    'name' : recipient.firstName + recipient.lastName,
                    'phoneNumber' : recipient.phoneNumber,
                    'bloodgroup' : recipient.bloodGroup,
                    'units' : recipient.units,
                    'address' : recipient.address

                }
                matchedDonors = MatchedDonor.objects.filter(recipient = recipient_id , status  = 'Pending')
                donorlist = []
                for pair in matchedDonors:
                    

                    donor = Donor.objects.filter(id = pair.donor).first()
                    donorlist.append({
                        'name' : donor.firstName +" "+donor.lastName,
                        'bloodGroup' : donor.bloodGroup,
                        'phoneNumber' : donor.phoneNumber,
                        'address' : donor.address,
                        'matched_id' : pair.id
                    })
                
                r_list.append({
                    
                    'recipient' : recipient_details,
                    'paired_donors' : donorlist
                })



            return JsonResponse({'success' : 'returned successsfully', 'recipient_donor_list' : r_list},status =200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=400)
    return JsonResponse({"error" : "Invalid request Method"}, status=401)

@csrf_exempt
def get_confirmed_donors(request):
    if (request.method =='GET'):
        try:
            recipient_list = Recipient.objects.filter(status = 'Pending')
            r_list = []
            for recipient in recipient_list:
        
                
                recipient_id = recipient.id
                recipient_details = {
                    'name' : recipient.firstName + recipient.lastName,
                    'phoneNumber' : recipient.phoneNumber,
                    'bloodgroup' : recipient.bloodGroup,
                    'units' : recipient.units,
                    'address' : recipient.address

                }
                matchedDonors = MatchedDonor.objects.filter(recipient = recipient_id , status  = 'Pending')
                donorlist = []
                for pair in matchedDonors:
                    

                    donor = Donor.objects.filter(id = pair.donor).first()
                    donorlist.append({
                        'name' : donor.firstName +" "+donor.lastName,
                        'bloodGroup' : donor.bloodGroup,
                        'phoneNumber' : donor.phoneNumber,
                        'address' : donor.address,
                        'matched_id' : pair.id
                    })
                
                r_list.append({
                    
                    'recipient' : recipient_details,
                    'paired_donors' : donorlist
                })



            return JsonResponse({'success' : 'returned successsfully', 'recipient_donor_list' : r_list},status =200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=400)
    return JsonResponse({"error" : "Invalid request Method"}, status=401)