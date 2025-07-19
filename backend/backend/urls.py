from django.urls import path
from api.views import signup, login, logout, upload_profile_image, upload_additional_photos, update_bio, update_preferences, swipe, match, unmatch, recommendations

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/',  login,  name='login'),
    path('logout/', logout, name='logout'),
    path('upload/main/', upload_profile_image, name='upload_profile_image'),
    path('upload/aux/', upload_additional_photos, name='upload_additional_photos'),
    path('edit/bio/', update_bio, name='update_bio'),
    path('edit/preferences/', update_preferences, name='update_preferences'),
    path('swipe/', swipe, name='swipe'),
    path('match/', match, name='match'),
    path('unmatch/', unmatch, name='unmatch'),
    path('recommend/', recommendations, name='recommend_users'),
]