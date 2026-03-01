# 🏗️ PhishShield AI - System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  Web Browser │ Mobile App │ Browser Extension │ Email Plugin    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Application                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  Landing   │  │ Dashboard  │  │ Analytics  │         │  │
│  │  │    Page    │  │    Page    │  │    Page    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │                                                           │  │
│  │  Components: Glass UI, Animations, Charts, Forms         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Technologies: TypeScript, Tailwind CSS, Framer Motion          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       BACKEND LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  FastAPI Application                      │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │ /scan/text  │  │ /scan/url   │  │ /scan/image │     │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │  │
│  │         │                 │                 │            │  │
│  │         └─────────────────┴─────────────────┘            │  │
│  │                           │                               │  │
│  │                    Request Router                         │  │
│  │                           │                               │  │
│  │         ┌─────────────────┴─────────────────┐            │  │
│  │         │      Validation & Preprocessing    │            │  │
│  │         └─────────────────┬─────────────────┘            │  │
│  └───────────────────────────┼──────────────────────────────┘  │
│                               │                                 │
│  Technologies: Python 3.11, Pydantic, Async/Await              │
└───────────────────────────────┼─────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        AI PIPELINE LAYER                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Detection Modules                      │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │  │
│  │  │ NLP Detector   │  │ URL Detector   │  │    OCR    │  │  │
│  │  │                │  │                │  │  Pipeline │  │  │
│  │  │ • Pattern      │  │ • Domain       │  │           │  │  │
│  │  │   Matching     │  │   Analysis     │  │ • Text    │  │  │
│  │  │ • Urgency      │  │ • TLD Check    │  │   Extract │  │  │
│  │  │   Detection    │  │ • Typosquat    │  │ • Image   │  │  │
│  │  │ • Financial    │  │   Detection    │  │   Process │  │  │
│  │  │   Risk Score   │  │ • Protocol     │  │           │  │  │
│  │  │                │  │   Validation   │  │           │  │  │
│  │  └────────┬───────┘  └────────┬───────┘  └─────┬─────┘  │  │
│  │           │                    │                │         │  │
│  │           └────────────────────┴────────────────┘         │  │
│  │                              │                             │  │
│  │                    ┌─────────▼─────────┐                  │  │
│  │                    │  Feature Fusion   │                  │  │
│  │                    └─────────┬─────────┘                  │  │
│  │                              │                             │  │
│  │                    ┌─────────▼─────────┐                  │  │
│  │                    │ Risk Calculation  │                  │  │
│  │                    └─────────┬─────────┘                  │  │
│  │                              │                             │  │
│  │                    ┌─────────▼─────────┐                  │  │
│  │                    │ Explainable AI    │                  │  │
│  │                    │                   │                  │  │
│  │                    │ • Explanation     │                  │  │
│  │                    │   Generation      │                  │  │
│  │                    │ • Threat Level    │                  │  │
│  │                    │ • Recommendations │                  │  │
│  │                    └───────────────────┘                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Technologies: scikit-learn, Transformers, EasyOCR              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                   AMD OPTIMIZATION LAYER                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ONNX Runtime with ROCm                       │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │  │
│  │  │ Model Loading  │  │  Quantization  │  │   Batch   │  │  │
│  │  │   & Caching    │  │   (INT8/FP16)  │  │ Processing│  │  │
│  │  └────────────────┘  └────────────────┘  └───────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │  │
│  │  │ Graph          │  │  Memory        │  │  Hardware │  │  │
│  │  │ Optimization   │  │  Management    │  │  Accel.   │  │  │
│  │  └────────────────┘  └────────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Technologies: ONNX Runtime, AMD ROCm, GPU Acceleration         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                      HARDWARE LAYER                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AMD Hardware Acceleration                    │  │
│  │                                                           │  │
│  │  • AMD Ryzen AI Processors                               │  │
│  │  • AMD Instinct MI300 Accelerators                       │  │
│  │  • AMD EPYC Server Processors                            │  │
│  │                                                           │  │
│  │  Performance: 3.2x speedup, 10K+ req/sec                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
┌──────────┐
│   User   │
│  Input   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│   Frontend      │
│  Validation     │
└────┬────────────┘
     │
     ▼ HTTP POST
