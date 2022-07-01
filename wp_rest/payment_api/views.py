from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import razorpay
from server_data import PASSWORD_CREDENTIALS
from .serializers import *
from wp_api.models import BusinessAccountModel
from subscription_plans_api.serializers import WpBusiAcc_Sub_plansModelSerializer
from datetime import datetime
from datetime import timedelta

# Create your views here.


class Payment(APIView):
    def get(self, request, wp_id, amount, reciept, format=None):
        client = razorpay.Client(auth=(PASSWORD_CREDENTIALS.RAZORPAY_ID, PASSWORD_CREDENTIALS.RAZORPAY_SECRET_ID))
        DATA = {
            "amount": amount * 100,
            "currency": "INR",
            "receipt": reciept
        }
        order = client.order.create(data=DATA)
        resp = {'resp': order}
        payment = {
            'order_id': order.get('id'),
            'amount': amount,
            'status': 'Created',
            'business_account': wp_id
        }
        payment_ser = PaymentSerializer(data=payment)
        if payment_ser.is_valid():
            payment_ser.save()
        else:
            return Response({'resp': payment_ser.errors})
        return Response(resp)

    def patch(self, request, format=None):
        order_id = request.data.get('order_id')
        status = request.data.get('status')
        try:
            payment = PaymentHistoryModel.objects.get(order_id=order_id)
            if status != 'Failed':  # Payment Paid
                payment.payment_id = request.data.get('payment_id')
                payment.days_added = request.data.get('days_added')
                busi_acc = BusinessAccountModel.objects.get(id=request.data.get('business_account_id'))
                subscription_expiry_date = busi_acc.subscription_expiry_date

                if subscription_expiry_date is None:
                    subscription_expiry_date = datetime.today().strftime('%Y-%m-%d')
                    expiration_date = datetime.strptime(str(subscription_expiry_date), "%Y-%m-%d")
                else:
                    expiration_date = datetime.strptime(str(subscription_expiry_date), "%Y-%m-%d")

                if expiration_date >= datetime.today():
                    new_subscription_expiry_date = expiration_date + timedelta(days=int(request.data.get('days_added')))
                else:
                    new_subscription_expiry_date = datetime.today() + timedelta(days=int(request.data.get('days_added')))
                busi_acc.subscription_expiry_date = new_subscription_expiry_date

                busi_sub = {
                    'business_account': request.data.get('business_account_id'),
                    'subscription_plan': request.data.get('subscription_plan_id')
                }
                serializer = WpBusiAcc_Sub_plansModelSerializer(data=busi_sub)
                if serializer.is_valid():
                    serializer.save()
                else:
                    print(serializer.errors)

                busi_acc.save()
            payment.status = request.data.get('status')
            payment.save()
            resp = {'resp': 'Payment status updated..!'}
        except Exception as e:
            print(e)
            resp = {'resp': 'Payment updation failed..!'}
        return Response(resp)


class PaymentHistory(APIView):
    def get(self, request, wp_id, format=None):
        payments = PaymentHistoryModel.objects.filter(business_account_id=wp_id).order_by('-id')
        serializer = PaymentSerializer(payments, many=True)
        resp = {'resp': serializer.data}
        return Response(resp)
