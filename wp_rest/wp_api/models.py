from django.db import models
from user_api.models import UserModel
import os

# Create your models here.

VERIFICATION_STATUS_CHOICES = (
    ("Pending", "Pending"),
    ("Approved", "Approved"),
    ("Not Selected", "Not Selected")
)


class BusinessAccountModel(models.Model):
    business_title = models.CharField(max_length=70)
    business_description = models.CharField(max_length=500)
    status = models.CharField(max_length=100)
    note = models.CharField(max_length=200)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='Pending')
    subscription_expiry_date = models.DateField(blank=True, null=True)
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE)

    class Meta:
        db_table = 'wp_business_acc'


class ProfessionTagsModel(models.Model):
    tag_name = models.CharField(max_length=60)
    business_account = models.ForeignKey(BusinessAccountModel,on_delete=models.CASCADE)

    class Meta:
        db_table = 'profession_tags'


class ServiceAreasModel(models.Model):
    city_name = models.CharField(max_length=20)
    business_account = models.ForeignKey(BusinessAccountModel,on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'service_areas'


class WorkSamplesModel(models.Model):
    work_sample_image = models.ImageField(max_length=3000,blank=True,null=True,upload_to="work_samples")
    work_sample_description = models.CharField(max_length=1000,blank=True,null=True)
    is_business_card_image = models.BooleanField(default=False)
    business_account = models.ForeignKey(BusinessAccountModel,on_delete=models.CASCADE)

    class Meta:
        db_table = 'work_samples'
    
    def delete(self):
        if self.work_sample_image:
          if os.path.isfile(self.work_sample_image.path):
             os.remove(self.work_sample_image.path)
        super().delete()
        
    
    
class FeedbackModel(models.Model):
    feedback_text = models.CharField(max_length=1000)
    rating = models.IntegerField()
    date = models.DateField(auto_now=True)
    feedback_by = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    business_account = models.ForeignKey(BusinessAccountModel,on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'feedback'