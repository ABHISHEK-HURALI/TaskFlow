from datetime import date, timedelta
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Task


class AuthenticationTests(APITestCase):
    """Tests for registration, login, token refresh, and auth security."""

    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'SecurePassword123!',
            'confirm_password': 'SecurePassword123!',
        }

    def test_registration_success(self):
        """User can register with valid credentials and receives JWT tokens."""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'testuser@example.com')
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_registration_mismatched_password(self):
        """Registration fails if passwords do not match."""
        data = self.user_data.copy()
        data['confirm_password'] = 'DifferentPassword123!'
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

    def test_registration_duplicate_username(self):
        """Registration fails if username is already taken."""
        User.objects.create_user(username='testuser', email='other@example.com', password='Password123!')
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_registration_duplicate_email(self):
        """Registration fails if email is already taken."""
        User.objects.create_user(username='otheruser', email='testuser@example.com', password='Password123!')
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_login_success(self):
        """User can log in with valid credentials and receive tokens & user info."""
        User.objects.create_user(username='testuser', email='test@example.com', password='Password123!')
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'Password123!'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_login_invalid_credentials(self):
        """Login fails with incorrect password."""
        User.objects.create_user(username='testuser', email='test@example.com', password='Password123!')
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'WrongPassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        """Access token can be refreshed with a valid refresh token."""
        user = User.objects.create_user(username='testuser', email='test@example.com', password='Password123!')
        refresh = RefreshToken.for_user(user)
        response = self.client.post(self.refresh_url, {'refresh': str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class TaskAPITests(APITestCase):
    """Comprehensive tests for Task CRUD, filtering, search, ordering, and user isolation."""

    def setUp(self):
        # Create User A and User B
        self.user_a = User.objects.create_user(username='usera', email='usera@example.com', password='Password123!')
        self.user_b = User.objects.create_user(username='userb', email='userb@example.com', password='Password123!')

        # Create tasks for User A
        self.task_a1 = Task.objects.create(
            user=self.user_a,
            title='Learn Django REST Framework',
            description='Build REST APIs with Django',
            status=Task.Status.PENDING,
            priority=Task.Priority.HIGH,
            due_date=date.today() + timedelta(days=2),
        )
        self.task_a2 = Task.objects.create(
            user=self.user_a,
            title='Setup MySQL Database',
            description='Configure database settings in Django',
            status=Task.Status.IN_PROGRESS,
            priority=Task.Priority.MEDIUM,
            due_date=date.today() + timedelta(days=5),
        )
        self.task_a3 = Task.objects.create(
            user=self.user_a,
            title='Deploy Frontend with Vite',
            description='Build and test React frontend',
            status=Task.Status.COMPLETED,
            priority=Task.Priority.LOW,
            due_date=date.today() - timedelta(days=1),
        )

        # Create task for User B
        self.task_b = Task.objects.create(
            user=self.user_b,
            title='Secret Task of User B',
            description='Confidential data',
            status=Task.Status.PENDING,
            priority=Task.Priority.HIGH,
            due_date=date.today() + timedelta(days=3),
        )

        self.list_create_url = reverse('task-list')

    def test_unauthenticated_access_denied(self):
        """Unauthenticated requests must receive 401 Unauthorized."""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tasks_only_returns_owners_tasks(self):
        """Logged-in user can only see their own tasks."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated or direct results
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 3)
        task_titles = [t['title'] for t in results]
        self.assertIn('Learn Django REST Framework', task_titles)
        self.assertIn('Setup MySQL Database', task_titles)
        self.assertIn('Deploy Frontend with Vite', task_titles)
        self.assertNotIn('Secret Task of User B', task_titles)

    def test_create_task_assigns_authenticated_user(self):
        """Creating a task automatically associates it with the authenticated user."""
        self.client.force_authenticate(user=self.user_a)
        data = {
            'title': 'New Task from Test',
            'description': 'Description for new task',
            'status': 'Pending',
            'priority': 'High',
            'due_date': str(date.today() + timedelta(days=7)),
        }
        response = self.client.post(self.list_create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Task from Test')
        self.assertEqual(response.data['user'], 'usera')
        
        # Verify in database
        task = Task.objects.get(id=response.data['id'])
        self.assertEqual(task.user, self.user_a)

    def test_retrieve_task_success(self):
        """User can retrieve their own task by ID."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_a1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.task_a1.id)
        self.assertEqual(response.data['title'], self.task_a1.title)

    def test_update_task_put(self):
        """User can perform a full update (PUT) on their own task."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_a1.id})
        data = {
            'title': 'Updated Title',
            'description': 'Updated Description',
            'status': 'Completed',
            'priority': 'Low',
            'due_date': str(date.today() + timedelta(days=10)),
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
        self.assertEqual(response.data['status'], 'Completed')

    def test_partial_update_task_patch(self):
        """User can perform a partial update (PATCH) on their own task."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_a1.id})
        data = {'status': 'Completed'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Completed')
        self.assertEqual(response.data['title'], self.task_a1.title)

    def test_delete_task(self):
        """User can delete their own task."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_a1.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task_a1.id).exists())

    def test_cross_user_access_blocked_retrieve(self):
        """User A cannot retrieve User B's task (returns 404)."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_b.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cross_user_access_blocked_update(self):
        """User A cannot update User B's task."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_b.id})
        response = self.client.put(url, {'title': 'Hacked Title', 'status': 'Pending', 'priority': 'High'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Verify User B's task was not changed
        self.task_b.refresh_from_db()
        self.assertEqual(self.task_b.title, 'Secret Task of User B')

    def test_cross_user_access_blocked_delete(self):
        """User A cannot delete User B's task."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse('task-detail', kwargs={'pk': self.task_b.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Task.objects.filter(id=self.task_b.id).exists())

    def test_filter_by_status(self):
        """Filter tasks by status."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(self.list_create_url, {'status': 'Pending'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['status'], 'Pending')

    def test_filter_by_priority(self):
        """Filter tasks by priority."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(self.list_create_url, {'priority': 'High'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['priority'], 'High')

    def test_search_by_keyword(self):
        """Search tasks by keyword in title or description."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(self.list_create_url, {'search': 'MySQL'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Setup MySQL Database')

    def test_ordering_by_due_date(self):
        """Order tasks by due date."""
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(self.list_create_url, {'ordering': 'due_date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]['title'], 'Deploy Frontend with Vite')
