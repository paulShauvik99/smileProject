from django.db import models
from django.utils import timezone
import uuid


class FirstDonationDetails(models.Model):
    id = models.UUIDField(primary_key=True,default= uuid.uuid4,  editable=False)
    donBlood = models.CharField(default="", max_length = 30,null=True)
    bloodBankName= models.CharField(default="", max_length = 30,null=True)
    donorName = models.CharField(default="", max_length = 30,null=True)
    donationDate = models.DateField(default = timezone.now,null=True)
    donationReceipt = models.ImageField(upload_to="receipts/",null=True)
    def __str__(self) -> str:
        return self.donorName

# Create your models here.
class Recipient(models.Model):
    id = models.UUIDField(primary_key=True,default= uuid.uuid4,  editable=False)
    firstName = models.CharField(default="",max_length=30)
    lastName = models.CharField(default="",max_length=30)
    dob = models.DateField(default=timezone.now)
    bloodGroup = models.CharField(default="",max_length=30)
    phoneNumber = models.CharField(default='',max_length=10)
    alternateNumber = models.CharField(default='',max_length=10)
    email = models.CharField(default="",max_length=30)
    
    address  = models.TextField(default="",max_length=500)
    hospitalName = models.CharField(default="",max_length=40)
    isThalassemia = models.BooleanField(default = False,null=True)
    hasCancer = models.BooleanField(default= False,null=True)
    firstDonCheck = models.BooleanField(default = False,null=True)
    firstDonation = models.ForeignKey(FirstDonationDetails, null=True, on_delete=models.CASCADE)
    date = models.DateField(timezone.now)
    status = models.CharField(default="Pending",max_length=10)


    def __str__(self) -> str:
        return self.firstName
