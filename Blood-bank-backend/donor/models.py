from django.db import models
from datetime import date
from django.utils import timezone
from recipient.models import Recipient
import uuid

# Create your models here.
class Donor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    firstName = models.CharField(default="",max_length=30)
    lastName = models.CharField(default="",max_length=30)
    dob = models.DateField()
    bloodGroup = models.CharField(default="",max_length=30)
    phoneNumber = models.TextField(default='',max_length=14,null=True)
    email = models.TextField(default="",max_length=30,null=True)
    lastDonated = models.DateField(null=True)
    address  = models.TextField(default="",max_length=500)
    weight = models.CharField(default ="",max_length=4)
    isThalassemia = models.BooleanField(default = False,null=True)
    totalDonation = models.IntegerField(default = 0,null=False)
    loan = models.BooleanField(default=False) 
    gender = models.CharField(default="",max_length=300)
    def __str__(self) :
        return self.firstName


    
class Calender(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.IntegerField(default=15,null=True)