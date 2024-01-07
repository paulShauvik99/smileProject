from djongo import models
from django.utils import timezone
import uuid


class FirstDonationDetails(models.Model):
    donBlood = models.CharField(default="", max_length = 30)
    bloodBankName= models.CharField(default="", max_length = 30)
    donorName = models.CharField(default="", max_length = 30)
    donationDate = models.DateField(default = timezone.now)
    donationReceipt = models.TextField(default="")

    class Meta :
        abstract = True

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
    firstDonation = models.EmbeddedField(
        model_container= FirstDonationDetails, null = True
    )
    date = models.DateField(timezone.now)
    status = models.CharField(default="Pending",max_length=10)

    
    

    def __str__(self) -> str:
        return self.firstName


    