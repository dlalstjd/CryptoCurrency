from django.db import models
from django.utils import timezone

# Create your models here.
#print("test")

class Notice(models.Model):
    notice = models.CharField(max_length=300)
    date = models.CharField(max_length=10)

    def __str__(self):
        """Returns a string representation of a message"""
        #data = timezone.localtime(self.date)
        return f"'{self.notice}' noticed on {self.date}"