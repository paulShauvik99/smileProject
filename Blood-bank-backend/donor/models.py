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
    thalassemia = models.CharField(default ="",max_length=4)
    totalDonation = models.IntegerField(default = 0,null=False)
    def __str__(self) :
        return self.firstName


class Calender(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(null=True)
    quantity = models.IntegerField(default=10,null=True)