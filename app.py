"""
SQL Where Clause Conversion Tool
================================
A Streamlit-based web application for converting SQL statements between different database dialects.

Features:
- Upload SQL from PDF, SQL files, or Excel sheets
- Convert between 11 popular SQL dialects using AI
- Export results to PDF, Word, Excel, or SQL files

Author: AI Agent
License: MIT
"""

import streamlit as st
import os
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Local imports
from config import SUPPORTED_DIALECTS, OUTPUT_FORMATS, APP_THEME
from parsers import PDFParser, SQLParser, ExcelParser
from converters import AIConverter
from generators import PDFGenerator, WordGenerator, ExcelGenerator, SQLGenerator
from utils import SQLUtils

# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


# Page configuration
st.set_page_config(
    page_title="SQL Dialect Converter",
    page_icon="🔄",
    layout="wide",
    initial_sidebar_state="expanded"
)


def load_custom_css():
    """Load custom CSS for premium dark theme."""
    st.markdown("""
    <style>
        /* Import Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        /* Root variables */
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --bg-dark: #0f0f23;
            --surface-dark: #1a1a2e;
            --surface-light: #25253a;
            --text-primary: #ffffff;
            --text-secondary: #a0a0b0;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
            --border-color: #3a3a5a;
        }
        
        /* Main container */
        .main {
            background-color: var(--bg-dark);
            font-family: 'Inter', sans-serif;
        }
        
        .stApp {
            background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
        }
        
        /* Header styling */
        .main-header {
            text-align: center;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        
        .main-title {
            font-size: 3rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        
        .main-subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
            font-weight: 300;
        }
        
        /* Card styling */
        .stCard, .css-1r6slb0 {
            background: var(--surface-dark);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
        }
        
        /* Sidebar styling */
        .css-1d391kg, [data-testid="stSidebar"] {
            background: var(--surface-dark);
            border-right: 1px solid var(--border-color);
        }
        
        [data-testid="stSidebar"] .stMarkdown {
            color: var(--text-primary);
        }
        
        /* Button styling */
        .stButton > button {
            background: var(--primary-gradient);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .stButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        /* Download button styling */
        .stDownloadButton > button {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        
        .stDownloadButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        /* Select box styling */
        .stSelectbox > div > div {
            background: var(--surface-light);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-primary);
        }
        
        /* File uploader styling */
        .stFileUploader > div {
            background: var(--surface-light);
            border: 2px dashed var(--border-color);
            border-radius: 16px;
            padding: 2rem;
            transition: all 0.3s ease;
        }
        
        .stFileUploader > div:hover {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
        }
        
        /* Progress bar styling */
        .stProgress > div > div {
            background: var(--primary-gradient);
            border-radius: 10px;
        }
        
        /* Code block styling */
        .sql-code {
            background: #1e1e3f;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: #e0e0ff;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        
        /* Success/Error badges */
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .status-success {
            background: rgba(16, 185, 129, 0.2);
            color: var(--success);
        }
        
        .status-error {
            background: rgba(239, 68, 68, 0.2);
            color: var(--error);
        }
        
        /* Metrics styling */
        .metric-card {
            background: var(--surface-light);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .metric-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        /* Result card styling */
        .result-card {
            background: var(--surface-light);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }
        
        .result-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
        }
        
        /* Tab styling */
        .stTabs [data-baseweb="tab-list"] {
            gap: 8px;
            background: var(--surface-dark);
            border-radius: 12px;
            padding: 0.5rem;
        }
        
        .stTabs [data-baseweb="tab"] {
            background: transparent;
            border-radius: 8px;
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
        }
        
        .stTabs [aria-selected="true"] {
            background: var(--primary-gradient);
            color: white;
        }
        
        /* Expander styling */
        .streamlit-expanderHeader {
            background: var(--surface-light);
            border-radius: 10px;
            color: var(--text-primary);
        }
        
        /* Alert styling */
        .stAlert {
            background: var(--surface-light);
            border-radius: 12px;
        }
        
        /* Divider */
        hr {
            border-color: var(--border-color);
        }
        
        /* Animation */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .converting {
            animation: pulse 2s ease-in-out infinite;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            color: var(--text-secondary);
            padding: 2rem 0;
            font-size: 0.85rem;
        }
    </style>
    """, unsafe_allow_html=True)


def render_header():
    """Render the main header."""
    st.markdown("""
    <div class="main-header">
        <h1 class="main-title">🔄 SQL Dialect Converter</h1>
        <p class="main-subtitle">
            Transform SQL queries between dialects with AI-powered precision
        </p>
    </div>
    """, unsafe_allow_html=True)


