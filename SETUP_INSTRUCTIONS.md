# 🚀 Setup Instructions - TaskFlow

Complete step-by-step guide to get TaskFlow running on your machine.

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Python 3.10+**
   ```bash
   python --version
   ```
   [Download Python](https://www.python.org/downloads/)

2. **Node.js 18+**
   ```bash
   node --version
   npm --version
   ```
   [Download Node.js](https://nodejs.org/)

3. **MySQL 8.0+**
   ```bash
   mysql --version
   ```
   [Download MySQL](https://dev.mysql.com/downloads/mysql/)

4. **Git**
   ```bash
   git --version
   ```
   [Download Git](https://git-scm.com/)

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>
cd task-management-application
```

---

## 🗄️ Step 2: Database Setup (MySQL)

### Option A: Using MySQL CLI (Recommended)

```bash
# Open MySQL in terminal
mysql -u root -p
# Enter your MySQL root password

# Run these SQL commands:
CREATE DATABASE taskflow_db;
CREATE USER 'taskflow_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON taskflow_db.* TO 'taskflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Option B: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Create new schema: `taskflow_db`
3. Create new user: `taskflow_user` with password `secure_password_123`
4. Grant all privileges

### Option C: Using Default Credentials (Quick Start)

The `.env.example` includes defaults. Just ensure MySQL is running and the database is created:

```bash
mysql -u root -p
CREATE DATABASE taskflow_db;
EXIT;
```

---

## ⚙️ Step 3: Backend Setup (Django + Django REST Framework)

### 3.1 Navigate to backend directory

```bash
cd backend
```

### 3.2 Create virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3.3 Copy environment file

```bash
# Copy the example environment file
copy .env.example .env          # Windows
# or
cp .env.example .env            # macOS/Linux
```

### 3.4 Edit `.env` with your configuration

Open `backend/.env` in your text editor and update:

```env
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True

# Database (MySQL) - Use your credentials from Step 2
DB_NAME=taskflow_db
DB_USER=root
DB_PASSWORD=Abhi#25  # or your MySQL root password
DB_HOST=localhost
DB_PORT=3306

# CORS - Allow frontend URL
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Django
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3.5 Install dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Django 5.2
- Django REST Framework
- Django Channels (WebSocket)
- SimpleJWT (JWT authentication)
- mysqlclient (MySQL driver)
- And more...

### 3.6 Run database migrations

```bash
# This creates all database tables
python manage.py migrate
```

**Expected Output:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, tasks
Running migrations:
  Applying tasks.0001_initial... OK
```

### 3.7 Create superuser (Optional - for Django Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account. You can then access:
- Admin Panel: http://127.0.0.1:8000/admin/
- Login with your superuser credentials

### 3.8 Start the backend server

```bash
python manage.py runserver
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
August 16, 2026 - 17:13:35
Django version 5.2.17, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **Backend is now running at:** `http://127.0.0.1:8000/`

---

## 💻 Step 4: Frontend Setup (React + Vite)

### 4.1 Open a NEW terminal and navigate to frontend

```bash
# In a new terminal
cd frontend
```

**Important:** Keep the backend terminal running in the original terminal!

### 4.2 Copy environment file (Optional)

```bash
# Copy the example environment file
copy .env.example .env          # Windows
# or
cp .env.example .env            # macOS/Linux
```

The default `VITE_API_URL=http://localhost:8000/api` works fine.

### 4.3 Install dependencies

```bash
npm install
```

This installs:
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- And more...

**Time:** ~5-10 minutes depending on internet speed

### 4.4 Start the development server

```bash
npm run dev
```

**Expected Output:**
```
> frontend@0.0.0 dev
> vite

VITE v8.2.1  ready in 502 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Frontend is now running at:** `http://localhost:5173/`

---

## 🎉 Step 5: Access the Application

1. Open your browser
2. Navigate to: **http://localhost:5173/**
3. You should see the TaskFlow login page

### First Time Setup:
1. Click "Register" or "Sign Up"
2. Create a new account
3. Start creating tasks!

---

## 🌐 Verify Everything Works

### Check Backend API

Open in browser or curl:
```bash
curl http://127.0.0.1:8000/api/
```

You should see the DRF API root.

### Check Frontend

Open http://localhost:5173/ in browser

You should see the login/register page.

### Check WebSocket

Open browser DevTools (F12 → Console) after logging in.
You should see:
```
WebSocket connected
Connection established...
```

---

## 🧪 Test Real-Time Updates (WebSocket)

1. Open the app in **2 browser tabs** side-by-side
2. **Tab 1:** Create a new task
3. **Tab 2:** See the task appear instantly!

This proves WebSocket real-time updates are working! 🚀

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'X'"

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### Error: "Cannot connect to MySQL server"

Check:
1. MySQL service is running
   ```bash
   # Windows: Services app → MySQL80 (running?)
   # macOS: System Preferences → MySQL
   # Linux: sudo systemctl status mysql
   ```

2. Credentials in `.env` are correct
3. Database exists:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### Error: "Port 8000 already in use"

```bash
# Windows
netstat -ano | findstr :8000
# Then kill the process

# macOS/Linux
lsof -i :8000
# Then kill: kill -9 <PID>
```

### Error: "Port 5173 already in use"

```bash
# Change Vite port in frontend package.json
# Or kill the process:
# Windows: netstat -ano | findstr :5173
# macOS/Linux: lsof -i :5173
```

### Error: "No such table: tasks_task"

Run migrations:
```bash
cd backend
python manage.py migrate
```

### CORS Error in browser console

Update `CORS_ALLOWED_ORIGINS` in `backend/.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Then restart the backend server.

### WebSocket connection fails

- Check backend is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check browser console (F12) for error messages
- Try refreshing the page after logging in

---

## 📝 Environment Variables Reference

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Debug mode (True for dev) | `True` |
| `DB_NAME` | MySQL database name | `taskflow_db` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `Abhi#25` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend URLs | `http://localhost:5173` |
| `ALLOWED_HOSTS` | Allowed backend hosts | `localhost,127.0.0.1` |

### Frontend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

---

## 🚀 Running Both Servers

### Terminal 1 (Backend)
```bash
cd backend
python manage.py runserver
# Output: http://127.0.0.1:8000/
```

### Terminal 2 (Frontend)
```bash
cd frontend
npm run dev
# Output: http://localhost:5173/
```

### Both Running?
- ✅ Frontend: http://localhost:5173/
- ✅ Backend: http://127.0.0.1:8000/
- ✅ WebSocket: ws://localhost:8000/ws/tasks/

---

## 📚 Next Steps

1. **Create some tasks** - Get familiar with the UI
2. **Test real-time updates** - Open 2 tabs, create a task in one and see it in the other
3. **Explore the dashboard** - Check filters, search, and statistics
4. **Test on mobile** - The app is fully responsive

---

## 🎓 Learn More

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ❓ Need Help?

1. Check the **Troubleshooting** section above
2. Review terminal error messages carefully
3. Check Django logs: `backend/console output`
4. Check Browser logs: F12 → Console tab

---

## ✨ Success!

If everything is working, you should be able to:
- ✅ Login/Register
- ✅ Create tasks
- ✅ Edit tasks
- ✅ Delete tasks
- ✅ See real-time updates
- ✅ Search and filter tasks
- ✅ View task statistics

**Congratulations! TaskFlow is ready to use! 🎉**

---

**Version:** 1.0  
**Last Updated:** August 16, 2026  
**Maintained by:** TaskFlow Team
