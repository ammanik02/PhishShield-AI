#!/bin/bash

# PhishShield AI - Installation Script
# For Linux/macOS

set -e

echo "🛡️  PhishShield AI - Installation Script"
echo "=========================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Found Python $PYTHON_VERSION"

# Check Node.js version
echo "📋 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Found Node.js $NODE_VERSION"

echo ""
echo "🔧 Setting up Backend..."
echo "------------------------"

# Backend setup
cd backend

echo "📦 Creating Python virtual environment..."
python3 -m venv venv

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📝 Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists, skipping..."
fi

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "------------------------"

# Frontend setup
cd frontend

echo "📦 Installing Node.js dependencies..."
npm install

echo "📝 Creating .env.local file..."
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    echo "✅ Created .env.local file"
else
    echo "⚠️  .env.local file already exists, skipping..."
fi

cd ..

echo ""
echo "✅ Installation Complete!"
echo "========================"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 For more information, see:"
echo "  - QUICKSTART.md"
echo "  - SETUP_GUIDE.md"
echo ""
echo "🎉 Happy scanning!"
