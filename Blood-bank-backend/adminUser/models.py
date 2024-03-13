from django.db import models
import uuid
# Create your models here.
class LeaderBoard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    p1 = models.ImageField(upload_to="leaderBoard/",null=True)
    p2 = models.ImageField(upload_to="leaderBoard/",null=True)
    p3 = models.ImageField(upload_to="leaderBoard/",null=True)
    p4 = models.ImageField(upload_to="leaderBoard/",null=True)
    p5 = models.ImageField(upload_to="leaderBoard/",null=True)
