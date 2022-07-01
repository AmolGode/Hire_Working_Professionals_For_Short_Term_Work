from .models import *
from .serializers import *
# from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import traceback
from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from server_data.mail import send_mail
from django.shortcuts import redirect
import random
from django.db.models import Q
import requests

# Create your views here.

key = 'working_professionals_2022'  # key from decrypt password


class UserAPI(APIView):
    def post(self, request, format=None):
        email_id = request.data.get('email_id')
        count = UserModel.objects.filter(
            email_id=email_id, is_email_id_verified=True).count()
        if count > 0:
            resp = {
                'error': 'Email id is already in use, Please use another email id and try again..!', 'acc_created': False}
            return Response(resp)
        request.data._mutable = True
        request.data['password'] = make_password(
            salt=key, password=request.data.get('password'))
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                # Sending verification link after sucessful save
                latest_uid = UserModel.objects.latest('id').id 
                to = request.data.get('email_id')
                html_message = f"""\
                <html>
                <head></head>
                <body>
                <h1>Working Professionals Email Verification Link</h1><br>
                <p>
                    Click on <a href="http://127.0.0.1:8000/user_api/verify_email_id/{latest_uid}/">verify</a> to verify your email id.
                </p>
                </body>
                </html>
                """
                send_mail(html_message, to)
                resp = {'resp': 'User account created successfully..!',
                    'acc_created': True}
            # except IntegrityError as e:
            #     print('save user mysql Exception : ', e)
            #     resp = {'error': 'This contact number already registered..!', 'acc_created': False}
            except:
                print('save user exception : ', traceback.print_exc())
                resp = {'error': 'Account create failed..!', 'acc_created': False}
        else:
            resp = {'error': 'User with this contact number already exists, Please use another contact number!', 'acc_created': False}
            print('Invalid inputs..!', serializer.errors)
        return Response(resp)

    def get(self, request, pk, format=None):
        print('Getting user info : ', pk)
        try:
            user = UserModel.objects.get(id=pk)
            user_serializer = UserSerializerInfo(user)
            resp = {
                'user_info': user_serializer.data
            }
        except Exception as e:
            resp = {'resp': 'Operation fail..!'}
            print(e)
        return Response(resp)

    def patch(self, request, pk, format=None):
        print('changing profile info')
        try:
            user = UserModel.objects.get(id=pk)
            user.first_name = request.data.get('first_name')
            user.last_name = request.data.get('last_name')
            user.gender = request.data.get('gender')
            user.contact_number = request.data.get('contact_number')

            is_email_id_changed = False
            if user.email_id != request.data.get('email_id'):
                user.email_id = request.data.get('email_id')
                user.is_email_id_verified = False
                is_email_id_changed = True
            user.save()
            resp = {'resp': 'Profile information updated successfully...!', 'is_success': True, 'is_email_id_changed': is_email_id_changed}
        except IntegrityError as e:
            print('save user mysql Exception : ', e)
            resp = {'error': 'This email id or contact number already registered..! (Please use another one.)',
                    'is_success': False}
        except:
            print('save user exception : ', traceback.print_exc())
            resp = {'error': 'Change profile info failed..!', 'is_success': False}
        return Response(resp)


class VerifyUserEmailId(APIView):
    def get(self, request, uid, format=None):
        user = UserModel.objects.get(id=uid)
        user.is_email_id_verified = True
        user.save()
        response = redirect('http://localhost:4200/login/' + str(user.email_id))
        return response


class GetVerificationOTP(APIView):
    def get(self, request, to_email_id, format=None):
        count = UserModel.objects.filter(email_id=to_email_id, is_email_id_verified=True).count()
        if count == 0:
            return Response({'resp': f'Can NOT send OTP, {to_email_id} is not verified..!'})
        OTP = random.randint(10000, 99999)
        html_message = f"""\
                <html>
                <head></head>
                <body>
                    <h1>Working Professionals OTP for forgot password</h1><br>
                    <p>
                    OTP =  <b> {OTP} </b>
                    </p>
                </body>
                </html>
                """
        send_mail(html_message, to_email_id)
        resp = {'is_otp_sent': True, 'OTP': OTP}
        return Response(resp)


class SendVerificationEmail(APIView):
    def get(self, request, uid, format=None):
        user = UserModel.objects.get(id=uid)
        to = user.email_id
        html_message = f"""\
        <html>
        <head></head>
        <body>
            <h1>Working Professionals Email Verification Link</h1><br>
            <p>
            Click on <a href="http://127.0.0.1:8000/user_api/verify_email_id/{uid}/">verify</a> to verify your email id.
            </p>
        </body>
        </html>
        """
        send_mail(html_message, to)
        return Response({'resp': 'Verification mail sent sucessfully..!'})


