from channels.routing import URLRouter
from django.conf.urls import url

from .consumers import ChatConsumer


websocket_urls = URLRouter([
    url(r"^chat/(?P<room_name>\w+)$", ChatConsumer.as_asgi()),
])


