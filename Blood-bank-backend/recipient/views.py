from django.shortcuts import render
import json
import datetime
from recipient.models import Recipient
from donor.models import Donor,MatchedDonor,Calender
from django.http import JsonResponse
import datetime
import pytz
import uuid
from twilio.rest import Client
from sms import send_sms
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt



#matchpair view

# def matchpair(donor,new_recipient,date):
    
#     matched_donor = MatchedDonor(recipient=new_recipient.id, donor=donor.id,date=date)
#     matched_donor.save()
#     dateObj = Calender.objects.filter(date = date).first()
#     print(dateObj)
#     if dateObj:
#         if dateObj.quantity <=0:
#             print(dateObj.quantity)
#             return JsonResponse({"error" : "Dates Not available "},status = 400)
#         dateObj.quantity -= 1
#         dateObj.save()

#     try:

#         client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
#         # Replace 'to' with the recipient's phone number
#         to = donor.phoneNumber
        
        
#         # Replace 'from_' with your Twilio phone number
#         from_ = settings.TWILIO_PHONE_NUMBER
        
#         message = client.messages.create(
#             body="Hi "+ donor.firstName + " , Someone Urgently needs blood of group "+ donor.bloodGroup +"\n Kindly contact to our NGO ASAP", 
#             to=to,
#             from_=from_
#         )

#         return JsonResponse({"success" : "Request Placed Successfully"},status =201)   
#     except:
#         return JsonResponse({"success" : "Request Placed Successfully"},status =201)   

    

# Create your views here.
@csrf_exempt
def request_blood(request):
    if request.method == "POST" : 

        phoneNumber = request.session.get('member_id')
        if phoneNumber is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)

        body = json.loads(request.body) 
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        email = body['email']
        alternateNumber = body['phoneNumber']
        address = body['address']
        bloodGroup = body['bloodGroup']
        hospitalName = body['hospitalName']
        isThalassemia = body['isThalassemia']
        hasCancer = body['hasCancer']
        donBlood = body['donBlood']
        bloodBankName = body['bloodBankName']
        donorName = body['donorName']
        donationDate = body['donationDate']
        donationReceipt = body['donationReceipt']
        firstDonCheck = body['firstDonCheck']
        # dateString = body['date']
        date_format = '%Y-%m-%d'


        
        
        FirstDonationDetails = None
        if firstDonCheck:
            if hasCancer == True or isThalassemia == True or (bloodGroup in ['A-', 'B-','AB-','O-']):
                pass
            else :
                return JsonResponse({"error" : "First Donation Validation Error"},status=500)
        else:
            FirstDonationDetails = {
                donBlood : donBlood,
                bloodBankName : bloodBankName,
                donorName : donorName,
                donationDate : datetime.datetime.strptime(donationDate,date_format).date(),
                donationReceipt : "randomurl"
            }

        
        
        
        
        
        birthDateObj = datetime.datetime.strptime(dob, date_format)
      
        
        current_date_string= datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.datetime.strptime(current_date_string, "%Y-%m-%d").date()


        try:
            recipient = Recipient.objects.filter(phoneNumber = phoneNumber,status__in = ['Confirmed' ,'Pending']).order_by("-date").first()
            if recipient is not None:
                #lastRecieved = datetime.datetime.strptime(recipient.date,"%Y-%m-%d").date()
                
                if ( current_date.month-recipient.date.month)*30 + (current_date.day - recipient.date.day) <15:
                    return JsonResponse({"error" : "Cannot place request withing 15 days of last recieved"},status = 400)
            
            
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something went wrong"},status = 400)
         

        try:
           
            new_recipient = Recipient(
            firstName = firstName,
            lastName = lastName,
            dob = birthDateObj.date(),
            bloodGroup = bloodGroup,
            phoneNumber = phoneNumber,
            alternateNumber = alternateNumber,
            email = email,
            address = address,
            date = current_date,
            hospitalName = hospitalName,
            isThalassemia = isThalassemia,
            hasCancer  = hasCancer,
            firstDonCheck = firstDonCheck,
            firstDonation = FirstDonationDetails
            )
            new_recipient.save()

            return JsonResponse({"success" : "Request Placed Successfully"},status=201)



          
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'error while saving form'},status=500)
        


        
    return JsonResponse({"error" : "Invalid request method"},status =400)





