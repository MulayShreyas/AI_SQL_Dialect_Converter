# Project Architecture - SQL Dialect Converter

## Overview

This document provides a complete overview of the SQL Dialect Converter architecture, showing how the React frontend and FastAPI backend work together.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Frontend (Port 3000)                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Components │  │   Services   │  │    Styles   │  │  │
│  │  │   (UI/UX)   │  │  (API Calls) │  │   (CSS)     │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   API Endpoints                        │  │
│  │  /api/parse-file  /api/convert  /api/export          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │ Parsers  │  │Converters│  │   Generators     │   │  │
│  │  │ (PDF/SQL)│  │   (AI)   │  │ (PDF/Word/Excel) │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenRouter API                             │
│         (Gemini, GPT-4, Claude, Llama, etc.)                │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
Where Clause Conversion Tool/
│
├── 📁 backend/                    # FastAPI Backend
│   ├── main.py                    # FastAPI application & endpoints
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example              # Environment template
│   └── README.md                 # Backend documentation
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # React UI components
│   │   │   ├── Header.jsx        # App header
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx       # Configuration sidebar
│   │   │   ├── Sidebar.css
│   │   │   ├── FileUpload.jsx    # File upload component
│   │   │   ├── FileUpload.css
│   │   │   ├── ManualInput.jsx   # Manual SQL input
│   │   │   ├── ManualInput.css
│   │   │   ├── StatementPreview.jsx  # SQL preview
│   │   │   ├── StatementPreview.css
│   │   │   ├── ConversionResults.jsx # Results display
│   │   │   └── ConversionResults.css
│   │   │
│   │   ├── 📁 services/          # API integration
│   │   │   └── api.js            # Axios API service
│   │   │
│   │   ├── App.jsx               # Main application
│   │   ├── App.css               # App styles
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   │
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── package.json              # Node dependencies
│   └── README.md                 # Frontend documentation
│
├── 📁 converters/                 # Shared: AI Conversion Logic
│   ├── __init__.py
│   └── ai_converter.py           # OpenRouter integration
│
├── 📁 parsers/                    # Shared: File Parsing
│   ├── __init__.py
│   ├── pdf_parser.py             # PDF parsing
│   ├── sql_parser.py             # SQL file parsing
│   └── excel_parser.py           # Excel parsing
│
├── 📁 generators/                 # Shared: Output Generation
│   ├── __init__.py
│   ├── pdf_generator.py          # PDF generation
│   ├── word_generator.py         # Word document generation
│   ├── excel_generator.py        # Excel generation
│   └── sql_generator.py          # SQL file generation
│
├── 📁 utils/                      # Shared: Utilities
│   ├── __init__.py
│   └── sql_utils.py              # SQL parsing utilities
│
├── config.py                      # Shared: Configuration
├── app.py                         # Legacy: Streamlit app
├── requirements.txt               # Legacy: Streamlit dependencies
│
├── setup.bat                      # Windows setup script
├── start.bat                      # Windows start script
│
├── README.md                      # Main documentation
├── QUICKSTART.md                  # Quick start guide
├── ARCHITECTURE.md                # This file
├── .gitignore                     # Git ignore rules
└── LICENSE                        # MIT License
```

## Data Flow

### 1. File Upload Flow
```
User uploads file
    ↓
FileUpload Component (React)
    ↓
api.parseFile() → POST /api/parse-file
    ↓
FastAPI Backend
    ↓
Appropriate Parser (PDF/SQL/Excel)
    ↓
Extract SQL statements
    ↓
Return to Frontend
    ↓
Display in StatementPreview Component
```

### 2. SQL Conversion Flow
```
User clicks Convert button
    ↓
App Component (React)
    ↓
api.convertSQL() → POST /api/convert
    ↓
FastAPI Backend
    ↓
AIConverter (OpenRouter)
    ↓
For each statement:
    - Build conversion prompt
    - Call OpenRouter API
    - Parse AI response
    ↓
Return conversion results
    ↓
Display in ConversionResults Component
```

### 3. Export Flow
```
User clicks Export button
    ↓
ConversionResults Component
    ↓
api.exportResults() → POST /api/export
    ↓
FastAPI Backend
    ↓
Appropriate Generator (PDF/Word/Excel/SQL)
    ↓
Generate file
    ↓
Stream file to browser
    ↓
Browser downloads file
```

## Component Hierarchy

```
App (Main Container)
├── ToastContainer (Notifications)
├── Sidebar (Configuration)
│   ├── API Key Input
│   ├── Source Dialect Select
│   ├── Target Dialect Select
│   └── Output Format Select
│
└── Main Content
    ├── Header (Title & Subtitle)
    │
    ├── Input Section
    │   ├── FileUpload (Drag & Drop)
    │   └── ManualInput (Text Area)
    │
    ├── StatementPreview (Collapsible List)
    │   └── SQL Code Blocks (Syntax Highlighted)
    │
    ├── Convert Button
    │
    └── ConversionResults
        ├── Metrics (Success/Error Count)
        ├── Results List (Collapsible Items)
        │   ├── Original SQL
        │   ├── Converted SQL
        │   └── Notes
        └── Export Buttons (PDF/Word/Excel/SQL)
