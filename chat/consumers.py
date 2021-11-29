from uuid import uuid4
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    groups = ['broadcast']

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.users = []

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        self.users.append(str(uuid4()))

        data = {
            'text': "new user connected",
            'channel_name': self.channel_name,
            'type': 'user',
            "users": self.users
        }
        await self.send(text_data=json.dumps(data))

    async def receive(self, text_data=None, bytes_data=None):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "text": text_data
            }
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
            'channel_name': self.channel_name,
            'type': 'send_text',
            "users": self.users
        }
        await self.send(text_data=json.dumps(data))
