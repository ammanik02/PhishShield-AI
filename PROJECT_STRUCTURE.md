# PhishShield AI - Project Structure

## 📁 Directory Layout

```
phishshield-ai/
├── backend/                    # FastAPI Backend
│   ├── ai/                    # AI/ML Pipeline
│   │   ├── nlp_detector.py   # Text analysis & NLP
│   │   ├── url_detector.py   # URL feature extraction
│   │   ├── ocr_pipeline.py   # Image text extraction
│   │   ├── explainable_ai.py # AI explanation generation
│   │   └── optimized_inference.py # AMD optimization
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment variables
│
├── frontend/                  # Next.js Frontend
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Scan dashboard
│   │   ├── results/         # Results page
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── tailwind.config.ts   # Tailwind CSS config
│   └── next.config.js       # Next.js config
│
├── README.md                 # Main documentation
└── PROJECT_STRUCTURE.md     # This file
```

## 🎯 Component Architecture

### Backend (FastAPI)

**Main API (`main.py`)**
- RESTful endpoints for scanning
- CORS middleware for frontend communication
- In-memory analytics storage
- Error handling and validation

**AI Pipeline**

1. **NLP Detector** (`nlp_detector.py`)
   - Pattern-based text analysis
   - Urgency and financial risk scoring
   - Suspicious phrase detection
   - Feature extraction for ML

2. **URL Detector** (`url_detector.py`)
   - Domain reputation analysis
   - TLD and typosquatting detection
   - Protocol and structure validation
   - IP address detection

3. **OCR Pipeline** (`ocr_pipeline.py`)
   - Image text extraction
   - EasyOCR integration (simulated)
   - Preprocessing and confidence scoring

4. **Explainable AI** (`explainable_ai.py`)
   - Natural language explanations
   - Threat level categorization
   - Actionable recommendations
   - Confidence scoring

5. **Optimized Inference** (`optimized_inference.py`)
   - AMD ROCm integration
   - ONNX Runtime optimization
   - Performance benchmarking
   - Hardware acceleration

### Frontend (Next.js)

**Pages**

1. **Landing Page** (`app/page.tsx`)
   - Hero section with animations
   - Feature showcase
   - AMD optimization highlights
   - Call-to-action sections

2. **Dashboard** (`app/dashboard/page.tsx`)
   - Multi-modal input (text/URL/image)
   - Example scans
   - Real-time scanning
   - Loading states

3. **Results** (`app/results/page.tsx`)
   - Circular progress meter
   - Threat level visualization
   - AI explanation with typing effect
   - Recommendations panel

4. **Analytics** (`app/analytics/page.tsx`)
   - Real-time metrics
   - Threat distribution charts
   - Recent scans history
   - Impact statistics

## 🔄 Data Flow

```
User Input → Frontend → API Endpoint → AI Pipeline → Response → UI Visualization
```

### Scan Flow

1. User enters content (text/URL/image)
2. Frontend sends POST request to backend
3. Backend routes to appropriate detector
4. AI pipeline analyzes content
5. Explainable AI generates explanation
6. Results returned as JSON
7. Frontend displays with animations

### Analytics Flow

1. Frontend polls `/api/analytics` endpoint
2. Backend returns aggregated statistics
3. Charts update in real-time
4. Recent scans displayed

## 🎨 Design System

**Colors**
- Primary: Blue (#3b82f6)
- Success: Green (#22c55e)
- Warning: Yellow (#eab308)
- Danger: Red (#ef4444)
- Background: Dark slate gradients

**Components**
- Glass morphism cards
- Neon glow effects
- Smooth animations (Framer Motion)
- Cyber grid background
- Gradient buttons

## 🚀 Deployment Architecture

```
┌─────────────┐
│   Frontend  │ (Vercel/Netlify)
│  (Next.js)  │
└──────┬──────┘
       │ REST API
┌──────▼──────┐
│   Backend   │ (AWS/Azure/GCP)
│  (FastAPI)  │
└──────┬──────┘
       │
┌──────▼──────┐
│ AMD Hardware│ (ROCm/Instinct)
│ Acceleration│
└─────────────┘
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API health check |
| `/api/health` | GET | Detailed health status |
| `/api/scan/text` | POST | Scan text content |
| `/api/scan/url` | POST | Scan URL |
| `/api/scan/image` | POST | Scan image (OCR) |
| `/api/analytics` | GET | Get analytics data |
| `/api/demo/examples` | GET | Get demo examples |

## 🔧 Configuration

**Backend Environment Variables**
- `ENVIRONMENT`: development/production
- `API_HOST`: API host address
- `API_PORT`: API port number
- `CORS_ORIGINS`: Allowed origins
- `USE_AMD_OPTIMIZATION`: Enable AMD acceleration

**Frontend Environment Variables**
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🧪 Testing Strategy

1. **Unit Tests**: Individual AI components
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Full scan workflows
4. **Performance Tests**: AMD optimization benchmarks

## 📈 Scalability

**Horizontal Scaling**
- Load balancer for API instances
- Stateless design for easy replication
- Caching layer for frequent requests

**Vertical Scaling**
- AMD hardware acceleration
- Batch processing for throughput
- Model quantization for speed

## 🔐 Security

- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- No sensitive data storage
- Secure file upload handling

## 🎯 Future Enhancements

1. Real-time email/SMS monitoring
2. Browser extension
3. Mobile applications
4. Voice deepfake detection
5. Multi-language support
6. Enterprise API with authentication
7. Threat intelligence sharing
8. Integration with security platforms