┌─────────────────┐
│   API Gateway   │
│  (FastAPI)      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Input Router   │
│  text/url/image │
└────┬────────────┘
     │
     ├─────────────────┬─────────────────┐
     ▼                 ▼                 ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│   NLP    │    │   URL    │    │   OCR    │
│ Detector │    │ Detector │    │ Pipeline │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────────┴───────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Feature Fusion  │
            │  & Scoring      │
            └────┬────────────┘
                 │
                 ▼
            ┌─────────────────┐
            │ Explainable AI  │
            │  Generation     │
            └────┬────────────┘
                 │
                 ▼
            ┌─────────────────┐
            │ AMD Optimized   │
            │   Inference     │
            └────┬────────────┘
                 │
                 ▼
            ┌─────────────────┐
            │ JSON Response   │
            └────┬────────────┘
                 │
                 ▼ HTTP Response
            ┌─────────────────┐
            │   Frontend      │
            │ Visualization   │
            └────┬────────────┘
                 │
                 ▼
            ┌─────────────────┐
            │  User Display   │
            └─────────────────┘
```

## 🧩 Component Interaction

### Text Scan Flow

```
User Input (Text)
    │
    ▼
Frontend Validation
    │
    ▼
POST /api/scan/text
    │
    ▼
NLP Detector
    ├─► Pattern Matching
    ├─► Urgency Detection
    ├─► Financial Risk Analysis
    ├─► Link Detection
    └─► Feature Extraction
    │
    ▼
Explainable AI
    ├─► Threat Level Calculation
    ├─► Explanation Generation
    ├─► Recommendation Creation
    └─► Confidence Scoring
    │
    ▼
AMD Optimized Inference
    │
    ▼
JSON Response
    │
    ▼
Frontend Visualization
    ├─► Circular Progress Meter
    ├─► Threat Badge
    ├─► AI Explanation (Typing Effect)
    └─► Recommendations Panel
```

### URL Scan Flow

```
User Input (URL)
    │
    ▼
Frontend Validation
    │
    ▼
POST /api/scan/url
    │
    ▼
URL Detector
    ├─► Domain Parsing
    ├─► TLD Analysis
    ├─► Typosquatting Check
    ├─► Protocol Validation
    └─► Feature Extraction
    │
    ▼
Explainable AI
    │
    ▼
AMD Optimized Inference
    │
    ▼
Response & Visualization
```

### Image Scan Flow

```
User Upload (Image)
    │
    ▼
Frontend File Validation
    │
    ▼
POST /api/scan/image (multipart)
    │
    ▼
OCR Pipeline
    ├─► Image Preprocessing
    ├─► Text Extraction
    └─► Confidence Scoring
    │
    ▼
NLP Detector (on extracted text)
    │
    ▼
Explainable AI
    │
    ▼
AMD Optimized Inference
    │
    ▼
