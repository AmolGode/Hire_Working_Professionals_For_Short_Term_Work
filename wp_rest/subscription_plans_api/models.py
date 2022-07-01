from django.db import models
from django.contrib.auth import get_user_model
from wp_api.models import BusinessAccountModel

# Create your models here.

UserModel = get_user_model()


class SubscriptionPlansModel(models.Model):
    title = models.CharField(max_length=50)
    price = models.IntegerField()
    duration = models.IntegerField()
    auth_user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    business_account = models.ManyToManyField(BusinessAccountModel, through='WpBusiAcc_Sub_plansModel')

    class Meta:
        db_table = 'subscription_plans'


class WpBusiAcc_Sub_plansModel(models.Model):
    business_account = models.ForeignKey(BusinessAccountModel, on_delete=models.CASCADE)
    subscription_plan = models.ForeignKey(SubscriptionPlansModel, on_delete=models.CASCADE)

    class Meta:
        db_table = 'wp_business_acc_subscription_plans'


