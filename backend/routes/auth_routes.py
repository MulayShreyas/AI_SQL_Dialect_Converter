"""
Authentication routes for user registration, login, and profile management
"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta

from auth import (
    UserCreate, UserLogin, UserResponse, Token,
    create_user, authenticate_user, create_access_token,
    get_user_by_email, get_user_by_username,
    get_current_user_required, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserCreate):
    """Register a new user"""
    # Check if email already exists
    if get_user_by_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if get_user_by_username(user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    try:
        new_user = create_user(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )
    
    # Return success message without token - user must sign in separately
    return {
        "message": "Account created successfully! Please sign in.",
        "username": new_user["username"]
    }


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login with email and password"""
    user = authenticate_user(user_credentials.email, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"user_id": user["user_id"], "email": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user_required)):
    """Get current user profile"""
    return UserResponse(
        user_id=current_user["user_id"],
        username=current_user["username"],
        email=current_user["email"],
        created_at=current_user["created_at"],
        is_active=current_user["is_active"]
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint - for JWT-based auth, the client handles token removal.
    This endpoint confirms the logout action and can be extended for token blacklisting.
    """
    return {
        "success": True,
        "message": "Successfully logged out"
    }
