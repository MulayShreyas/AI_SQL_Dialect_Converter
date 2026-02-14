"""
Routes for managing saved conversions
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from auth import get_current_user, get_current_user_required
from database import get_db

router = APIRouter(prefix="/api/conversions", tags=["Conversions"])


class ConversionCreate(BaseModel):
    source_dialect: str
    target_dialect: str
    input_type: str  # 'QUERY' or 'FILE'
    input_query: Optional[str] = None
    output_query: Optional[str] = None
    file_name: Optional[str] = None
    file_format: Optional[str] = None
    conversion_status: str = 'SUCCESS'
    error_message: Optional[str] = None


class ConversionResponse(BaseModel):
    conversion_id: int
    user_id: Optional[int]
    source_dialect: str
    target_dialect: str
    input_type: str
    input_query: Optional[str]
    output_query: Optional[str]
    file_name: Optional[str]
    conversion_status: str
    created_at: datetime


class ConversionListResponse(BaseModel):
    conversions: List[ConversionResponse]
    total: int


def get_dialect_id(cursor, dialect_name: str) -> int:
    """Get dialect ID by name"""
    cursor.execute(
        "SELECT dialect_id FROM sql_dialects WHERE dialect_name = %s",
        (dialect_name,)
    )
    result = cursor.fetchone()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid dialect: {dialect_name}"
        )
    return result["dialect_id"]


def get_dialect_name(cursor, dialect_id: int) -> str:
    """Get dialect name by ID"""
    cursor.execute(
        "SELECT dialect_name FROM sql_dialects WHERE dialect_id = %s",
        (dialect_id,)
    )
    result = cursor.fetchone()
    return result["dialect_name"] if result else "Unknown"


@router.post("/save", response_model=ConversionResponse)
async def save_conversion(
    conversion: ConversionCreate,
    current_user: dict = Depends(get_current_user_required)
):
    """Save a conversion for the authenticated user"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get dialect IDs
            source_dialect_id = get_dialect_id(cursor, conversion.source_dialect)
            target_dialect_id = get_dialect_id(cursor, conversion.target_dialect)
            
            cursor.execute(
                """
                INSERT INTO where_clause_conversions 
                (user_id, source_dialect_id, target_dialect_id, input_type, 
                 input_query, output_query, file_name, file_format, 
                 conversion_status, error_message)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING conversion_id, user_id, source_dialect_id, target_dialect_id,
                          input_type, input_query, output_query, file_name,
                          conversion_status, created_at
                """,
                (
                    current_user["user_id"],
                    source_dialect_id,
                    target_dialect_id,
                    conversion.input_type,
                    conversion.input_query,
                    conversion.output_query,
                    conversion.file_name,
                    conversion.file_format,
                    conversion.conversion_status,
                    conversion.error_message
                )
            )
            
            result = cursor.fetchone()
            conn.commit()
            
            return ConversionResponse(
                conversion_id=result["conversion_id"],
                user_id=result["user_id"],
                source_dialect=conversion.source_dialect,
                target_dialect=conversion.target_dialect,
                input_type=result["input_type"],
                input_query=result["input_query"],
                output_query=result["output_query"],
                file_name=result["file_name"],
                conversion_status=result["conversion_status"],
                created_at=result["created_at"]
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save conversion: {str(e)}"
        )


@router.get("/history", response_model=ConversionListResponse)
async def get_conversion_history(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user_required)
):
    """Get conversion history for the authenticated user"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get total count
            cursor.execute(
                "SELECT COUNT(*) as count FROM where_clause_conversions WHERE user_id = %s",
                (current_user["user_id"],)
            )
            total = cursor.fetchone()["count"]
            
            # Get conversions with dialect names
            cursor.execute(
                """
                SELECT 
                    wcc.conversion_id,
                    wcc.user_id,
                    sd.dialect_name as source_dialect,
                    td.dialect_name as target_dialect,
                    wcc.input_type,
                    wcc.input_query,
                    wcc.output_query,
                    wcc.file_name,
                    wcc.conversion_status,
                    wcc.created_at
                FROM where_clause_conversions wcc
                JOIN sql_dialects sd ON wcc.source_dialect_id = sd.dialect_id
                JOIN sql_dialects td ON wcc.target_dialect_id = td.dialect_id
                WHERE wcc.user_id = %s
                ORDER BY wcc.created_at DESC
                LIMIT %s OFFSET %s
                """,
                (current_user["user_id"], limit, offset)
            )
            
            conversions = cursor.fetchall()
            
            return ConversionListResponse(
                conversions=[ConversionResponse(**conv) for conv in conversions],
                total=total
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch conversion history: {str(e)}"
        )


@router.get("/{conversion_id}", response_model=ConversionResponse)
async def get_conversion(
    conversion_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """Get a specific conversion by ID"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute(
                """
                SELECT 
                    wcc.conversion_id,
                    wcc.user_id,
                    sd.dialect_name as source_dialect,
                    td.dialect_name as target_dialect,
                    wcc.input_type,
                    wcc.input_query,
                    wcc.output_query,
                    wcc.file_name,
                    wcc.conversion_status,
                    wcc.created_at
                FROM where_clause_conversions wcc
                JOIN sql_dialects sd ON wcc.source_dialect_id = sd.dialect_id
                JOIN sql_dialects td ON wcc.target_dialect_id = td.dialect_id
                WHERE wcc.conversion_id = %s AND wcc.user_id = %s
                """,
                (conversion_id, current_user["user_id"])
            )
            
            conversion = cursor.fetchone()
            
            if not conversion:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversion not found"
                )
            
            return ConversionResponse(**conversion)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch conversion: {str(e)}"
        )


@router.delete("/{conversion_id}")
async def delete_conversion(
    conversion_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """Delete a conversion by ID"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if conversion exists and belongs to user
            cursor.execute(
                "SELECT conversion_id FROM where_clause_conversions WHERE conversion_id = %s AND user_id = %s",
                (conversion_id, current_user["user_id"])
            )
            
            if not cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversion not found"
                )
            
            # Delete related records first
            cursor.execute(
                "DELETE FROM conversion_logs WHERE conversion_id = %s",
                (conversion_id,)
            )
            cursor.execute(
                "DELETE FROM download_history WHERE conversion_id = %s",
                (conversion_id,)
            )
            cursor.execute(
                "DELETE FROM uploaded_files WHERE conversion_id = %s",
                (conversion_id,)
            )
            
            # Delete the conversion
            cursor.execute(
                "DELETE FROM where_clause_conversions WHERE conversion_id = %s",
                (conversion_id,)
            )
            
            conn.commit()
            
            return {"message": "Conversion deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete conversion: {str(e)}"
        )
