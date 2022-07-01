from dataclasses import fields
from rest_framework import serializers
from .models import *
from datetime import datetime
from django.db.models import Avg, Count


class BusiAccSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessAccountModel
        fields = '__all__'


class ProfessionTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionTagsModel
        fields = '__all__'


class ProfessionTagsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionTagsModel
        fields = ['tag_name']


class ServiceAreasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAreasModel
        fields = '__all__'

class WorkSamplesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSamplesModel
        fields = '__all__'

class ServiceAreasCityNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAreasModel
        fields = ['city_name']

class FeedbackSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackModel
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    feedback_by_user_profile_pic = serializers.ImageField(source='feedback_by.profile_pic')
    class Meta:
        model = FeedbackModel
        fields = ['feedback_text','rating','date','feedback_by_user_profile_pic']

# class SearchWorkingProfessionalsSerializer(serializers.Serializer):
#     business_account_id = serializers.IntegerField()
#     first_name = serializers.CharField(source='business_account.user.first_name')
#     last_name = serializers.CharField(source='business_account.user.last_name')
#     profile_pic = serializers.ImageField(source='business_account.user.profile_pic')
#     business_title = serializers.CharField(source='business_account.business_title')
#     business_description = serializers.CharField(source='business_account.business_description')
#     status = serializers.CharField(source='business_account.status')
#     note = serializers.CharField(source='business_account.note')
#     work_sample_image = serializers.ImageField()
#     work_sample_description = serializers.CharField(max_length=1000)

    

class WPFullInfoSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    profile_pic = serializers.ImageField(source='user.profile_pic')
    email_id = serializers.CharField(source='user.email_id')
    contact_number = serializers.CharField(source='user.contact_number')
    class Meta:
        model = BusinessAccountModel
        fields = ['first_name','last_name','profile_pic','email_id','contact_number','business_title','business_description','status','note','user_id']





# class WPFullProfileSerializer(serializers.ModelSerializer):
#     work_sample_image = serializers.ImageField(source='work_sample.work_sample_image')
#     work_sample_description = serializers.CharField(source='work_sample.work_sample_description')
#     class Meta:
#         model = BusinessAccountModel
#         fields = ['id','business_title','business_description','status','note','work_sample_image','work_sample_description']