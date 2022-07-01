from django.contrib import admin
from .models import *
# Register your models here.


class SubscriptionPlansAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'duration', 'number_if_time_buy']

    def number_if_time_buy(self, instance):
        return WpBusiAcc_Sub_plansModel.objects.filter(subscription_plan_id=instance.id).count()


admin.site.register(SubscriptionPlansModel, SubscriptionPlansAdmin)

