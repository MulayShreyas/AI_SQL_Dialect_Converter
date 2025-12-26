"""
SQL Parser - Extracts SQL statements from SQL files
"""

import sqlparse
from typing import List
import io


class SQLParser:
    """
    Parser for extracting SQL statements from SQL files.
    Uses sqlparse for proper SQL tokenization.
    """
    
    def __init__(self):
        pass
    
    def parse(self, file) -> List[str]:
        """
        Extract SQL statements from a SQL file.
        
        Args:
            file: File-like object or path to SQL file
            
        Returns:
            List of SQL statements found in the file
        """
        content = self._read_file(file)
        return self._extract_statements(content)
    
    def _read_file(self, file) -> str:
        """Read content from file."""
        # Handle different file types
        if isinstance(file, str):
            # File path
            return self._read_with_encoding(file)
        else:
            # File-like object (uploaded file)
            try:
                content = file.read()
                if isinstance(content, bytes):
                    # Try different encodings
                    for encoding in ['utf-8', 'latin-1', 'cp1252']:
                        try:
                            return content.decode(encoding)
                        except UnicodeDecodeError:
                            continue
                    return content.decode('utf-8', errors='replace')
                return content
            except Exception:
                return ""
    
    def _read_with_encoding(self, file_path: str) -> str:
        """Read file with multiple encoding attempts."""
        encodings = ['utf-8', 'latin-1', 'cp1252', 'utf-16']
        
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        # Fallback with error replacement
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()
    
    def _extract_statements(self, content: str) -> List[str]:
        """
        Extract and split SQL statements using sqlparse.
        
        Args:
            content: Raw SQL file content
            
        Returns:
            List of individual SQL statements
        """
        statements = []
        
        # Remove comments and parse
        parsed = sqlparse.split(content)
        
        for stmt in parsed:
            # Clean up the statement
            cleaned = self._clean_statement(stmt)
            
            if cleaned and self._is_valid_statement(cleaned):
                statements.append(cleaned)
        
        return statements
    
    def _clean_statement(self, statement: str) -> str:
        """Clean and format a SQL statement."""
        # Strip whitespace
        statement = statement.strip()
        
        # Skip empty or comment-only statements
        if not statement or statement.startswith('--') or statement.startswith('/*'):
            # But keep if it has SQL content after the comment
            lines = statement.split('\n')
            non_comment_lines = []
            for line in lines:
                line = line.strip()
                if not line.startswith('--') and line:
                    non_comment_lines.append(line)
            statement = ' '.join(non_comment_lines)
        
        # Format with sqlparse
        if statement:
            statement = sqlparse.format(
                statement,
                strip_comments=False,
                reindent=False,
                keyword_case='upper'
            )
        
        return statement.strip()
    
    def _is_valid_statement(self, statement: str) -> bool:
        """Check if the statement is a valid SQL statement."""
        # Must have content
        if not statement or len(statement) < 5:
            return False
        
        # Check for SQL keywords
        sql_keywords = [
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 
            'ALTER', 'DROP', 'WITH', 'MERGE', 'TRUNCATE'
        ]
        
        upper_stmt = statement.upper()
        return any(upper_stmt.startswith(keyword) or f' {keyword} ' in upper_stmt 
                   for keyword in sql_keywords)