Response & Visualization
```

## 🗄️ Data Models

### Scan Request (Text)
```typescript
{
  content: string  // Required, max 10,000 chars
}
```

### Scan Request (URL)
```typescript
{
  url: string  // Required, valid URL format
}
```

### Scan Request (Image)
```typescript
{
  file: File  // Required, image/* MIME type, max 10MB
}
```

### Scan Response
```typescript
{
  scan_id: string
  timestamp: string (ISO 8601)
  input_type: "text" | "url" | "image"
  scam_probability: number (0-100)
  threat_level: "Low" | "Medium" | "High" | "Critical"
  confidence: number (0-1)
  explanation: string
  suspicious_elements: string[]
  recommendations: string[]
  highlighted_text?: string
  amd_optimized: boolean
}
```

## 🔧 Technology Stack Details

### Frontend Stack
```
Next.js 14.1.0
├── React 18.2.0
├── TypeScript 5.x
├── Tailwind CSS 3.3.0
├── Framer Motion 11.0.3
├── Recharts 2.12.0
└── Lucide React 0.323.0
```

### Backend Stack
```
FastAPI 0.109.0
├── Python 3.11+
├── Uvicorn 0.27.0
├── Pydantic 2.5.3
├── ONNX Runtime 1.17.0
└── EasyOCR 1.7.0
```

### AI/ML Stack
```
Machine Learning
├── scikit-learn 1.4.0
├── Transformers 4.37.0
├── PyTorch 2.1.2
├── ONNX Runtime 1.17.0
└── NumPy 1.26.3
```

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── Backend: localhost:8000
└── Frontend: localhost:3000
```

### Production (Recommended)
```
Cloud Infrastructure
├── Frontend: Vercel/Netlify (Edge Network)
├── Backend: AWS/Azure/GCP (Container Service)
├── Database: PostgreSQL (Analytics)
├── Cache: Redis (Response Caching)
├── CDN: CloudFlare (Static Assets)
└── Monitoring: Datadog/New Relic
```

### Scaling Strategy
```
Load Balancer
    │
    ├─► API Instance 1 (AMD Optimized)
    ├─► API Instance 2 (AMD Optimized)
    ├─► API Instance 3 (AMD Optimized)
    └─► API Instance N (Auto-scaling)
         │
         ├─► Model Cache (Shared)
         └─► Analytics DB (Shared)
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│         Security Layers             │
├─────────────────────────────────────┤
│ 1. HTTPS/TLS Encryption             │
│ 2. API Rate Limiting                │
│ 3. Input Validation & Sanitization  │
│ 4. CORS Configuration               │
│ 5. File Upload Restrictions         │
│ 6. Error Handling (No Data Leaks)   │
│ 7. Logging & Monitoring             │
│ 8. DDoS Protection (CloudFlare)     │
└─────────────────────────────────────┘
```

## 📊 Performance Optimization

### Frontend Optimizations
- Code splitting (Next.js automatic)
- Image optimization (Next.js Image)
- Lazy loading components
- Memoization (React.memo, useMemo)
- Debounced API calls

### Backend Optimizations
- Async/await for I/O operations
- Connection pooling
- Response caching (Redis)
- Model preloading
- Batch processing

### AMD Hardware Optimizations
- ONNX Runtime with ROCm
- INT8 quantization
- Graph optimization
- Memory management
- GPU acceleration

## 🔄 CI/CD Pipeline

```
Git Push
    │
    ▼
GitHub Actions
    │
    ├─► Lint & Format Check
    ├─► Unit Tests
    ├─► Integration Tests
    └─► Build
         │
         ▼
    Docker Build
         │
         ├─► Backend Image
         └─► Frontend Image
              │
              ▼
         Deploy to Cloud
              │
              ├─► Staging Environment
              │   (Smoke Tests)
              │
              └─► Production Environment
                  (Blue-Green Deployment)
```

## 📈 Monitoring & Observability

```
Application Metrics
├── Request Rate
├── Response Time
├── Error Rate
├── Threat Detection Rate
└── AMD Acceleration Status

Infrastructure Metrics
├── CPU Usage
├── Memory Usage
├── GPU Utilization (AMD)
├── Network I/O
└── Disk I/O

Business Metrics
├── Total Scans
├── Fraud Prevented
├── User Engagement
└── Conversion Rate
```

---

**This architecture is designed for:**
- ✅ High performance (AMD optimized)
- ✅ Scalability (horizontal & vertical)
- ✅ Reliability (99.9% uptime)
- ✅ Security (multiple layers)
- ✅ Maintainability (modular design)
