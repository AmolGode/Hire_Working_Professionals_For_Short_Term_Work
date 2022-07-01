# from user_api import views
from django.urls import path
from .views import *


urlpatterns = [
    path('save_user/',UserAPI.as_view()),
    path('get_user_info/<int:pk>/',UserAPI.as_view()),
    path('change_user_info/<int:pk>/',UserAPI.as_view()),
    path('login/',LoginAPI.as_view()),
    path('change_profile_pic/<int:pk>/',ProfilePicAPI.as_view()),
    path('delete_profile_pic/<int:pk>/',ProfilePicAPI.as_view()),
    path('change_password/<int:pk>/',ChanegePasswordAPI.as_view()),

    path('get_msg_to_user_info/<int:msg_to_uid>/',MessageToUser.as_view()),

    path('add_into_contact_list/',UserContactList.as_view()),
    path('get_contact_list/<int:uid>/',UserContactList.as_view()),
    path('get_new_msg_count_for_each_contact/<int:uid>/',NewMsgCountForEachContact.as_view()),
    path('send_varification_link/<int:uid>/', SendVerificationEmail.as_view()),
    path('verify_email_id/<int:uid>/', VerifyUserEmailId.as_view()),

    path('get_verification_otp/<str:to_email_id>/', GetVerificationOTP.as_view()),
    path('change_password_via_email/', ChanegePasswordByEmail.as_view()),
]