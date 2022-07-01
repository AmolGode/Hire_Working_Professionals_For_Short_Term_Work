from urllib import request
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response
import os
from django.db.models import Avg, Count
# Create your views here.


class BusinessAccount(APIView):
    def post(self, request, format=None):
        serializers =  BusiAccSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            newly_added_wp_busi_acc_id = BusinessAccountModel.objects.latest('id').id
            resp = {'resp' : 'Working professionals account is created..!',
                    'is_sucess':True,
                    'newly_added_wp_busi_acc_id':newly_added_wp_busi_acc_id
                    }
        else:
            resp = {'error' : serializers.errors,'is_sucess':False}
            print(serializers.errors)
        return Response(resp)

    def get(self,request,user_id,format=None):
        try:
            busi_acc = BusinessAccountModel.objects.get(user_id=user_id)
            serializer = BusiAccSerializer(busi_acc)
            if serializer.data.get('subscription_expiry_date') is None:
                days_left = -1
            else:
                expiration_date = datetime.strptime(str(serializer.data.get('subscription_expiry_date')), "%Y-%m-%d")
                days_left = (expiration_date - datetime.today()).days + 1 # adding 1 day because it 1 day excluded
            resp = {'resp': serializer.data, 'have_busi_acc': True, 'days_left': days_left}
        except Exception as e:
            print('get wp business acc info Exception : ',e)
            resp = {'resp' : 'User does not have business account.','have_busi_acc':False}
        return Response(resp)

    def put(self,request,pk,format=None):
        try:
            busi_acc = BusinessAccountModel.objects.get(id=pk)
            busi_acc.business_title = request.data.get('business_title')
            busi_acc.business_description = request.data.get('business_description')
            busi_acc.note = request.data.get('note')
            busi_acc.status = request.data.get('status')

            busi_acc.save()
            resp={'resp':'Basic busines details is updated successfully..!','is_sucess':True}
        except Exception as e:
            print('Update Business Acount Exception = '+e)
            resp={'resp':'Basic busines details is updated Failed..!','is_sucess':False}
        return Response(resp)

    def delete(self,request,pk,format=None):
        work_samples = WorkSamplesModel.objects.filter(business_account=pk)
        for obj in work_samples:
            obj.delete()
        BusinessAccountModel.objects.get(id=pk).delete()
        resp = {'resp': 'Working Professional business account deleted successfully...!'}
        return Response(resp)


class ReapplayVerification(APIView):
    def patch(self, request, format=None):
        wp_id = request.data.get('wp_id')
        wp_busi_acc = BusinessAccountModel.objects.get(id=wp_id)
        wp_busi_acc.verification_status = 'Pending'
        wp_busi_acc.save()
        resp = {'resp': 'Your verification status is now changed to Pending.'}
        return Response(resp)


class ProfessionTags(APIView):
    def post(self,request,format=None):
        serializer = ProfessionTagsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            newly_added_tag_id = ProfessionTagsModel.objects.latest('id').id
            resp = {
                'resp':str(request.data.get('tag_name'))+' is added successfully..!',
                'is_success':True,
                'newly_added_tag_id':newly_added_tag_id
            }
        else:
            print(serializer.errors)
            resp = {'error':serializer.errors,'is_success':False}
        return Response(resp)

    def get(self,request,wp_busi_acc_id,format=None):
        p_tags = ProfessionTagsModel.objects.filter(business_account=wp_busi_acc_id)
        serializer = ProfessionTagsSerializer(p_tags,many=True)
        resp = {'resp':serializer.data}
        return Response(resp)

    def delete(self,request,pk,format=None):
        try:
            ProfessionTagsModel.objects.get(id=pk).delete()
            resp = {'resp':'Tag deleted successfully..!','is_deleted':True}
        except Exception as e:
            print(e)
            resp = {'resp':'Tag deleting failed..!','is_deleted':False}
        return Response(resp)


class ServiceArea(APIView):
    def post(self,request,format=None):
        serializer = ServiceAreasSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            newly_added_service_area_id = ServiceAreasModel.objects.latest('id').id
            resp = {
                'resp':str(request.data.get('city_name'))+' is added successfully..!',
                'is_success':True,
                'newly_added_service_area_id':newly_added_service_area_id
            }
        else:
            print(serializer.errors)
            resp = {'error':serializer.errors,'is_success':False}
        return Response(resp)

    def get(self,request,wp_busi_acc_id,format=None):
        p_tags = ServiceAreasModel.objects.filter(business_account=wp_busi_acc_id)
        serializer = ServiceAreasSerializer(p_tags,many=True)
        resp = {'resp':serializer.data}
        return Response(resp)

    def delete(self,request,pk,format=None):
        try:
            ServiceAreasModel.objects.get(id=pk).delete()
            resp = {'resp':'City from service area deleted successfully..!','is_deleted':True}
        except Exception as e:
            print(e)
            resp = {'resp':'deleting city from service area deleting failed..!','is_deleted':False}
        return Response(resp)