def render_sidebar():
    """Render the sidebar configuration."""
    with st.sidebar:
        st.markdown("### ⚙️ Configuration")
        st.markdown("---")
        
        # API Key status - loaded from .env
        if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
            st.success("🔑 API Key loaded from .env")
            api_key = GEMINI_API_KEY
        else:
            st.warning("⚠️ API Key not found in .env")
            api_key = st.text_input(
                "🔑 Gemini API Key",
                type="password",
                help="Add GEMINI_API_KEY to your .env file or enter it here"
            )
        
        st.markdown("---")
        
        # Source dialect
        source_dialect = st.selectbox(
            "📤 Source Dialect",
            options=SUPPORTED_DIALECTS,
            index=0,
            help="Select the original SQL dialect"
        )
        
        # Target dialect
        target_dialect = st.selectbox(
            "📥 Target Dialect",
            options=SUPPORTED_DIALECTS,
            index=1,
            help="Select the target SQL dialect"
        )
        
        st.markdown("---")
        
        # Output format
        output_format = st.selectbox(
            "📁 Output Format",
            options=OUTPUT_FORMATS,
            help="Choose the format for your converted SQL"
        )
        
        st.markdown("---")
        
        # Info section
        st.markdown("### 📋 Supported Formats")
        st.markdown("""
        **Input:** PDF, SQL, Excel (.xlsx)  
        **Output:** PDF, Word, Excel, SQL
        """)
        
        st.markdown("---")
        
        st.markdown("""
        <div style='text-align: center; color: #888; font-size: 0.8rem;'>
            Powered by Google Gemini AI
        </div>
        """, unsafe_allow_html=True)
        
        return api_key, source_dialect, target_dialect, output_format


def parse_uploaded_file(file) -> List[str]:
    """Parse uploaded file and extract SQL statements."""
    file_type = file.name.split('.')[-1].lower()
    
    if file_type == 'pdf':
        parser = PDFParser()
        return parser.parse(file)
    elif file_type in ['sql', 'txt']:
        parser = SQLParser()
        return parser.parse(file)
    elif file_type in ['xlsx', 'xls']:
        parser = ExcelParser()
        return parser.parse(file)
    else:
        st.error(f"Unsupported file format: {file_type}")
        return []


def render_sql_preview(statements: List[str]):
    """Render a preview of extracted SQL statements."""
    st.markdown("### 📜 Extracted SQL Statements")
    
    if not statements:
        st.warning("No SQL statements found in the uploaded file.")
        return
    
    # Show count
    st.info(f"Found **{len(statements)}** SQL statement(s)")
    
    # Show each statement
    for i, stmt in enumerate(statements, 1):
        with st.expander(f"Statement {i}", expanded=i == 1):
            st.code(stmt, language="sql")


def render_conversion_results(results: List[Dict]):
    """Render conversion results."""
    st.markdown("### 🎯 Conversion Results")
    
    # Summary metrics
    success_count = sum(1 for r in results if r['status'] == 'success')
    error_count = len(results) - success_count
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{len(results)}</div>
            <div class="metric-label">Total Statements</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color: #10b981;">{success_count}</div>
            <div class="metric-label">Converted</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color: #ef4444;">{error_count}</div>
            <div class="metric-label">Errors</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Show each result
    for i, result in enumerate(results, 1):
        status_class = "status-success" if result['status'] == 'success' else "status-error"
        status_text = "✓ Success" if result['status'] == 'success' else "✗ Error"
        
        with st.expander(f"Statement {i} - {status_text}", expanded=result['status'] == 'error'):
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("**Original SQL:**")
                st.code(result['original'], language="sql")
            
            with col2:
                if result['status'] == 'success':
                    st.markdown("**Converted SQL:**")
                    st.code(result['converted'], language="sql")
                else:
                    st.markdown("**Error:**")
                    st.error(result.get('notes', 'Unknown error'))
            
            if result['status'] == 'success' and result.get('notes'):
                st.markdown(f"*📝 Notes: {result['notes']}*")


def generate_output_file(results: List[Dict], source_dialect: str, target_dialect: str, format: str):
    """Generate output file in the selected format."""
    if format == "PDF":
        generator = PDFGenerator()
        buffer = generator.generate(results, source_dialect, target_dialect)
        return buffer, "application/pdf", "converted_sql.pdf"
    
    elif format == "Word Document":
        generator = WordGenerator()
        buffer = generator.generate(results, source_dialect, target_dialect)
        return buffer, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "converted_sql.docx"
    
    elif format == "Excel":
        generator = ExcelGenerator()
        buffer = generator.generate(results, source_dialect, target_dialect)
        return buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "converted_sql.xlsx"
    
    elif format == "SQL File":
        generator = SQLGenerator()
        buffer = generator.generate(results, source_dialect, target_dialect)
        return buffer, "text/plain", "converted_sql.sql"
    
    return None, None, None


