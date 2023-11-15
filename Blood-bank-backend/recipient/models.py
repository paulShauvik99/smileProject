from django.db import models
from django.utils import timezone
import uuid


# Create your models here.
class Recipient(models.Model):
    id = models.UUIDField(primary_key=True,default= uuid.uuid4,  editable=False)
    firstName = models.CharField(default="",max_length=30)
    lastName = models.CharField(default="",max_length=30)
    dob = models.DateField(default=timezone.now)
    bloodGroup = models.CharField(default="",max_length=30)
    phoneNumber = models.TextField(default='',max_length=10)
    email = models.TextField(default="",max_length=30)
    units = models.IntegerField(default=0)
    address  = models.TextField(default="",max_length=500)
    date = models.DateField(timezone.now)
    status = models.CharField(default="Pending",max_length=10)

    
    

    def __str__(self) -> str:
        return self.firstName
    
    