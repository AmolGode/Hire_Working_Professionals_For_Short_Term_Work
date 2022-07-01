from django.db import models
from wp_api.models import BusinessAccountModel
# Create your models here.


class PaymentHistoryModel(models.Model):
    order_id = models.CharField(max_length=30)
    payment_id = models.CharField(max_length=30, blank=True, null=True)
    amount = models.FloatField()
    days_added = models.IntegerField(default=0)
    status = models.CharField(max_length=20)
    done_date = models.DateField(auto_now=True)
    business_account = models.ForeignKey(BusinessAccountModel, on_delete=models.CASCADE)

    class Meta:
        db_table = 'payment_history'
