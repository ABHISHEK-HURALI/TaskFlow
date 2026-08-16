import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from .models import Task
from .serializers import TaskSerializer


class TaskConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time task updates.
    Handles task creation, updates, deletion, and notifies all connected clients.
    """

    async def connect(self):
        """Accept WebSocket connection after authentication."""
        try:
            # Get the token from query parameters
            query_string = self.scope.get('query_string', b'').decode()
            params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
            token = params.get('token')

            if not token:
                await self.close()
                return

            # Verify token and get user
            self.user = await self.get_user_from_token(token)
            if not self.user:
                await self.close()
                return

            # Accept connection
            await self.accept()
            
            # Add to group for this user
            self.user_group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(self.user_group_name, self.channel_name)

            # Send initial connection message
            await self.send(
                text_data=json.dumps({
                    'type': 'connection_established',
                    'message': 'Connected to task updates',
                    'user_id': self.user.id,
                })
            )
        except Exception as e:
            print(f'WebSocket connection error: {e}')
            await self.close()

    async def disconnect(self, close_code):
        """Remove from group when disconnected."""
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'task_created':
                await self.handle_task_created(data)
            elif action == 'task_updated':
                await self.handle_task_updated(data)
            elif action == 'task_deleted':
                await self.handle_task_deleted(data)
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
        except Exception as e:
            await self.send_error(str(e))

    async def handle_task_created(self, data):
        """Broadcast task creation to user's group."""
        task_data = data.get('task')
        await self.channel_layer.group_send(
            self.user_group_name,
            {
                'type': 'task.created',
                'task': task_data,
            }
        )

    async def handle_task_updated(self, data):
        """Broadcast task update to user's group."""
        task_data = data.get('task')
        await self.channel_layer.group_send(
            self.user_group_name,
            {
                'type': 'task.updated',
                'task': task_data,
            }
        )

    async def handle_task_deleted(self, data):
        """Broadcast task deletion to user's group."""
        task_id = data.get('task_id')
        await self.channel_layer.group_send(
            self.user_group_name,
            {
                'type': 'task.deleted',
                'task_id': task_id,
            }
        )

    # Group event handlers
    async def task_created(self, event):
        """Send task creation event to WebSocket."""
        await self.send(
            text_data=json.dumps({
                'type': 'task_created',
                'task': event['task'],
            })
        )

    async def task_updated(self, event):
        """Send task update event to WebSocket."""
        await self.send(
            text_data=json.dumps({
                'type': 'task_updated',
                'task': event['task'],
            })
        )

    async def task_deleted(self, event):
        """Send task deletion event to WebSocket."""
        await self.send(
            text_data=json.dumps({
                'type': 'task_deleted',
                'task_id': event['task_id'],
            })
        )

    async def send_error(self, message):
        """Send error message to WebSocket."""
        await self.send(
            text_data=json.dumps({
                'type': 'error',
                'message': message,
            })
        )

    @database_sync_to_async
    def get_user_from_token(self, token):
        """Verify JWT token and return user object."""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return User.objects.get(id=user_id)
        except Exception:
            return None
