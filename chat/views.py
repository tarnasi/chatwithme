from django.shortcuts import render
from django.views.generic import View, TemplateView


class MainPageView(TemplateView):
    template_name = "chat/index.html"


class ChatView(View):

    def get(self, request, room_name):
        username = request.GET.get('username')
        context = {
            'room_name': room_name,
            'username': username,
        }
        return render(request, "chat/chat.html", context)
