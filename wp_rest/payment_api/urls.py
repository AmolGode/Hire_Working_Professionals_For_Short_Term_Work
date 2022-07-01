from django.urls import path
from .views import *


urlpatterns = [
    path('get_payment_order_id/<int:wp_id>/<int:amount>/<str:reciept>/', Payment.as_view()),
    path('get_payments_history/<int:wp_id>/', PaymentHistory.as_view()),
    path('update_payment_order_status/', Payment.as_view()),
]
