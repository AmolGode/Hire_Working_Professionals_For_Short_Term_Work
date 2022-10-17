from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from wp_api.models import WorkSamplesModel
from datetime import datetime
from wp_api.serializers import FeedbackSerializer


# Create your views here.

class SearchWorkingProgessionals(APIView):
    def post(self, request, format=None):
        tags = request.data.get('tag_arr')
        city_name = request.data.get('city_name')
        tags_list = tags.split(',')
        ws = WorkSamplesModel.objects.filter(business_account__serviceareasmodel__city_name=city_name,
                                             business_account__professiontagsmodel__tag_name__in=tags_list,
                                             is_business_card_image=True, business_account__verification_status=
                                             'Approved', business_account__subscription_expiry_date__gte=datetime.today()
                                             .strftime('%Y-%m-%d')).distinct()
                            #.select_related('business_account')
        serializer = SearchWorkingProfessionalsSerializer(ws, many=True)
        resp = {'resp': serializer.data}
        return Response(resp)
