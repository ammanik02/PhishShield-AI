# 🚀 PhishShield AI - Setup Guide

Complete installation and deployment guide for the AMD Slingshot Hackathon project.

## 📋 Prerequisites

### Required Software
- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)

### Optional (for production)
- **AMD ROCm** (for hardware acceleration)
- **Docker** (for containerization)
- **Git** (for version control)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/phishshield-ai.git
cd phishshield-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env if needed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
# or
yarn install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local if backend is not on localhost:8000
```

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# or
yarn dev
```

Frontend will be available at: `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
# or
yarn build
yarn start
```

## 🐳 Docker Deployment (Optional)

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - CORS_ORIGINS=http://localhost:3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

Run with Docker:
```bash
docker-compose up -d
```

## 🧪 Testing the Application

### 1. Health Check

```bash
# Check backend health
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-01T...",
  "models_loaded": true,
  "amd_acceleration": true
}
```

### 2. Test Scan

```bash
# Test text scan
curl -X POST http://localhost:8000/api/scan/text \
  -H "Content-Type: application/json" \
  -d '{"content": "URGENT! Your account will be suspended. Click here to verify."}'
```

### 3. Frontend Testing

1. Open `http://localhost:3000`
2. Navigate to Dashboard
3. Click "Try Example Scans"
4. Click "Urgent Payment Scam"
5. Click "Scan Now"
6. Verify results page displays correctly

## 🔍 Troubleshooting

### Backend Issues

**Problem: Module not found**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: Port already in use**
```bash
# Change port in command
uvicorn main:app --reload --port 8001

# Update frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Problem: CORS errors**
```bash
# Check backend .env CORS_ORIGINS includes frontend URL
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend Issues

**Problem: API connection failed**
- Verify backend is running on correct port
- Check `.env.local` has correct API URL
- Ensure no firewall blocking requests

**Problem: Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Styling not loading**
```bash
# Rebuild Tailwind
npm run dev
```

## 🚀 Deployment to Cloud

### Vercel (Frontend)

```bash
cd frontend
vercel deploy

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### AWS/Azure/GCP (Backend)

**Using AWS Elastic Beanstalk:**
```bash
cd backend
eb init -p python-3.11 phishshield-backend
eb create phishshield-env
eb deploy
```

**Using Azure App Service:**
```bash
cd backend
az webapp up --name phishshield-api --runtime "PYTHON:3.11"
```

**Using Google Cloud Run:**
```bash
cd backend
gcloud run deploy phishshield-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## ⚡ AMD Optimization Setup

### Installing ROCm (Linux)

```bash
# Ubuntu/Debian
wget https://repo.radeon.com/amdgpu-install/latest/ubuntu/focal/amdgpu-install_*.deb
sudo apt install ./amdgpu-install_*.deb
sudo amdgpu-install --usecase=rocm

# Verify installation
rocm-smi
```

### ONNX Runtime with ROCm

```bash
# Install ONNX Runtime with ROCm support
pip install onnxruntime-rocm

# Update backend/.env
USE_AMD_OPTIMIZATION=true
ONNX_EXECUTION_PROVIDER=ROCmExecutionProvider
```

## 📊 Performance Monitoring

### Backend Metrics

```bash
# Install monitoring tools
pip install prometheus-fastapi-instrumentator

# Add to main.py
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)
```

### Frontend Analytics

```bash
# Install analytics
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
```

## 🔐 Security Hardening

### Backend

1. **Rate Limiting**
```bash
pip install slowapi
```

2. **API Keys** (for production)
```python
# Add authentication middleware
from fastapi.security import APIKeyHeader
```

3. **HTTPS Only**
```bash
# Use reverse proxy (nginx/caddy)
# Force HTTPS redirects
```

### Frontend

1. **Environment Variables**
- Never commit `.env.local`
- Use Vercel/Netlify environment variables

2. **Content Security Policy**
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  }
]
```

## 📝 Development Tips

### Hot Reload

Both frontend and backend support hot reload in development mode.

### API Documentation

Access interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Code Formatting

```bash
# Backend
pip install black
black .

# Frontend
npm install -D prettier
npx prettier --write .
```

## 🎯 Next Steps

1. ✅ Complete installation
2. ✅ Run development servers
3. ✅ Test all features
4. ✅ Review code structure
5. ✅ Customize for your needs
6. ✅ Deploy to production
7. ✅ Monitor performance
8. ✅ Iterate and improve

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review API documentation
- Check GitHub issues
- Contact development team

---

**Built for AMD Slingshot Hackathon 2026** 🚀