```

## API Endpoints

### Backend REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/dialects` | Get supported SQL dialects |
| GET | `/api/formats` | Get supported output formats |
| POST | `/api/parse-file` | Parse uploaded file |
| POST | `/api/parse-sql` | Parse manual SQL input |
| POST | `/api/convert` | Convert SQL statements |
| POST | `/api/export` | Export results to file |
| POST | `/api/validate-key` | Validate API key |

### Request/Response Examples

**Convert SQL:**
```json
// Request
POST /api/convert
{
  "statements": ["SELECT * FROM users WHERE id = 1;"],
  "source_dialect": "MySQL",
  "target_dialect": "PostgreSQL",
  "api_key": "sk-or-v1-..."
}

// Response
{
  "results": [
    {
      "original": "SELECT * FROM users WHERE id = 1;",
      "converted": "SELECT * FROM users WHERE id = 1;",
      "status": "success",
      "notes": "No significant changes needed"
    }
  ],
  "success_count": 1,
  "error_count": 0,
  "total_count": 1
}
```

## State Management

### Frontend State (React Hooks)

```javascript
// App.jsx
const [dialects, setDialects] = useState([])           // Available dialects
const [formats, setFormats] = useState([])             // Available formats
const [sourceDialect, setSourceDialect] = useState('') // Selected source
const [targetDialect, setTargetDialect] = useState('') // Selected target
const [outputFormat, setOutputFormat] = useState('')   // Selected format
const [apiKey, setApiKey] = useState('')               // User's API key
const [statements, setStatements] = useState([])       // Parsed SQL
const [results, setResults] = useState(null)           // Conversion results
const [isConverting, setIsConverting] = useState(false) // Loading state
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **Axios**: HTTP client
- **React Dropzone**: File upload
- **Prism.js**: Syntax highlighting
- **React Icons**: Icon library
- **React Toastify**: Notifications

### Backend
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Python-multipart**: File uploads
- **Requests**: HTTP client

### Shared Libraries
- **pdfplumber**: PDF parsing
- **openpyxl**: Excel handling
- **python-docx**: Word generation
- **ReportLab**: PDF generation
- **sqlparse**: SQL parsing

### External Services
- **OpenRouter API**: AI model access
  - Google Gemini
  - OpenAI GPT-4
  - Anthropic Claude
  - Meta Llama
  - And more...

## Security Considerations

### API Key Protection
- API keys stored in `.env` files (not committed to git)
- Keys can be provided per-request or from environment
- Backend validates keys before processing

### CORS Configuration
- Backend configured to accept requests from frontend origins
- Configurable via environment variables

### Input Validation
- Pydantic models validate all API inputs
- File type validation on upload
- SQL injection prevention through parsing

### Error Handling
- Comprehensive error messages
- No sensitive data in error responses
- Proper HTTP status codes

## Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading of components
- Optimized bundle size
- CSS minification
- Asset optimization

### Backend
- Async/await for I/O operations
- Streaming responses for large files
- Connection pooling
- Request timeout handling

## Deployment Considerations

### Frontend Deployment
- Build: `npm run build`
- Output: `dist/` folder
- Can be deployed to:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - Any static hosting

### Backend Deployment
- Production server: Uvicorn with Gunicorn
- Can be deployed to:
  - Heroku
  - AWS EC2/ECS
  - Google Cloud Run
  - DigitalOcean
  - Any Python hosting

### Environment Variables
- Frontend: `VITE_API_URL`
- Backend: `GEMINI_API_KEY`, `HOST`, `PORT`, `CORS_ORIGINS`

## Testing Strategy

### Frontend Testing
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress
- Visual regression testing

### Backend Testing
- Unit tests with pytest
- API tests with FastAPI TestClient
- Integration tests for parsers/generators

## Future Enhancements

### Planned Features
- [ ] User authentication (JWT)
- [ ] Conversion history storage
- [ ] Batch file processing
- [ ] WebSocket for real-time updates
- [ ] Custom dialect configurations
- [ ] Collaborative editing
- [ ] Theme customization
- [ ] More AI model options

### Scalability Improvements
- [ ] Redis caching
- [ ] Database for user data
- [ ] Queue system for long conversions
- [ ] CDN for static assets
- [ ] Load balancing

## Monitoring & Logging

### Frontend
- Error boundary for React errors
- Analytics integration (Google Analytics, etc.)
- Performance monitoring

### Backend
- Structured logging
- Request/response logging
- Error tracking (Sentry, etc.)
- Performance metrics

## Development Workflow

### Local Development
1. Run `setup.bat` for initial setup
2. Use `start.bat` to run both servers
3. Frontend: http://localhost:3000
4. Backend: http://localhost:8000
5. API Docs: http://localhost:8000/docs

### Code Style
- Frontend: ESLint + Prettier
- Backend: Black + Flake8
- Consistent naming conventions
- Comprehensive comments

### Version Control
- Git for source control
- Feature branch workflow
- Pull request reviews
- Semantic versioning

---

**For more information, see:**
- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [backend/README.md](backend/README.md) - Backend details
- [frontend/README.md](frontend/README.md) - Frontend details
