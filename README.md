# SQL Dialect Converter

A full-stack web application for converting SQL statements between different database dialects using AI-powered conversion.

![SQL Dialect Converter](https://img.shields.io/badge/React-18.2.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green) ![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## 🌟 Features

### Core Functionality
- **Multi-Format Input**: Upload SQL from PDF, SQL files, or Excel spreadsheets
- **Manual Input**: Paste SQL directly with syntax highlighting
- **AI-Powered Conversion**: Convert between 11+ database dialects using OpenRouter API
- **Multiple Export Formats**: Download results as PDF, Word, Excel, or SQL files
- **Real-time Progress**: Live conversion tracking with progress indicators

### Supported SQL Dialects
- MySQL
- PostgreSQL
- Oracle
- SQL Server
- SQLite
- MariaDB
- Teradata
- Snowflake
- BigQuery
- Amazon Redshift
- IBM DB2

### User Interface
- **Premium Dark Theme**: Modern, beautiful UI with gradient effects
- **Drag & Drop**: Easy file upload with visual feedback
- **Syntax Highlighting**: Color-coded SQL for better readability
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Polished micro-interactions and transitions

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 18 with Vite
- **Styling**: Custom CSS with premium dark theme
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **UI Components**: Custom components with React Icons
- **Syntax Highlighting**: Prism.js

### Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **AI Integration**: OpenRouter API (Gemini, GPT-4, Claude, etc.)
- **File Parsing**: pdfplumber, openpyxl, sqlparse
- **Document Generation**: ReportLab, python-docx
- **API Documentation**: Auto-generated Swagger/ReDoc

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.8+
- **OpenRouter API Key** (get from [openrouter.ai](https://openrouter.ai))

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Where Clause Conversion Tool"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac

# Edit .env and add your OpenRouter API key
# GEMINI_API_KEY=your_openrouter_api_key_here

# Run the backend server
python main.py
```

Backend will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
Where Clause Conversion Tool/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── README.md           # Backend documentation
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Node dependencies
│   ├── vite.config.js     # Vite configuration
│   └── README.md          # Frontend documentation
│
├── converters/            # AI conversion logic
│   └── ai_converter.py    # OpenRouter integration
│
├── parsers/               # File parsing modules
│   ├── pdf_parser.py      # PDF parsing
│   ├── sql_parser.py      # SQL file parsing
│   └── excel_parser.py    # Excel parsing
│
├── generators/            # Output file generators
│   ├── pdf_generator.py   # PDF generation
│   ├── word_generator.py  # Word document generation
│   ├── excel_generator.py # Excel generation
│   └── sql_generator.py   # SQL file generation
│
├── utils/                 # Utility functions
│   └── sql_utils.py       # SQL parsing utilities
│
├── config.py              # Configuration constants
├── app.py                 # Original Streamlit app (legacy)
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration (.env)
```env
GEMINI_API_KEY=your_openrouter_api_key_here
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend Configuration (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📖 Usage

### 1. Upload or Paste SQL
- **Upload**: Drag and drop a file (PDF, SQL, Excel) or click to browse
- **Paste**: Enter SQL statements directly in the text area

### 2. Configure Conversion
- **API Key**: Enter your OpenRouter API key in the sidebar
- **Source Dialect**: Select the original SQL dialect
- **Target Dialect**: Select the target SQL dialect

### 3. Convert
- Click the "🚀 Convert to [Target Dialect]" button
- Watch the progress as statements are converted

### 4. Review Results
- View side-by-side comparison of original and converted SQL
- Check conversion notes and any errors
- See success/error metrics

### 5. Export
- Download results in your preferred format:
  - 📄 PDF
  - 📝 Word Document
  - 📊 Excel
  - 💾 SQL File

## 🔑 Getting an OpenRouter API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Note**: OpenRouter provides access to multiple AI models including Gemini, GPT-4, Claude, and more. Some models are free to use.

## 🎨 Design Philosophy

The application follows modern web design principles:
- **Premium Aesthetics**: Vibrant gradients, smooth animations, glassmorphism
- **User-Centric**: Intuitive interface with clear visual feedback
- **Responsive**: Seamless experience across all devices
- **Accessible**: Semantic HTML, keyboard navigation, ARIA labels
- **Performance**: Optimized builds, code splitting, lazy loading

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Formatting
```bash
# Backend
black .
flake8

# Frontend
npm run lint
```

### Building for Production

#### Backend
```bash
cd backend
# Backend runs with uvicorn in production
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run build
# Output will be in dist/ folder
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### API Key Issues
- Ensure you're using an **OpenRouter** API key, not a direct Google Gemini key
- Check for extra quotes or whitespace in the `.env` file
- Verify the key is valid at [openrouter.ai](https://openrouter.ai)

### Connection Issues
- Ensure both backend and frontend are running
- Check that ports 8000 and 3000 are not in use
- Verify CORS settings in the backend

### Import Errors
- Ensure all dependencies are installed
- Check Python path includes the project root
- Verify virtual environment is activated

### Build Errors
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- **OpenRouter** for AI model access
- **FastAPI** for the excellent Python framework
- **React** and **Vite** for the modern frontend stack
- **Prism.js** for syntax highlighting
- All the open-source libraries that made this possible

## 🗺️ Roadmap

- [ ] User authentication and saved conversions
- [ ] Conversion history and favorites
- [ ] Batch file processing
- [ ] Custom dialect configurations
- [ ] Real-time collaboration
- [ ] Dark/Light theme toggle
- [ ] More AI model options
- [ ] Performance analytics

---

**Made with ❤️ using React, FastAPI, and AI**
