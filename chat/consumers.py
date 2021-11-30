from uuid import uuid4
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    groups = ['broadcast']

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def receive(self, text_data=None):
        data = json.loads(text_data)

        options = {
            "type": "chat_message",
            "text": data['text'],
            'username': data['username']
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            options
        )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        data = {
            'text': event['text'],
            'username': event['username']
        }
        await self.send(text_data=json.dumps(data))