class LoginAPI(APIView):
    def post(self, request, format=None):
        print(request.data)
        email_id = request.data.get('email_id')
        password = make_password(salt=key, password=request.data.get('password'))
        try:
            user = UserModel.objects.get(email_id=email_id, password=password)
            user_serializer = UserSerializerInfo(user)
            resp = {
                'is_valid': True,
                'user_id': user_serializer.data.get('id'),
                'first_name': user_serializer.data.get('first_name'),
                'last_name': user_serializer.data.get('last_name')
            }
        except Exception as e:
            resp = {'is_valid': False}
            print('Login exception : ', e)
        return Response(resp)


class ProfilePicAPI(APIView):
    def patch(self, request, pk, format=None):
        print('Changing profile pic..!')
        user = UserModel.objects.get(id=pk)
        try:
            if os.path.exists(user.profile_pic.path):  # delete old profile picture if exist.
                self.delete(request, pk)
        except Exception as e:
            print('No profile image found ', e)

        try:
            if request.data.get('profile_pic') != '':
                user.profile_pic = request.FILES['profile_pic']
            else:
                user.profile_pic = ''  # if no profile pic is selected..!
            user.save()
            resp = {'resp': 'Profile pic changed successfully...!', 'is_success': True}
        except Exception as e:
            resp = {'resp': 'Profile pic changing failed...!', 'is_success': False}
            print('Changing profile pic exception : ', e)
        return Response(resp)

    def delete(self, request, pk, format=None):
        try:
            user = UserModel.objects.get(id=pk)
            if os.path.exists(user.profile_pic.path):
                os.remove(user.profile_pic.path)
            resp = {'resp': 'Profile pic deleted successfully..!', 'is_success': True}
        except:
            print('save user exception : ', traceback.print_exc())
            resp = {'error': 'No profile pic found for delete..!', 'is_success': True}
        return Response(resp)


class ChanegePasswordAPI(APIView):
    def patch(self, request, pk=None, email_id=None):
        print('changing password..! = ', pk)
        new_password = make_password(salt=key, password=request.data.get('new_password'))
        try:
            old_password = make_password(salt=key, password=request.data.get('old_password'))
            user = UserModel.objects.get(id=pk, password=old_password)  # for changing password

            user.password = new_password
            user.save()
            resp = {'resp': 'Password updated successfully...!', 'is_success': True}
        except Exception as e:
            print('change password exception : ', e)
            resp = {'error': 'Old password does not matched..!', 'is_success': False}
        return Response(resp)


class ChanegePasswordByEmail(APIView):
    def patch(self, request, format=None):
        email_id = request.data.get('user_email_id')
        print('changing password..! = ', email_id)
        try:
            user = UserModel.objects.get(email_id=email_id, is_email_id_verified=True)
            new_password = make_password(salt=key, password=request.data.get('new_password'))
            user.password = new_password
            user.save()
            resp = {'resp': 'Password updated successfully...!', 'is_password_updated': True}
        except Exception as e:
            print('change password exception : ', e)
            resp = {'error': 'User with verified email id NOT fount', 'is_success': False}
        return Response(resp)


class MessageToUser(APIView):
    def get(self, request, msg_to_uid, format=None):
        try:
            user = UserModel.objects.get(id=msg_to_uid)
            user_serializer = MsgToUserSerializer(user)
            resp = {
                'resp': user_serializer.data
            }
        except Exception as e:
            resp = {'resp': 'Operation fail..!'}
            print(e)
        return Response(resp)


# class UserContactList(APIView):
#     def get(self,request,uid,format=None):
#         users = MessageModel.objects.filter(Q(msg_from=uid) | Q(msg_to=uid))
#         serializer = UserContactListSerializer(users,many=True)
#         dict = {}
#         for data in serializer.data:
#             if data.get('msg_from_id') != uid:
#                 if data.get('msg_from_id') != uid:
#                     obj = {
#                         'fist_name': data.get('from_first_name'),
#                         'last_name': data.get('from_last_name'),
#                         'profile_pic': data.get('from_profile_pic'),
#                         'business_title': data.get('from_business_title'),
#                     }
#                 else:
#                     obj = {
#                         'fist_name': data.get('to_first_name'),
#                         'last_name': data.get('to_last_name'),
#                         'profile_pic': data.get('to_profile_pic'),
#                         'business_title': data.get('to_business_title'),
#                     }
#                 dict[data.get('msg_from_id')] = obj

#         resp={'resp':dict}
#         return Response(resp)

class UserContactList(APIView):
    def post(self, request, format=None):
        serializer = UserContactListSaveSerializer(data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                resp = {'resp': 'User is added to contact list successfully..!'}
            else:
                resp = {'resp': 'user already in contact list' + serializer.errors}
        except Exception as e:
            print(e)
            resp = {'resp': e}
        return Response(resp)

    def get(self, request, uid, format=None):
        users = UserContactListModel.objects.filter(user=uid)
        serializer = UserContactListSerializer(users, many=True)
        resp = {'resp': serializer.data}
        return Response(resp)


class NewMsgCountForEachContact(APIView):
    def get(self, request, uid, format=None):
        msg_count = UserContactListModel.objects.filter(user_id=uid)
        serializer = NewMsgCountForEachContactSerializer(msg_count, many=True)
        resp = {'resp': serializer.data}
        return Response(resp)
