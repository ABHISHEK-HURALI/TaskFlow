from rest_framework import permissions


class IsTaskOwner(permissions.BasePermission):
    """Only allow the owner of a task to view or modify it."""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
