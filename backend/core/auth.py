import os
from dotenv import load_dotenv
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client

load_dotenv()

# Initialize Supabase Client
url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")

if not url or not key:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY not found in environment!")

supabase: Client = create_client(url, key) if url and key else None
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates the Bearer token provided in the Authorization header.
    Returns the Supabase user object if valid, throws 401 otherwise.
    """
    if not supabase:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured. Missing URL or KEY in .env."
        )
        
    token = credentials.credentials
    try:
        # get_user automatically validates standard JWT tokens internally assigned by the Supabase project
        response = supabase.auth.get_user(token)
        if hasattr(response, 'user') and response.user:
            return response.user
        raise HTTPException(status_code=401, detail="Invalid auth credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
