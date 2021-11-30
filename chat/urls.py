from django.urls import path

from .views import MainPageView, ChatView

urlpatterns = [
    path('', MainPageView.as_view(), name="main-page"),
    path('<str:room_name>', ChatView.as_view(), name="chat"),
]
