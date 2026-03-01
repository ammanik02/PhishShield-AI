# ⚡ PhishShield AI - Quick Start

Get up and running in 5 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Open Browser

Navigate to: **http://localhost:3000**

## 🎯 Try It Out

1. Click **"Launch Dashboard"**
2. Click **"Urgent Payment Scam"** example
3. Click **"Scan Now"**
4. View results with AI explanation!

## 📊 View Analytics

Navigate to: **http://localhost:3000/analytics**

## 🔍 API Documentation

Navigate to: **http://localhost:8000/docs**

## ❓ Issues?

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to API
- Ensure backend is running on port 8000
- Check `frontend/.env.local` has correct API URL

## 📚 Full Documentation

- [README.md](README.md) - Complete overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md) - Hackathon demo guide

## 🎉 You're Ready!

Start scanning for threats and protecting users from cyber fraud!

---

**Built for AMD Slingshot Hackathon 2026** 🛡️
