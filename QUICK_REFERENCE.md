# 📋 Quick Reference Guide

Quick commands and common tasks for TaskFlow development.

---

## 🚀 Starting the Application

### Start Backend (Terminal 1)
```bash
cd backend
python manage.py runserver
# Or: daphne -b 0.0.0.0 -p 8000 config.asgi:application
```
→ Backend: http://127.0.0.1:8000/

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
→ Frontend: http://localhost:5173/

---

## 🗄️ Database Commands

### Create Database
```bash
mysql -u root -p
CREATE DATABASE taskflow_db;
EXIT;
```

### Run Migrations
```bash
cd backend
python manage.py migrate
```

### Create Superuser
```bash
cd backend
python manage.py createsuperuser
```
→ Access at: http://127.0.0.1:8000/admin/

### Reset Database
```bash
cd backend
python manage.py migrate zero tasks  # Reverse migrations
python manage.py migrate              # Reapply migrations
```

---

## 📦 Dependency Management

### Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Update Backend Dependencies
```bash
cd backend
pip freeze > requirements.txt
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Update Frontend Dependencies
```bash
cd frontend
npm update
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test tasks
```

### Run Specific Test
```bash
cd backend
python manage.py test tasks.tests.TaskViewSetTests.test_create_task
```

### Run Frontend Linter
```bash
cd frontend
npm run lint
```

---

## 🏗️ Building for Production

### Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder with optimized code
```

### Preview Production Build
```bash
cd frontend
npm run preview
# Test production build locally
```

### Run Backend with Daphne (ASGI - Production)
```bash
cd backend
pip install daphne
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

---

## 🔧 Troubleshooting Commands

### Check if Ports are in Use
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :8000
lsof -i :5173
```

### Kill Process Using Port
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Check Python Version
```bash
python --version
python -m pip --version
```

### Check Node Version
```bash
node --version
npm --version
```

### Verify MySQL is Running
```bash
mysql -u root -p -e "SELECT 1"
```

### Clear Python Cache
```bash
cd backend
find . -type d -name __pycache__ -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

---

## 🔑 Environment Setup

### Reset Environment Files
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend
cd frontend
cp .env.example .env
# (Usually no changes needed - default works)
```

---

## 📡 API Testing

### Get Auth Tokens
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_user","password":"your_pass"}'
```

### List Tasks (Replace TOKEN with actual token)
```bash
curl -X GET http://127.0.0.1:8000/api/tasks/ \
  -H "Authorization: Bearer TOKEN"
```

### Create Task
```bash
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Task",
    "description":"Task description",
    "status":"Pending",
    "priority":"High",
    "due_date":"2026-12-31"
  }'
```

---

## 🌐 WebSocket Testing

### Check WebSocket Connection (Browser Console)
After logging in, open browser DevTools (F12) and check Console for:
```
WebSocket connected
Connection established...
```

### Test Real-Time Updates
1. Open app in 2 browser tabs
2. Create task in Tab 1
3. Watch it appear instantly in Tab 2

---

## 🐚 Useful Django Commands

```bash
cd backend

# Show database migrations
python manage.py showmigrations

# Make new migration
python manage.py makemigrations

# View SQL for migration
python manage.py sqlmigrate tasks 0001

# Check Django system
python manage.py check

# Access Django shell
python manage.py shell

# Run management command
python manage.py <command_name>
```

---

## 📚 Useful NPM Commands

```bash
cd frontend

# Check for outdated packages
npm outdated

# Audit for security vulnerabilities
npm audit

# Clear npm cache
npm cache clean --force

# Install specific package version
npm install package@version
```

---

## 🔄 Git Commands (Before Committing)

```bash
# Check git status
git status

# Add all changes
git add .

# Check for .env files
git check-ignore -v backend/.env frontend/.env

# Commit changes
git commit -m "Your message"

# Push to remote
git push origin main
```

---

## ⚡ Performance Optimization

### Frontend Build Size
```bash
cd frontend
npm run build  # See dist/ size
```

### Django Debug Toolbar (Optional)
```bash
cd backend
pip install django-debug-toolbar
# Add to INSTALLED_APPS in settings.py
```

---

## 📖 Documentation Links

- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Pro Tips

1. **Use `.env` for sensitive data** - Never commit API keys or passwords
2. **Keep virtual environment activated** - Especially in backend terminal
3. **Hot reload works** - Changes auto-refresh in both frontend and backend
4. **Check browser console** - Errors often show there first
5. **Check terminal logs** - Backend errors print to terminal
6. **Use Postman or Insomnia** - For testing API endpoints
7. **Test WebSocket separately** - Use browser DevTools Network tab

---

## 🆘 Emergency Commands

### Start Fresh (Nuclear Option)
```bash
# Backend
cd backend
rm -rf venv
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### Check Everything
```bash
# Backend health check
cd backend
python manage.py check

# Test one migration step
python manage.py migrate --fake-initial tasks
```

---

**Last Updated:** August 16, 2026

For detailed setup instructions, see **SETUP_INSTRUCTIONS.md**
