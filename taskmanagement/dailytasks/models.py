
from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
 

class ToDoTask(models.Model):
    task_name = models.CharField(max_length=255)
    description = models.CharField(max_length=50)
    deadline = models.DateField()
    status = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE , null=True, blank=True)  # Associate task with user

    def __str__(self):
        return self.task_name

