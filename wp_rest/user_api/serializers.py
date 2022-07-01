# from dataclasses import field, fields
# from pyexpat import model
from rest_framework import serializers
from .models import *
from message_api.models import MessageModel
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    # def create(self, validated_data):
    #     return UserModel.objects.create(**validated_data)


class UserSerializerInfo(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)
    gender = serializers.CharField(max_length=6)
    email_id = serializers.CharField(max_length=50)
    is_email_id_verified = serializers.BooleanField()
    contact_number = serializers.CharField(max_length=10)
    password = serializers.CharField(max_length=200)
    plain_password = models.CharField(max_length=50)
    profile_pic = serializers.ImageField(default='')


class MsgToUserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)
    email_id = serializers.CharField(max_length=50)
    contact_number = serializers.CharField(max_length=10)
    profile_pic = serializers.ImageField(default='')
    business_title = serializers.CharField(source='businessaccountmodel.business_title')


class UserContactListSerializer(serializers.Serializer):
    msg_from_id = serializers.IntegerField()
    from_first_name = serializers.CharField(source='msg_from.first_name')
    from_last_name = serializers.CharField(source='msg_from.last_name')
    from_profile_pic = serializers.CharField(source='msg_from.profile_pic')
    from_business_title = serializers.CharField(source='msg_from.businessaccountmodel.business_title')
    msg_to_id = serializers.IntegerField()
    to_first_name = serializers.CharField(source='msg_to.first_name')
    to_last_name = serializers.CharField(source='msg_to.last_name')
    to_profile_pic = serializers.CharField(source='msg_to.profile_pic')
    to_business_title = serializers.CharField(source='msg_to.businessaccountmodel.business_title')


class UserContactListSerializer(serializers.Serializer):
    in_contact_with_id = serializers.IntegerField()
    first_name = serializers.CharField(source='in_contact_with.first_name')
    last_name = serializers.CharField(source='in_contact_with.last_name')
    profile_pic = serializers.CharField(source='in_contact_with.profile_pic')
    email_id = serializers.CharField(source='in_contact_with.email_id')
    contact_number = serializers.CharField(source='in_contact_with.contact_number')
    business_title = serializers.CharField(source='in_contact_with.businessaccountmodel.business_title')

class UserContactListSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContactListModel
        fields = '__all__'

    def create(self, validated_data):
        return UserContactListModel.objects.create(**validated_data)

class NewMsgCountForEachContactSerializer(serializers.Serializer):
    in_contact_with_id = serializers.IntegerField()
    new_msg_count = serializers.SerializerMethodField()

    def get_new_msg_count(self,instance):
        return MessageModel.objects.filter((Q(msg_from=instance.in_contact_with_id) & Q(msg_to=instance.user_id) ) & Q(msg_is_read=False)).count()