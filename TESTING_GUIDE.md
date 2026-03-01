# 🧪 PhishShield AI - Testing Guide

## 🎯 Testing Overview

This guide helps you verify that all features work correctly before the demo.

---

## ✅ Pre-Demo Testing Checklist

### 1. Backend Health Check

```bash
# Start backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload

# Test in new terminal
curl http://localhost:8000/
```

**Expected Response**:
```json
{
  "message": "PhishShield AI API",
  "version": "1.0.0",
  "status": "operational",
  "amd_optimized": true
}
```

✅ **Pass**: JSON response received
❌ **Fail**: Connection refused or error

---

### 2. Frontend Health Check

```bash
# Start frontend
cd frontend
npm run dev
```

**Test**:
1. Open http://localhost:3000
2. Page loads without errors
3. Navigation bar appears
4. "Launch Dashboard" button visible

✅ **Pass**: Page loads correctly
❌ **Fail**: Build errors or blank page

---

### 3. Text Scan Test

**Steps**:
1. Navigate to Dashboard
2. Click "Urgent Payment Scam" example
3. Verify text loads in textarea
4. Click "Scan Now"
5. Wait for results page

**Expected Results**:
- Scam probability: 75-95%
- Threat level: Critical or High
- Explanation appears with typing effect
- Suspicious elements listed
- Recommendations provided
- AMD badge visible

✅ **Pass**: All elements display correctly
❌ **Fail**: Error message or missing data

---

### 4. URL Scan Test

**Steps**:
1. Navigate to Dashboard
2. Switch to "URL" tab
3. Click "Suspicious URL" example
4. Verify URL loads in input
5. Click "Scan Now"

**Expected Results**:
- Scam probability: 80-95%
- Threat level: Critical or High
- URL-specific indicators
- Protocol warnings
- Domain analysis

✅ **Pass**: URL analysis works
❌ **Fail**: Error or incorrect analysis

---

### 5. Image Upload Test

**Steps**:
1. Navigate to Dashboard
2. Switch to "Image" tab
3. Upload any image file
4. Click "Scan Now"

**Expected Results**:
- File uploads successfully
- OCR extraction occurs
- Text analysis runs
- Results display

✅ **Pass**: Image processing works
❌ **Fail**: Upload fails or error

---

### 6. Analytics Dashboard Test

**Steps**:
1. Navigate to Analytics page
2. Verify all metrics load
3. Check charts render
4. Verify recent scans appear

**Expected Elements**:
- Total scans counter
- Fraud prevented amount
- Scans today counter
- Pie chart (threat distribution)
- Bar chart (threats by level)
- Recent scans list

✅ **Pass**: All metrics and charts display
❌ **Fail**: Missing data or errors

---

### 7. Navigation Test

**Test All Links**:
- [ ] Home → Dashboard
- [ ] Home → Analytics
- [ ] Dashboard → Analytics
- [ ] Dashboard → Results → Dashboard
- [ ] Results → New Scan

✅ **Pass**: All navigation works
❌ **Fail**: Broken links or errors

---

### 8. Responsive Design Test

**Test Viewports**:
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

**Check**:
- Layout adapts correctly
- No horizontal scroll
- Buttons are clickable
- Text is readable

✅ **Pass**: Responsive on all sizes
❌ **Fail**: Layout breaks

---

### 9. Animation Test

**Verify Animations**:
- [ ] Landing page fade-in
- [ ] Scanning progress animation
- [ ] Results typing effect
- [ ] Circular progress meter
- [ ] Chart animations
- [ ] Hover effects

✅ **Pass**: Smooth animations
❌ **Fail**: Janky or missing

---

### 10. API Documentation Test

**Steps**:
1. Navigate to http://localhost:8000/docs
2. Verify Swagger UI loads
3. Test "Try it out" on /api/scan/text
4. Submit example request

✅ **Pass**: API docs work
❌ **Fail**: Docs don't load

---

## 🔍 Detailed Test Cases

### Test Case 1: Phishing Email Detection

**Input**:
```
URGENT! Your account will be suspended in 24 hours. 
Click here to verify: bit.ly/verify123. 
Send $500 to restore access immediately!
```

**Expected Output**:
- Score: 85-95%
- Threat: Critical
- Indicators: Urgency, financial request, suspicious link
- Recommendations: Do not click, delete message

---

### Test Case 2: Legitimate Message

**Input**:
```
Hi! Just wanted to confirm our meeting tomorrow at 3 PM. 
Let me know if you need to reschedule. Thanks!
```

**Expected Output**:
- Score: 5-20%
- Threat: Low
- Indicators: No major red flags
- Recommendations: Message appears safe

---

### Test Case 3: Prize Scam

**Input**:
```
Congratulations! You've won $10,000 in our lottery. 
To claim your prize, send your bank details and $50 
processing fee to winner@prize-claim.com
```

**Expected Output**:
- Score: 80-95%
- Threat: Critical or High
- Indicators: Prize claim, financial request, suspicious email
- Recommendations: Do not respond, report as scam

