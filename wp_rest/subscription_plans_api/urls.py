from django.urls import path
from .views import *


urlpatterns = [
    path('get_all_subscription_plans/', SubscriptionPlans.as_view()),
]