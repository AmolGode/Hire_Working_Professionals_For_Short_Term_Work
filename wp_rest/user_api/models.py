from enum import unique
from django.db import models
import os  # for remove image file


# Create your models here.


class UserModel(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email_id = models.CharField(max_length=50)
    is_email_id_verified = models.BooleanField(default=False)
    contact_number = models.CharField(max_length=10, unique=True)
    gender = models.CharField(max_length=6)
    password = models.CharField(max_length=200)  # encrypted
    profile_pic = models.ImageField(max_length=300,blank=True, null=True, upload_to='profile_pic/')

    class Meta:
        db_table = 'user'

    def delete(self):
        if self.profile_pic:
            if os.path.isfile(self.profile_pic.path):
                os.remove(self.profile_pic.path)
        super().delete()


class UserContactListModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='user')
    in_contact_with = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='in_contact_with')

    class Meta:
        unique_together = [['user', 'in_contact_with']]

        db_table = 'user_contact_list'
