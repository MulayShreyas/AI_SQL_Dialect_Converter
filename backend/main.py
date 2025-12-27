from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from io import BytesIO
from dotenv import load_dotenv

# Import local modules
from converters.ai_converter import AIConverter
from parsers.pdf_parser import PDFParser
from parsers.sql_parser import SQLParser
from parsers.excel_parser import ExcelParser
from generators.pdf_generator import PDFGenerator
from generators.word_generator import WordGenerator
from generators.excel_generator import ExcelGenerator
from generators.sql_generator import SQLGenerator
from utils.sql_utils import SQLUtils
from config import SUPPORTED_DIALECTS, OUTPUT_FORMATS

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SQL Dialect Converter API",
    description="Convert SQL statements between different database dialects using AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class ConversionRequest(BaseModel):
    statements: List[str]
    source_dialect: str
    target_dialect: str
    api_key: Optional[str] = None


class ConversionResult(BaseModel):
    original: str
    converted: Optional[str]
    status: str
    notes: str


class ConversionResponse(BaseModel):
    results: List[ConversionResult]
    success_count: int
    error_count: int
    total_count: int


class ManualSQLRequest(BaseModel):
    sql_text: str


class ExportRequest(BaseModel):
    results: List[dict]
    source_dialect: str
    target_dialect: str
    format: str


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "SQL Dialect Converter API",
        "version": "1.0.0",
        "status": "running"
    }


# Get supported dialects
@app.get("/api/dialects")
async def get_dialects():
    """Get list of supported SQL dialects"""
    return {"dialects": SUPPORTED_DIALECTS}


# Get supported output formats
@app.get("/api/formats")
async def get_formats():
    """Get list of supported output formats"""
    return {"formats": OUTPUT_FORMATS}


# Parse uploaded file
@app.post("/api/parse-file")
async def parse_file(file: UploadFile = File(...)):
    """
    Parse uploaded file and extract SQL statements.
    Supports: PDF, SQL, TXT, Excel (XLSX/XLS)
    """
    try:
        # Get file extension
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file content
        content = await file.read()
        file_obj = BytesIO(content)
        file_obj.name = file.filename
        
        # Parse based on file type
        if file_extension == 'pdf':
            parser = PDFParser()
            statements = parser.parse(file_obj)
        elif file_extension in ['sql', 'txt']:
            parser = SQLParser()
            statements = parser.parse(file_obj)
        elif file_extension in ['xlsx', 'xls']:
            parser = ExcelParser()
            statements = parser.parse(file_obj)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format: {file_extension}"
            )
        
        return {
            "statements": statements,
            "count": len(statements),
            "filename": file.filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Parse manual SQL input
@app.post("/api/parse-sql")
async def parse_sql(request: ManualSQLRequest):
    """Parse manually entered SQL text into statements"""
    try:
        statements = SQLUtils.split_statements(request.sql_text)
        return {
            "statements": statements,
            "count": len(statements)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Convert SQL statements
@app.post("/api/convert", response_model=ConversionResponse)
async def convert_sql(request: ConversionRequest):
    """
    Convert SQL statements from source dialect to target dialect.
    Uses AI-powered conversion via OpenRouter API.
    """
    try:
        # Validate dialects
        if request.source_dialect not in SUPPORTED_DIALECTS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported source dialect: {request.source_dialect}"
            )
        
        if request.target_dialect not in SUPPORTED_DIALECTS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported target dialect: {request.target_dialect}"
            )
        
        if request.source_dialect == request.target_dialect:
            raise HTTPException(
                status_code=400,
                detail="Source and target dialects cannot be the same"
            )
        
        # Get API key from request or environment
        api_key = request.api_key or os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            raise HTTPException(
                status_code=401,
                detail="API key is required. Provide it in the request or set GEMINI_API_KEY environment variable."
            )
        
        # Initialize converter
        converter = AIConverter(api_key=api_key)
        
        # Perform conversion
        results = converter.convert(
            request.statements,
            request.source_dialect,
            request.target_dialect
        )
        
        # Calculate statistics
        success_count = sum(1 for r in results if r['status'] == 'success')
        error_count = len(results) - success_count
        
        return ConversionResponse(
            results=[ConversionResult(**r) for r in results],
            success_count=success_count,
            error_count=error_count,
            total_count=len(results)
        )
    
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Export results to file
@app.post("/api/export")
async def export_results(request: ExportRequest):
    """
    Export conversion results to specified format.
    Formats: PDF, Word Document, Excel, SQL File
    """
    try:
        # Generate file based on format
        if request.format == "PDF":
            generator = PDFGenerator()
            buffer = generator.generate(
                request.results,
                request.source_dialect,
                request.target_dialect
            )
            media_type = "application/pdf"
            filename = "converted_sql.pdf"
        
        elif request.format == "Word Document":
            generator = WordGenerator()
            buffer = generator.generate(
                request.results,
                request.source_dialect,
                request.target_dialect
            )
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename = "converted_sql.docx"
        
        elif request.format == "Excel":
            generator = ExcelGenerator()
            buffer = generator.generate(
                request.results,
                request.source_dialect,
                request.target_dialect
            )
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = "converted_sql.xlsx"
        
        elif request.format == "SQL File":
            generator = SQLGenerator()
            buffer = generator.generate(
                request.results,
                request.source_dialect,
                request.target_dialect
            )
            media_type = "text/plain"
            filename = "converted_sql.sql"
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format: {request.format}"
            )
        
        # Return file as streaming response
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Validate API key
@app.post("/api/validate-key")
async def validate_api_key(api_key: str = Form(...)):
    """Validate OpenRouter API key"""
    try:
        converter = AIConverter(api_key=api_key)
        is_valid = converter.validate_api_key()
        
        return {
            "valid": is_valid,
            "message": "API key is valid" if is_valid else "API key is invalid"
        }
    except Exception as e:
        return {
            "valid": False,
            "message": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
