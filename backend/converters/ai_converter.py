import requests
from typing import List, Dict, Tuple, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"


class AIConverter:
    """
    AI-powered SQL dialect converter using OpenRouter API.
    Converts SQL statements between different database dialects.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the AI converter.
        
        Args:
            api_key: OpenRouter API key. If not provided, reads from GEMINI_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "API key is required. Set GEMINI_API_KEY environment variable "
                "or pass api_key parameter."
            )
        
        # Remove quotes if present (common .env issue)
        self.api_key = self.api_key.strip().strip("'\"")
        
        # List of FREE models to try in order (for fallback)
        self.models_to_try = [
            "google/gemini-2.0-flash-exp:free",
            "meta-llama/llama-3.3-70b-instruct:free", 
            "mistralai/mistral-small-3.1-24b-instruct:free",
            "google/gemma-3-27b-it:free",
            "microsoft/phi-3-medium-128k-instruct:free"
        ]
        
        # Dialect-specific information for better conversions
        self.dialect_info = {
            "MySQL": {
                "string_concat": "CONCAT()",
                "date_functions": "DATE_FORMAT(), NOW(), CURDATE()",
                "limit": "LIMIT",
                "auto_increment": "AUTO_INCREMENT",
                "iif": "IF()"
            },
            "PostgreSQL": {
                "string_concat": "|| operator or CONCAT()",
                "date_functions": "TO_CHAR(), NOW(), CURRENT_DATE",
                "limit": "LIMIT",
                "auto_increment": "SERIAL / IDENTITY",
                "iif": "CASE WHEN"
            },
            "Oracle": {
                "string_concat": "|| operator or CONCAT()",
                "date_functions": "TO_CHAR(), SYSDATE, TRUNC()",
                "limit": "FETCH FIRST n ROWS ONLY (12c+) or ROWNUM",
                "auto_increment": "SEQUENCE + TRIGGER or IDENTITY (12c+)",
                "iif": "DECODE() or CASE WHEN"
            },
            "SQL Server": {
                "string_concat": "+ operator or CONCAT()",
                "date_functions": "FORMAT(), GETDATE(), CONVERT()",
                "limit": "TOP or OFFSET FETCH",
                "auto_increment": "IDENTITY",
                "iif": "IIF() or CASE WHEN"
            },
            "SQLite": {
                "string_concat": "|| operator",
                "date_functions": "strftime(), datetime(), date()",
                "limit": "LIMIT",
                "auto_increment": "AUTOINCREMENT",
                "iif": "IIF() or CASE WHEN"
            },
            "MariaDB": {
                "string_concat": "CONCAT()",
                "date_functions": "DATE_FORMAT(), NOW(), CURDATE()",
                "limit": "LIMIT",
                "auto_increment": "AUTO_INCREMENT",
                "iif": "IF()"
            },
            "Teradata": {
                "string_concat": "|| operator",
                "date_functions": "TO_CHAR(), CURRENT_DATE, CURRENT_TIMESTAMP",
                "limit": "TOP or SAMPLE",
                "auto_increment": "GENERATED ALWAYS AS IDENTITY",
                "iif": "CASE WHEN"
            },
            "Snowflake": {
                "string_concat": "|| operator or CONCAT()",
                "date_functions": "TO_CHAR(), CURRENT_TIMESTAMP(), CURRENT_DATE()",
                "limit": "LIMIT",
                "auto_increment": "AUTOINCREMENT or IDENTITY",
                "iif": "IFF() or CASE WHEN"
            },
            "BigQuery": {
                "string_concat": "CONCAT()",
                "date_functions": "FORMAT_DATE(), CURRENT_TIMESTAMP(), CURRENT_DATE()",
                "limit": "LIMIT",
                "auto_increment": "Not supported (use GENERATE_UUID())",
                "iif": "IF() or CASE WHEN"
            },
            "Amazon Redshift": {
                "string_concat": "|| operator or CONCAT()",
                "date_functions": "TO_CHAR(), GETDATE(), CURRENT_DATE",
                "limit": "LIMIT",
                "auto_increment": "IDENTITY",
                "iif": "CASE WHEN"
            },
            "IBM DB2": {
                "string_concat": "|| operator or CONCAT()",
                "date_functions": "TO_CHAR(), CURRENT DATE, CURRENT TIMESTAMP",
                "limit": "FETCH FIRST n ROWS ONLY",
                "auto_increment": "GENERATED ALWAYS AS IDENTITY",
                "iif": "CASE WHEN"
            }
        }
    
    def convert(
        self, 
        statements: List[str], 
        source_dialect: str, 
        target_dialect: str,
        progress_callback=None
    ) -> List[Dict]:
        """
        Convert SQL statements from source dialect to target dialect.
        
        Args:
            statements: List of SQL statements to convert
            source_dialect: Source database dialect
            target_dialect: Target database dialect
            progress_callback: Optional callback function(current, total) for progress updates
            
        Returns:
            List of dicts with 'original', 'converted', 'status', and 'notes' keys
        """
        results = []
        total = len(statements)
        
        for i, statement in enumerate(statements):
            try:
                converted, notes = self._convert_single(statement, source_dialect, target_dialect)
                results.append({
                    "original": statement,
                    "converted": converted,
                    "status": "success",
                    "notes": notes
                })
            except Exception as e:
                results.append({
                    "original": statement,
                    "converted": None,
                    "status": "error",
                    "notes": str(e)
                })
            
            if progress_callback:
                progress_callback(i + 1, total)
        
        return results
    
    def _convert_single(
        self, 
        statement: str, 
        source_dialect: str, 
        target_dialect: str
    ) -> Tuple[str, str]:
        """
        Convert a single SQL statement.
        
        Args:
            statement: SQL statement to convert
            source_dialect: Source dialect
            target_dialect: Target dialect
            
        Returns:
            Tuple of (converted_sql, conversion_notes)
        """
        prompt = self._build_conversion_prompt(statement, source_dialect, target_dialect)
        
        # Try models in sequence until one works
        last_error = None
        
        for model in self.models_to_try:
            try:
                return self._call_model(model, prompt)
            except Exception as e:
                print(f"Model {model} failed: {e}")
                last_error = e
                continue
        
        # If all failed
        raise Exception(f"All AI models failed. Last error: {last_error}")

    def _call_model(self, model: str, prompt: str) -> Tuple[str, str]:
        """Helper to call a specific model."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8501",
            "X-Title": "SQL Dialect Converter"
        }
        
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3,
            "max_tokens": 2000
        }
        
        # Debug: Print API key (masked) and request details
        masked_key = self.api_key[:10] + "..." + self.api_key[-10:] if len(self.api_key) > 20 else "***"
        print(f"[DEBUG] Using API key: {masked_key}")
        print(f"[DEBUG] API key length: {len(self.api_key)}")
        print(f"[DEBUG] Model: {model}")
        print(f"[DEBUG] Full Authorization header: {headers['Authorization'][:20]}...")
        
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=60)
        
        if response.status_code != 200:
            error_data = response.json() if response.text else {}
            error_msg = error_data.get("error", {}).get("message", response.text)
            print(f"[DEBUG] Full error response: {response.text}")
            raise Exception(f"API Error ({response.status_code}): {error_msg}")
        
        response_data = response.json()
        
        if "choices" not in response_data or not response_data["choices"]:
             raise Exception("Invalid API response: No choices returned")
             
        response_text = response_data["choices"][0]["message"]["content"]
        
        # Parse the response
        return self._parse_response(response_text)
    
    def _build_conversion_prompt(
        self, 
        statement: str, 
        source_dialect: str, 
        target_dialect: str
    ) -> str:
        """Build the prompt for SQL conversion."""
        
        source_info = self.dialect_info.get(source_dialect, {})
        target_info = self.dialect_info.get(target_dialect, {})
        
        prompt = f"""You are an expert SQL developer specializing in database migrations and SQL dialect conversions.

TASK: Convert the following SQL statement from {source_dialect} to {target_dialect}.

SOURCE SQL ({source_dialect}):
```sql
{statement}
```

SOURCE DIALECT FEATURES ({source_dialect}):
- String concatenation: {source_info.get('string_concat', 'N/A')}
- Date functions: {source_info.get('date_functions', 'N/A')}
- Row limiting: {source_info.get('limit', 'N/A')}
- Conditional: {source_info.get('iif', 'N/A')}

TARGET DIALECT FEATURES ({target_dialect}):
- String concatenation: {target_info.get('string_concat', 'N/A')}
- Date functions: {target_info.get('date_functions', 'N/A')}
- Row limiting: {target_info.get('limit', 'N/A')}
- Conditional: {target_info.get('iif', 'N/A')}

CONVERSION REQUIREMENTS:
1. Convert ALL dialect-specific syntax to {target_dialect} equivalents
2. Handle data type differences appropriately
3. Convert functions to their {target_dialect} equivalents
4. Preserve the original query logic exactly
5. Handle NULL handling differences between dialects
6. Convert string/date formatting appropriately

RESPONSE FORMAT:
Provide your response in EXACTLY this format:

CONVERTED_SQL:
```sql
[Your converted SQL here]
```

NOTES:
[Brief notes about what was changed and why, or "No significant changes needed" if applicable]

IMPORTANT: Only output valid {target_dialect} SQL. Do not include any explanatory text within the SQL code block."""

        return prompt
    
    def _parse_response(self, response_text: str) -> Tuple[str, str]:
        """Parse the AI response to extract SQL and notes."""
        
        # Extract SQL from response
        sql_start = response_text.find("```sql")
        sql_end = response_text.find("```", sql_start + 6)
        
        if sql_start != -1 and sql_end != -1:
            converted_sql = response_text[sql_start + 6:sql_end].strip()
        else:
            # Try to find SQL without markdown
            lines = response_text.split('\n')
            sql_lines = []
            in_sql = False
            
            for line in lines:
                if 'CONVERTED_SQL:' in line.upper():
                    in_sql = True
                    continue
                if 'NOTES:' in line.upper():
                    in_sql = False
                    continue
                if in_sql and line.strip():
                    sql_lines.append(line)
            
            converted_sql = '\n'.join(sql_lines).strip()
            
            # Last resort: use the whole response
            if not converted_sql:
                converted_sql = response_text.strip()
        
        # Extract notes
        notes_start = response_text.upper().find("NOTES:")
        if notes_start != -1:
            notes = response_text[notes_start + 6:].strip()
            # Clean up notes
            notes = notes.replace("```", "").strip()
        else:
            notes = "Conversion completed"
        
        return converted_sql, notes
    
    def validate_api_key(self) -> bool:
        """Validate that the API key is working."""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": "Say OK"}],
                "max_tokens": 10
            }
            
            response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, timeout=10)
            return response.status_code == 200
        except Exception:
            return False
