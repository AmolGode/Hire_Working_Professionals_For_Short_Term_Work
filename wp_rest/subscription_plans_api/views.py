from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *


# Create your views here.

class SubscriptionPlans(APIView):
    def get(self, request, format=None):
        s_plans = SubscriptionPlansModel.objects.all()
        serializer = SubscriptionPlansSerializers(s_plans, many=True)
        resp = {'resp': serializer.data}
        return Response(resp)
