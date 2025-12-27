import pdfplumber
import re
from typing import List
import io

class PDFParser:
    """
    Parser for extracting SQL statements from PDF files.
    Uses pdfplumber for robust text extraction.
    """
    
    def __init__(self):
        self.sql_keywords = [
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 
            'DROP', 'WHERE', 'FROM', 'JOIN', 'UNION', 'WITH'
        ]
    
    def parse(self, file) -> List[str]:
        """
        Extract SQL statements from a PDF file.
        
        Args:
            file: File-like object or path to PDF
            
        Returns:
            List of SQL statements found in the PDF
        """
        text = self._extract_text(file)
        return self._extract_sql_statements(text)
    
    def _extract_text(self, file) -> str:
        """Extract all text from PDF file."""
        full_text = []
        
        # Handle both file path and file-like object
        if isinstance(file, str):
            pdf = pdfplumber.open(file)
        else:
            # For uploaded files (BytesIO)
            pdf = pdfplumber.open(io.BytesIO(file.read()))
        
        try:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text.append(page_text)
        finally:
            pdf.close()
        
        return "\n".join(full_text)
    
    def _extract_sql_statements(self, text: str) -> List[str]:
        """
        Extract SQL statements from raw text.
        
        Looks for common SQL patterns and extracts complete statements.
        """
        statements = []
        
        # Clean up the text
        text = self._clean_text(text)
        
        # Pattern to match SQL statements
        # Matches statements starting with SQL keywords and ending with semicolon or EOF
        sql_pattern = r'(?i)((?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b[^;]*(?:;|$))'
        
        matches = re.findall(sql_pattern, text, re.DOTALL | re.IGNORECASE)
        
        for match in matches:
            cleaned_statement = self._clean_sql_statement(match)
            if cleaned_statement and self._is_valid_sql(cleaned_statement):
                statements.append(cleaned_statement)
        
        # If no statements found with pattern, try to find any SQL-like content
        if not statements:
            statements = self._fallback_extraction(text)
        
        return statements
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted PDF text."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Fix common PDF extraction issues
        text = text.replace('\u2010', '-')  # Unicode hyphen
        text = text.replace('\u2019', "'")  # Right single quote
        text = text.replace('\u201c', '"')  # Left double quote
        text = text.replace('\u201d', '"')  # Right double quote
        return text.strip()
    
    def _clean_sql_statement(self, statement: str) -> str:
        """Clean a single SQL statement."""
        # Remove leading/trailing whitespace
        statement = statement.strip()
        # Normalize whitespace
        statement = re.sub(r'\s+', ' ', statement)
        # Ensure proper semicolon
        if not statement.endswith(';'):
            statement += ';'
        return statement
    
    def _is_valid_sql(self, statement: str) -> bool:
        """Check if a statement looks like valid SQL."""
        upper_stmt = statement.upper()
        
        # Must contain at least one SQL keyword
        has_keyword = any(keyword in upper_stmt for keyword in self.sql_keywords)
        
        # Must have reasonable length
        is_reasonable_length = len(statement) >= 10
        
        return has_keyword and is_reasonable_length
    
    def _fallback_extraction(self, text: str) -> List[str]:
        """
        Fallback method to extract SQL when pattern matching fails.
        Splits on common delimiters and checks for SQL content.
        """
        statements = []
        
        # Split on semicolons
        parts = text.split(';')
        
        for part in parts:
            part = part.strip()
            if part and self._is_valid_sql(part):
                statements.append(part + ';')
        
        return statements
