from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Task


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds user details to token claims and login response."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
        }
        return data


class RegisterSerializer(serializers.ModelSerializer):
    """Handles user registration with password confirmation."""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError('Email is required.')
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Read-only user info returned with auth responses."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class TaskSerializer(serializers.ModelSerializer):
    """Full task serializer — user is read-only (set from request)."""

    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Task
        fields = (
            'id', 'user', 'title', 'description',
            'status', 'priority', 'due_date',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title cannot be blank.')
        return value.strip()

    def validate_status(self, value):
        valid = [c[0] for c in Task.Status.choices]
        if value not in valid:
            raise serializers.ValidationError(
                f'Invalid status. Must be one of: {", ".join(valid)}'
            )
        return value

    def validate_priority(self, value):
        valid = [c[0] for c in Task.Priority.choices]
        if value not in valid:
            raise serializers.ValidationError(
                f'Invalid priority. Must be one of: {", ".join(valid)}'
            )
        return value
