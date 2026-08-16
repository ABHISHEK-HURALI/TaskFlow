from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Task
from .permissions import IsTaskOwner
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    TaskSerializer,
    UserSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain pair view returning user info."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Create a new user account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for the newly registered user
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'message': 'Registration successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class TaskViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for tasks — scoped to the authenticated user.

    Supports:
      - filtering by status and priority
      - search by title and description
      - ordering by due_date, created_at, priority
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return only tasks belonging to the logged-in user."""
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically assign the task to the logged-in user and notify via WebSocket."""
        task = serializer.save(user=self.request.user)
        self.notify_websocket('task_created', task)

    def perform_update(self, serializer):
        """Update task and notify via WebSocket."""
        task = serializer.save()
        self.notify_websocket('task_updated', task)

    def perform_destroy(self, instance):
        """Delete task and notify via WebSocket."""
        task_id = instance.id
        instance.delete()
        self.notify_websocket_delete(task_id, instance.user)

    def notify_websocket(self, action, task):
        """Send WebSocket notification to task owner."""
        try:
            channel_layer = get_channel_layer()
            user_group_name = f'user_{task.user.id}'
            serializer = TaskSerializer(task)

            async_to_sync(channel_layer.group_send)(
                user_group_name,
                {
                    'type': f'task.{action.split("_")[1]}',
                    'task': serializer.data,
                }
            )
        except Exception as e:
            print(f'WebSocket notification error: {e}')

    def notify_websocket_delete(self, task_id, user):
        """Send WebSocket notification for task deletion."""
        try:
            channel_layer = get_channel_layer()
            user_group_name = f'user_{user.id}'

            async_to_sync(channel_layer.group_send)(
                user_group_name,
                {
                    'type': 'task.deleted',
                    'task_id': task_id,
                }
            )
        except Exception as e:
            print(f'WebSocket notification error: {e}')
