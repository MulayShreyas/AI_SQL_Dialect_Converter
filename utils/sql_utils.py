"""
SQL Utility Functions
"""

import sqlparse
from typing import List, Optional
import re


class SQLUtils:
    """
    Utility class for SQL processing and validation.
    """
    
    @staticmethod
    def format_sql(sql: str, keyword_case: str = 'upper') -> str:
        """
        Format SQL statement for better readability.
        
        Args:
            sql: SQL statement to format
            keyword_case: Case for keywords ('upper', 'lower', 'capitalize')
            
        Returns:
            Formatted SQL string
        """
        return sqlparse.format(
            sql,
            reindent=True,
            keyword_case=keyword_case,
            indent_width=2
        )
    
    @staticmethod
    def validate_sql(sql: str) -> bool:
        """
        Basic validation to check if a string looks like valid SQL.
        
        Args:
            sql: String to validate
            
        Returns:
            True if the string appears to be valid SQL
        """
        if not sql or len(sql.strip()) < 5:
            return False
        
        # Parse the SQL
        parsed = sqlparse.parse(sql)
        
        if not parsed:
            return False
        
        # Check for SQL keywords
        sql_keywords = [
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 
            'ALTER', 'DROP', 'WITH', 'MERGE', 'TRUNCATE'
        ]
        
        upper_sql = sql.upper()
        return any(keyword in upper_sql for keyword in sql_keywords)
    
    @staticmethod
    def extract_tables(sql: str) -> List[str]:
        """
        Extract table names from a SQL statement.
        
        Args:
            sql: SQL statement
            
        Returns:
            List of table names found
        """
        tables = []
        
        # Simple pattern matching for FROM and JOIN clauses
        patterns = [
            r'FROM\s+(\w+)',
            r'JOIN\s+(\w+)',
            r'INTO\s+(\w+)',
            r'UPDATE\s+(\w+)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, sql, re.IGNORECASE)
            tables.extend(matches)
        
        return list(set(tables))
    
    @staticmethod
    def split_statements(sql: str) -> List[str]:
        """
        Split a SQL string into individual statements.
        
        Args:
            sql: SQL string potentially containing multiple statements
            
        Returns:
            List of individual SQL statements
        """
        statements = sqlparse.split(sql)
        return [stmt.strip() for stmt in statements if stmt.strip()]
    
    @staticmethod
    def get_statement_type(sql: str) -> Optional[str]:
        """
        Determine the type of SQL statement.
        
        Args:
            sql: SQL statement
            
        Returns:
            Statement type (SELECT, INSERT, UPDATE, DELETE, etc.) or None
        """
        parsed = sqlparse.parse(sql)
        
        if parsed and len(parsed) > 0:
            return parsed[0].get_type()
        
        return None
    
    @staticmethod
    def contains_where_clause(sql: str) -> bool:
        """
        Check if a SQL statement contains a WHERE clause.
        
        Args:
            sql: SQL statement
            
        Returns:
            True if WHERE clause is present
        """
        return bool(re.search(r'\bWHERE\b', sql, re.IGNORECASE))
    
    @staticmethod
    def extract_where_clause(sql: str) -> Optional[str]:
        """
        Extract the WHERE clause from a SQL statement.
        
        Args:
            sql: SQL statement
            
        Returns:
            WHERE clause content or None if not found
        """
        # Pattern to match WHERE clause content
        pattern = r'\bWHERE\b\s+(.+?)(?:\bGROUP\s+BY\b|\bORDER\s+BY\b|\bHAVING\b|\bLIMIT\b|;|$)'
        
        match = re.search(pattern, sql, re.IGNORECASE | re.DOTALL)
        
        if match:
            return match.group(1).strip()
        
        return None
    
    @staticmethod
    def count_statements(sql: str) -> int:
        """
        Count the number of SQL statements in a string.
        
        Args:
            sql: SQL string
            
        Returns:
            Number of statements
        """
        statements = sqlparse.split(sql)
        return len([s for s in statements if s.strip()])
