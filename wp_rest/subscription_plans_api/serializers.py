from rest_framework import serializers
from .models import *


class SubscriptionPlansSerializers(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlansModel
        fields = '__all__'


class WpBusiAcc_Sub_plansModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = WpBusiAcc_Sub_plansModel
        fields = '__all__'