def main():
    """Main application function."""
    load_custom_css()
    render_header()
    
    # Sidebar configuration
    api_key, source_dialect, target_dialect, output_format = render_sidebar()
    
    # Main content area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 📂 Upload SQL File")
        st.markdown("*Drag and drop or click to upload*")
        
        uploaded_file = st.file_uploader(
            "Upload your SQL file",
            type=['pdf', 'sql', 'txt', 'xlsx', 'xls'],
            help="Supported formats: PDF, SQL, TXT, Excel (XLSX/XLS)",
            label_visibility="collapsed"
        )
    
    with col2:
        st.markdown("### ✍️ Or Paste SQL Directly")
        st.markdown("*Enter your SQL statements below*")
        
        manual_sql = st.text_area(
            "Enter SQL",
            height=150,
            placeholder="SELECT * FROM users WHERE id = 1;",
            label_visibility="collapsed"
        )
    
    st.markdown("---")
    
    # Initialize session state
    if 'statements' not in st.session_state:
        st.session_state.statements = []
    if 'results' not in st.session_state:
        st.session_state.results = []
    
    # Process uploaded file or manual input
    statements = []
    
    if uploaded_file is not None:
        with st.spinner("📄 Extracting SQL from file..."):
            statements = parse_uploaded_file(uploaded_file)
            st.session_state.statements = statements
    elif manual_sql.strip():
        statements = SQLUtils.split_statements(manual_sql)
        st.session_state.statements = statements
    
    # Show extracted statements
    if st.session_state.statements:
        render_sql_preview(st.session_state.statements)
    else:
        st.markdown("""
        <div style='background: rgba(102, 126, 234, 0.05); border: 1px dashed var(--border-color); border-radius: 12px; padding: 2rem; text-align: center; color: var(--text-secondary);'>
            <p style='font-size: 1.2rem; margin-bottom: 0.5rem;'>📌 No SQL statements detected yet</p>
            <p style='font-size: 0.9rem;'>Upload a file or paste SQL in the text area above to start the conversion.</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Conversion section - Always visible for better UX
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        is_disabled = not bool(st.session_state.statements)
        button_hint = " (Input Required)" if is_disabled else ""
        
        convert_button = st.button(
            f"🚀 Convert to {target_dialect}{button_hint}",
            use_container_width=True,
            type="primary",
            disabled=is_disabled,
            help="Provide SQL input to enable conversion"
        )
    
    if convert_button and st.session_state.statements:
        if not api_key:
            st.error("⚠️ Please enter your Gemini API key in the sidebar.")
        elif source_dialect == target_dialect:
            st.warning("⚠️ Source and target dialects are the same. No conversion needed.")
        else:
            try:
                # Initialize converter
                converter = AIConverter(api_key=api_key)
                
                # Progress bar
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                def update_progress(current, total):
                    progress = current / total
                    progress_bar.progress(progress)
                    status_text.markdown(f"*Converting statement {current} of {total}...*")
                
                # Perform conversion
                with st.spinner("🔄 Converting SQL statements..."):
                    results = converter.convert(
                        st.session_state.statements,
                        source_dialect,
                        target_dialect,
                        progress_callback=update_progress
                    )
                    st.session_state.results = results
                
                progress_bar.progress(1.0)
                status_text.markdown("*✅ Conversion complete!*")
                
            except ValueError as e:
                st.error(f"⚠️ API Key Error: {str(e)}")
            except Exception as e:
                st.error(f"❌ Conversion failed: {str(e)}")
    
    # Show results
    if st.session_state.results:
        st.markdown("---")
        render_conversion_results(st.session_state.results)
        
        st.markdown("---")
        
        # Download section
        st.markdown("### 📥 Download Results")
        
        col1, col2, col3, col4 = st.columns(4)
        
        # Generate files for all formats
        formats = [
            ("PDF", col1, "📄"),
            ("Word Document", col2, "📝"),
            ("Excel", col3, "📊"),
            ("SQL File", col4, "💾")
        ]
        
        for fmt, col, icon in formats:
            with col:
                buffer, mime_type, filename = generate_output_file(
                    st.session_state.results,
                    source_dialect,
                    target_dialect,
                    fmt
                )
                
                if buffer:
                    st.download_button(
                        label=f"{icon} {fmt}",
                        data=buffer,
                        file_name=filename,
                        mime=mime_type,
                        use_container_width=True
                    )
    
    # Footer
    st.markdown("""
    <div class="footer">
        <hr style="margin: 2rem 0; border-color: #3a3a5a;">
        <p>SQL Dialect Converter • Powered by Google Gemini AI • Made with ❤️ using Streamlit</p>
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