class WorkSamples(APIView):
    def post(self,request,format=None):
        serializer = WorkSamplesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            latest_work_sample = WorkSamplesModel.objects.latest('id')
            print(latest_work_sample)
            newly_added_work_sample_image = '/media/'+str(latest_work_sample.work_sample_image)
            newly_added_work_sample_id = latest_work_sample.id
            resp = {
                'resp':'Work sample is successfully added...!',
                'is_success':True,
                'newly_added_work_sample_id':newly_added_work_sample_id,
                'newly_added_work_sample_image':newly_added_work_sample_image
                }
        else:
            print(serializer.errors)
            resp = {'error':serializer.errors,'is_succeess':False}
        return Response(resp)

    def get(self,request,wp_id,format=None):
        work_samples = WorkSamplesModel.objects.filter(business_account=wp_id)
        serializer = WorkSamplesSerializer(work_samples,many=True)
        resp = {'resp':serializer.data}
        return Response(resp)

    
    def patch(self,request,pk,format=None):
        work_sample_description = request.data.get('work_sample_description')

        work_sample = WorkSamplesModel.objects.get(id=pk)
        try:
            if work_sample_description is not None:
                work_sample.work_sample_description = work_sample_description
                work_sample.save()
                resp = {'resp':'Work sample description updated successfully...!'}
            else:
                os.remove(work_sample.work_sample_image.path)
                work_sample.work_sample_image = request.data.get('work_sample_image')
                work_sample.save()
                resp = {'resp':'Work sample image updated successfully...!'}
        except Exception as e:
            resp = {'error':'Fail'}
            print(e)
        return Response(resp)


    def delete(self,request,pk,format=None):
        WorkSamplesModel.objects.get(id=pk).delete()
        resp = {'resp':'Work sample deleted seuucessfully..!'}
        return Response(resp)


class WorkSamplesSetBusinessCardImage(APIView):
    def patch(self,request,pk,format=None):
        wp_business_account_id = request.data.get('wp_business_account_id')
        bool_value = request.data.get('bool_value')
        WorkSamplesModel.objects.filter(business_account=wp_business_account_id,is_business_card_image=True).update(is_business_card_image=False) #set all samples to false
        work_sample = WorkSamplesModel.objects.get(id=pk)
        work_sample.is_business_card_image = bool_value
        work_sample.save()
        if bool_value:
            resp = {'resp':'Image is selected as business card image sucessfully...!'}
        else:
            resp = {'resp':'Image is unselected as business card image sucessfully...!'}
        return Response(resp)

class AllCities(APIView):
    def get(self,request,format=None):
        all_cities = ServiceAreasModel.objects.all().values('city_name').distinct()
        serializer = ServiceAreasCityNamesSerializer(all_cities,many=True)
        resp = {'resp':serializer.data}
        return Response(resp)

class AllProfessionTags(APIView):
    def get(self,request,format=None):
        all_tags = ProfessionTagsModel.objects.all().values('tag_name').distinct()
        serializer = ProfessionTagsNameSerializer(all_tags,many=True)
        resp = {'resp':serializer.data}
        return Response(resp)

# class SearchWorkingProgessionals(APIView):
#     def post(self,request,format=None):
#         tags = request.data.get('tag_arr')
#         city_name = request.data.get('city_name')
#         tags_list = tags.split(',')
#         ws = WorkSamplesModel.objects.filter(business_account__serviceareasmodel__city_name=city_name,
#         business_account__professiontagsmodel__tag_name__in=tags_list,
#         is_business_card_image=True).distinct()
#         serializer = SearchWorkingProfessionalsSerializer(ws,many=True)
#         resp = {'resp':serializer.data}
#         for data in serializer.data:
#             feedback = FeedbackModel.objects.filter(business_account=data.get('business_account_id'))
#             fed_ser = FeedbackSerializer(feedback,many=True)
#             data['feedback'] = fed_ser.data
#         return Response(resp)

class GetBusinessAccountInfo(APIView):
    def get(self,request,pk,format=None):
        try:
            busi_acc = BusinessAccountModel.objects.get(id=pk)
            serializer = BusiAccSerializer(busi_acc)
            resp = {'resp' :serializer.data,'have_busi_acc':True}
        except Exception as e:
            print('get wp business acc info Exception : ',e)
            resp = {'resp' : 'User does not have business account.','have_busi_acc':False}
        return Response(resp)


class Feedback(APIView):
    def post(self,request,format=None):
        serializer = FeedbackSaveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            new_feedback = FeedbackModel.objects.latest('id')
            new_ser = FeedbackSerializer(new_feedback)
            resp = {'resp':'feedback is added successfully..!','new_feedback':new_ser.data}
        else:
            resp = {'resp':'feedback adding failed..!','error':serializer.errors}
        return Response(resp)

    def get(self,request,business_account_id,format=None):
        feedbacks = FeedbackModel.objects.filter(business_account=business_account_id).order_by('-id')
        serializer = FeedbackSerializer(feedbacks,many=True)
        resp = {'resp' :serializer.data}
        return Response(resp)



class WPFullInfo(APIView):
    def get(self,request,pk,format=None):
        full_profile = BusinessAccountModel.objects.get(id=pk)
        serializer = WPFullInfoSerializer(full_profile)
        resp = {'resp':serializer.data}
        print(resp)
        return Response(resp)