from django.urls import path
from .views import *


urlpatterns = [
    path('create_wp_business_account/',BusinessAccount.as_view()),
    path('get_wp_business_account_info/<int:user_id>/',BusinessAccount.as_view()),
    path('update_wp_business_account/<int:pk>/',BusinessAccount.as_view()),
    path('delete_wp_business_account/<int:pk>/',BusinessAccount.as_view()),

    path('add_wp_profession_tag/',ProfessionTags.as_view()),
    path('get_wp_profession_tags/<int:wp_busi_acc_id>/',ProfessionTags.as_view()),
    path('delete_wp_profession_tag/<int:pk>/',ProfessionTags.as_view()),

    path('add_wp_service_area/',ServiceArea.as_view()),
    path('get_wp_service_areas/<int:wp_busi_acc_id>/',ServiceArea.as_view()),
    path('delete_wp_service_area/<int:pk>/',ServiceArea.as_view()),

    path('add_wp_work_sample/',WorkSamples.as_view()),
    path('get_wp_work_samples/<int:wp_id>/',WorkSamples.as_view()),
    path('edit_wp_work_sample/<int:pk>/',WorkSamples.as_view()),
    path('delete_wp_work_sample/<int:pk>/',WorkSamples.as_view()),
    
    path('toggle_business_card_image/<int:pk>/',WorkSamplesSetBusinessCardImage.as_view()),

    path('get_all_distinct_cities/',AllCities.as_view()),
    path('get_all_distinct_tags/',AllProfessionTags.as_view()),
    path('get_business_account_info/<int:pk>/',GetBusinessAccountInfo.as_view()),

    path('add_feedback_for_wp/',Feedback.as_view()),
    path('get_wp_feedbacks/<int:business_account_id>/',Feedback.as_view()),

    path('get_wp_info/<int:pk>/',WPFullInfo.as_view()),
    path('reapplay_for_verification/', ReapplayVerification.as_view()),

]