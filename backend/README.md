# SQL Dialect Converter - Backend

FastAPI backend for the SQL Dialect Converter application.

## Features

- **File Parsing**: Parse SQL from PDF, SQL files, and Excel spreadsheets
- **AI-Powered Conversion**: Convert SQL between 11+ database dialects using OpenRouter API
- **Multiple Export Formats**: Export results to PDF, Word, Excel, or SQL files
- **RESTful API**: Clean API design with comprehensive error handling

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **Python 3.8+**: Core language
- **OpenRouter API**: AI model access (Gemini, GPT-4, Claude, etc.)
- **pdfplumber**: PDF parsing
- **openpyxl**: Excel file handling
- **python-docx**: Word document generation
- **ReportLab**: PDF generation

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_openrouter_api_key_here
HOST=0.0.0.0
PORT=8000
```

**Get your OpenRouter API key:**
1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up/Login
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or simply
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
```
GET /
```

### Get Supported Dialects
```
GET /api/dialects
```

### Get Supported Formats
```
GET /api/formats
```

### Parse File
```
POST /api/parse-file
Content-Type: multipart/form-data
Body: file (PDF, SQL, TXT, XLSX, XLS)
```

### Parse Manual SQL
```
POST /api/parse-sql
Content-Type: application/json
Body: { "sql_text": "SELECT * FROM users;" }
```

### Convert SQL
```
POST /api/convert
Content-Type: application/json
Body: {
  "statements": ["SELECT * FROM users;"],
  "source_dialect": "MySQL",
  "target_dialect": "PostgreSQL",
  "api_key": "optional_api_key"
}
```

### Export Results
```
POST /api/export
Content-Type: application/json
Body: {
  "results": [...],
  "source_dialect": "MySQL",
  "target_dialect": "PostgreSQL",
  "format": "PDF"
}
```

### Validate API Key
```
POST /api/validate-key
Content-Type: multipart/form-data
Body: api_key=your_key_here
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (create this)
├── .env.example         # Environment template
└── (shared modules from parent directory)
    ├── converters/      # AI conversion logic
    ├── parsers/         # File parsing modules
    ├── generators/      # Output file generators
    ├── utils/           # Utility functions
    └── config.py        # Configuration constants
```

## Supported SQL Dialects

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

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid API key)
- `500`: Internal Server Error

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8
```

## Troubleshooting

### API Key Issues
- Ensure you're using an **OpenRouter** API key, not a direct Google Gemini key
- Check that the key is properly set in `.env` file
- Verify the key has no extra quotes or whitespace

### Import Errors
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Ensure the parent directory modules are accessible

### Port Already in Use
```bash
# Change the port in .env or run with different port
uvicorn main:app --reload --port 8001
```

## License

MIT License - See LICENSE file for details
