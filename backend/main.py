from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from services.pipeline_service import run_analysis_pipeline
from agents.orchestrator_agent import process_request
from routes.auth_routes import router as auth_router
from core.auth import get_current_user

app = FastAPI(title="Codebase Analyzer API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Supabase Auth routes
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Store AST functions in memory for Graph/Stats Orchestrator commands
_memory_cache = {}

class AnalyzeRequest(BaseModel):
    repo_url: str

class ChatRequest(BaseModel):
    query: str
    collection_name: str

@app.get("/")
def home():
    return {"message": "Codebase Analyzer API is running"}

@app.post("/api/analyze")
async def analyze_repo(req: AnalyzeRequest, current_user = Depends(get_current_user)):
    try:
        if not req.repo_url.startswith("http"):
            raise HTTPException(status_code=400, detail="Invalid repository URL provided.")
            
        print(f"Starting pipeline for {req.repo_url}...")
        results = run_analysis_pipeline(req.repo_url)
        
        collection = results["collection_name"]
        _memory_cache[collection] = results.pop("functions_data", [])
        
        # Save to Supabase History
        from core.auth import supabase
        if supabase:
            try:
                supabase.table("repositories").insert({
                    "user_id": current_user.id,
                    "repo_url": req.repo_url,
                    "repo_name": results["repo_name"],
                    "collection_name": collection
                }).execute()
            except Exception as db_err:
                print(f"Failed to save repo to history: {db_err}")

        return {"status": "success", "data": results}
        
    except Exception as e:
        print(f"Pipeline error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_interaction(req: ChatRequest, current_user = Depends(get_current_user)):
    try:
        from core.auth import supabase
        repo_id = None
        if supabase:
            # find repo_id matching collection
            res = supabase.table("repositories").select("id").eq("collection_name", req.collection_name).eq("user_id", current_user.id).execute()
            repo_id = res.data[0]["id"] if res.data else None
            
            if repo_id:
                supabase.table("chats").insert({
                    "user_id": current_user.id,
                    "repository_id": repo_id,
                    "role": "user",
                    "content": req.query
                }).execute()

        funcs = _memory_cache.get(req.collection_name, [])
        answer = process_request(
            user_input=req.query,
            collection_name=req.collection_name,
            functions_data=funcs
        )

        if supabase and repo_id:
            supabase.table("chats").insert({
                "user_id": current_user.id,
                "repository_id": repo_id,
                "role": "assistant",
                "content": answer
            }).execute()

        return {"response": answer}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/repos")
async def get_recent_repos(current_user = Depends(get_current_user)):
    try:
        from core.auth import supabase
        if not supabase: return {"status": "success", "data": []}
        res = supabase.table("repositories").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/chats/{repository_id}")
async def get_chat_history(repository_id: str, current_user = Depends(get_current_user)):
    try:
        from core.auth import supabase
        if not supabase: return {"status": "success", "data": []}
        res = supabase.table("chats").select("*").eq("repository_id", repository_id).eq("user_id", current_user.id).order("created_at").execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
