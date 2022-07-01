from django.shortcuts import render

from user_api.models import UserModel
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
from django.db.models import Q

# Create your views here.

class Message(APIView):
    def post(self, request, format=None):
        serializer =  MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            new_msg = MessageModel.objects.latest('id')
            new_msg_ser = MessageSerializer(new_msg)
            resp = {'resp' : 'Message is sended sucessfully..!','new_message':new_msg_ser.data}
        else:
            resp = {'error' : serializer.errors}
            print(serializer.errors)
        return Response(resp)

    def get(self,request,uid1,uid2,format=None):
        messages = MessageModel.objects.filter((Q(msg_from=uid1) & Q(msg_to=uid2)) | (Q(msg_from=uid2) & Q(msg_to=uid1))).order_by('id')
        serializer = MessageSerializer(messages,many=True)
        resp = {'resp': serializer.data}
        MessageModel.objects.filter((Q(msg_from=uid2) & Q(msg_to=uid1)) & Q(msg_is_read=False)).update(msg_is_read=True)
        return Response(resp)


class UnreadMessage(APIView):
    def get(self,request,uid1,uid2,format=None):
        messages = MessageModel.objects.filter( (Q(msg_from=uid2) & Q(msg_to=uid1) ) & Q(msg_is_read=False) ).order_by('id')
        serializer = MessageSerializer(messages,many=True)
        resp = {'resp': serializer.data}
        MessageModel.objects.filter( (Q(msg_from=uid2) & Q(msg_to=uid1)) & Q(msg_is_read = False)).update(msg_is_read=True)        
        return Response(resp)




class NewMsgCount(APIView):
    def get(self,request,uid,format=None):
        new_msg_count = MessageModel.objects.filter((Q(msg_to=uid)) & Q(msg_is_read=False)).count()
        return Response({'resp':new_msg_count})