---

### Test Case 4: Suspicious URL

**Input**:
```
http://paypal-secure-login.tk/verify
```

**Expected Output**:
- Score: 85-95%
- Threat: Critical
- Indicators: Suspicious TLD, typosquatting, HTTP
- Recommendations: Do not visit

---

### Test Case 5: Legitimate URL

**Input**:
```
https://github.com/phishshield
```

**Expected Output**:
- Score: 5-15%
- Threat: Low
- Indicators: Trusted domain
- Recommendations: URL appears safe

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Won't Start

**Symptoms**:
- `ModuleNotFoundError`
- `ImportError`

**Solutions**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Windows: venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt

# Check Python version
python --version  # Should be 3.11+
```

---

### Issue 2: Frontend Build Errors

**Symptoms**:
- `Module not found`
- `Cannot find module`

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

---

### Issue 3: CORS Errors

**Symptoms**:
- `CORS policy blocked`
- `Access-Control-Allow-Origin`

**Solutions**:
```bash
# Check backend .env
CORS_ORIGINS=http://localhost:3000

# Restart backend after changes
```

---

### Issue 4: API Connection Failed

**Symptoms**:
- `Failed to fetch`
- `Network error`

**Solutions**:
```bash
# Verify backend is running
curl http://localhost:8000/api/health

# Check frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart frontend after changes
```

---

### Issue 5: Slow Performance

**Symptoms**:
- Scans take >5 seconds
- UI feels sluggish

**Solutions**:
```bash
# Check system resources
# Close unnecessary applications
# Restart both services

# For production, enable AMD optimization
USE_AMD_OPTIMIZATION=true
```

---

## 📊 Performance Benchmarks

### Expected Response Times

| Operation | Expected Time | Acceptable Range |
|-----------|---------------|------------------|
| Text Scan | 500-800ms | <2s |
| URL Scan | 600-900ms | <2s |
| Image Scan | 800-1200ms | <3s |
| Analytics Load | 200-400ms | <1s |
| Page Navigation | 100-300ms | <500ms |

---

## 🎯 Pre-Demo Final Check

**30 Minutes Before Demo**:

1. **Restart Everything**
   ```bash
   # Kill all processes
   # Restart backend
   # Restart frontend
   ```

2. **Test All Features**
   - [ ] Text scan (phishing example)
   - [ ] URL scan (suspicious URL)
   - [ ] Image upload
   - [ ] Analytics page
   - [ ] All navigation

3. **Check Appearance**
   - [ ] No console errors
   - [ ] Animations smooth
   - [ ] Charts render
   - [ ] Mobile responsive

4. **Prepare Backup**
   - [ ] Have API docs ready
   - [ ] Have code open in editor
   - [ ] Have example data ready
   - [ ] Know how to restart services

---

## 🚀 Load Testing (Optional)

### Simple Load Test

```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install ab

# Test text scan endpoint
ab -n 100 -c 10 -p test.json -T application/json \
   http://localhost:8000/api/scan/text
```

**test.json**:
```json
{"content": "URGENT! Click here now!"}
```

**Expected Results**:
- Requests per second: 50+
- Mean response time: <500ms
- Failed requests: 0

---

## 📝 Test Report Template

```
PhishShield AI - Test Report
Date: [DATE]
Tester: [NAME]

Backend Tests:
[ ] Health check - PASS/FAIL
[ ] Text scan - PASS/FAIL
[ ] URL scan - PASS/FAIL
[ ] Image scan - PASS/FAIL
[ ] Analytics - PASS/FAIL

Frontend Tests:
[ ] Landing page - PASS/FAIL
[ ] Dashboard - PASS/FAIL
[ ] Results page - PASS/FAIL
[ ] Analytics page - PASS/FAIL
[ ] Navigation - PASS/FAIL

Performance:
- Text scan: [TIME]ms
- URL scan: [TIME]ms
- Image scan: [TIME]ms

Issues Found:
1. [ISSUE DESCRIPTION]
2. [ISSUE DESCRIPTION]

Overall Status: READY / NOT READY

Notes:
[ADDITIONAL NOTES]
```

---

## ✅ Demo Readiness Criteria

**Ready to Demo When**:
- ✅ All backend endpoints respond
- ✅ All frontend pages load
- ✅ All example scans work
- ✅ Analytics displays correctly
- ✅ No console errors
- ✅ Animations are smooth
- ✅ Response times acceptable
- ✅ Mobile responsive works
- ✅ Navigation functions
- ✅ AMD badge displays

---

## 🎉 Final Confidence Check

Before the demo, verify:
- [ ] I can explain the problem
- [ ] I can demo text scanning
- [ ] I can demo URL scanning
- [ ] I can show analytics
- [ ] I can explain AMD optimization
- [ ] I know the key numbers
- [ ] I have backup plans
- [ ] I'm confident in the code
- [ ] I'm ready to answer questions
- [ ] I believe in the project

---

**If all tests pass, you're ready to win! 🏆**

**Good luck with your demo! 🚀**