@csrf_exempt
def get_available_dates(request):
    if request.method == "GET":
        # phoneNumber = request.session.get('member_id')
        # if phoneNumber is None:
        #     return JsonResponse({"error" : "Invalid Session Id"},status =401)
        try:
            dates = Calender.objects.all()
            data = {}
            for date in dates:
                data[str(date.date.day)] =str(date.quantity)
        except Exception as e:
            return JsonResponse({"error" : "Something Went Wrong"},status=500)
        return JsonResponse({"status" : "success","dates" : data},status=200)
    return JsonResponse({"error" : "Invalid request method"},status =400)


@csrf_exempt
def get_recipient_records(request):
    if request.method == "GET":
        phoneNumber = request.session.get('member_id')
        print(phoneNumber)
        if phoneNumber is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        recipients = Recipient.objects.filter(phoneNumber = phoneNumber,status__in = ['Confirmed','Pending','Rejected']).all()
        print(recipients)
        data = []
        pendingDonation = {}
        pendingDonorJson ={}
        requestPlaced = {}
        
        if recipients:
            try :
                for recipient in recipients:
                    if recipient.status == "Rejected" :
                        data.append(
                            {
                                "donor_name" : "-",
                                "donor_address" : "-",
                                "donor_phoneNumber" : "-",
                                "bloodGroup" : recipient.bloodGroup,
                                "date" : recipient.date, 
                                "status" : recipient.status,
                                "recipient_name" : recipient.firstName +" " + recipient.lastName
                            }
                        )
                    else:
                        donationObj = MatchedDonor.objects.filter(status__in = ['Confirmed'],donated = "Yes", recipient = recipient.id).order_by("-date").first()
                        print(donationObj)
                        pendingDonation = MatchedDonor.objects.filter(status = "Confirmed",donated = "No", recipient = recipient.id).first()
                        request_placed = MatchedDonor.objects.filter(status = "Pending",donated = "No", recipient = recipient.id).first()
                        print(pendingDonation)
                        if pendingDonation is not None:
                            pendingDonor = Donor.objects.filter(id = pendingDonation.donor).first()
                            pendingRecipient = Recipient.objects.filter(id = pendingDonation.recipient).first()
                            print(pendingDonor)
                            pendingDonorJson = {
                                "donor_name" : pendingDonor.firstName +" " +  pendingDonor.lastName,
                                "donor_address" : pendingDonor.address,
                                "donor_phoneNumber" : pendingDonor.phoneNumber,
                                "bloodGroup" : pendingDonor.bloodGroup,
                                "date" : pendingDonation.date,
                                "status" : "Donor Matched",
                                "recipient_name" : recipient.firstName+ " "+ recipient.lastName,
                                
                                
                            }

                        if request_placed :
                            requestPlaced = {
                                "donor_name" : "-",
                                "donor_address" : "-",
                                "bloodGroup" : recipient.bloodGroup,
                                "donor_phoneNumber" : "-",
                                "status" : request_placed.status,
                                "recipient_name" : recipient.firstName+" "+ recipient.lastName,
                                "date" : recipient.date
                            } 
                        
                        if donationObj:
                            
                            donor = Donor.objects.filter(id = donationObj.donor).first()
                            data.append({
                                "donor_name" : donor.firstName +" "+ donor.lastName,
                                "bloodGroup" : donor.bloodGroup,
                                "donor_phoneNumber" : donor.phoneNumber,
                                "donor_address" : donor.address,
                                "date" : donationObj.date,
                                "status" : donationObj.status,
                                "recipient_name" : recipient.firstName+ " "+ recipient.lastName,
                                
                
                            })
                  
                
                
            except Exception as e:
                print(e)
                return JsonResponse({"error" : "No Donor has not Confirmed yet"},status=500)
        return JsonResponse({"status" : "Data fetched","pastRecord" :data,"pendingDonation" : pendingDonorJson, "requestPlaced" : requestPlaced },status=200)
    
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)


