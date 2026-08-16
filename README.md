# TaskFlow — Full-Stack Task Management Application

> **"Organize your work. Track your progress."**

<p align="center">
  <img src="frontend/src/assets/hero.png" alt="TaskFlow Dashboard" width="900" />
</p>

TaskFlow is a production-quality full-stack web application designed for creating, tracking, organizing, and managing tasks. Built with a **React + Vite** frontend and a **Django REST Framework** backend powered by **MySQL 8.0**, it features secure JWT authentication, strict owner-based data isolation, real-time filtering, search, sorting, dynamic dashboard analytics, and **WebSocket-powered real-time updates**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (5 minutes)](#quick-start-5-minutes)
  - [Detailed Setup](#detailed-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Real-Time Updates (WebSocket)](#real-time-updates-websocket)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Features

✅ **JWT Authentication & Authorization** - Secure user registration, login, token refresh, and logout  
✅ **Strict Data Isolation** - Users only access their own tasks  
✅ **Complete Task CRUD** - Create, read, update, delete with full control  
✅ **Real-Time Updates** - WebSocket support for instant task synchronization across tabs/devices  
✅ **Dynamic Dashboard** - Real-time statistics for Total, Pending, In-Progress, Completed, and Overdue tasks  
✅ **Smart Search & Filtering** - Keyword search, status/priority filters, sorting  
✅ **Responsive UI** - Mobile, tablet, and desktop optimized  
✅ **Production Ready** - Error handling, validations, loading states, delete confirmations  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite, Tailwind CSS, React Router v7 |
| **Backend** | Python 3.14 + Django 5.2 LTS, Django REST Framework |
| **Real-Time** | Django Channels, WebSocket, Channel Layers |
| **Database** | MySQL 8.0 |
| **Authentication** | SimpleJWT (JSON Web Tokens) |

---

## Getting Started

### Prerequisites

Make sure you have installed:
- **Python 3.10+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** — [Download](https://git-scm.com/)

---

## Quick Start (5 minutes)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-application

# Setup Backend
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# In a new terminal: Setup Frontend
cd frontend
npm install
npm run dev
```

**That's it!** Open http://localhost:5173/ and start using the app.

---

## Detailed Setup

### 1. Database Setup (MySQL)

```bash
# Open MySQL
mysql -u root -p

# Create database
CREATE DATABASE taskflow_db;
CREATE USER 'taskflow_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON taskflow_db.* TO 'taskflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Or use the default (in `.env.example`):
```
DB_USER=root
DB_PASSWORD=Abhi#25
DB_NAME=taskflow_db
```

### 2. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Copy environment file
cp .env.example .env

# Edit .env and set your database credentials
# Key variables:
# - DB_NAME=taskflow_db
# - DB_USER=root
# - DB_PASSWORD=your_password
# - DB_HOST=localhost
# - DB_PORT=3306

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates database tables)
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
# Server runs at http://127.0.0.1:8000/
```

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
# Copy .env.example to .env if you want custom API URL
cp .env.example .env
# Default API URL: http://localhost:8000/api

# Start development server
npm run dev
# Frontend runs at http://localhost:5173/
```

---

## Environment Variables

### Backend (`.env`)

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database (MySQL)
DB_NAME=taskflow_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# CORS (Frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Running the Application

### Start Backend

```bash
cd backend
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000/`

### Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173/`

### Both Running?

- **Frontend:** http://localhost:5173/ ✅
- **Backend API:** http://127.0.0.1:8000/api/ ✅
- **WebSocket:** ws://localhost:8000/ws/tasks/ ✅

---

## Real-Time Updates (WebSocket)

The application includes **WebSocket support** for real-time task synchronization!

### How It Works:

1. User logs in (JWT token obtained)
2. Frontend automatically connects to WebSocket
3. Any task change (create/update/delete) is broadcast to all open tabs
4. Updates appear instantly without page refresh

### Testing Real-Time Updates:

1. Open the app in **2 browser tabs** side-by-side
2. Create/Edit/Delete a task in **Tab 1**
3. Watch it appear instantly in **Tab 2**! 🚀

### Troubleshooting WebSocket:

- Check browser console for connection errors
- Ensure backend is running on port 8000
- Verify `CORS_ALLOWED_ORIGINS` in `.env`
- If using Redis, make sure Redis service is running (or in-memory fallback will be used)

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | Login (get JWT tokens) |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `POST` | `/api/auth/logout/` | Logout |

### Tasks (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks/` | List user's tasks |
| `POST` | `/api/tasks/` | Create new task |
| `GET` | `/api/tasks/{id}/` | Get task details |
| `PUT` | `/api/tasks/{id}/` | Update task (full) |
| `PATCH` | `/api/tasks/{id}/` | Partial update (status/priority) |
| `DELETE` | `/api/tasks/{id}/` | Delete task |

### Query Parameters (Filtering & Sorting)

```
GET /api/tasks/?status=Pending&priority=High&search=urgent&ordering=-due_date
```

- `status` — Filter by status (Pending, In Progress, Completed)
- `priority` — Filter by priority (Low, Medium, High)
- `search` — Search by title or description
- `ordering` — Sort by field (-created_at, due_date, priority, etc.)
- `page_size` — Items per page (default: 50)

---

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
# Creates optimized build in dist/
npm run preview  # Preview production build locally
```

### Backend Production

```bash
# Use a production WSGI server (e.g., Gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 config.wsgi

# For WebSocket support, use Daphne (ASGI server)
pip install daphne
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

---

## Troubleshooting

### "Cannot find module" or Dependencies Missing

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### MySQL Connection Error

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE taskflow_db;`

### Port Already in Use

```bash
# Find process using port 8000 (Backend)
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000

# Kill and restart
```

### WebSocket Connection Failed

- Ensure backend is running on http://localhost:8000
- Check browser console for errors
- Verify frontend is trying to connect (check Network tab)

### "No such table" Error

```bash
cd backend
python manage.py migrate
```

### CORS Error

Check `CORS_ALLOWED_ORIGINS` in `backend/.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## Project Structure

```
task-management-application/
├── backend/
│   ├── config/
│   │   ├── settings.py         # Django settings & configuration
│   │   ├── asgi.py             # ASGI app (WebSocket support)
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI entrypoint
│   ├── tasks/
│   │   ├── models.py           # Task & User models
│   │   ├── views.py            # API ViewSets
│   │   ├── serializers.py      # Data serialization
│   │   ├── permissions.py      # Custom permissions
│   │   ├── consumers.py        # WebSocket consumer
│   │   ├── routing.py          # WebSocket routing
│   │   └── tests.py            # Unit & integration tests
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                    # DO NOT COMMIT
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Auth context
│   │   ├── services/           # API & WebSocket services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env                    # DO NOT COMMIT
│
└── README.md
```

---

## Security Checklist

- ✅ JWT tokens for authentication
- ✅ User-isolated data (no data leaking between users)
- ✅ HTTPS ready for production
- ✅ Secret keys in environment variables
- ✅ CORS properly configured
- ✅ WebSocket authenticated

---

## License

MIT License — Feel free to use, modify, and distribute!

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Django/React documentation
3. Check terminal logs for errors

---

**Happy task managing! 🚀**
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state, tokens, login/logout, JWT decoding
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Main task dashboard with stats & task grid
│   │   │   ├── Landing.jsx     # Landing page with hero & features
│   │   │   ├── Login.jsx       # User login page
│   │   │   └── Register.jsx    # User registration page
│   │   ├── services/
│   │   │   └── api.js          # Axios client with auto JWT refresh interceptors
│   │   ├── App.jsx             # App routes (Public & Protected routes)
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS imports
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Vite config with proxy to backend
│   └── .env.example
│
├── scratch/
│   └── verify_e2e.py           # 25-step automated live end-to-end API verification
└── README.md
```

---

## Database Schema

### `tasks_task` Table

| Column | Type | Description |
|---|---|---|
| `id` | BigInt (Auto Increment, PK) | Unique identifier for each task |
| `user_id` | Int (Foreign Key -> auth_user) | Owner of the task (`ON DELETE CASCADE`) |
| `title` | VarChar(200) | Title of the task |
| `description` | LongText (Optional) | Detailed task description |
| `status` | VarChar(20) | `Pending`, `In Progress`, `Completed` |
| `priority` | VarChar(10) | `Low`, `Medium`, `High` |
| `due_date` | Date (Optional, Nullable) | Task deadline |
| `created_at` | DateTime (Auto Now Add) | Creation timestamp |
| `updated_at` | DateTime (Auto Now) | Last modified timestamp |

**Indexes**:
- `(user_id, status)` — for efficient status filtering
- `(user_id, priority)` — for priority-based queries
- `(user_id, due_date)` — for deadline lookups and overdue calculation

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new user account | No |
| `POST` | `/api/auth/login/` | Log in and obtain JWT access + refresh tokens | No |
| `POST` | `/api/auth/refresh/` | Refresh expired access token | No |

#### Register Request Payload
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!"
}
```

#### Login Request Payload
```json
{
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

#### Login Response Payload
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Tasks (CRUD & Filtering)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks/` | List all tasks for current user | Bearer Token |
| `POST` | `/api/tasks/` | Create a new task | Bearer Token |
| `GET` | `/api/tasks/<id>/` | Retrieve single task | Bearer Token |
| `PUT` | `/api/tasks/<id>/` | Full update of a task | Bearer Token |
| `PATCH` | `/api/tasks/<id>/` | Partial update of a task | Bearer Token |
| `DELETE` | `/api/tasks/<id>/` | Delete a task | Bearer Token |

#### Query Parameters Supported:
- `status`: `Pending`, `In Progress`, `Completed` (e.g. `/api/tasks/?status=Pending`)
- `priority`: `Low`, `Medium`, `High` (e.g. `/api/tasks/?priority=High`)
- `search`: Search across title & description (e.g. `/api/tasks/?search=report`)
- `ordering`: Sort by field (`created_at`, `-created_at`, `due_date`, `-due_date`, `priority`)

---

## Getting Started

### Prerequisites

- **Python 3.10+** (tested on 3.14)
- **Node.js 18+** (tested on 24.19) & **npm**
- **MySQL Server 8.0+**

---

### 1. MySQL Database Setup

Log in to MySQL and create the database:
```sql
CREATE DATABASE IF NOT EXISTS taskflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Setup (Django)

1. Open PowerShell and navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Configure `.env` file:
   ```env
   SECRET_KEY=your-secure-secret-key
   DEBUG=True

   DB_NAME=taskflow_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306

   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

4. Apply database migrations:
   ```powershell
   python manage.py migrate
   ```

5. (Optional) Create a superuser for Django admin:
   ```powershell
   python manage.py createsuperuser
   ```

---

### 3. Frontend Setup (React)

1. Navigate to the frontend directory:
   ```powershell
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```powershell
   npm install
   ```

3. (Optional) Configure `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

---

## Running the Application

### Option A: Run Both Simultaneously in Separate Terminals

#### Terminal 1 — Backend (Django REST API):
```powershell
cd backend
python manage.py runserver 8000
```
API will run at `http://127.0.0.1:8000/`

#### Terminal 2 — Frontend (Vite Dev Server):
```powershell
cd frontend
npm run dev
```
Web app will run at `http://localhost:5173/`

---

## Testing & Verification

### 1. Backend Unit & Integration Tests
Run the comprehensive 21-test Django test suite:
```powershell
cd backend
python manage.py test
```
**Output**: `Ran 21 tests in ~4s. OK`

### 2. Live End-to-End API Verification
Run the 25-step automated live API verification against the running server:
```powershell
python scratch/verify_e2e.py
```
**Verification results**:
- `Registration validation`: Rejected mismatched password & invalid email
- `User Alpha`: Registered and received JWT token pair
- `Login validation`: Rejected bad credentials (401)
- `Token refresh`: Refreshed access token successfully
- `CRUD`: Created 3 tasks, retrieved single task, full updated (PUT), partial updated (PATCH)
- `User Beta`: Registered separate account and created private task
- `Security / Isolation`: User Beta blocked with 404 from viewing, modifying, or deleting User Alpha's task
- `Filters`: Verified `?status=Completed` and `?priority=Medium`
- `Search`: Verified `?search=keyword`
- `Ordering`: Verified `?ordering=due_date`
- `Delete`: Deleted task with 204 No Content

### 3. Frontend Production Build
```powershell
cd frontend
npm run build
```
**Output**: `✓ built in ~400ms` without warnings or errors.

---

## Postman Testing Guide

1. Open **Postman**.
2. **Register**:
   - `POST http://127.0.0.1:8000/api/auth/register/`
   - Body (JSON):
     ```json
     {
       "username": "developer",
       "email": "dev@example.com",
       "password": "Password123!",
       "confirm_password": "Password123!"
     }
     ```
3. **Login**:
   - `POST http://127.0.0.1:8000/api/auth/login/`
   - Copy the `"access"` token from the response.
4. **Create Task**:
   - `POST http://127.0.0.1:8000/api/tasks/`
   - Headers: `Authorization: Bearer <YOUR_ACCESS_TOKEN>`
   - Body (JSON):
     ```json
     {
       "title": "Finish Project Documentation",
       "description": "Complete README with setup instructions",
       "status": "In Progress",
       "priority": "High",
       "due_date": "2026-08-20"
     }
     ```
5. **Get Tasks with Filters**:
   - `GET http://127.0.0.1:8000/api/tasks/?status=In+Progress&priority=High`
   - Headers: `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

---

## Security & Authorization

1. **Backend-Enforced Authorization**: The backend querysets are strictly scoped using `Task.objects.filter(user=self.request.user)`. Even if an unauthorized user guesses another user's task ID, DRF returns `404 Not Found`.
2. **Permission Classes**: `IsAuthenticated` and `IsTaskOwner` are enforced on all task endpoints.
3. **Password Security**: Django's built-in password validators enforce secure passwords with PBKDF2 hashing.
4. **Token Security**: JWT tokens are signed using the backend's secret key and rotated securely.
