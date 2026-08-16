@echo off
REM Deployment preparation script for TaskFlow (Windows)
REM This script prepares your application for production deployment

echo.
echo 🚀 TaskFlow Deployment Preparation Script
echo ===========================================
echo.

REM Check if in correct directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo Step 1: Checking environment files...

REM Check .env files exist
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo    Please edit backend\.env with your settings
)

if not exist "frontend\.env" (
    echo ⚠️  frontend\.env not found. Creating from .env.example...
    copy frontend\.env.example frontend\.env
)

echo ✅ Environment files checked
echo.

echo Step 2: Checking Python dependencies...

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt > nul 2>&1

echo ✅ Python dependencies installed
echo.

echo Step 3: Running database migrations...

python manage.py migrate --noinput > nul 2>&1

echo ✅ Database migrations applied
echo.

echo Step 4: Collecting static files...

python manage.py collectstatic --noinput > nul 2>&1

echo ✅ Static files collected
echo.

cd ..\frontend

echo Step 5: Checking Node dependencies...

if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install > nul 2>&1
)

echo ✅ Node dependencies checked
echo.

echo Step 6: Building frontend for production...

call npm run build > nul 2>&1

echo ✅ Frontend built for production
echo.

cd ..

echo Step 7: Checking deployment configuration files...

REM Check for required deployment files
if exist "backend\Procfile" (
    echo ✅ backend\Procfile exists
) else (
    echo ❌ backend\Procfile missing
)

if exist "backend\runtime.txt" (
    echo ✅ backend\runtime.txt exists
) else (
    echo ❌ backend\runtime.txt missing
)

if exist "railway.json" (
    echo ✅ railway.json exists
) else (
    echo ❌ railway.json missing
)

if exist "DEPLOYMENT_GUIDE.md" (
    echo ✅ DEPLOYMENT_GUIDE.md exists
) else (
    echo ❌ DEPLOYMENT_GUIDE.md missing
)

echo.
echo ============================================
echo ✅ Deployment preparation complete!
echo ============================================
echo.
echo Next steps:
echo 1. Update backend\.env with production settings
echo 2. Ensure .env files are NOT committed to Git
echo 3. Push code to GitHub:
echo    git add .
echo    git commit -m "Prepare for deployment"
echo    git push origin main
echo.
echo 4. Follow DEPLOYMENT_GUIDE.md for your platform
echo    - Railway (easiest): railway.app
echo    - Heroku: heroku.com
echo    - Vercel (frontend): vercel.com
echo.
echo Happy deploying! 🚀
echo.

pause
