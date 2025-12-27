# SQL Queries Conversion Tool

A powerful AI-powered tool that converts SQL statements between different database dialects using Google Gemini.

![SQL Dialect Converter](https://img.shields.io/badge/AI-Powered-blue) ![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?logo=streamlit&logoColor=white) ![Python](https://img.shields.io/badge/Python-3.9+-green)

## ✨ Features

- **Multi-Format Input Support**
  - PDF files containing SQL queries
  - SQL files (.sql, .txt)
  - Excel spreadsheets (.xlsx, .xls)

- **11 Database Dialects Supported**
  - MySQL, PostgreSQL, Oracle, SQL Server
  - SQLite, MariaDB, Teradata
  - Snowflake, BigQuery, Amazon Redshift, IBM DB2

- **Flexible Output Formats**
  - PDF reports with professional formatting
  - Word documents with before/after comparison
  - Excel files with detailed results
  - Clean SQL files with metadata

- **AI-Powered Conversion**
  - Uses Google Gemini for intelligent SQL transformation
  - Handles dialect-specific functions and syntax
  - Preserves query logic during conversion

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

```bash
streamlit run app.py
```

The application will open in your browser at `http://localhost:8501`

## 📖 Usage

1. **Enter API Key**: Add your Gemini API key in the sidebar
2. **Select Dialects**: Choose source and target SQL dialects
3. **Upload File or Paste SQL**: 
   - Upload a PDF, SQL, or Excel file
   - Or paste SQL directly in the text area
4. **Convert**: Click the convert button
5. **Download Results**: Choose your preferred output format

## 📁 Project Structure

```
Where Clause Conversion Tool/
├── app.py                    # Main Streamlit application
├── config.py                 # Configuration and constants
├── requirements.txt          # Python dependencies
├── .env                      # API key (create this)
├── parsers/
│   ├── pdf_parser.py         # PDF file parsing
│   ├── sql_parser.py         # SQL file parsing
│   └── excel_parser.py       # Excel file parsing
├── converters/
│   └── ai_converter.py       # AI-powered SQL converter
├── generators/
│   ├── pdf_generator.py      # PDF output generation
│   ├── word_generator.py     # Word document generation
│   ├── excel_generator.py    # Excel output generation
│   └── sql_generator.py      # SQL file generation
├── utils/
│   └── sql_utils.py          # SQL utility functions
└── samples/
    └── sample_queries.sql    # Sample SQL for testing
```

## 🎨 Screenshots

The application features a modern dark theme with:
- Gradient headers and buttons
- Clean card-based layout
- Color-coded conversion results
- Interactive file upload

## 🔧 Configuration

Edit `config.py` to customize:
- Supported dialects
- Output formats
- AI model settings
- Theme colors

## 📝 License

MIT License - feel free to use and modify as needed.
