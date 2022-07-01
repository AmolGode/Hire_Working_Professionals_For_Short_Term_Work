from django.urls import path
from .views import *


urlpatterns = [
    path('send_message/',Message.as_view()),
    path('get_message/<int:uid1>/<int:uid2>/',Message.as_view()),
    path('get_unread_messages/<int:uid1>/<int:uid2>/',UnreadMessage.as_view()),
    path('get_notiication_count/<int:uid>/',NewMsgCount.as_view()),
]