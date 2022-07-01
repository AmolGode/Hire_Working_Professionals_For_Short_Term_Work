from django.db.models import Avg
from rest_framework import serializers


class SearchWorkingProfessionalsSerializer(serializers.Serializer):
    business_account_id = serializers.IntegerField()
    first_name = serializers.CharField(source='business_account.user.first_name')
    last_name = serializers.CharField(source='business_account.user.last_name')
    profile_pic = serializers.ImageField(source='business_account.user.profile_pic')
    business_title = serializers.CharField(source='business_account.business_title')
    business_description = serializers.CharField(source='business_account.business_description')
    status = serializers.CharField(source='business_account.status')
    note = serializers.CharField(source='business_account.note')
    work_sample_image = serializers.ImageField()
    work_sample_description = serializers.CharField(max_length=1000)
    feedback_count = serializers.SerializerMethodField('get_feedback_count')
    average_rating = serializers.SerializerMethodField()

    def get_feedback_count(self, instance):
        return instance.business_account.feedbackmodel_set.count()

    def get_average_rating(self, instance):
        return instance.business_account.feedbackmodel_set.aggregate(average_rating=Avg('rating'))['average_rating']