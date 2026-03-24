import os
import shutil
import stat
from pathlib import Path
from repo_loader.github_loader import clone
from parser.code_parser import extract_functions
from services.graph_service import compute_stats
from index_repo import index_repo, _iter_code_files

def remove_readonly(func, path, _):
    """Clear the readonly bit and reattempt the removal"""
    os.chmod(path, stat.S_IWRITE)
    func(path)

def run_analysis_pipeline(repo_url: str) -> dict:
    """Clones a repo, calculates its graph/stats, and pushes its logic to Qdrant."""
    repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
    target_dir = Path(f"repos/{repo_name}")
    
    # 1. Clone
    if target_dir.exists():
        shutil.rmtree(target_dir, onerror=remove_readonly)
    clone(repo_url)
    
    # 2. Extract AST Data for Graph/Stats
    funcs = []
    for filepath in _iter_code_files(target_dir):
        if any(part in ["tests", "venv", "node_modules", ".git"] for part in filepath.parts):
            continue
            
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            rel_path = str(filepath.relative_to(target_dir).as_posix())
            funcs.extend(extract_functions(content, file_path=rel_path))
        except Exception:
            pass
            
    stats = compute_stats(funcs) if funcs else {}

    # 3. Index to Qdrant using specialized multi-language chunker
    collection_name = f"{repo_name}_collection"
    index_repo(target_dir, collection=collection_name)
    
    return {
        "repo_name": repo_name,
        "collection_name": collection_name,
        "stats": stats,
        "parsed_functions_count": len(funcs),
        "functions_data": funcs
    }
