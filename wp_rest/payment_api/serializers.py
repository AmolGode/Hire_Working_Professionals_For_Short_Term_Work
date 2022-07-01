from rest_framework import serializers
from .models import *


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentHistoryModel
        fields = '__all__'

