#!/bin/bash
# Deployment preparation script for TaskFlow
# This script prepares your application for production deployment

echo "🚀 TaskFlow Deployment Preparation Script"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking environment files...${NC}"

# Check .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}   Please edit backend/.env with your settings${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env not found. Creating from .env.example...${NC}"
    cp frontend/.env.example frontend/.env
fi

echo -e "${GREEN}✅ Environment files checked${NC}"
echo ""

echo -e "${YELLOW}Step 2: Checking Python dependencies...${NC}"

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python -m venv venv
fi

# Activate virtual environment
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate  # Windows Git Bash
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate  # macOS/Linux
fi

# Install requirements
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1

echo -e "${GREEN}✅ Python dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Running database migrations...${NC}"

python manage.py migrate --noinput > /dev/null 2>&1

echo -e "${GREEN}✅ Database migrations applied${NC}"
echo ""

echo -e "${YELLOW}Step 4: Collecting static files...${NC}"

python manage.py collectstatic --noinput > /dev/null 2>&1

echo -e "${GREEN}✅ Static files collected${NC}"
echo ""

cd ../frontend

echo -e "${YELLOW}Step 5: Checking Node dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node dependencies...${NC}"
    npm install > /dev/null 2>&1
fi

echo -e "${GREEN}✅ Node dependencies checked${NC}"
echo ""

echo -e "${YELLOW}Step 6: Building frontend for production...${NC}"

npm run build > /dev/null 2>&1

echo -e "${GREEN}✅ Frontend built for production${NC}"
echo ""

cd ..

echo -e "${YELLOW}Step 7: Checking deployment configuration files...${NC}"

# Check for required deployment files
files=("backend/Procfile" "backend/runtime.txt" "railway.json" "DEPLOYMENT_GUIDE.md")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo -e "${YELLOW}Step 8: Pre-deployment checklist...${NC}"

# Check .env values
if grep -q "your-" backend/.env; then
    echo -e "${RED}❌ Please update SECRET_KEY in backend/.env${NC}"
else
    echo -e "${GREEN}✅ SECRET_KEY appears configured${NC}"
fi

if grep -q "yourdomain" backend/.env; then
    echo -e "${YELLOW}⚠️  Remember to update ALLOWED_HOSTS and CORS settings${NC}"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update backend/.env with production settings"
echo "2. Ensure .env files are NOT committed to Git"
echo "3. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "4. Follow DEPLOYMENT_GUIDE.md for your platform"
echo "   - Railway (easiest): railway.app"
echo "   - Heroku: heroku.com"
echo "   - Vercel (frontend): vercel.com"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
