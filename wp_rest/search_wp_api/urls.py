from django.urls import path
from .views import *


urlpatterns = [
    path('search_working_professionals/',SearchWorkingProgessionals.as_view()),
]