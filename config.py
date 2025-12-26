"""
Configuration and constants for the SQL Where Clause Conversion Tool
"""

# Supported SQL dialects
SUPPORTED_DIALECTS = [
    "MySQL",
    "PostgreSQL",
    "Oracle",
    "SQL Server",
    "SQLite",
    "MariaDB",
    "Teradata",
    "Snowflake",
    "BigQuery",
    "Amazon Redshift",
    "IBM DB2"
]

# Supported input file formats
INPUT_FORMATS = {
    "pdf": ["application/pdf"],
    "sql": ["text/plain", "application/sql"],
    "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    "xls": ["application/vnd.ms-excel"],
    "txt": ["text/plain"]
}

# Supported output formats
OUTPUT_FORMATS = ["PDF", "Word Document", "Excel", "SQL File"]

# AI Model configuration
GEMINI_MODEL = "gemini-1.5-flash"

# Application styling
APP_THEME = {
    "primary_color": "#667eea",
    "secondary_color": "#764ba2",
    "background_dark": "#0f0f23",
    "surface_dark": "#1a1a2e",
    "text_light": "#ffffff",
    "success_color": "#10b981",
    "error_color": "#ef4444"
}
