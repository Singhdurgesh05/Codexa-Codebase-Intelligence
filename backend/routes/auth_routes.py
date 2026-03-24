from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from core.auth import supabase

router = APIRouter()

class AuthRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register_user(req: AuthRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    try:
        response = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
        })
        return {"message": "User registered successfully", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login_user(req: AuthRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    try:
        response = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password,
        })
        return {
            "message": "Login successful", 
            "access_token": response.session.access_token,
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
